import { NextRequest } from 'next/server';
import { verifyToken, type TokenPayload } from './auth';
import { Role } from '@prisma/client';

export function getAuthUser(request: NextRequest): TokenPayload | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  return verifyToken(token);
}

export function requireAuth(request: NextRequest): TokenPayload {
  const user = getAuthUser(request);
  if (!user) {
    throw new AuthError('Não autenticado. Faça login para continuar.', 401);
  }
  return user;
}

export function requireRole(request: NextRequest, ...roles: Role[]): TokenPayload {
  const user = getAuthUser(request);
  if (!user) {
    throw new AuthError('Não autenticado. Faça login para continuar.', 401);
  }
  if (!roles.includes(user.role as Role)) {
    throw new AuthError('Acesso negado. Você não tem permissão para esta ação.', 403);
  }
  return user;
}

export class AuthError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AuthError';
  }
}

export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function errorResponse(message: string, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
