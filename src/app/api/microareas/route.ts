import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonResponse, errorResponse } from '@/lib/auth-middleware';

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
