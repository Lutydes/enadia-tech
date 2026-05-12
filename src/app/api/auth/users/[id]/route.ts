import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { requireRole, getAuthUser, jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireRole(request, Role.MASTER);

    const { id } = await params;

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        ra: true,
        avatar: true,
        active: true,
        curso: true,
        periodo: true,
        modalidade: true,
        disciplina: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            responses: true,
            authoredQuestions: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse('Usuário não encontrado.', 404);
    }

    return jsonResponse({ user });
  } catch (error) {
    console.error('Get user error:', error);
    if (error instanceof Error && (error.message.includes('Acesso negado') || error.message.includes('Não autenticado'))) {
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
    requireRole(request, Role.MASTER);

    const { id } = await params;
    const body = await request.json();
    const { name, email, role, ra, active, password, curso, periodo, modalidade, disciplina } = body;

    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Usuário não encontrado.', 404);
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (active !== undefined) updateData.active = active;
    if (password) updateData.password = await hashPassword(password);
    if (curso !== undefined) updateData.curso = curso;
    if (periodo !== undefined) updateData.periodo = periodo ? parseInt(String(periodo)) : null;
    if (modalidade !== undefined) updateData.modalidade = modalidade;
    if (disciplina !== undefined) updateData.disciplina = disciplina;

    if (email && email !== existing.email) {
      const emailTaken = await db.user.findFirst({ where: { email, NOT: { id } } });
      if (emailTaken) return errorResponse('Email já em uso.', 409);
      updateData.email = email;
    }

    if (ra !== undefined && ra !== existing.ra) {
      if (ra) {
        const raTaken = await db.user.findFirst({ where: { ra, NOT: { id } } });
        if (raTaken) return errorResponse('RA já em uso.', 409);
      }
      updateData.ra = ra;
    }

    const user = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        ra: true,
        avatar: true,
        active: true,
        curso: true,
        periodo: true,
        modalidade: true,
        disciplina: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return jsonResponse({ user });
  } catch (error) {
    console.error('Update user error:', error);
    if (error instanceof Error && (error.message.includes('Acesso negado') || error.message.includes('Não autenticado'))) {
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
    const authUser = getAuthUser(request);

    if (authUser?.userId === id) {
      return errorResponse('Você não pode excluir sua própria conta.', 400);
    }

    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Usuário não encontrado.', 404);
    }

    await db.user.delete({ where: { id } });

    return jsonResponse({ message: 'Usuário excluído com sucesso.' });
  } catch (error) {
    console.error('Delete user error:', error);
    if (error instanceof Error && (error.message.includes('Acesso negado') || error.message.includes('Não autenticado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
