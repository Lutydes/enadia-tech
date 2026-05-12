import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, jsonResponse, errorResponse } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request);

    // Get total stats
    const totalResponses = await db.studentResponse.count({
      where: { userId: authUser.userId },
    });

    const correctResponses = await db.studentResponse.count({
      where: { userId: authUser.userId, isCorrect: true },
    });

    const incorrectResponses = totalResponses - correctResponses;
    const hitRate = totalResponses > 0 ? Math.round((correctResponses / totalResponses) * 100) : 0;

    // Get all responses with question details for analytics
    const responsesWithQuestion = await db.studentResponse.findMany({
      where: { userId: authUser.userId },
      select: {
        id: true,
        isCorrect: true,
        responseTime: true,
        createdAt: true,
        answer: true,
        question: {
          select: {
            id: true,
            code: true,
            difficulty: true,
            microareaId: true,
            microarea: {
              select: {
                id: true,
                name: true,
                code: true,
                color: true,
                macroarea: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group by microarea
    const microareaPerformance: Record<string, { microareaId: string; total: number; correct: number; name: string; code: string; color: string; macroarea: string }> = {};

    for (const r of responsesWithQuestion) {
      const maId = r.question.microareaId;
      if (!microareaPerformance[maId]) {
        microareaPerformance[maId] = {
          microareaId: maId,
          total: 0,
          correct: 0,
          name: r.question.microarea?.name || 'Desconhecida',
          code: r.question.microarea?.code || '',
          color: r.question.microarea?.color || '#3b82f6',
          macroarea: r.question.microarea?.macroarea || '',
        };
      }
      microareaPerformance[maId].total++;
      if (r.isCorrect) microareaPerformance[maId].correct++;
    }

    // Group by macroarea (from microarea data)
    const macroareaPerformance: Record<string, { total: number; correct: number; name: string }> = {};
    for (const ma of Object.values(microareaPerformance)) {
      const macroName = ma.macroarea;
      if (!macroareaPerformance[macroName]) {
        macroareaPerformance[macroName] = { total: 0, correct: 0, name: macroName };
      }
      macroareaPerformance[macroName].total += ma.total;
      macroareaPerformance[macroName].correct += ma.correct;
    }

    // Performance by difficulty
    const difficultyStats: Record<string, { total: number; correct: number }> = {};
    for (const r of responsesWithQuestion) {
      const diff = r.question.difficulty || 'não definida';
      if (!difficultyStats[diff]) difficultyStats[diff] = { total: 0, correct: 0 };
      difficultyStats[diff].total++;
      if (r.isCorrect) difficultyStats[diff].correct++;
    }

    // Recent activity (last 10 responses)
    const recentResponses = responsesWithQuestion.slice(0, 10).map((r) => ({
      id: r.id,
      isCorrect: r.isCorrect,
      responseTime: r.responseTime,
      createdAt: r.createdAt,
      answer: r.answer,
      microarea: r.question.microarea?.name || 'Desconhecida',
      difficulty: r.question.difficulty,
    }));

    // Simulado stats - count unique simulado sessions
    const simuladoSessions = await db.studentResponse.groupBy({
      by: ['simuladoId'],
      where: { userId: authUser.userId, simuladoId: { not: null } },
      _count: { id: true },
    });
    const simuladosTaken = simuladoSessions.length;

    // Average response time
    const avgTimeResult = await db.studentResponse.aggregate({
      where: { userId: authUser.userId, responseTime: { not: null } },
      _avg: { responseTime: true },
    });

    // TRI evolution - simulated theta based on cumulative performance
    // Simple IRT approximation: theta = log(correct/incorrect) normalized
    const triEvolution: Array<{ date: string; theta: number; cumulativeCorrect: number; cumulativeTotal: number }> = [];
    let cumCorrect = 0;
    let cumTotal = 0;
    // Process in reverse chronological order and build forward
    const chronological = [...responsesWithQuestion].reverse();
    for (const r of chronological) {
      cumTotal++;
      if (r.isCorrect) cumCorrect++;
      // Simple theta estimation
      const theta = cumTotal > 0 ? Math.round(((cumCorrect / cumTotal) - 0.25) * 300) / 100 : 0;
      triEvolution.push({
        date: r.createdAt.toISOString(),
        theta,
        cumulativeCorrect: cumCorrect,
        cumulativeTotal: cumTotal,
      });
    }

    // Find best and worst microareas
    const microareaList = Object.values(microareaPerformance)
      .filter(ma => ma.total > 0)
      .sort((a, b) => (b.correct / b.total) - (a.correct / a.total));

    const bestMicroarea = microareaList.length > 0 ? microareaList[0] : null;
    const worstMicroarea = microareaList.length > 0 ? microareaList[microareaList.length - 1] : null;

    // Get all microareas from the system
    const allMicroareas = await db.microarea.findMany({
      select: { id: true, name: true, code: true, color: true, macroarea: true },
      orderBy: { order: 'asc' },
    });

    return jsonResponse({
      overview: {
        totalResponses,
        correctResponses,
        incorrectResponses,
        hitRate,
        simuladosTaken,
        avgResponseTime: avgTimeResult._avg.responseTime
          ? Math.round(avgTimeResult._avg.responseTime)
          : null,
        bestMicroarea: bestMicroarea ? {
          name: bestMicroarea.name,
          hitRate: Math.round((bestMicroarea.correct / bestMicroarea.total) * 100),
          total: bestMicroarea.total,
        } : null,
        worstMicroarea: worstMicroarea ? {
          name: worstMicroarea.name,
          hitRate: Math.round((worstMicroarea.correct / worstMicroarea.total) * 100),
          total: worstMicroarea.total,
        } : null,
      },
      byMicroarea: Object.values(microareaPerformance).map((ma) => ({
        microareaId: ma.microareaId,
        name: ma.name,
        code: ma.code,
        color: ma.color,
        macroarea: ma.macroarea,
        total: ma.total,
        correct: ma.correct,
        hitRate: ma.total > 0 ? Math.round((ma.correct / ma.total) * 100) : 0,
      })),
      byMacroarea: Object.values(macroareaPerformance).map((ma) => ({
        name: ma.name,
        total: ma.total,
        correct: ma.correct,
        hitRate: ma.total > 0 ? Math.round((ma.correct / ma.total) * 100) : 0,
      })),
      byDifficulty: Object.entries(difficultyStats).map(([difficulty, stats]) => ({
        difficulty,
        total: stats.total,
        correct: stats.correct,
        hitRate: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      })),
      recentResponses,
      triEvolution: triEvolution.length > 0 ? triEvolution : [],
      allMicroareas,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    if (error instanceof Error && error.message.includes('Não autenticado')) {
      return errorResponse(error.message, 401);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
