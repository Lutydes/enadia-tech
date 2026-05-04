import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireRole, jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    requireAuth(request);

    const { searchParams } = new URL(request.url);
    const microareaId = searchParams.get('microareaId');
    const elementId = searchParams.get('elementId');
    const status = searchParams.get('status');
    const difficulty = searchParams.get('difficulty');
    const source = searchParams.get('source');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};

    if (microareaId) where.microareaId = microareaId;
    if (elementId) where.elementId = elementId;
    if (status) where.status = status;
    if (difficulty) where.difficulty = difficulty;
    if (source) where.source = source;
    if (type) where.type = type;

    // Professors and masters can see all statuses; alunos only see ATIVA/INATIVA
    const authUser = requireAuth(request);
    if (authUser.role === Role.ALUNO) {
      where.status = { in: ['ATIVA', 'INATIVA'] };
    } else if (!status) {
      // Don't filter by status for prof/master unless explicitly requested
    }

    const [questions, total] = await Promise.all([
      db.question.findMany({
        where,
        include: {
          microarea: { select: { id: true, name: true, code: true, color: true } },
          element: { select: { id: true, name: true, code: true } },
          author: { select: { id: true, name: true } },
          validator: { select: { id: true, name: true } },
          alternatives: { select: { id: true, letter: true, text: true } },
          _count: { select: { responses: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.question.count({ where }),
    ]);

    return jsonResponse({
      questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List questions error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = requireRole(request, Role.PROFESSOR, Role.MASTER);

    const body = await request.json();
    const {
      type,
      statement,
      context,
      correctAnswer,
      explanation,
      difficulty,
      microareaId,
      elementId,
      source,
      sourceYear,
      enadeId,
      alternatives,
      tags,
    } = body;

    if (!statement || !correctAnswer || !microareaId || !alternatives?.length) {
      return errorResponse('Enunciado, resposta correta, microárea e alternativas são obrigatórios.', 400);
    }

    // Generate unique code
    const count = await db.question.count();
    const code = `Q${String(count + 1).padStart(5, '0')}`;

    const question = await db.question.create({
      data: {
        code,
        type: type || 'OBJETIVA',
        statement,
        context: context || null,
        correctAnswer,
        explanation: explanation || null,
        difficulty: difficulty || 'médio',
        microareaId,
        elementId: elementId || null,
        authorId: authUser.userId,
        source: source || 'elaborada',
        sourceYear: sourceYear || null,
        enadeId: enadeId || null,
        status: 'RASCUNHO',
        alternatives: {
          create: alternatives.map((alt: { letter: string; text: string }) => ({
            letter: alt.letter,
            text: alt.text,
          })),
        },
        tags: tags?.length
          ? {
              create: tags.map((name: string) => ({ name })),
            }
          : undefined,
      },
      include: {
        microarea: true,
        element: true,
        alternatives: true,
        tags: true,
      },
    });

    return jsonResponse({ question }, 201);
  } catch (error) {
    console.error('Create question error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
