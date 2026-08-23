import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, jsonResponse, errorResponse } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    const instance = authUser.instance || process.env.APP_INSTANCE || 'ENADIA';

    // FIX: Fetch BOTH database responses AND local bank responses, filtered by instance
    const [dbResponses, localResponses] = await Promise.all([
      db.studentResponse.findMany({
        where: { userId: authUser.userId, instance },
        select: {
          id: true, isCorrect: true, responseTime: true, createdAt: true, answer: true,
          question: {
            select: {
              id: true, code: true, difficulty: true, microareaId: true,
              microarea: { select: { id: true, name: true, code: true, color: true, macroarea: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.localQuestionResponse.findMany({
        where: { userId: authUser.userId, instance },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const dbTotal = dbResponses.length;
    const dbCorrect = dbResponses.filter(r => r.isCorrect).length;
    const localTotal = localResponses.length;
    const localCorrect = localResponses.filter(r => r.isCorrect).length;

    const totalResponses = dbTotal + localTotal;
    const correctResponses = dbCorrect + localCorrect;
    const incorrectResponses = totalResponses - correctResponses;
    const hitRate = totalResponses > 0 ? Math.round((correctResponses / totalResponses) * 100) : 0;

    // Get all microareas for lookup (shared content, no instance filter)
    const allMicroareas = await db.microarea.findMany({
      select: { id: true, name: true, code: true, color: true, macroarea: true },
      orderBy: { order: 'asc' },
    });
    const microareaMap = new Map(allMicroareas.map(ma => [ma.name, ma]));

    // Group by microarea — process both DB and local responses
    const microareaPerformance: Record<string, { microareaId: string; total: number; correct: number; name: string; code: string; color: string; macroarea: string }> = {};

    for (const r of dbResponses) {
      const maId = r.question.microareaId;
      if (!microareaPerformance[maId]) {
        microareaPerformance[maId] = {
          microareaId: maId, total: 0, correct: 0,
          name: r.question.microarea?.name || 'Desconhecida',
          code: r.question.microarea?.code || '',
          color: r.question.microarea?.color || '#3b82f6',
          macroarea: r.question.microarea?.macroarea || '',
        };
      }
      microareaPerformance[maId].total++;
      if (r.isCorrect) microareaPerformance[maId].correct++;
    }

    // FIX: Also count local bank responses by topic (microarea name)
    for (const r of localResponses) {
      const ma = microareaMap.get(r.topic);
      const key = ma?.id || `local-${r.topic}`;
      if (!microareaPerformance[key]) {
        microareaPerformance[key] = {
          microareaId: key, total: 0, correct: 0,
          name: r.topic,
          code: ma?.code || '',
          color: ma?.color || '#3b82f6',
          macroarea: r.macroarea || '',
        };
      }
      microareaPerformance[key].total++;
      if (r.isCorrect) microareaPerformance[key].correct++;
    }

    // Group by macroarea
    const macroareaPerformance: Record<string, { total: number; correct: number; name: string }> = {};
    for (const ma of Object.values(microareaPerformance)) {
      const macroName = ma.macroarea || 'Outros';
      if (!macroareaPerformance[macroName]) {
        macroareaPerformance[macroName] = { total: 0, correct: 0, name: macroName };
      }
      macroareaPerformance[macroName].total += ma.total;
      macroareaPerformance[macroName].correct += ma.correct;
    }

    // Performance by difficulty
    const difficultyStats: Record<string, { total: number; correct: number }> = {};
    for (const r of dbResponses) {
      const diff = r.question.difficulty || 'não definida';
      if (!difficultyStats[diff]) difficultyStats[diff] = { total: 0, correct: 0 };
      difficultyStats[diff].total++;
      if (r.isCorrect) difficultyStats[diff].correct++;
    }
    for (const r of localResponses) {
      const diff = r.difficulty || 'não definida';
      if (!difficultyStats[diff]) difficultyStats[diff] = { total: 0, correct: 0 };
      difficultyStats[diff].total++;
      if (r.isCorrect) difficultyStats[diff].correct++;
    }

    // Merge recent activity from both sources (sorted by date)
    const allRecent = [
      ...dbResponses.map(r => ({
        id: r.id, isCorrect: r.isCorrect, responseTime: r.responseTime,
        createdAt: r.createdAt, answer: r.answer,
        microarea: r.question.microarea?.name || 'Desconhecida',
        difficulty: r.question.difficulty,
      })),
      ...localResponses.map(r => ({
        id: r.id, isCorrect: r.isCorrect, responseTime: r.responseTime,
        createdAt: r.createdAt, answer: r.answer,
        microarea: r.topic, difficulty: r.difficulty,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
     .slice(0, 10);

    // Simulado stats
    const simuladoSessions = await db.studentResponse.groupBy({
      by: ['simuladoId'],
      where: { userId: authUser.userId, simuladoId: { not: null }, instance },
      _count: { id: true },
    });
    const simuladosTaken = simuladoSessions.length;

    // Average response time (both sources)
    const dbAvgTime = await db.studentResponse.aggregate({
      where: { userId: authUser.userId, responseTime: { not: null }, instance },
      _avg: { responseTime: true },
    });
    const localAvgTime = await db.localQuestionResponse.aggregate({
      where: { userId: authUser.userId, responseTime: { not: null }, instance },
      _avg: { responseTime: true },
    });
    const allTimes = [
      ...(dbAvgTime._avg.responseTime ? [dbAvgTime._avg.responseTime] : []),
      ...(localAvgTime._avg.responseTime ? [localAvgTime._avg.responseTime] : []),
    ];
    const avgResponseTime = allTimes.length > 0 ? Math.round(allTimes.reduce((a, b) => a + b, 0) / allTimes.length) : null;

    // TRI evolution — merge both sources chronologically
    const allChronological = [
      ...dbResponses.map(r => ({ date: r.createdAt, isCorrect: r.isCorrect })),
      ...localResponses.map(r => ({ date: r.createdAt, isCorrect: r.isCorrect })),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const triEvolution: Array<{ date: string; theta: number; cumulativeCorrect: number; cumulativeTotal: number }> = [];
    let cumCorrect = 0;
    let cumTotal = 0;
    for (const r of allChronological) {
      cumTotal++;
      if (r.isCorrect) cumCorrect++;
      const theta = cumTotal > 0 ? Math.round(((cumCorrect / cumTotal) - 0.25) * 300) / 100 : 0;
      triEvolution.push({
        date: r.date.toISOString(),
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

    return jsonResponse({
      overview: {
        totalResponses, correctResponses, incorrectResponses, hitRate, simuladosTaken,
        avgResponseTime,
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
        microareaId: ma.microareaId, name: ma.name, code: ma.code,
        color: ma.color, macroarea: ma.macroarea,
        total: ma.total, correct: ma.correct,
        hitRate: ma.total > 0 ? Math.round((ma.correct / ma.total) * 100) : 0,
      })),
      byMacroarea: Object.values(macroareaPerformance).map((ma) => ({
        name: ma.name, total: ma.total, correct: ma.correct,
        hitRate: ma.total > 0 ? Math.round((ma.correct / ma.total) * 100) : 0,
      })),
      byDifficulty: Object.entries(difficultyStats).map(([difficulty, stats]) => ({
        difficulty, total: stats.total, correct: stats.correct,
        hitRate: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      })),
      recentResponses: allRecent,
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
