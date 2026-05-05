/**
 * Script de Migração: SQLite → Supabase (PostgreSQL)
 * 
 * Este script lê todos os dados do banco SQLite local e os insere
 * no banco Supabase/PostgreSQL.
 * 
 * USO:
 * 1. Certifique-se de que o .env aponta para o SQLite (DATABASE_URL antigo)
 * 2. Execute: bun run scripts/migrate-to-supabase.ts export
 * 3. O script vai exportar todos os dados para migration-data.json
 * 4. Troque o .env para o Supabase
 * 5. Execute: bunx prisma migrate dev --name init_supabase
 * 6. Execute: bun run scripts/migrate-to-supabase.ts import
 */

import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

interface ExportData {
  users: unknown[];
  microareas: unknown[];
  elements: unknown[];
  questions: unknown[];
  alternatives: unknown[];
  simulados: unknown[];
  simuladoConfigs: unknown[];
  studentResponses: unknown[];
  essayAnswers: unknown[];
  questionTags: unknown[];
  systemConfigs: unknown[];
}

async function exportFromSQLite() {
  console.log('📦 Exportando dados do SQLite...');
  
  const data: ExportData = {
    users: await db.user.findMany(),
    microareas: await db.microarea.findMany(),
    elements: await db.element.findMany(),
    questions: await db.question.findMany(),
    alternatives: await db.alternative.findMany(),
    simulados: await db.simulado.findMany(),
    simuladoConfigs: await db.simuladoConfig.findMany(),
    studentResponses: await db.studentResponse.findMany(),
    essayAnswers: await db.essayAnswer.findMany(),
    questionTags: await db.questionTag.findMany(),
    systemConfigs: await db.systemConfig.findMany(),
  };

  const outputPath = path.join(process.cwd(), 'migration-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  
  console.log(`✅ Dados exportados para ${outputPath}`);
  console.log(`   Usuários: ${data.users.length}`);
  console.log(`   Microáreas: ${data.microareas.length}`);
  console.log(`   Elementos: ${data.elements.length}`);
  console.log(`   Questões: ${data.questions.length}`);
  console.log(`   Alternativas: ${data.alternatives.length}`);
  console.log(`   Simulados: ${data.simulados.length}`);
  console.log(`   Respostas: ${data.studentResponses.length}`);
  console.log(`   Respostas Dissertativas: ${data.essayAnswers.length}`);

  await db.$disconnect();
}

async function importToSupabase() {
  console.log('📥 Importando dados para o Supabase...');
  
  const inputPath = path.join(process.cwd(), 'migration-data.json');
  if (!fs.existsSync(inputPath)) {
    console.error('❌ Arquivo migration-data.json não encontrado. Execute export primeiro.');
    process.exit(1);
  }

  const data: ExportData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  // Import in order respecting foreign keys
  console.log(`Importando ${data.users.length} usuários...`);
  for (const user of data.users) {
    const u = user as Record<string, unknown>;
    try {
      await db.user.upsert({
        where: { id: u.id as string },
        update: {},
        create: {
          id: u.id as string,
          email: u.email as string,
          name: u.name as string,
          password: u.password as string,
          role: u.role as string,
          ra: u.ra as string | null,
          avatar: u.avatar as string | null,
          active: u.active as boolean,
          lastLogin: u.lastLogin as Date | null,
          curso: u.curso as string | null,
          periodo: u.periodo as number | null,
          modalidade: u.modalidade as string | null,
          disciplina: u.disciplina as string | null,
          createdAt: u.createdAt as Date,
          updatedAt: u.updatedAt as Date,
        },
      });
    } catch (err) {
      console.error(`  ❌ Erro ao importar usuário ${u.email}:`, err);
    }
  }

  console.log(`Importando ${data.microareas.length} microáreas...`);
  for (const ma of data.microareas) {
    const m = ma as Record<string, unknown>;
    try {
      await db.microarea.upsert({
        where: { id: m.id as string },
        update: {},
        create: {
          id: m.id as string,
          name: m.name as string,
          code: m.code as string,
          macroarea: m.macroarea as string,
          description: m.description as string,
          color: m.color as string,
          order: m.order as number,
          createdAt: m.createdAt as Date,
        },
      });
    } catch (err) {
      console.error(`  ❌ Erro ao importar microárea ${m.name}:`, err);
    }
  }

  console.log(`Importando ${data.elements.length} elementos...`);
  for (const el of data.elements) {
    const e = el as Record<string, unknown>;
    try {
      await db.element.upsert({
        where: { id: e.id as string },
        update: {},
        create: {
          id: e.id as string,
          code: e.code as string,
          name: e.name as string,
          description: e.description as string,
          skillLevel: e.skillLevel as string,
          microareaId: e.microareaId as string,
          order: e.order as number,
          createdAt: e.createdAt as Date,
        },
      });
    } catch (err) {
      console.error(`  ❌ Erro ao importar elemento ${e.name}:`, err);
    }
  }

  console.log(`Importando ${data.questions.length} questões...`);
  for (const q of data.questions) {
    const question = q as Record<string, unknown>;
    try {
      await db.question.upsert({
        where: { id: question.id as string },
        update: {},
        create: {
          id: question.id as string,
          code: question.code as string,
          type: question.type as string,
          statement: question.statement as string,
          context: question.context as string | null,
          correctAnswer: question.correctAnswer as string,
          explanation: question.explanation as string | null,
          difficulty: question.difficulty as string,
          triA: question.triA as number | null,
          triB: question.triB as number | null,
          triC: question.triC as number | null,
          triCalibrated: question.triCalibrated as boolean,
          source: question.source as string,
          sourceYear: question.sourceYear as number | null,
          enadeId: question.enadeId as string | null,
          microareaId: question.microareaId as string,
          elementId: question.elementId as string | null,
          authorId: question.authorId as string | null,
          validatorId: question.validatorId as string | null,
          status: question.status as string,
          createdAt: question.createdAt as Date,
          updatedAt: question.updatedAt as Date,
        },
      });
    } catch (err) {
      console.error(`  ❌ Erro ao importar questão ${question.code}:`, err);
    }
  }

  console.log(`Importando ${data.alternatives.length} alternativas...`);
  for (const alt of data.alternatives) {
    const a = alt as Record<string, unknown>;
    try {
      await db.alternative.upsert({
        where: { id: a.id as string },
        update: {},
        create: {
          id: a.id as string,
          letter: a.letter as string,
          text: a.text as string,
          questionId: a.questionId as string,
          createdAt: a.createdAt as Date,
        },
      });
    } catch (err) { /* skip duplicates */ }
  }

  console.log(`Importando ${data.simulados.length} simulados...`);
  for (const sim of data.simulados) {
    const s = sim as Record<string, unknown>;
    try {
      await db.simulado.upsert({
        where: { id: s.id as string },
        update: {},
        create: {
          id: s.id as string,
          title: s.title as string,
          description: s.description as string | null,
          type: s.type as string,
          phase: s.phase as number | null,
          timeLimit: s.timeLimit as number | null,
          questionCount: s.questionCount as number,
          active: s.active as boolean,
          createdAt: s.createdAt as Date,
          updatedAt: s.updatedAt as Date,
        },
      });
    } catch (err) { /* skip */ }
  }

  console.log(`Importando tabelas restantes...`);
  for (const sc of data.simuladoConfigs) {
    const c = sc as Record<string, unknown>;
    try { await db.simuladoConfig.upsert({ where: { id: c.id as string }, update: {}, create: { id: c.id as string, simuladoId: c.simuladoId as string, questionId: c.questionId as string, order: c.order as number } }); } catch { /* skip */ }
  }
  for (const sr of data.studentResponses) {
    const r = sr as Record<string, unknown>;
    try { await db.studentResponse.upsert({ where: { id: r.id as string }, update: {}, create: { id: r.id as string, userId: r.userId as string, questionId: r.questionId as string, simuladoId: r.simuladoId as string | null, answer: r.answer as string, isCorrect: r.isCorrect as boolean | null, responseTime: r.responseTime as number | null, createdAt: r.createdAt as Date } }); } catch { /* skip */ }
  }
  for (const ea of data.essayAnswers) {
    const e = ea as Record<string, unknown>;
    try { await db.essayAnswer.upsert({ where: { id: e.id as string }, update: {}, create: { id: e.id as string, userId: e.userId as string, questionId: e.questionId as string, simuladoId: e.simuladoId as string | null, answer: e.answer as string, aiFeedback: e.aiFeedback as string | null, aiScore: e.aiScore as number | null, createdAt: e.createdAt as Date } }); } catch { /* skip */ }
  }
  for (const qt of data.questionTags) {
    const t = qt as Record<string, unknown>;
    try { await db.questionTag.upsert({ where: { id: t.id as string }, update: {}, create: { id: t.id as string, name: t.name as string, questionId: t.questionId as string } }); } catch { /* skip */ }
  }
  for (const sc of data.systemConfigs) {
    const c = sc as Record<string, unknown>;
    try { await db.systemConfig.upsert({ where: { id: c.id as string }, update: {}, create: { id: c.id as string, key: c.key as string, value: c.value as string, createdAt: c.createdAt as Date, updatedAt: c.updatedAt as Date } }); } catch { /* skip */ }
  }

  console.log('🎉 Importação concluída!');
  await db.$disconnect();
}

// Main
const command = process.argv[2] || 'export';

if (command === 'export') {
  exportFromSQLite().catch((e) => {
    console.error('Export error:', e);
    process.exit(1);
  });
} else if (command === 'import') {
  importToSupabase().catch((e) => {
    console.error('Import error:', e);
    process.exit(1);
  });
} else {
  console.log('Uso: bun run scripts/migrate-to-supabase.ts [export|import]');
  console.log('  export - Exporta dados do SQLite para migration-data.json');
  console.log('  import - Importa dados do migration-data.json para o banco atual (Supabase)');
}
