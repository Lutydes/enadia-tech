import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole, jsonResponse, errorResponse } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const instance = process.env.APP_INSTANCE || 'ENADIA';

    // FIX: Fetch BOTH StudentResponse AND LocalQuestionResponse, filtered by instance
    const [dbResponses, localResponses] = await Promise.all([
      db.studentResponse.findMany({
        where: { instance },
        include: {
          user: {
            select: {
              id: true, name: true, email: true, ra: true, role: true,
              curso: true, modalidade: true, periodo: true,
            },
          },
        },
      }),
      db.localQuestionResponse.findMany({
        where: { instance },
        include: {
          user: {
            select: {
              id: true, name: true, email: true, ra: true, role: true,
              curso: true, modalidade: true, periodo: true,
            },
          },
        },
      }),
    ]);

    // Group by user
    const userStats = new Map<string, {
      userId: string;
      name: string;
      email: string;
      ra: string | null;
      role: string;
      curso: string | null;
      modalidade: string | null;
      periodo: number | null;
      totalAnswered: number;
      totalCorrect: number;
      totalResponseTime: number;
      responseTimeCount: number;
    }>();

    function initStats(userId: string, user: { name: string; email: string; ra: string | null; role: string; curso: string | null; modalidade: string | null; periodo: number | null }) {
      return userStats.get(userId) || {
        userId,
        name: user.name || 'Desconhecido',
        email: user.email || '',
        ra: user.ra,
        role: user.role,
        curso: user.curso,
        modalidade: user.modalidade,
        periodo: user.periodo,
        totalAnswered: 0,
        totalCorrect: 0,
        totalResponseTime: 0,
        responseTimeCount: 0,
      };
    }

    // Process DB responses
    for (const r of dbResponses) {
      const existing = initStats(r.userId, r.user);
      existing.totalAnswered++;
      if (r.isCorrect) existing.totalCorrect++;
      if (r.responseTime) {
        existing.totalResponseTime += r.responseTime;
        existing.responseTimeCount++;
      }
      userStats.set(r.userId, existing);
    }

    // Process LOCAL BANK responses (THE FIX!)
    for (const r of localResponses) {
      const existing = initStats(r.userId, r.user);
      existing.totalAnswered++;
      if (r.isCorrect) existing.totalCorrect++;
      if (r.responseTime) {
        existing.totalResponseTime += r.responseTime;
        existing.responseTimeCount++;
      }
      userStats.set(r.userId, existing);
    }

    // Include users with no responses yet (filtered by instance)
    const allUsers = await db.user.findMany({
      where: { active: true, instance },
      select: { id: true, name: true, email: true, ra: true, role: true, curso: true, modalidade: true, periodo: true },
    });

    for (const u of allUsers) {
      if (!userStats.has(u.id)) {
        userStats.set(u.id, {
          userId: u.id,
          name: u.name,
          email: u.email,
          ra: u.ra,
          role: u.role,
          curso: u.curso,
          modalidade: u.modalidade,
          periodo: u.periodo,
          totalAnswered: 0,
          totalCorrect: 0,
          totalResponseTime: 0,
          responseTimeCount: 0,
        });
      }
    }

    // Convert to array and calculate derived stats
    const ranking = Array.from(userStats.values())
      .filter(u => u.role === 'ALUNO')
      .map(u => ({
        userId: u.userId,
        name: u.name,
        email: u.email,
        ra: u.ra,
        role: u.role,
        curso: u.curso,
        modalidade: u.modalidade,
        periodo: u.periodo,
        totalAnswered: u.totalAnswered,
        totalCorrect: u.totalCorrect,
        points: u.totalCorrect, // 1 ponto por resposta correta — acumula conforme mais simulados são feitos
        hitRate: u.totalAnswered > 0 ? Math.round((u.totalCorrect / u.totalAnswered) * 100) : 0,
        avgResponseTime: u.responseTimeCount > 0
          ? Math.round(u.totalResponseTime / u.responseTimeCount)
          : null,
      }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.hitRate - a.hitRate;
      })
      .slice(0, limit)
      .map((item, index) => ({
        ...item,
        position: index + 1,
      }));

    return NextResponse.json({ ranking });
  } catch (error) {
    console.error('Ranking API error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar ranking' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authUser = requireRole(request, 'MASTER');
    const instance = authUser.instance || process.env.APP_INSTANCE || 'ENADIA';

    // Delete ALL responses for this instance only
    await db.essayAnswer.deleteMany({ where: { instance } });
    await db.studentResponse.deleteMany({ where: { instance } });
    await db.localQuestionResponse.deleteMany({ where: { instance } });

    return jsonResponse({ message: 'Ranking resetado com sucesso. Todas as respostas foram removidas.' });
  } catch (error) {
    console.error('Reset ranking error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
