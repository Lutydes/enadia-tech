import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireRole, jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    requireRole(request, Role.MASTER, Role.PROFESSOR);

    // Get all students
    const students = await db.user.findMany({
      where: { role: Role.ALUNO },
      select: { id: true, name: true, ra: true, createdAt: true },
    });

    // Get all responses with question info
    const allResponses = await db.studentResponse.findMany({
      select: {
        userId: true,
        isCorrect: true,
        question: {
          select: {
            difficulty: true,
            microareaId: true,
            microarea: { select: { name: true, code: true, color: true, macroarea: true } },
          },
        },
      },
    });

    // Group by student
    const studentReports = [];
    for (const student of students) {
      const studentResponses = allResponses.filter((r) => r.userId === student.id);
      const total = studentResponses.length;
      const correct = studentResponses.filter((r) => r.isCorrect).length;
      const hitRate = total > 0 ? Math.round((correct / total) * 100) : 0;

      // By microarea for this student
      const microareaMap: Record<string, { total: number; correct: number; name: string; code: string; color: string }> = {};
      for (const r of studentResponses) {
        const maId = r.question.microareaId;
        if (!microareaMap[maId]) {
          microareaMap[maId] = {
            total: 0,
            correct: 0,
            name: r.question.microarea.name,
            code: r.question.microarea.code,
            color: r.question.microarea.color,
          };
        }
        microareaMap[maId].total++;
        if (r.isCorrect) microareaMap[maId].correct++;
      }

      studentReports.push({
        user: student,
        overview: { total, correct, hitRate },
        byMicroarea: Object.values(microareaMap).map((ma) => ({
          ...ma,
          hitRate: ma.total > 0 ? Math.round((ma.correct / ma.total) * 100) : 0,
        })),
      });
    }

    // Sort by hit rate descending
    studentReports.sort((a, b) => b.overview.hitRate - a.overview.hitRate);

    // Class averages
    const classTotal = allResponses.length;
    const classCorrect = allResponses.filter((r) => r.isCorrect).length;
    const classAvg = classTotal > 0 ? Math.round((classCorrect / classTotal) * 100) : 0;

    // Students who haven't responded
    const activeStudents = new Set(allResponses.map((r) => r.userId));
    const inactiveStudents = students.filter((s) => !activeStudents.has(s.id));

    // Performance distribution
    const distribution = { excellent: 0, good: 0, average: 0, needsImprovement: 0, noData: 0 };
    for (const sr of studentReports) {
      if (sr.overview.total === 0) {
        distribution.noData++;
      } else if (sr.overview.hitRate >= 80) {
        distribution.excellent++;
      } else if (sr.overview.hitRate >= 60) {
        distribution.good++;
      } else if (sr.overview.hitRate >= 40) {
        distribution.average++;
      } else {
        distribution.needsImprovement++;
      }
    }

    // Overall microarea performance
    const globalMicroareaMap: Record<string, { total: number; correct: number; name: string; code: string; color: string; macroarea: string }> = {};
    for (const r of allResponses) {
      const maId = r.question.microareaId;
      if (!globalMicroareaMap[maId]) {
        globalMicroareaMap[maId] = {
          total: 0,
          correct: 0,
          name: r.question.microarea.name,
          code: r.question.microarea.code,
          color: r.question.microarea.color,
          macroarea: r.question.microarea.macroarea,
        };
      }
      globalMicroareaMap[maId].total++;
      if (r.isCorrect) globalMicroareaMap[maId].correct++;
    }

    return jsonResponse({
      summary: {
        totalStudents: students.length,
        activeStudents: activeStudents.size,
        inactiveStudents: inactiveStudents.length,
        classAverage: classAvg,
        totalResponses: classTotal,
        distribution,
      },
      globalByMicroarea: Object.values(globalMicroareaMap)
        .map((ma) => ({
          ...ma,
          hitRate: ma.total > 0 ? Math.round((ma.correct / ma.total) * 100) : 0,
        }))
        .sort((a, b) => b.hitRate - a.hitRate),
      studentReports,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Collective report error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
