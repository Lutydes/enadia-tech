import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

async function seed() {
  console.log('🌱 Seeding database...');

  // ═══ UPSERT MASTER ═══
  await db.user.upsert({
    where: { email: 'master@unifecaf.br' },
    update: {
      name: 'Coordenação ENADE',
      role: 'MASTER',
      ra: 'MASTER001',
      active: true,
      password: await hashPassword('master123'),
    },
    create: {
      email: 'master@unifecaf.br',
      name: 'Coordenação ENADE',
      password: await hashPassword('master123'),
      role: 'MASTER',
      ra: 'MASTER001',
      active: true,
    },
  });
  console.log('✅ Master: master@unifecaf.br / master123');

  // ═══ UPSERT PROFESSOR ═══
  await db.user.upsert({
    where: { email: 'professor@unifecaf.br' },
    update: {
      name: 'Prof. Dr. Carlos Silva',
      role: 'PROFESSOR',
      ra: 'PROF001',
      disciplina: 'Engenharia de Software',
      active: true,
      password: await hashPassword('prof123'),
    },
    create: {
      email: 'professor@unifecaf.br',
      name: 'Prof. Dr. Carlos Silva',
      password: await hashPassword('prof123'),
      role: 'PROFESSOR',
      ra: 'PROF001',
      disciplina: 'Engenharia de Software',
      active: true,
    },
  });
  console.log('✅ Professor: professor@unifecaf.br / prof123');

  // ═══ UPSERT STUDENT ═══
  await db.user.upsert({
    where: { email: 'aluno@unifecaf.br' },
    update: {
      name: 'Maria Santos',
      role: 'ALUNO',
      ra: '2024001',
      curso: 'Ciência da Computação',
      periodo: 6,
      modalidade: 'PRESENCIAL',
      active: true,
      password: await hashPassword('aluno123'),
    },
    create: {
      email: 'aluno@unifecaf.br',
      name: 'Maria Santos',
      password: await hashPassword('aluno123'),
      role: 'ALUNO',
      ra: '2024001',
      curso: 'Ciência da Computação',
      periodo: 6,
      modalidade: 'PRESENCIAL',
      active: true,
    },
  });
  console.log('✅ Aluno: aluno@unifecaf.br / aluno123');

  // ═══ ADDITIONAL TEST STUDENTS ═══
  const testStudents = [
    { email: 'joao@unifecaf.br', name: 'João Oliveira', ra: '2024002', curso: 'Ciência da Computação', periodo: 4, modalidade: 'EAD' as const, password: 'joao123' },
    { email: 'ana@unifecaf.br', name: 'Ana Costa', ra: '2024003', curso: 'Sistemas de Informação', periodo: 8, modalidade: 'PRESENCIAL' as const, password: 'ana123' },
    { email: 'pedro@unifecaf.br', name: 'Pedro Lima', ra: '2024004', curso: 'Ciência da Computação', periodo: 2, modalidade: 'SEMIPRESENCIAL' as const, password: 'pedro123' },
  ];

  for (const s of testStudents) {
    await db.user.upsert({
      where: { email: s.email },
      update: {
        name: s.name,
        ra: s.ra,
        curso: s.curso,
        periodo: s.periodo,
        modalidade: s.modalidade,
        active: true,
        password: await hashPassword(s.password),
      },
      create: {
        email: s.email,
        name: s.name,
        password: await hashPassword(s.password),
        role: 'ALUNO',
        ra: s.ra,
        curso: s.curso,
        periodo: s.periodo,
        modalidade: s.modalidade,
        active: true,
      },
    });
    console.log(`✅ Aluno: ${s.email} / ${s.password}`);
  }

  // ═══ ADDITIONAL TEST PROFESSOR ═══
  await db.user.upsert({
    where: { email: 'maria.prof@unifecaf.br' },
    update: {
      name: 'Profa. Dra. Maria Fernandes',
      role: 'PROFESSOR',
      ra: 'PROF002',
      disciplina: 'Banco de Dados',
      active: true,
      password: await hashPassword('maria123'),
    },
    create: {
      email: 'maria.prof@unifecaf.br',
      name: 'Profa. Dra. Maria Fernandes',
      password: await hashPassword('maria123'),
      role: 'PROFESSOR',
      ra: 'PROF002',
      disciplina: 'Banco de Dados',
      active: true,
    },
  });
  console.log('✅ Professor: maria.prof@unifecaf.br / maria123');

  await db.$disconnect();
  console.log('🎉 Seed complete!');
}

seed().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});
