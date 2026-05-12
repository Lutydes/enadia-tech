import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireRole, jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const microarea = await db.microarea.findUnique({
      where: { id },
      include: {
        elements: {
          orderBy: { order: 'asc' },
          include: {
            _count: {
              select: { questions: true },
            },
          },
        },
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    if (!microarea) {
      return errorResponse('Microárea não encontrada.', 404);
    }

    return jsonResponse({ microarea });
  } catch (error) {
    console.error('Get microarea error:', error);
    return errorResponse('Erro interno do servidor.', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireRole(request, Role.MASTER);
    const { id } = await params;

    const existing = await db.microarea.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Microárea não encontrada.', 404);
    }

    const body = await request.json();
    const { name, code, macroarea, description, color, order } = body;

    // Check for duplicate code if code is being changed
    if (code && code !== existing.code) {
      const duplicate = await db.microarea.findUnique({ where: { code } });
      if (duplicate) {
        return errorResponse('Já existe uma microárea com este código.', 409);
      }
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (code !== undefined) updateData.code = code;
    if (macroarea !== undefined) updateData.macroarea = macroarea;
    if (description !== undefined) updateData.description = description;
    if (color !== undefined) updateData.color = color;
    if (order !== undefined) updateData.order = order;

    const microarea = await db.microarea.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            elements: true,
            questions: true,
          },
        },
      },
    });

    return jsonResponse({ microarea });
  } catch (error) {
    console.error('Update microarea error:', error);
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
    requireRole(request, Role.MASTER);
    const { id } = await params;

    const existing = await db.microarea.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Microárea não encontrada.', 404);
    }

    // Cascade deletes elements (via schema onDelete: Cascade)
    await db.microarea.delete({ where: { id } });

    return jsonResponse({ message: 'Microárea excluída com sucesso.' });
  } catch (error) {
    console.error('Delete microarea error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
