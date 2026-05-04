import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, jsonResponse, errorResponse } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return errorResponse('Não autenticado.', 401);
    }

    const user = await db.user.findUnique({
      where: { id: authUser.userId },
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

    if (!user) {
      return errorResponse('Usuário não encontrado.', 404);
    }

    return jsonResponse({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    return errorResponse('Erro interno do servidor.', 500);
  }
}
