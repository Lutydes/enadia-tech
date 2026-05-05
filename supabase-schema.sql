-- ============================================================
-- EnadIA - Supabase Database Schema & Row Level Security
-- ============================================================
-- Execute this SQL in the Supabase SQL Editor to set up
-- the complete database with Row Level Security policies.
-- ============================================================

-- ======================== ENUMS ========================

CREATE TYPE public.role AS ENUM ('MASTER', 'PROFESSOR', 'ALUNO');
CREATE TYPE public.question_type AS ENUM ('OBJETIVA', 'DISSERTATIVA');
CREATE TYPE public.question_status AS ENUM (
  'RASCUNHO', 'AGUARDANDO_TESTE', 'EM_TESTE',
  'AGUARDANDO_VALIDACAO', 'APROVADA', 'REPROVADA', 'ATIVA', 'INATIVA'
);
CREATE TYPE public.simulado_type AS ENUM (
  'DIAGNOSTICO', 'MICROAREA', 'MACROAREA', 'GERAL', 'LIVRE', 'ENADE_SIMULADO'
);
CREATE TYPE public.modalidade AS ENUM ('EAD', 'PRESENCIAL', 'SEMIPRESENCIAL');

-- ======================== TABLES ========================

-- Users
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  role public.role NOT NULL DEFAULT 'ALUNO',
  ra TEXT UNIQUE,
  avatar TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMPTZ,

  -- Student fields
  curso TEXT,
  periodo INTEGER,
  modalidade public.modalidade DEFAULT 'PRESENCIAL',

  -- Professor fields
  disciplina TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Microareas
CREATE TABLE public.microareas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  macroarea TEXT NOT NULL,
  description TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Elements
CREATE TABLE public.elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  skill_level TEXT NOT NULL DEFAULT 'compreensão',
  microarea_id UUID NOT NULL REFERENCES public.microareas(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Questions
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type public.question_type NOT NULL DEFAULT 'OBJETIVA',
  statement TEXT NOT NULL,
  context TEXT,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT NOT NULL DEFAULT 'médio',

  tri_a FLOAT,
  tri_b FLOAT,
  tri_c FLOAT,
  tri_calibrated BOOLEAN NOT NULL DEFAULT false,

  source TEXT NOT NULL DEFAULT 'elaborada',
  source_year INTEGER,
  enade_id TEXT,

  microarea_id UUID NOT NULL REFERENCES public.microareas(id),
  element_id UUID REFERENCES public.elements(id),
  author_id UUID REFERENCES public.users(id),
  validator_id UUID REFERENCES public.users(id),

  status public.question_status NOT NULL DEFAULT 'RASCUNHO',

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Alternatives
CREATE TABLE public.alternatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  letter TEXT NOT NULL,
  text TEXT NOT NULL,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Simulados
CREATE TABLE public.simulados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type public.simulado_type NOT NULL DEFAULT 'LIVRE',
  phase INTEGER,
  time_limit INTEGER,
  question_count INTEGER NOT NULL DEFAULT 10,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Simulado Config (link questions to simulados)
CREATE TABLE public.simulado_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  simulado_id UUID NOT NULL REFERENCES public.simulados(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id),
  "order" INTEGER NOT NULL DEFAULT 0
);

-- Student Responses
CREATE TABLE public.student_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  question_id UUID NOT NULL REFERENCES public.questions(id),
  simulado_id UUID REFERENCES public.simulados(id),
  answer TEXT NOT NULL,
  is_correct BOOLEAN,
  response_time INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Essay Answers
CREATE TABLE public.essay_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  question_id UUID NOT NULL REFERENCES public.questions(id),
  simulado_id UUID REFERENCES public.simulados(id),
  answer TEXT NOT NULL,
  ai_feedback TEXT,
  ai_score FLOAT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Question Tags
CREATE TABLE public.question_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE
);

