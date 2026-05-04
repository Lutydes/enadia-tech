import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonResponse, errorResponse } from '@/lib/auth-middleware';

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
