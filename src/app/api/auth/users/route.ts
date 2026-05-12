import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { requireRole, jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    requireRole(request, Role.MASTER);

    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get('role') as Role | null;
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};
    if (roleFilter && Object.values(Role).includes(roleFilter)) {
      where.role = roleFilter;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { ra: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
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
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    return jsonResponse({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List users error:', error);
    if (error instanceof Error && error.message.includes('Acesso negado')) {
      return errorResponse(error.message, 403);
    }
    if (error instanceof Error && error.message.includes('Não autenticado')) {
      return errorResponse(error.message, 401);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireRole(request, Role.MASTER);

    const body = await request.json();
    const { email, name, password, role, ra, curso, periodo, modalidade, disciplina } = body;

    if (!email || !name || !password) {
      return errorResponse('Email, nome e senha são obrigatórios.', 400);
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return errorResponse('Já existe um usuário com este email.', 409);
    }

    if (ra) {
      const existingRa = await db.user.findUnique({ where: { ra } });
      if (existingRa) {
        return errorResponse('Já existe um usuário com este RA.', 409);
      }
    }

    const hashedPassword = await hashPassword(password);
    const userRole = role || Role.ALUNO;
    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: userRole,
        ra: ra || null,
        curso: userRole === Role.ALUNO ? (curso || null) : null,
        periodo: userRole === Role.ALUNO ? (periodo ? parseInt(String(periodo)) : null) : null,
        modalidade: userRole === Role.ALUNO ? (modalidade || 'PRESENCIAL') : null,
        disciplina: userRole === Role.PROFESSOR ? (disciplina || null) : null,
      },
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
        createdAt: true,
      },
    });

    return jsonResponse({ user }, 201);
  } catch (error) {
    console.error('Create user error:', error);
    if (error instanceof Error && error.message.includes('Acesso negado')) {
      return errorResponse(error.message, 403);
    }
    if (error instanceof Error && error.message.includes('Não autenticado')) {
      return errorResponse(error.message, 401);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
