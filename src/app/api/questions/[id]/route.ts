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

    const question = await db.question.findUnique({
      where: { id },
      include: {
        microarea: { select: { id: true, name: true, code: true, color: true, macroarea: true } },
        element: { select: { id: true, name: true, code: true } },
        author: { select: { id: true, name: true, email: true } },
        validator: { select: { id: true, name: true, email: true } },
        alternatives: { select: { id: true, letter: true, text: true }, orderBy: { letter: 'asc' } },
        tags: { select: { id: true, name: true } },
        _count: { select: { responses: true, simuladoConfigs: true } },
      },
    });

    if (!question) {
      return errorResponse('Questão não encontrada.', 404);
    }

    // Hide correct answer and explanation from students if question is ATIVA
    const authUser = requireAuth(request);
    if (authUser.role === Role.ALUNO && question.status === 'ATIVA') {
      return jsonResponse({
        question: {
          ...question,
          correctAnswer: undefined,
          explanation: undefined,
        },
      });
    }

    return jsonResponse({ question });
  } catch (error) {
    console.error('Get question error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = requireRole(request, Role.PROFESSOR, Role.MASTER);
    const { id } = await params;

    const existing = await db.question.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Questão não encontrada.', 404);
    }

    const body = await request.json();
    const {
      statement,
      context,
      correctAnswer,
      explanation,
      difficulty,
      elementId,
      microareaId,
      source,
      sourceYear,
      enadeId,
      triA,
      triB,
      triC,
      triCalibrated,
      status,
      alternatives,
      tags,
    } = body;

    // If professor is updating, they must be the author or a MASTER
    if (authUser.role === Role.PROFESSOR && existing.authorId !== authUser.userId) {
      return errorResponse('Você só pode editar suas próprias questões.', 403);
    }

    const updateData: Record<string, unknown> = {};
    if (statement !== undefined) updateData.statement = statement;
    if (context !== undefined) updateData.context = context;
    if (correctAnswer !== undefined) updateData.correctAnswer = correctAnswer;
    if (explanation !== undefined) updateData.explanation = explanation;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (elementId !== undefined) updateData.elementId = elementId;
    if (microareaId !== undefined) updateData.microareaId = microareaId;
    if (source !== undefined) updateData.source = source;
    if (sourceYear !== undefined) updateData.sourceYear = sourceYear;
    if (enadeId !== undefined) updateData.enadeId = enadeId;
    if (triA !== undefined) updateData.triA = triA;
    if (triB !== undefined) updateData.triB = triB;
    if (triC !== undefined) updateData.triC = triC;
    if (triCalibrated !== undefined) updateData.triCalibrated = triCalibrated;
    if (status !== undefined) updateData.status = status;

    // Handle alternatives replacement
    if (alternatives && Array.isArray(alternatives)) {
      await db.alternative.deleteMany({ where: { questionId: id } });
      updateData.alternatives = {
        create: alternatives.map((alt: { letter: string; text: string }) => ({
          letter: alt.letter,
          text: alt.text,
        })),
      };
    }

    // Handle tags replacement
    if (tags && Array.isArray(tags)) {
      await db.questionTag.deleteMany({ where: { questionId: id } });
      updateData.tags = {
        create: tags.map((name: string) => ({ name })),
      };
    }

    const question = await db.question.update({
      where: { id },
      data: updateData,
      include: {
        microarea: true,
        element: true,
        alternatives: true,
        tags: true,
      },
    });

    return jsonResponse({ question });
  } catch (error) {
    console.error('Update question error:', error);
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
    const authUser = requireRole(request, Role.PROFESSOR, Role.MASTER);
    const { id } = await params;

    const existing = await db.question.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Questão não encontrada.', 404);
    }

    if (authUser.role === Role.PROFESSOR && existing.authorId !== authUser.userId) {
      return errorResponse('Você só pode excluir suas próprias questões.', 403);
    }

    // Only PROFESSOR is restricted to RASCUNHO or REPROVADA; MASTER can delete any question
    if (authUser.role !== Role.MASTER && !['RASCUNHO', 'REPROVADA'].includes(existing.status)) {
      return errorResponse('Apenas questões em rascunho ou reprovadas podem ser excluídas.', 400);
    }

    await db.question.delete({ where: { id } });

    return jsonResponse({ message: 'Questão excluída com sucesso.' });
  } catch (error) {
    console.error('Delete question error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