-- Phase Config
CREATE TABLE public.phase_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  features TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- System Config
CREATE TABLE public.system_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ======================== INDEXES ========================

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_ra ON public.users(ra);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_elements_microarea ON public.elements(microarea_id);
CREATE INDEX idx_questions_microarea ON public.questions(microarea_id);
CREATE INDEX idx_questions_status ON public.questions(status);
CREATE INDEX idx_questions_author ON public.questions(author_id);
CREATE INDEX idx_alternatives_question ON public.alternatives(question_id);
CREATE INDEX idx_simulado_configs_simulado ON public.simulado_configs(simulado_id);
CREATE INDEX idx_student_responses_user ON public.student_responses(user_id);
CREATE INDEX idx_student_responses_question ON public.student_responses(question_id);
CREATE INDEX idx_student_responses_simulado ON public.student_responses(simulado_id);
CREATE INDEX idx_essay_answers_user ON public.essay_answers(user_id);
CREATE INDEX idx_essay_answers_question ON public.essay_answers(question_id);
CREATE INDEX idx_question_tags_question ON public.question_tags(question_id);

-- ======================== ROW LEVEL SECURITY ========================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.microareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alternatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulado_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.essay_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phase_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_configs ENABLE ROW LEVEL SECURITY;

-- ======================== HELPER FUNCTIONS ========================

-- Function to check if current user is MASTER
CREATE OR REPLACE FUNCTION public.is_master()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'MASTER' AND active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Function to check if current user is PROFESSOR
CREATE OR REPLACE FUNCTION public.is_professor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'PROFESSOR' AND active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Function to check if current user is MASTER or PROFESSOR
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('MASTER', 'PROFESSOR') AND active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Function to get current user role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.role AS $$
  SELECT role FROM public.users WHERE id = auth.uid() AND active = true;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ======================== RLS POLICIES ========================

-- === USERS ===

-- Anyone can register (insert)
CREATE POLICY "Anyone can register" ON public.users
  FOR INSERT WITH CHECK (true);

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (id = auth.uid());

-- MASTER can read all users
CREATE POLICY "Master can read all users" ON public.users
  FOR SELECT USING (public.is_master());

-- PROFESSOR can read students (for reports)
CREATE POLICY "Professor can read students" ON public.users
  FOR SELECT USING (
    public.is_professor() AND role = 'ALUNO'
  );

-- Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- MASTER can update any user
CREATE POLICY "Master can update any user" ON public.users
  FOR UPDATE USING (public.is_master())
  WITH CHECK (public.is_master());

-- MASTER can delete users
CREATE POLICY "Master can delete users" ON public.users
  FOR DELETE USING (public.is_master());

-- === MICROAREAS ===

-- Anyone can read microareas
CREATE POLICY "Anyone can read microareas" ON public.microareas
  FOR SELECT USING (true);

-- MASTER can insert/update/delete microareas
CREATE POLICY "Master can manage microareas" ON public.microareas
  FOR ALL USING (public.is_master());

-- === ELEMENTS ===

-- Anyone can read elements
CREATE POLICY "Anyone can read elements" ON public.elements
  FOR SELECT USING (true);

-- MASTER can manage elements
CREATE POLICY "Master can manage elements" ON public.elements
  FOR ALL USING (public.is_master());

-- === QUESTIONS ===

-- Anyone can read active questions
CREATE POLICY "Anyone can read active questions" ON public.questions
  FOR SELECT USING (status = 'ATIVA');

-- Authors can read their own questions (any status)
CREATE POLICY "Authors can read own questions" ON public.questions
  FOR SELECT USING (author_id = auth.uid());

-- MASTER can read all questions
CREATE POLICY "Master can read all questions" ON public.questions
  FOR SELECT USING (public.is_master());

-- PROFESSOR can read questions they authored or that are in test/validation
CREATE POLICY "Professor can read relevant questions" ON public.questions
  FOR SELECT USING (
    public.is_professor() AND (
      author_id = auth.uid() OR
      status IN ('ATIVA', 'EM_TESTE', 'AGUARDANDO_VALIDACAO', 'AGUARDANDO_TESTE')
    )
  );

-- PROFESSOR and MASTER can create questions
CREATE POLICY "Admins can create questions" ON public.questions
  FOR INSERT WITH CHECK (public.is_admin());

-- MASTER can update any question
CREATE POLICY "Master can update any question" ON public.questions
  FOR UPDATE USING (public.is_master());

