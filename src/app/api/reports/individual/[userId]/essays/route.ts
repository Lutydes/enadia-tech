import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireRole, jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const authUser = requireAuth(request);
    const { userId } = await params;

    // Students can only see their own essays; masters/professors can see any
    if (authUser.role === Role.ALUNO && authUser.userId !== userId) {
      return errorResponse('Acesso negado.', 403);
    }

    const essays = await db.essayAnswer.findMany({
      where: { userId },
      select: {
        id: true,
        answer: true,
        aiFeedback: true,
        aiScore: true,
        createdAt: true,
        question: {
          select: {
            id: true,
            code: true,
            statement: true,
            microarea: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return jsonResponse({
      essays: essays.map(e => ({
        id: e.id,
        answer: e.answer,
        aiFeedback: e.aiFeedback,
        aiScore: e.aiScore,
        createdAt: e.createdAt.toISOString(),
        question: {
          id: e.question.id,
          code: e.question.code,
          statement: e.question.statement,
          microarea: { name: e.question.microarea.name },
        },
      })),
    });
  } catch (error) {
    console.error('Essay answers report error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
