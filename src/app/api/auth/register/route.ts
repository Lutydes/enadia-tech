import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { jsonResponse, errorResponse } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, ra, role, curso, periodo, modalidade, disciplina } = body;

    const instanceValue = process.env.APP_INSTANCE || 'ENADIA';

    // Validate required fields
    if (!name || !email || !password || !ra) {
      return errorResponse('Nome, email, senha e RA são obrigatórios.', 400);
    }

    // Validate role
    const userRole = role || 'ALUNO';
    if (!['ALUNO', 'PROFESSOR', 'MASTER'].includes(userRole)) {
      return errorResponse('Role inválido. Use ALUNO ou PROFESSOR.', 400);
    }

    // Validate ALUNO-specific fields
    if (userRole === 'ALUNO') {
      if (!curso) {
        return errorResponse('Curso é obrigatório para alunos.', 400);
      }
      if (periodo === undefined || periodo === null) {
        return errorResponse('Período é obrigatório para alunos.', 400);
      }
    }

    // Validate PROFESSOR-specific fields
    if (userRole === 'PROFESSOR') {
      if (!disciplina) {
        return errorResponse('Disciplina é obrigatória para professores.', 400);
      }
    }

    // Check for duplicate email within this instance
    const existingEmail = await db.user.findFirst({ where: { email, instance: instanceValue } });
    if (existingEmail) {
      return errorResponse('Já existe um usuário com este email.', 409);
    }

    // Check for duplicate RA within this instance
    const existingRa = await db.user.findFirst({ where: { ra, instance: instanceValue } });
    if (existingRa) {
      return errorResponse('Já existe um usuário com este RA.', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Determine modalidade (defaults to PRESENCIAL for ALUNO)
    const userModalidade = userRole === 'ALUNO'
      ? (modalidade && ['EAD', 'PRESENCIAL', 'SEMIPRESENCIAL'].includes(modalidade) ? modalidade : 'PRESENCIAL')
      : null;

    // Create user with instance
    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: userRole,
        ra,
        instance: instanceValue,
        curso: userRole === 'ALUNO' ? curso : null,
        periodo: userRole === 'ALUNO' ? parseInt(String(periodo)) : null,
        modalidade: userModalidade,
        disciplina: userRole === 'PROFESSOR' ? disciplina : null,
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
        instance: true,
      },
    });

    // Generate JWT token with instance
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      instance: user.instance,
    });

    return jsonResponse({ user, token }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse('Erro interno do servidor.', 500);
  }
}
