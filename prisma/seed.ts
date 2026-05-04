import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create master user
  const existingMaster = await db.user.findUnique({ where: { email: 'master@unifecaf.br' } });
  
  if (!existingMaster) {
    const hashedPassword = await hashPassword('master123');
    await db.user.create({
      data: {
        email: 'master@unifecaf.br',
        name: 'Coordenação ENADE',
        password: hashedPassword,
        role: 'MASTER',
        ra: 'MASTER001',
        active: true,
      },
    });
    console.log('✅ Master user created: master@unifecaf.br / master123');
  } else {
    console.log('⏭️  Master user already exists');
  }

  // Create sample professor
  const existingProf = await db.user.findUnique({ where: { email: 'professor@unifecaf.br' } });
  
  if (!existingProf) {
    const hashedPassword = await hashPassword('prof123');
    await db.user.create({
      data: {
        email: 'professor@unifecaf.br',
        name: 'Prof. Dr. Carlos Silva',
        password: hashedPassword,
        role: 'PROFESSOR',
        ra: 'PROF001',
        disciplina: 'Engenharia de Software',
        active: true,
      },
    });
    console.log('✅ Professor user created: professor@unifecaf.br / prof123');
  } else {
    console.log('⏭️  Professor user already exists');
  }

  // Create sample student
  const existingStudent = await db.user.findUnique({ where: { email: 'aluno@unifecaf.br' } });
  
  if (!existingStudent) {
    const hashedPassword = await hashPassword('aluno123');
    await db.user.create({
      data: {
        email: 'aluno@unifecaf.br',
        name: 'Maria Santos',
        password: hashedPassword,
        role: 'ALUNO',
        ra: '2024001',
        curso: 'Ciência da Computação',
        periodo: 6,
        modalidade: 'PRESENCIAL',
        active: true,
      },
    });
    console.log('✅ Student user created: aluno@unifecaf.br / aluno123');
  } else {
    console.log('⏭️  Student user already exists');
  }

  await db.$disconnect();
  console.log('🎉 Seed complete!');
}

seed().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});
