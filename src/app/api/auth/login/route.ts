import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';
import { jsonResponse, errorResponse } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse('Email e senha são obrigatórios.', 400);
    }

    const instance = process.env.APP_INSTANCE || 'ENADIA';

    // Use findFirst with composite key (email, instance) instead of findUnique
    const user = await db.user.findFirst({
      where: { email, instance },
    });

    if (!user) {
      return errorResponse('Credenciais inválidas.', 401);
    }

    // Cross-instance login check: user must belong to this instance
    if (user.instance !== instance) {
      return errorResponse('Credenciais inválidas.', 401);
    }

    if (!user.active) {
      return errorResponse('Conta desativada. Entre em contato com a coordenação.', 403);
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return errorResponse('Credenciais inválidas.', 401);
    }

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      instance: user.instance,
    });

    return jsonResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        ra: user.ra,
        avatar: user.avatar,
        active: user.active,
        curso: user.curso,
        periodo: user.periodo,
        modalidade: user.modalidade,
        disciplina: user.disciplina,
        instance: user.instance,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Erro interno do servidor.', 500);
  }
}
