import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireRole, jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all');

    // If all param, return all phases (MASTER only)
    if (all === 'true') {
      requireRole(request, Role.MASTER);
      const phases = await db.phaseConfig.findMany({
        orderBy: { phase: 'asc' },
      });
      return jsonResponse({ phases });
    }

    // Otherwise return current active phase
    const activePhase = await db.phaseConfig.findFirst({
      where: { active: true },
    });

    if (!activePhase) {
      return errorResponse('Nenhuma fase ativa encontrada.', 404);
    }

    return jsonResponse({ phase: activePhase });
  } catch (error) {
    console.error('Get phases error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