-- PROFESSOR can update their own questions
CREATE POLICY "Professor can update own questions" ON public.questions
  FOR UPDATE USING (
    public.is_professor() AND author_id = auth.uid()
  );

-- MASTER can delete questions
CREATE POLICY "Master can delete questions" ON public.questions
  FOR DELETE USING (public.is_master());

-- === ALTERNATIVES ===

-- Anyone can read alternatives for active questions
CREATE POLICY "Anyone can read alternatives" ON public.alternatives
  FOR SELECT USING (true);

-- Admins can manage alternatives
CREATE POLICY "Admins can manage alternatives" ON public.alternatives
  FOR ALL USING (public.is_admin());

-- === SIMULADOS ===

-- Anyone can read active simulados
CREATE POLICY "Anyone can read active simulados" ON public.simulados
  FOR SELECT USING (active = true);

-- MASTER can read all simulados
CREATE POLICY "Master can read all simulados" ON public.simulados
  FOR SELECT USING (public.is_master());

-- MASTER can manage simulados
CREATE POLICY "Master can manage simulados" ON public.simulados
  FOR ALL USING (public.is_master());

-- === SIMULADO CONFIGS ===

-- Anyone can read simulado configs
CREATE POLICY "Anyone can read simulado configs" ON public.simulado_configs
  FOR SELECT USING (true);

-- MASTER can manage simulado configs
CREATE POLICY "Master can manage simulado configs" ON public.simulado_configs
  FOR ALL USING (public.is_master());

-- === STUDENT RESPONSES ===

-- Students can read their own responses
CREATE POLICY "Students can read own responses" ON public.student_responses
  FOR SELECT USING (user_id = auth.uid());

-- MASTER can read all responses
CREATE POLICY "Master can read all responses" ON public.student_responses
  FOR SELECT USING (public.is_master());

-- PROFESSOR can read responses from students (for reports)
CREATE POLICY "Professor can read student responses" ON public.student_responses
  FOR SELECT USING (public.is_professor());

-- Students can insert their own responses
CREATE POLICY "Students can insert own responses" ON public.student_responses
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- MASTER can delete responses
CREATE POLICY "Master can delete responses" ON public.student_responses
  FOR DELETE USING (public.is_master());

-- === ESSAY ANSWERS ===

-- Students can read their own essay answers
CREATE POLICY "Students can read own essays" ON public.essay_answers
  FOR SELECT USING (user_id = auth.uid());

-- MASTER can read all essay answers
CREATE POLICY "Master can read all essays" ON public.essay_answers
  FOR SELECT USING (public.is_master());

-- PROFESSOR can read essay answers from students
CREATE POLICY "Professor can read student essays" ON public.essay_answers
  FOR SELECT USING (public.is_professor());

-- Students can insert their own essay answers
CREATE POLICY "Students can insert own essays" ON public.essay_answers
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- MASTER can update essay answers (e.g., add AI feedback)
CREATE POLICY "Master can update essays" ON public.essay_answers
  FOR UPDATE USING (public.is_master());

-- === QUESTION TAGS ===

-- Anyone can read question tags
CREATE POLICY "Anyone can read tags" ON public.question_tags
  FOR SELECT USING (true);

-- Admins can manage tags
CREATE POLICY "Admins can manage tags" ON public.question_tags
  FOR ALL USING (public.is_admin());

-- === PHASE CONFIGS ===

-- Anyone can read phase configs
CREATE POLICY "Anyone can read phases" ON public.phase_configs
  FOR SELECT USING (true);

-- MASTER can manage phase configs
CREATE POLICY "Master can manage phases" ON public.phase_configs
  FOR ALL USING (public.is_master());

-- === SYSTEM CONFIGS ===

-- Anyone can read system configs
CREATE POLICY "Anyone can read system configs" ON public.system_configs
  FOR SELECT USING (true);

-- MASTER can manage system configs
CREATE POLICY "Master can manage system configs" ON public.system_configs
  FOR ALL USING (public.is_master());

