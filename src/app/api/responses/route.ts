import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, jsonResponse, errorResponse } from '@/lib/auth-middleware';

// =============================================================================
// FIXED: /api/responses — Handles BOTH database questions AND local bank questions
//
// ROOT CAUSE FIX: The simulado uses in-memory questions from enade-full-bank.ts
// whose IDs don't exist in the database. Previously this caused a 404 and the
// response was silently lost, breaking ranking and progress tracking.
//
// Now: If the question isn't found in the DB, we check for additional fields
// (correctAnswer, topic, macroarea, difficulty) from the client and save to
// the LocalQuestionResponse table instead.
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const authUser = requireAuth(request);

    const body = await request.json();
    const { questionId, answer, responseTime, correctAnswer, topic, macroarea, difficulty } = body;

    if (!questionId || answer === undefined) {
      return errorResponse('questionId e answer são obrigatórios.', 400);
    }

    const instance = authUser.instance || process.env.APP_INSTANCE || 'ENADIA';

    // Try to find the question in the database first
    const question = await db.question.findUnique({
      where: { id: questionId },
      select: { correctAnswer: true, status: true },
    });

    if (question) {
      // ─── DB Question: use original logic ───
      const isCorrect = answer === question.correctAnswer;

      const response = await db.studentResponse.create({
        data: {
          userId: authUser.userId,
          questionId,
          answer,
          isCorrect,
          responseTime: responseTime || null,
          instance,
        },
      });

      return jsonResponse({
        response: {
          id: response.id,
          isCorrect,
          correctAnswer: question.correctAnswer,
        },
      }, 201);
    } else if (correctAnswer) {
      // ─── LOCAL BANK QUESTION: save to LocalQuestionResponse ───
      // This is the FIX for the ranking/progress bug
      const isCorrect = answer === correctAnswer;

      const response = await db.localQuestionResponse.create({
        data: {
          userId: authUser.userId,
          questionBankId: questionId,
          topic: topic || 'Geral',
          macroarea: macroarea || 'Geral',
          difficulty: difficulty || 'médio',
          answer,
          correctAnswer,
          isCorrect,
          responseTime: responseTime || null,
          instance,
        },
      });

      return jsonResponse({
        response: {
          id: response.id,
          isCorrect,
          correctAnswer,
          source: 'local-bank',
        },
      }, 201);
    } else {
      return errorResponse('Questão não encontrada no banco de dados. Envie correctAnswer para questões do banco local.', 404);
    }
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const instance = authUser.instance || process.env.APP_INSTANCE || 'ENADIA';

    // Fetch BOTH database responses and local bank responses, filtered by instance
    const [dbResponses, localResponses, dbTotal, localTotal] = await Promise.all([
      db.studentResponse.findMany({
        where: { userId: authUser.userId, instance },
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
      }),
      db.localQuestionResponse.findMany({
        where: { userId: authUser.userId, instance },
        orderBy: { createdAt: 'desc' },
      }),
      db.studentResponse.count({ where: { userId: authUser.userId, instance } }),
      db.localQuestionResponse.count({ where: { userId: authUser.userId, instance } }),
    ]);

    // Merge and sort by date
    const allResponses = [
      ...dbResponses.map(r => ({
        id: r.id,
        questionId: r.questionId,
        answer: r.answer,
        isCorrect: r.isCorrect,
        responseTime: r.responseTime,
        createdAt: r.createdAt,
        source: 'db' as const,
        microarea: r.question?.microarea?.name || null,
        difficulty: r.question?.difficulty || null,
      })),
      ...localResponses.map(r => ({
        id: r.id,
        questionId: r.questionBankId,
        answer: r.answer,
        isCorrect: r.isCorrect,
        responseTime: r.responseTime,
        createdAt: r.createdAt,
        source: 'local-bank' as const,
        microarea: r.topic,
        difficulty: r.difficulty,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = dbTotal + localTotal;
    const paginated = allResponses.slice((page - 1) * limit, page * limit);

    return jsonResponse({
      responses: paginated,
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
