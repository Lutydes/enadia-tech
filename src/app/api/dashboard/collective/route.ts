import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireRole, jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    requireRole(request, Role.MASTER, Role.PROFESSOR);

    // Run independent queries in parallel for performance
    const [
      totalUsers,
      activeUsers,
      studentsCount,
      questionsByStatus,
      totalQuestions,
      activeQuestions,
      totalResponses,
      allMicroareas,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { active: true } }),
      db.user.count({ where: { role: Role.ALUNO } }),
      db.question.groupBy({ by: ['status'], _count: { id: true } }),
      db.question.count(),
      db.question.count({ where: { status: 'ATIVA' } }),
      db.studentResponse.count(),
      db.microarea.findMany({ select: { id: true, name: true, code: true, color: true } }),
    ]);

    // Compute average hit rate manually (Prisma cannot _avg Boolean in SQLite)
    // Only fetch if there are responses
    let avgHitRateValue = 0;
    let microareaPerformance: Record<string, { total: number; correct: number; name: string; code: string; color: string }> = {};

    if (totalResponses > 0) {
      // Single query to get all response data with microarea info (no N+1)
      const allResponses = await db.studentResponse.findMany({
        select: {
          isCorrect: true,
          question: {
            select: {
              microareaId: true,
            },
          },
        },
      });

      // Build microarea lookup from pre-fetched data
      const microareaMap = new Map(allMicroareas.map(ma => [ma.id, ma]));

      // Calculate stats in a single pass
      let correctCount = 0;
      for (const r of allResponses) {
        if (r.isCorrect === true) correctCount++;
        
        const maId = r.question.microareaId;
        if (!microareaPerformance[maId]) {
          const ma = microareaMap.get(maId);
          if (ma) {
            microareaPerformance[maId] = { total: 0, correct: 0, name: ma.name, code: ma.code, color: ma.color };
          }
        }
        if (microareaPerformance[maId]) {
          microareaPerformance[maId].total++;
          if (r.isCorrect) microareaPerformance[maId].correct++;
        }
      }

      avgHitRateValue = allResponses.length > 0 ? correctCount / allResponses.length : 0;
    }

    // Student ranking - optimized: fetch all student responses in bulk instead of N+1
    const students = await db.user.findMany({
      where: { role: Role.ALUNO },
      select: {
        id: true,
        name: true,
        ra: true,
        _count: { select: { responses: true } },
      },
      take: 20,
    });

    // Batch fetch all student responses in a single query
    const studentIds = students.map(s => s.id);
    const allStudentResponses = studentIds.length > 0 ? await db.studentResponse.findMany({
      where: { userId: { in: studentIds } },
      select: { userId: true, isCorrect: true },
    }) : [];

    // Group responses by student
    const responsesByStudent = new Map<string, { total: number; correct: number }>();
    for (const r of allStudentResponses) {
      const existing = responsesByStudent.get(r.userId) || { total: 0, correct: 0 };
      existing.total++;
      if (r.isCorrect) existing.correct++;
      responsesByStudent.set(r.userId, existing);
    }

    const studentPerformance = students.map(student => {
      const stats = responsesByStudent.get(student.id) || { total: 0, correct: 0 };
      return {
        id: student.id,
        name: student.name,
        ra: student.ra,
        totalResponses: stats.total,
        correct: stats.correct,
        hitRate: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      };
    }).sort((a, b) => b.hitRate - a.hitRate);

    // Simulado stats
    const simuladoStats = await db.simulado.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        _count: { select: { responses: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Build chart data
    const macroareaChart = Object.values(microareaPerformance).map(ma => ({
      name: ma.name,
      questoes: ma.total,
    }));

    const statusChart = questionsByStatus.map((q, i) => ({
      name: q.status,
      value: q._count.id,
      color: ['#00f0ff', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'][i % 7],
    }));

    // Recent activity (simplified - last 10 responses)
    const recentResponses = await db.studentResponse.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        isCorrect: true,
        createdAt: true,
        user: { select: { name: true } },
        question: { select: { microarea: { select: { name: true } } } },
      },
    });

    const recentActivity = recentResponses.map(r => ({
      student: r.user?.name || 'Desconhecido',
      action: `Respondeu ${r.question?.microarea?.name || 'questão'}`,
      time: r.createdAt ? new Date(r.createdAt).toLocaleDateString('pt-BR') : '',
      score: r.isCorrect !== null ? (r.isCorrect ? 100 : 0) : undefined,
    }));

    return jsonResponse({
      overview: {
        totalUsers,
        activeUsers,
        studentsCount,
        totalQuestions,
        activeQuestions,
        totalResponses,
        avgHitRate: Math.round(avgHitRateValue * 100),
      },
      questionsByStatus: questionsByStatus.map((q) => ({
        status: q.status,
        count: q._count.id,
      })),
      byMicroarea: Object.values(microareaPerformance).map((ma) => ({
        ...ma,
        hitRate: ma.total > 0 ? Math.round((ma.correct / ma.total) * 100) : 0,
      })),
      studentRanking: studentPerformance,
      simuladoStats,
      macroareaChart,
      statusChart,
      recentActivity,
      maiorPerformador: studentPerformance.length > 0 ? studentPerformance[0].name : '—',
      microareaDificil: Object.values(microareaPerformance).length > 0
        ? Object.values(microareaPerformance).sort((a, b) => {
            const rateA = a.total > 0 ? a.correct / a.total : 1;
            const rateB = b.total > 0 ? b.correct / b.total : 1;
            return rateA - rateB;
          })[0].name
        : '—',
    });
  } catch (error) {
    console.error('Collective stats error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
