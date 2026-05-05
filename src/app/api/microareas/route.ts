import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireRole, jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const macroarea = searchParams.get('macroarea');

    const where: Record<string, unknown> = {};
    if (macroarea) where.macroarea = macroarea;

    const microareas = await db.microarea.findMany({
      where,
      include: {
        _count: {
          select: {
            elements: true,
            questions: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    return jsonResponse({ microareas });
  } catch (error) {
    console.error('List microareas error:', error);
    return errorResponse('Erro interno do servidor.', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireRole(request, Role.MASTER);

    const body = await request.json();
    const { name, code, macroarea, description, color, order } = body;

    if (!name || !code || !macroarea || !description) {
      return errorResponse('Nome, código, macroárea e descrição são obrigatórios.', 400);
    }

    // Check for duplicate code
    const existing = await db.microarea.findUnique({ where: { code } });
    if (existing) {
      return errorResponse('Já existe uma microárea com este código.', 409);
    }

    const microarea = await db.microarea.create({
      data: {
        name,
        code,
        macroarea,
        description,
        color: color || '#3b82f6',
        order: order ?? 0,
      },
      include: {
        _count: {
          select: {
            elements: true,
            questions: true,
          },
        },
      },
    });

    return jsonResponse({ microarea }, 201);
  } catch (error) {
    console.error('Create microarea error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
