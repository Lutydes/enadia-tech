import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role, Modalidade } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, ra, role, curso, periodo, modalidade, disciplina } = body;

    // Validate required fields
    if (!name || !email || !password || !ra) {
      return errorResponse('Nome, email, senha e RA são obrigatórios.', 400);
    }

    // Validate role
    const userRole = role || Role.ALUNO;
    if (!Object.values(Role).includes(userRole)) {
      return errorResponse('Role inválido. Use ALUNO ou PROFESSOR.', 400);
    }

    // Validate ALUNO-specific fields
    if (userRole === Role.ALUNO) {
      if (!curso) {
        return errorResponse('Curso é obrigatório para alunos.', 400);
      }
      if (periodo === undefined || periodo === null) {
        return errorResponse('Período é obrigatório para alunos.', 400);
      }
    }

    // Validate PROFESSOR-specific fields
    if (userRole === Role.PROFESSOR) {
      if (!disciplina) {
        return errorResponse('Disciplina é obrigatória para professores.', 400);
      }
    }

    // Check for duplicate email
    const existingEmail = await db.user.findUnique({ where: { email } });
    if (existingEmail) {
      return errorResponse('Já existe um usuário com este email.', 409);
    }

    // Check for duplicate RA
    const existingRa = await db.user.findUnique({ where: { ra } });
    if (existingRa) {
      return errorResponse('Já existe um usuário com este RA.', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Determine modalidade (defaults to PRESENCIAL for ALUNO)
    const userModalidade = userRole === Role.ALUNO
      ? (modalidade && Object.values(Modalidade).includes(modalidade) ? modalidade : Modalidade.PRESENCIAL)
      : null;

    // Create user
    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: userRole,
        ra,
        curso: userRole === Role.ALUNO ? curso : null,
        periodo: userRole === Role.ALUNO ? parseInt(String(periodo)) : null,
        modalidade: userModalidade,
        disciplina: userRole === Role.PROFESSOR ? disciplina : null,
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
      },
    });

    // Generate JWT token (same as login)
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return jsonResponse({ user, token }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse('Erro interno do servidor.', 500);
  }
}
