import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireRole, jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    requireRole(request, Role.MASTER, Role.PROFESSOR);

    // Total users
    const totalUsers = await db.user.count();
    const activeUsers = await db.user.count({ where: { active: true } });
    const studentsCount = await db.user.count({ where: { role: Role.ALUNO } });

    // Total questions by status
    const questionsByStatus = await db.question.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const totalQuestions = await db.question.count();
    const activeQuestions = await db.question.count({ where: { status: 'ATIVA' } });

    // Total responses
    const totalResponses = await db.studentResponse.count();
    const avgHitRate = await db.studentResponse.aggregate({
      _avg: { isCorrect: true },
    });

    // Performance by microarea (all students)
    const allResponses = await db.studentResponse.findMany({
      select: {
        isCorrect: true,
        question: {
          select: {
            microareaId: true,
            difficulty: true,
          },
        },
      },
    });

    const microareaPerformance: Record<string, { total: number; correct: number; name: string; code: string; color: string }> = {};

    for (const r of allResponses) {
      const maId = r.question.microareaId;
      if (!microareaPerformance[maId]) {
        const ma = await db.microarea.findUnique({
          where: { id: maId },
          select: { name: true, code: true, color: true },
        });
        if (ma) {
          microareaPerformance[maId] = { total: 0, correct: 0, ...ma };
        }
      }
      if (microareaPerformance[maId]) {
        microareaPerformance[maId].total++;
        if (r.isCorrect) microareaPerformance[maId].correct++;
      }
    }

    // Students ranked by performance
    const studentRanking = await db.user.findMany({
      where: { role: Role.ALUNO },
      select: {
        id: true,
        name: true,
        ra: true,
        _count: { select: { responses: true } },
      },
      orderBy: {
        responses: { _count: 'desc' },
      },
      take: 20,
    });

    // Get actual performance for each student
    const studentPerformance = [];
    for (const student of studentRanking) {
      const responses = await db.studentResponse.findMany({
        where: { userId: student.id },
        select: { isCorrect: true },
      });
      const correct = responses.filter((r) => r.isCorrect).length;
      studentPerformance.push({
        ...student,
        totalResponses: responses.length,
        correct,
        hitRate: responses.length > 0 ? Math.round((correct / responses.length) * 100) : 0,
      });
    }

    studentPerformance.sort((a, b) => b.hitRate - a.hitRate);

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

    return jsonResponse({
      overview: {
        totalUsers,
        activeUsers,
        studentsCount,
        totalQuestions,
        activeQuestions,
        totalResponses,
        avgHitRate: avgHitRate._avg.isCorrect
          ? Math.round(avgHitRate._avg.isCorrect * 100)
          : 0,
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
    });
  } catch (error) {
    console.error('Collective stats error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
