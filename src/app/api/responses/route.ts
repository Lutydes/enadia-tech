import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, jsonResponse, errorResponse } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const authUser = requireAuth(request);

    const body = await request.json();
    const { questionId, answer, responseTime } = body;

    if (!questionId || answer === undefined) {
      return errorResponse('questionId e answer são obrigatórios.', 400);
    }

    const question = await db.question.findUnique({
      where: { id: questionId },
      select: { correctAnswer: true, status: true },
    });

    if (!question) {
      return errorResponse('Questão não encontrada.', 404);
    }

    const isCorrect = answer === question.correctAnswer;

    const response = await db.studentResponse.create({
      data: {
        userId: authUser.userId,
        questionId,
        answer,
        isCorrect,
        responseTime: responseTime || null,
      },
    });

    return jsonResponse({
      response: {
        id: response.id,
        isCorrect,
        correctAnswer: question.correctAnswer,
      },
    }, 201);
  } catch (error) {
    console.error('Save response error:', error);
    if (error instanceof Error && error.message.includes('Não autenticado')) {
      return errorResponse(error.message, 401);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request);

    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = { userId: authUser.userId };
    if (questionId) where.questionId = questionId;

    const [responses, total] = await Promise.all([
      db.studentResponse.findMany({
        where,
        include: {
          question: {
            select: {
              id: true,
              code: true,
              type: true,
              difficulty: true,
              correctAnswer: true,
              microarea: { select: { name: true, code: true, color: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.studentResponse.count({ where }),
    ]);

    return jsonResponse({
      responses,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('List responses error:', error);
    if (error instanceof Error && error.message.includes('Não autenticado')) {
      return errorResponse(error.message, 401);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
