import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireRole, jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role } from '@prisma/client';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireRole(request, Role.MASTER);
    const { id } = await params;

    const existing = await db.phaseConfig.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Fase não encontrada.', 404);
    }

    const body = await request.json();
    const { name, description, startDate, endDate, features, active } = body;

    // If activating this phase, deactivate others
    if (active === true) {
      await db.phaseConfig.updateMany({
        where: { active: true, id: { not: id } },
        data: { active: false },
      });
    }

    const phase = await db.phaseConfig.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(startDate !== undefined ? { startDate: startDate ? new Date(startDate) : null } : {}),
        ...(endDate !== undefined ? { endDate: endDate ? new Date(endDate) : null } : {}),
        ...(features !== undefined ? { features: JSON.stringify(features) } : {}),
        ...(active !== undefined ? { active } : {}),
      },
    });

    // Also update system config
    if (active === true) {
      await db.systemConfig.upsert({
        where: { key: 'current_phase' },
        update: { value: String(existing.phase) },
        create: { key: 'current_phase', value: String(existing.phase) },
      });
    }

    return jsonResponse({ phase });
  } catch (error) {
    console.error('Update phase error:', error);
    if (error instanceof Error && (error.message.includes('Não autenticado') || error.message.includes('Acesso negado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
