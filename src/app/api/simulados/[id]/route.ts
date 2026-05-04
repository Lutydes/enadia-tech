import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireRole, jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAuth(request);
    const { id } = await params;

    const simulado = await db.simulado.findUnique({
      where: { id },
      include: {
        configs: {
          include: {
            question: {
              include: {
                microarea: { select: { name: true, code: true, color: true } },
                element: { select: { name: true } },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { responses: true },
        },
      },
    });

    if (!simulado) {
      return errorResponse('Simulado não encontrado.', 404);
    }

    return jsonResponse({ simulado });
  } catch (error) {
    console.error('Get simulado error:', error);
    if (error instanceof Error && error.message.includes('Não autenticado')) {
      return errorResponse(error.message, 401);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireRole(request, Role.PROFESSOR, Role.MASTER);
    const { id } = await params;

    const existing = await db.simulado.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Simulado não encontrado.', 404);
    }

    const body = await request.json();
    const { title, description, type, phase, timeLimit, questionCount, active } = body;

    const simulado = await db.simulado.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(type !== undefined ? { type } : {}),
        ...(phase !== undefined ? { phase } : {}),
        ...(timeLimit !== undefined ? { timeLimit } : {}),
        ...(questionCount !== undefined ? { questionCount } : {}),
        ...(active !== undefined ? { active } : {}),
      },
    });

    return jsonResponse({ simulado });
  } catch (error) {
    console.error('Update simulado error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireRole(request, Role.PROFESSOR, Role.MASTER);
    const { id } = await params;

    const existing = await db.simulado.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Simulado não encontrado.', 404);
    }

    await db.simulado.delete({ where: { id } });

    return jsonResponse({ message: 'Simulado excluído com sucesso.' });
  } catch (error) {
    console.error('Delete simulado error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
