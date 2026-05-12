import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireRole, jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const microareaId = searchParams.get('microareaId');
    const skillLevel = searchParams.get('skillLevel');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (microareaId) where.microareaId = microareaId;
    if (skillLevel) where.skillLevel = skillLevel;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const elements = await db.element.findMany({
      where,
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
      orderBy: { order: 'asc' },
    });

    return jsonResponse({ elements });
  } catch (error) {
    console.error('List elements error:', error);
    return errorResponse('Erro interno do servidor.', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireRole(request, Role.MASTER);

    const body = await request.json();
    const { code, name, description, microareaId, skillLevel, order } = body;

    if (!code || !name || !description || !microareaId) {
      return errorResponse('Código, nome, descrição e microárea são obrigatórios.', 400);
    }

    // Verify microarea exists
    const microarea = await db.microarea.findUnique({ where: { id: microareaId } });
    if (!microarea) {
      return errorResponse('Microárea não encontrada.', 404);
    }

    // Check for duplicate code
    const existing = await db.element.findUnique({ where: { code } });
    if (existing) {
      return errorResponse('Já existe um elemento com este código.', 409);
    }

    const element = await db.element.create({
      data: {
        code,
        name,
        description,
        microareaId,
        skillLevel: skillLevel || 'compreensão',
        order: order ?? 0,
      },
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

    return jsonResponse({ element }, 201);
  } catch (error) {
    console.error('Create element error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
