import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = requireAuth(request);
    const { id } = await params;

    const simulado = await db.simulado.findUnique({
      where: { id },
      include: {
        configs: {
          include: {
            question: {
              include: {
                alternatives: { orderBy: { letter: 'asc' } },
                microarea: { select: { name: true, code: true, color: true } },
                element: { select: { name: true, code: true } },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!simulado) {
      return errorResponse('Simulado não encontrado.', 404);
    }

    if (!simulado.active) {
      return errorResponse('Este simulado não está ativo.', 400);
    }

    // For students, hide correct answers
    const questions = simulado.configs.map((config) => {
      const q = config.question;
      return {
        id: q.id,
        code: q.code,
        statement: q.statement,
        context: q.context,
        type: q.type,
        difficulty: q.difficulty,
        microarea: q.microarea,
        element: q.element,
        order: config.order,
        alternatives: q.alternatives,
        // Hide correct answer for students
        ...(authUser.role === Role.ALUNO ? { correctAnswer: undefined, explanation: undefined } : {}),
        // Show correct answer for professors/masters
        ...(authUser.role !== Role.ALUNO ? { correctAnswer: q.correctAnswer, explanation: q.explanation } : {}),
      };
    });

    return jsonResponse({
      simulado: {
        id: simulado.id,
        title: simulado.title,
        description: simulado.description,
        type: simulado.type,
        timeLimit: simulado.timeLimit,
        questionCount: simulado.questionCount,
      },
      questions,
      startedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Start simulado error:', error);
    if (error instanceof Error && error.message.includes('Não autenticado')) {
      return errorResponse(error.message, 401);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
