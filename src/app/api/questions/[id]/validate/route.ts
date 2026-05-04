import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireRole, jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = requireRole(request, Role.PROFESSOR, Role.MASTER);
    const { id } = await params;

    const question = await db.question.findUnique({
      where: { id },
    });

    if (!question) {
      return errorResponse('Questão não encontrada.', 404);
    }

    // Only questions waiting for validation can be validated
    if (!['AGUARDANDO_VALIDACAO', 'EM_TESTE'].includes(question.status)) {
      return errorResponse(`Questão não pode ser validada. Status atual: ${question.status}`, 400);
    }

    const body = await request.json();
    const { approved, feedback } = body;

    if (typeof approved !== 'boolean') {
      return errorResponse('O campo "approved" (boolean) é obrigatório.', 400);
    }

    const newStatus = approved ? 'APROVADA' : 'REPROVADA';

    const updated = await db.question.update({
      where: { id },
      data: {
        status: newStatus,
        validatorId: authUser.userId,
        // If approved, also mark as active
        ...(approved ? { status: 'ATIVA' } : {}),
      },
      include: {
        microarea: { select: { name: true, code: true } },
        element: { select: { name: true } },
        validator: { select: { name: true } },
      },
    });

    return jsonResponse({
      question: updated,
      message: approved
        ? 'Questão aprovada e ativada com sucesso!'
        : 'Questão reprovada.',
      feedback: feedback || null,
    });
  } catch (error) {
    console.error('Validate question error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
