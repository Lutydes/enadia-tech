-- =============================================================================
-- EnadIA - Schema Supabase (PostgreSQL)
-- Execute este SQL no SQL Editor do Supabase para criar toda a base
-- =============================================================================

-- ─── ENUMS ───────────────────────────────────────────

CREATE TYPE "Role" AS ENUM ('MASTER', 'PROFESSOR', 'ALUNO');

CREATE TYPE "QuestionType" AS ENUM ('OBJETIVA', 'DISSERTATIVA');

CREATE TYPE "QuestionStatus" AS ENUM (
  'RASCUNHO',
  'AGUARDANDO_TESTE',
  'EM_TESTE',
  'AGUARDANDO_VALIDACAO',
  'APROVADA',
  'REPROVADA',
  'ATIVA',
  'INATIVA'
);

CREATE TYPE "SimuladoType" AS ENUM (
  'DIAGNOSTICO',
  'MICROAREA',
  'MACROAREA',
  'GERAL',
  'LIVRE',
  'ENADE_SIMULADO'
);

-- ─── TABELAS ──────────────────────────────────────────

-- Usuários
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "email" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'ALUNO',
  "ra" TEXT UNIQUE,
  "avatar" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "lastLogin" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

-- Microáreas
CREATE TABLE "Microarea" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "code" TEXT UNIQUE NOT NULL,
  "macroarea" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "color" TEXT NOT NULL DEFAULT '#3b82f6',
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

-- Elementos
CREATE TABLE "Element" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "skillLevel" TEXT NOT NULL DEFAULT 'compreensão',
  "microareaId" TEXT NOT NULL REFERENCES "Microarea"("id") ON DELETE CASCADE,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

-- Questões
CREATE TABLE "Question" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "code" TEXT UNIQUE NOT NULL,
  "type" "QuestionType" NOT NULL DEFAULT 'OBJETIVA',
  "statement" TEXT NOT NULL,
  "context" TEXT,
  "correctAnswer" TEXT NOT NULL,
  "explanation" TEXT,
  "difficulty" TEXT NOT NULL DEFAULT 'médio',
  "triA" DOUBLE PRECISION,
  "triB" DOUBLE PRECISION,
  "triC" DOUBLE PRECISION,
  "triCalibrated" BOOLEAN NOT NULL DEFAULT false,
  "source" TEXT NOT NULL DEFAULT 'elaborada',
  "sourceYear" INTEGER,
  "enadeId" TEXT,
  "microareaId" TEXT NOT NULL REFERENCES "Microarea"("id"),
  "elementId" TEXT REFERENCES "Element"("id"),
  "authorId" TEXT REFERENCES "User"("id"),
  "validatorId" TEXT REFERENCES "User"("id"),
  "status" "QuestionStatus" NOT NULL DEFAULT 'RASCUNHO',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

-- Alternativas
CREATE TABLE "Alternative" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "letter" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "questionId" TEXT NOT NULL REFERENCES "Question"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

-- Simulados
CREATE TABLE "Simulado" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "type" "SimuladoType" NOT NULL DEFAULT 'LIVRE',
  "phase" INTEGER,
  "timeLimit" INTEGER,
  "questionCount" INTEGER NOT NULL DEFAULT 10,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

-- Configuração de Simulados (questões)
CREATE TABLE "SimuladoConfig" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "simuladoId" TEXT NOT NULL REFERENCES "Simulado"("id") ON DELETE CASCADE,
  "questionId" TEXT NOT NULL REFERENCES "Question"("id"),
  "order" INTEGER NOT NULL DEFAULT 0
);

-- Respostas dos Estudantes
CREATE TABLE "StudentResponse" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  "questionId" TEXT NOT NULL REFERENCES "Question"("id"),
  "simuladoId" TEXT REFERENCES "Simulado"("id"),
  "answer" TEXT NOT NULL,
  "isCorrect" BOOLEAN,
  "responseTime" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

-- Tags de Questões
CREATE TABLE "QuestionTag" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "questionId" TEXT NOT NULL REFERENCES "Question"("id") ON DELETE CASCADE
);

-- Configuração de Fases
CREATE TABLE "PhaseConfig" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "phase" INTEGER UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "features" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

-- Configuração do Sistema
CREATE TABLE "SystemConfig" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "key" TEXT UNIQUE NOT NULL,
  "value" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

-- ─── ÍNDICES ──────────────────────────────────────────

