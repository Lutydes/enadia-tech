import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, jsonResponse, errorResponse } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const authUser = requireAuth(request);

    const body = await request.json();
    const { simuladoId, answers } = body; // answers: [{ questionId, answer, responseTime? }]

    if (!simuladoId || !answers?.length) {
      return errorResponse('simuladoId e answers são obrigatórios.', 400);
    }

    // Verify simulado exists and is active
    const simulado = await db.simulado.findUnique({
      where: { id: simuladoId },
    });

    if (!simulado) {
      return errorResponse('Simulado não encontrado.', 404);
    }

    // Process each answer
    const results = [];
    let correctCount = 0;

    for (const answer of answers) {
      const question = await db.question.findUnique({
        where: { id: answer.questionId },
        select: { correctAnswer: true },
      });

      if (!question) continue;

      const isCorrect = answer.answer === question.correctAnswer;
      if (isCorrect) correctCount++;

      await db.studentResponse.create({
        data: {
          userId: authUser.userId,
          questionId: answer.questionId,
          simuladoId,
          answer: answer.answer,
          isCorrect,
          responseTime: answer.responseTime || null,
        },
      });

      results.push({
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect,
      });
    }

    const score = Math.round((correctCount / answers.length) * 100);

    return jsonResponse({
      simuladoId,
      score,
      correct: correctCount,
      total: answers.length,
      percentage: `${score}%`,
      results,
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Submit simulado error:', error);
    if (error instanceof Error && error.message.includes('Não autenticado')) {
      return errorResponse(error.message, 401);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
