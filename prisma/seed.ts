import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Create Master user
  const masterPassword = await hash('enadia2024', 12)
  const master = await prisma.user.upsert({
    where: { email: 'master@enadia.com' },
    update: {},
    create: {
      email: 'master@enadia.com',
      name: 'Gestor Master',
      password: masterPassword,
      role: 'MASTER',
    },
  })
  console.log(`✅ Master user: ${master.email}`)

  // 2. Create Professor user
  const profPassword = await hash('enadia2024', 12)
  const professor = await prisma.user.upsert({
    where: { email: 'professor@enadia.com' },
    update: {},
    create: {
      email: 'professor@enadia.com',
      name: 'Professor Exemplo',
      password: profPassword,
      role: 'PROFESSOR',
      disciplina: 'Engenharia de Software',
    },
  })
  console.log(`✅ Professor user: ${professor.email}`)

  // 3. Create sample student
  const studentPassword = await hash('aluno123', 12)
  const student = await prisma.user.upsert({
    where: { email: 'aluno@exemplo.com' },
    update: {},
    create: {
      email: 'aluno@exemplo.com',
      name: 'Estudante Exemplo',
      password: studentPassword,
      role: 'ALUNO',
      ra: '2024001',
      curso: 'Ciência da Computação',
      periodo: 4,
      modalidade: 'PRESENCIAL',
    },
  })
  console.log(`✅ Student user: ${student.email}`)

  // 4. Seed Microareas from the enade-full-bank MACROAREAS
  const microareas = [
    { name: 'Lógica Proposicional', code: 'LOG-PRO', macroarea: 'Fundamentos da Computação', description: 'Conectivos lógicos, tabelas-verdade, equivalências e inferências.', color: '#3b82f6', order: 1 },
    { name: 'Matemática Discreta', code: 'MAT-DIS', macroarea: 'Fundamentos da Computação', description: 'Conjuntos, relações, funções, contagem e grafos.', color: '#3b82f6', order: 2 },
    { name: 'Autômatos e Linguagens Formais', code: 'AUT-LIN', macroarea: 'Teoria da Computação', description: 'Autômatos finitos, autômatos de pilha, máquinas de Turing e linguagens.', color: '#8b5cf6', order: 3 },
    { name: 'Programação Orientada a Objetos', code: 'POO', macroarea: 'Paradigmas de Programação', description: 'Classes, objetos, herança, polimorfismo, padrões de projeto.', color: '#ec4899', order: 4 },
    { name: 'Algoritmos e Estruturas de Dados', code: 'AED', macroarea: 'Algoritmos', description: 'Complexidade, ordenação, busca, listas, pilhas, filas, árvores, grafos.', color: '#f59e0b', order: 5 },
    { name: 'Banco de Dados', code: 'BD', macroarea: 'Desenvolvimento', description: 'Modelagem relacional, SQL, normalização, transações, índices.', color: '#10b981', order: 6 },
    { name: 'Engenharia de Software', code: 'ES', macroarea: 'Desenvolvimento', description: 'Processos de desenvolvimento, requisitos, arquitetura, testes, qualidade.', color: '#10b981', order: 7 },
    { name: 'Sistemas Operacionais', code: 'SO', macroarea: 'Desenvolvimento', description: 'Processos, escalonamento, memória, sistemas de arquivos, deadlock.', color: '#10b981', order: 8 },
    { name: 'Redes', code: 'RED', macroarea: 'Desenvolvimento', description: 'Modelos OSI e TCP/IP, protocolos, roteamento, segurança de redes.', color: '#10b981', order: 9 },
    { name: 'Sistemas Distribuídos', code: 'SD', macroarea: 'Desenvolvimento', description: 'Arquiteturas distribuídas, consistência, RPC, mensageria, tolerância a falhas.', color: '#10b981', order: 10 },
    { name: 'Criptografia', code: 'CRIP', macroarea: 'Segurança/IA', description: 'Cifras simétricas e assimétricas, funções hash, certificados digitais.', color: '#ef4444', order: 11 },
    { name: 'Inteligência Artificial', code: 'IA', macroarea: 'Segurança/IA', description: 'Busca, representação de conhecimento, aprendizado de máquina, redes neurais.', color: '#ef4444', order: 12 },
    { name: 'Ciência de Dados', code: 'CD', macroarea: 'Segurança/IA', description: 'Estatística, visualização, mineração de dados, big data.', color: '#ef4444', order: 13 },
    { name: 'Ética Profissional', code: 'ETICA', macroarea: 'Segurança/IA', description: 'Ética em TI, legislação, LGPD, propriedade intelectual, responsabilidade social.', color: '#ef4444', order: 14 },
    { name: 'Legislação', code: 'LEG', macroarea: 'Segurança/IA', description: 'Marco Civil da Internet, LGPD, licitação, direitos autorais em software.', color: '#ef4444', order: 15 },
  ]

  for (const ma of microareas) {
    await prisma.microarea.upsert({
      where: { code: ma.code },
      update: { name: ma.name, macroarea: ma.macroarea, description: ma.description, color: ma.color, order: ma.order },
      create: ma,
    })
  }
  console.log(`✅ Seeded ${microareas.length} microareas`)

  console.log('🎉 Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
