import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireRole, jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const authUser = requireAuth(request);
    const { userId } = await params;

    // Students can only see their own report; masters/professors can see any
    if (authUser.role === Role.ALUNO && authUser.userId !== userId) {
      return errorResponse('Acesso negado.', 403);
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, ra: true, role: true, createdAt: true },
    });

    if (!user) {
      return errorResponse('Usuário não encontrado.', 404);
    }

    // Total stats
    const totalResponses = await db.studentResponse.count({
      where: { userId },
    });

    const correctResponses = await db.studentResponse.count({
      where: { userId, isCorrect: true },
    });

    const hitRate = totalResponses > 0 ? Math.round((correctResponses / totalResponses) * 100) : 0;

    // Performance by microarea
    const responses = await db.studentResponse.findMany({
      where: { userId },
      select: {
        isCorrect: true,
        createdAt: true,
        responseTime: true,
        question: {
          select: {
            difficulty: true,
            microareaId: true,
            microarea: {
              select: { name: true, code: true, color: true, macroarea: true },
            },
            element: {
              select: { name: true, code: true },
            },
          },
        },
        simulado: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group by microarea
    const microareaMap: Record<string, { total: number; correct: number; name: string; code: string; color: string; macroarea: string }> = {};
    for (const r of responses) {
      const maId = r.question.microareaId;
      if (!microareaMap[maId]) {
        microareaMap[maId] = {
          total: 0,
          correct: 0,
          name: r.question.microarea.name,
          code: r.question.microarea.code,
          color: r.question.microarea.color,
          macroarea: r.question.microarea.macroarea,
        };
      }
      microareaMap[maId].total++;
      if (r.isCorrect) microareaMap[maId].correct++;
    }

    // Group by difficulty
    const difficultyMap: Record<string, { total: number; correct: number }> = {};
    for (const r of responses) {
      const diff = r.question.difficulty || 'não definida';
      if (!difficultyMap[diff]) difficultyMap[diff] = { total: 0, correct: 0 };
      difficultyMap[diff].total++;
      if (r.isCorrect) difficultyMap[diff].correct++;
    }

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentResponses = responses.filter((r) => r.createdAt >= thirtyDaysAgo);

    // Simulado history
    const simuladoHistory: Record<string, { simulado: string; total: number; correct: number; date: string }> = {};
    for (const r of responses) {
      if (r.simulado) {
        if (!simuladoHistory[r.simulado.id]) {
          simuladoHistory[r.simulado.id] = {
            simulado: r.simulado.title,
            total: 0,
            correct: 0,
            date: r.createdAt.toISOString(),
          };
        }
        simuladoHistory[r.simulado.id].total++;
        if (r.isCorrect) simuladoHistory[r.simulado.id].correct++;
      }
    }

    // Identify strengths and weaknesses
    const microareas = Object.values(microareaMap)
      .map((ma) => ({
        ...ma,
        hitRate: ma.total > 0 ? Math.round((ma.correct / ma.total) * 100) : 0,
      }))
      .sort((a, b) => b.hitRate - a.hitRate);

    const strengths = microareas.filter((m) => m.hitRate >= 70).slice(0, 5);
    const weaknesses = microareas.filter((m) => m.hitRate < 50 && m.total > 0).slice(0, 5);

    // Average response time
    const times = responses.filter((r) => r.responseTime !== null).map((r) => r.responseTime!);
    const avgResponseTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;

    return jsonResponse({
      user,
      overview: {
        totalResponses,
        correctResponses,
        hitRate,
        avgResponseTime,
        recentActivity: recentResponses.length,
      },
      byMicroarea: microareas,
      byDifficulty: Object.entries(difficultyMap).map(([difficulty, stats]) => ({
        difficulty,
        ...stats,
        hitRate: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      })),
      simuladoHistory: Object.values(simuladoHistory).map((s) => ({
        ...s,
        hitRate: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
      })),
      strengths,
      weaknesses,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Individual report error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