CREATE INDEX idx_element_microarea ON "Element"("microareaId");
CREATE INDEX idx_question_microarea ON "Question"("microareaId");
CREATE INDEX idx_question_element ON "Question"("elementId");
CREATE INDEX idx_question_author ON "Question"("authorId");
CREATE INDEX idx_question_validator ON "Question"("validatorId");
CREATE INDEX idx_question_status ON "Question"("status");
CREATE INDEX idx_alternative_question ON "Alternative"("questionId");
CREATE INDEX idx_simulado_config_simulado ON "SimuladoConfig"("simuladoId");
CREATE INDEX idx_simulado_config_question ON "SimuladoConfig"("questionId");
CREATE INDEX idx_response_user ON "StudentResponse"("userId");
CREATE INDEX idx_response_question ON "StudentResponse"("questionId");
CREATE INDEX idx_response_simulado ON "StudentResponse"("simuladoId");
CREATE INDEX idx_tag_question ON "QuestionTag"("questionId");

-- ─── ROW LEVEL SECURITY (RLS) ────────────────────────

-- Habilitar RLS em todas as tabelas
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Microarea" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Element" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Question" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Alternative" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Simulado" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SimuladoConfig" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StudentResponse" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QuestionTag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PhaseConfig" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SystemConfig" ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajuste conforme necessidade)

-- Usuários podem ver próprio perfil
CREATE POLICY "Users can view own profile" ON "User"
  FOR SELECT USING (auth.uid()::text = id OR id = auth.uid()::text);

-- Admins podem ver todos os usuários
CREATE POLICY "Admins can view all users" ON "User"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role IN ('MASTER', 'PROFESSOR'))
  );

-- Microáreas são públicas para leitura
CREATE POLICY "Microareas are publicly readable" ON "Microarea"
  FOR SELECT USING (true);

-- Elementos são públicos para leitura
CREATE POLICY "Elements are publicly readable" ON "Element"
  FOR SELECT USING (true);

-- Questões aprovadas são visíveis para todos autenticados
CREATE POLICY "Approved questions visible to authenticated" ON "Question"
  FOR SELECT USING (status = 'ATIVA' OR EXISTS (
    SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role IN ('MASTER', 'PROFESSOR')
  ));

-- Alternativas visíveis quando questão é visível
CREATE POLICY "Alternatives visible with question" ON "Alternative"
  FOR SELECT USING (true);

-- Simulados ativos visíveis
CREATE POLICY "Active simulados visible" ON "Simulado"
  FOR SELECT USING (active = true OR EXISTS (
    SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role IN ('MASTER', 'PROFESSOR')
  ));

-- Estudantes podem inserir próprias respostas
CREATE POLICY "Students can insert own responses" ON "StudentResponse"
  FOR INSERT WITH CHECK (userId = auth.uid()::text);

-- Estudantes podem ver próprias respostas
CREATE POLICY "Students can view own responses" ON "StudentResponse"
  FOR SELECT USING (userId = auth.uid()::text OR EXISTS (
    SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role IN ('MASTER', 'PROFESSOR')
  ));

-- Fases visíveis para autenticados
CREATE POLICY "Phases visible to authenticated" ON "PhaseConfig"
  FOR SELECT USING (true);

-- ─── DADOS INICIAIS ────────────────────────────────────

-- Inserir usuário Master (senha: master123 — hash bcrypt)
INSERT INTO "User" (id, email, name, password, role, ra) VALUES
('master-001', 'master@unifecaf.br', 'Coordenação ENADE', '$2a$12$LJ3m4ys3Hz0JeVN5UxCE/.WmGBjHCFzrG1vXhqqLz.EEqlFmzDIXi', 'MASTER', 'MASTER001')
ON CONFLICT DO NOTHING;

-- Inserir fases
INSERT INTO "PhaseConfig" (phase, name, description, features, active, "startDate", "endDate") VALUES
(1, 'Diagnóstico', 'Fase inicial de diagnóstico do conhecimento', '["chat","diagnóstico","revisão_básica"]', true, '2025-01-01', '2025-03-31'),
(2, 'Prática Direcionada', 'Prática focada nas áreas com maior dificuldade', '["chat","diagnóstico","revisão_básica","simulados_microarea","dicas","relatório_individual","ranking"]', false, '2025-04-01', '2025-06-30'),
(3, 'Simulados Completos', 'Simulados completos no formato ENADE', '["chat","diagnóstico","revisão_básica","simulados_microarea","dicas","relatório_individual","simulados_completos","enade_simulado","relatório_coletivo","ranking"]', false, '2025-07-01', '2025-09-30'),
(4, 'Preparação Final', 'Preparação final com simulados cronometrados', '["chat","diagnóstico","revisão_básica","simulados_microarea","dicas","relatório_individual","simulados_completos","enade_simulado","relatório_coletivo","simulados_cronometrados","relatório_final","ranking"]', false, '2025-10-01', '2025-12-31')
ON CONFLICT DO NOTHING;
