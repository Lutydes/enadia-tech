/**
 * Seed balance questions into the EnadIA database.
 * Appends to existing questions (does NOT clear them).
 * Run with: npx tsx prisma/seed-balance.ts
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const prisma = new PrismaClient();

const MICROAREA_ALIASES: Record<string, string> = {
  'Redes': 'Redes de Computadores',
};

function normalizeMicroareaName(name: string): string {
  return MICROAREA_ALIASES[name] || name;
}

function getTriDefault(difficulty: string) {
  switch (difficulty) {
    case 'fácil': return { triA: 1.2, triB: -1.0, triC: 0.30 };
    case 'médio': return { triA: 1.7, triB: 0.0, triC: 0.20 };
    case 'difícil': return { triA: 2.2, triB: 0.8, triC: 0.12 };
    default: return { triA: 1.7, triB: 0.0, triC: 0.20 };
  }
}

async function main() {
  console.log('🚀 Starting balance question seeding...\n');

  // Read the balance questions TS file and extract the array
  const filePath = path.join(projectRoot, 'download', 'questions_balance.ts');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract the array using regex
  const arrayMatch = content.match(/export const balanceQuestions[^=]*=\s*(\[[\s\S]*?\n\]);/);
  if (!arrayMatch) {
    console.error('❌ Could not extract questions array from file');
    process.exit(1);
  }

  // Convert TS to JSON-parseable (replace single quotes, handle nested objects)
  const arrayStr = arrayMatch[1]
    .replace(/'/g, '"')
    .replace(/(\w+):\s*/g, '"$1": ');
  
  let questions: any[];
  try {
    questions = JSON.parse(arrayStr);
  } catch (err) {
    console.error('❌ JSON parse error:', err.message);
    process.exit(1);
  }
  console.log(`📊 Loaded ${questions.length} balance questions\n`);

  // Get microareas from DB
  const microareas = await prisma.microarea.findMany({
    include: { elements: true },
  });
  const microareaMap = new Map<string, typeof microareas[0]>();
  for (const ma of microareas) {
    microareaMap.set(ma.name, ma);
  }

  // Get professor
  const professor = await prisma.user.findFirst({ where: { role: 'PROFESSOR' } });

  // Build element map per microarea
  const elementMap = new Map<string, Map<string, any>>();
  for (const ma of microareas) {
    const emap = new Map<string, any>();
    for (const el of ma.elements) {
      emap.set(el.name, el);
      // Also index by lowercase for fuzzy matching
      emap.set(el.name.toLowerCase(), el);
    }
    elementMap.set(ma.id, emap);
  }

  let inserted = 0;
  let skipped = 0;

  for (const q of questions) {
    const normalizedName = normalizeMicroareaName(q.microarea);
    const microarea = microareaMap.get(normalizedName);
    if (!microarea) {
      console.log(`   ⚠️ No microarea for: ${q.microarea} (id: ${q.id})`);
      skipped++;
      continue;
    }

    // Find element
    let elementId: string | undefined;
    const emap = elementMap.get(microarea.id);
    if (emap) {
      const exactMatch = emap.get(q.element) || emap.get(q.element.toLowerCase());
      if (exactMatch) elementId = exactMatch.id;
      else {
        for (const [name, el] of emap.entries()) {
          const qEl = q.element.toLowerCase().replace(/[-_]/g, ' ');
          const nameL = name.toLowerCase();
          if (qEl.includes(nameL.split(' ')[0]) || nameL.includes(qEl.split(' ')[0])) {
            elementId = el.id;
            break;
          }
        }
      }
    }

    let code = q.id;
    if (code.length > 50) code = code.substring(0, 50);
    const dup = await prisma.question.findUnique({ where: { code } });
    if (dup) code = code + '_v2';

    try {
      await prisma.question.create({
        data: {
          code,
          type: 'OBJETIVA',
          statement: q.statement,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || null,
          difficulty: q.difficulty,
          triA: q.triA ?? getTriDefault(q.difficulty).triA,
          triB: q.triB ?? getTriDefault(q.difficulty).triB,
          triC: q.triC ?? getTriDefault(q.difficulty).triC,
          triCalibrated: false,
          source: q.source || 'elaborada',
          microareaId: microarea.id,
          elementId: elementId || null,
          authorId: professor?.id || null,
          status: 'ATIVA',
          alternatives: {
            create: q.alternatives.map((alt: any) => ({
              letter: alt.letter,
              text: alt.text,
            })),
          },
        },
      });
      inserted++;
    } catch (err: any) {
      console.log(`   ❌ Error on ${q.id}: ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n✅ Balance questions: ${inserted} inserted, ${skipped} skipped`);

  const total = await prisma.question.count();
  console.log(`📊 Total questions in DB: ${total}\n`);

  // Print per-microarea counts
  const counts = await prisma.$queryRaw`
    SELECT m.name as microarea, COUNT(q.id) as cnt
    FROM Microarea m
    LEFT JOIN Question q ON q.microareaId = m.id AND q.status = 'ATIVA'
    GROUP BY m.name
    ORDER BY cnt ASC
  `;
  console.log('📋 Questions per microarea:');
  for (const r of counts as any[]) {
    const icon = r.cnt >= 10 ? '✅' : '⚠️';
    console.log(`   ${icon} ${r.microarea}: ${r.cnt}`);
  }
}

main()
  .catch((err) => { console.error('Fatal:', err); process.exit(1); })
  .finally(() => prisma.$disconnect());
