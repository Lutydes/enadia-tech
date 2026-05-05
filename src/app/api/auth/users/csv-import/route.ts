import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { requireRole, jsonResponse, errorResponse } from '@/lib/auth-middleware';
import { Role, Modalidade } from '@prisma/client';

/**
 * POST /api/auth/users/csv-import
 * 
 * Importa usuários em lote via CSV ou JSON.
 * Apenas MASTER pode usar este endpoint.
 * 
 * Formato CSV para ALUNOS:
 *   nome,email,ra,curso,periodo,modalidade,senha
 * 
 * Formato CSV para PROFESSORES:
 *   nome,email,ra,disciplina,senha
 * 
 * Body JSON:
 * {
 *   "role": "ALUNO" | "PROFESSOR",
 *   "format": "csv" | "json",
 *   "data": "nome,email,ra,..." ou [{...}, ...],
 *   "defaultPassword": "senha123" (opcional, se CSV não incluir senha)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    requireRole(request, Role.MASTER);

    const body = await request.json();
    const { role, format, data, defaultPassword } = body;

    if (!role || !['ALUNO', 'PROFESSOR'].includes(role)) {
      return errorResponse('Role deve ser ALUNO ou PROFESSOR.', 400);
    }

    if (!data) {
      return errorResponse('Dados são obrigatórios (data).', 400);
    }

    const userRole = role as Role;
    let items: Array<Record<string, string>> = [];

    if (format === 'csv' || typeof data === 'string') {
      // Parse CSV
      const lines = (data as string).trim().split('\n').filter((l: string) => l.trim());
      
      // Detect if first line is header
      const firstLine = lines[0].toLowerCase();
      const hasHeader = firstLine.includes('nome') || firstLine.includes('email') || firstLine.includes('ra');
      const startIndex = hasHeader ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p: string) => p.trim().replace(/^"|"$/g, ''));
        
        if (userRole === 'ALUNO') {
          if (parts.length < 6) {
            continue; // Skip invalid lines
          }
          items.push({
            name: parts[0],
            email: parts[1],
            ra: parts[2],
            curso: parts[3],
            periodo: parts[4],
            modalidade: parts[5] || 'PRESENCIAL',
            senha: parts[6] || defaultPassword || 'enadia123',
          });
        } else {
          if (parts.length < 4) {
            continue;
          }
          items.push({
            name: parts[0],
            email: parts[1],
            ra: parts[2],
            disciplina: parts[3],
            senha: parts[4] || defaultPassword || 'enadia123',
          });
        }
      }
    } else if (Array.isArray(data)) {
      items = data.map((item: Record<string, string>) => ({
        ...item,
        senha: item.senha || item.password || defaultPassword || 'enadia123',
      }));
    } else {
      return errorResponse('Formato inválido. Use "csv" ou envie um array JSON.', 400);
    }

    if (items.length === 0) {
      return errorResponse('Nenhum registro válido encontrado nos dados.', 400);
    }

    // Process in batches
    const results = {
      success: 0,
      errors: 0,
      errorDetails: [] as Array<{ row: number; name: string; error: string }>,
      createdUsers: [] as Array<{ name: string; email: string; ra: string | null }>,
    };

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      try {
        // Validate required fields
        if (!item.name || !item.email) {
          results.errors++;
          results.errorDetails.push({ row: i + 1, name: item.name || `Linha ${i + 1}`, error: 'Nome e email são obrigatórios' });
          continue;
        }

        // Check duplicate email
        const existingEmail = await db.user.findUnique({ where: { email: item.email } });
        if (existingEmail) {
          results.errors++;
          results.errorDetails.push({ row: i + 1, name: item.name, error: `Email já existe: ${item.email}` });
          continue;
        }

        // Check duplicate RA
        if (item.ra) {
          const existingRa = await db.user.findUnique({ where: { ra: item.ra } });
          if (existingRa) {
            results.errors++;
            results.errorDetails.push({ row: i + 1, name: item.name, error: `RA já existe: ${item.ra}` });
            continue;
          }
        }

        const hashedPassword = await hashPassword(item.senha);

        const createData: Record<string, unknown> = {
          email: item.email,
          name: item.name,
          password: hashedPassword,
          role: userRole,
          ra: item.ra || null,
          active: true,
        };

        if (userRole === Role.ALUNO) {
          createData.curso = item.curso || null;
          createData.periodo = item.periodo ? parseInt(item.periodo) : null;
          const mod = (item.modalidade || 'PRESENCIAL').toUpperCase();
          createData.modalidade = Object.values(Modalidade).includes(mod as Modalidade) 
            ? mod 
            : Modalidade.PRESENCIAL;
        }

        if (userRole === Role.PROFESSOR) {
          createData.disciplina = item.disciplina || null;
        }

        const user = await db.user.create({
          data: createData as Parameters<typeof db.user.create>[0]['data'],
          select: { id: true, name: true, email: true, ra: true },
        });

        results.success++;
        results.createdUsers.push({ name: user.name, email: user.email, ra: user.ra });
      } catch (err) {
        results.errors++;
        const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
        results.errorDetails.push({ row: i + 1, name: item.name || `Linha ${i + 1}`, error: errorMsg });
      }
    }

    return jsonResponse(results, 201);
  } catch (error) {
    console.error('CSV import error:', error);
    if (error instanceof Error && (error.message.includes('Acesso negado') || error.message.includes('Não autenticado'))) {
      return errorResponse(error.message, error.message.includes('Não autenticado') ? 401 : 403);
    }
    return errorResponse('Erro interno do servidor.', 500);
  }
}