-- ======================== TRIGGERS ========================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_simulados_updated_at
  BEFORE UPDATE ON public.simulados
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_phase_configs_updated_at
  BEFORE UPDATE ON public.phase_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_system_configs_updated_at
  BEFORE UPDATE ON public.system_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ======================== INITIAL DATA ========================

-- Insert Phase Configs
INSERT INTO public.phase_configs (phase, name, description, features, active) VALUES
(1, 'Diagnóstico', 'Avaliação inicial do conhecimento do aluno', 'chat,diagnostico', true),
(2, 'Prática Direcionada', 'Exercícios focados nas áreas de dificuldade', 'chat,simulado,revisao,dashboard,dicas,ranking', false),
(3, 'Simulados Completos', 'Simulados completos no formato ENADE', 'chat,simulado,revisao,dashboard,dicas,ranking', false),
(4, 'Preparação Final', 'Revisão final e dicas para o dia da prova', 'chat,simulado,revisao,dashboard,dicas,ranking', false);

-- Insert default MASTER user (password: master123 - bcrypt hash)
-- NOTE: Change this password immediately after first login!
INSERT INTO public.users (email, name, password, role, ra, active) VALUES
('master@unifecaf.br', 'Coordenação ENADE', '$2a$12$LJ3m4ys3Hz0JeVN5UxCE/.9.9.9 PLACEHOLDER_HASH_CHANGE_ME', 'MASTER', 'MASTER001', true);

-- ======================== VIEWS FOR REPORTS ========================

-- Student ranking view
CREATE OR REPLACE VIEW public.student_ranking AS
SELECT
  u.id AS user_id,
  u.name,
  u.email,
  u.ra,
  u.curso,
  u.periodo,
  u.modalidade,
  COUNT(sr.id) AS total_answered,
  COUNT(sr.id) FILTER (WHERE sr.is_correct = true) AS total_correct,
  CASE
    WHEN COUNT(sr.id) > 0
    THEN ROUND((COUNT(sr.id) FILTER (WHERE sr.is_correct = true)::FLOAT / COUNT(sr.id)::FLOAT) * 100)
    ELSE 0
  END AS hit_rate,
  CASE
    WHEN AVG(sr.response_time) IS NOT NULL
    THEN ROUND(AVG(sr.response_time))
    ELSE NULL
  END AS avg_response_time,
  RANK() OVER (
    ORDER BY
      CASE WHEN COUNT(sr.id) > 0
        THEN ROUND((COUNT(sr.id) FILTER (WHERE sr.is_correct = true)::FLOAT / COUNT(sr.id)::FLOAT) * 100)
        ELSE 0
      END DESC,
      COUNT(sr.id) FILTER (WHERE sr.is_correct = true) DESC
  ) AS position
FROM public.users u
LEFT JOIN public.student_responses sr ON sr.user_id = u.id
WHERE u.role = 'ALUNO' AND u.active = true
GROUP BY u.id, u.name, u.email, u.ra, u.curso, u.periodo, u.modalidade;

-- Class performance view
CREATE OR REPLACE VIEW public.class_performance AS
SELECT
  u.curso,
  u.periodo,
  u.modalidade,
  COUNT(DISTINCT u.id) AS total_students,
  AVG(
    CASE WHEN sr_count > 0
      THEN ROUND((sr_correct::FLOAT / sr_count::FLOAT) * 100)
      ELSE 0
    END
  ) AS avg_hit_rate
FROM public.users u
LEFT JOIN LATERAL (
  SELECT
    COUNT(sr.id) AS sr_count,
    COUNT(sr.id) FILTER (WHERE sr.is_correct = true) AS sr_correct
  FROM public.student_responses sr WHERE sr.user_id = u.id
) sub ON true
WHERE u.role = 'ALUNO' AND u.active = true
GROUP BY u.curso, u.periodo, u.modalidade;

-- ======================== GRANT PERMISSIONS ========================

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant access to anon users (for registration)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.microareas TO anon;
GRANT SELECT ON public.elements TO anon;
GRANT SELECT ON public.phase_configs TO anon;
GRANT SELECT ON public.system_configs TO anon;
GRANT INSERT ON public.users TO anon;
