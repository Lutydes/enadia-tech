import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get all student responses grouped by user
    const responses = await db.studentResponse.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            ra: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group by user
    const userStats = new Map<string, {
      userId: string;
      name: string;
      email: string;
      ra: string | null;
      role: string;
      totalAnswered: number;
      totalCorrect: number;
      totalResponseTime: number;
      responseTimeCount: number;
    }>();

    for (const r of responses) {
      const existing = userStats.get(r.userId) || {
        userId: r.userId,
        name: r.user.name,
        email: r.user.email,
        ra: r.user.ra,
        role: r.user.role,
        totalAnswered: 0,
        totalCorrect: 0,
        totalResponseTime: 0,
        responseTimeCount: 0,
      };

      existing.totalAnswered++;
      if (r.isCorrect) existing.totalCorrect++;
      if (r.responseTime) {
        existing.totalResponseTime += r.responseTime;
        existing.responseTimeCount++;
      }

      userStats.set(r.userId, existing);
    }

    // Also include users with no responses yet
    const allUsers = await db.user.findMany({
      where: { active: true },
      select: { id: true, name: true, email: true, ra: true, role: true },
    });

    for (const u of allUsers) {
      if (!userStats.has(u.id)) {
        userStats.set(u.id, {
          userId: u.id,
          name: u.name,
          email: u.email,
          ra: u.ra,
          role: u.role,
          totalAnswered: 0,
          totalCorrect: 0,
          totalResponseTime: 0,
          responseTimeCount: 0,
        });
      }
    }

    // Convert to array and calculate derived stats
    const ranking = Array.from(userStats.values())
      .filter(u => u.role === 'ALUNO' || u.role === 'PROFESSOR')
      .map(u => ({
        userId: u.userId,
        name: u.name,
        email: u.email,
        ra: u.ra,
        role: u.role,
        totalAnswered: u.totalAnswered,
        totalCorrect: u.totalCorrect,
        hitRate: u.totalAnswered > 0 ? Math.round((u.totalCorrect / u.totalAnswered) * 100) : 0,
        avgResponseTime: u.responseTimeCount > 0
          ? Math.round(u.totalResponseTime / u.responseTimeCount)
          : null,
      }))
      .sort((a, b) => {
        // Sort by hit rate desc, then by total correct desc
        if (b.hitRate !== a.hitRate) return b.hitRate - a.hitRate;
        return b.totalCorrect - a.totalCorrect;
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
