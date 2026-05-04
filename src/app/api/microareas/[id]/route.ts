import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonResponse, errorResponse } from '@/lib/auth-middleware';

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
