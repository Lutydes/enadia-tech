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

    const element = await db.element.findUnique({
      where: { id },
      include: {
        microarea: {
          select: {
            id: true,
            name: true,
            code: true,
            color: true,
            macroarea: true,
          },
        },
        _count: {
          select: { questions: true },
        },
      },
    });

    if (!element) {
      return errorResponse('Elemento não encontrado.', 404);
    }

    return jsonResponse({ element });
  } catch (error) {
    console.error('Get element error:', error);
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

    const existing = await db.element.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Elemento não encontrado.', 404);
    }

    const body = await request.json();
    const { code, name, description, microareaId, skillLevel, order } = body;

    // Check for duplicate code if code is being changed
    if (code && code !== existing.code) {
      const duplicate = await db.element.findUnique({ where: { code } });
      if (duplicate) {
        return errorResponse('Já existe um elemento com este código.', 409);
      }
    }

    // Verify microarea exists if being changed
    if (microareaId && microareaId !== existing.microareaId) {
      const microarea = await db.microarea.findUnique({ where: { id: microareaId } });
      if (!microarea) {
        return errorResponse('Microárea não encontrada.', 404);
      }
    }

    const updateData: Record<string, unknown> = {};
    if (code !== undefined) updateData.code = code;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (microareaId !== undefined) updateData.microareaId = microareaId;
    if (skillLevel !== undefined) updateData.skillLevel = skillLevel;
    if (order !== undefined) updateData.order = order;

    const element = await db.element.update({
      where: { id },
      data: updateData,
      include: {
        microarea: {
          select: {
            id: true,
            name: true,
            code: true,
            color: true,
            macroarea: true,
          },
        },
        _count: {
          select: { questions: true },
        },
      },
    });

    return jsonResponse({ element });
  } catch (error) {
    console.error('Update element error:', error);
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

    const existing = await db.element.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Elemento não encontrado.', 404);
    }

    await db.element.delete({ where: { id } });

    return jsonResponse({ message: 'Elemento excluído com sucesso.' });
  } catch (error) {
    console.error('Delete element error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
