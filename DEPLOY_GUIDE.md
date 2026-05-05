# 🚀 Guia Completo: EnadIA TECH → Supabase + Netlify

## Índice
1. [Configurando o Supabase](#1-configurando-o-supabase)
2. [Migrando o Banco de Dados](#2-migrando-o-banco-de-dados)
3. [Importando Alunos e Professores via CSV](#3-importando-alunos-e-professores-via-csv)
4. [Deploy no Netlify](#4-deploy-no-netlify)
5. [Variáveis de Ambiente](#5-variáveis-de-ambiente)
6. [Resolução de Problemas](#6-resolução-de-problemas)

---

## 1. Configurando o Supabase

### Passo 1: Criar conta e projeto
1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **Start your project** e crie uma conta (pode usar GitHub)
3. Clique em **New Project**
4. Preencha:
   - **Name**: `enadia-tech`
   - **Database Password**: Crie uma senha forte (guarde bem!)
   - **Region**: Escolha a mais próxima (ex: South America - São Paulo)
5. Aguarde o projeto ser criado (~2 minutos)

### Passo 2: Obter as credenciais
1. No painel do Supabase, vá em **Settings** → **Database**
2. Role até **Connection string**
3. Copie a **URI** do PostgreSQL

Você precisará de DUAS URLs:

**Pooler URL** (para a aplicação - recomendada para serverless/Netlify):
```
postgresql://postgres.[PROJECT_REF]:[SUA_SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Direct URL** (para Prisma Migrations):
```
postgresql://postgres.[PROJECT_REF]:[SUA_SENHA]@aws-0-sa-east-1.supabase.com:5432/postgres
```

### Passo 3: Configurar o .env
Crie um arquivo `.env.local` na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[SUA_SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[SUA_SENHA]@aws-0-sa-east-1.supabase.com:5432/postgres"
JWT_SECRET="gere-uma-chave-com-openssl-rand-hex-32"
```

Para gerar o JWT_SECRET:
```bash
openssl rand -hex 32
```

### Passo 4: Obter a Anon Key (para o painel)
1. No Supabase, vá em **Settings** → **API**
2. Copie a **anon public** key
3. Esta key NÃO é usada pelo código atual (usamos JWT próprio), mas pode ser útil futuramente

---

## 2. Migrando o Banco de Dados

### Opção A: Migração do Zero (Recomendado para produção)

Se você quer começar limpo no Supabase com apenas os dados essenciais:

```bash
# 1. Certifique-se que o .env aponta para o Supabase
cat .env.local

# 2. Gere o Prisma Client para PostgreSQL
bunx prisma generate

# 3. Crie as tabelas no Supabase
bunx prisma db push

# 4. Execute o seed para criar usuários padrão
bun run prisma/seed.ts
```

Usuários criados pelo seed:
| Role | Email | Senha |
|------|-------|-------|
| MASTER | master@unifecaf.br | master123 |
| PROFESSOR | professor@unifecaf.br | prof123 |
| ALUNO | aluno@unifecaf.br | aluno123 |

⚠️ **TROQUE AS SENHAS PADRÃO** após o primeiro login!

### Opção B: Migrar dados do SQLite existente

Se você tem dados no SQLite local que quer preservar:

```bash
# 1. Com o .env apontando para o SQLite, exporte os dados
bun run scripts/migrate-to-supabase.ts export

# 2. Troque o .env para o Supabase
# (edite .env.local com as URLs do Supabase)

# 3. Gere o Prisma Client e crie as tabelas
bunx prisma generate
bunx prisma db push

# 4. Importe os dados para o Supabase
bun run scripts/migrate-to-supabase.ts import
```

### Após a migração: Semear as questões

Para popular o banco com as questões ENADE:

```bash
bun run prisma/seed-questions.ts
```

---

## 3. Importando Alunos e Professores via CSV

### Formato CSV para Alunos

O CSV deve ter o formato:
```
nome,email,ra,curso,periodo,modalidade,senha
João Silva,joao.silva@unifecaf.br,2024001,Ciência da Computação,6,PRESENCIAL,joao123
```

| Campo | Obrigatório | Descrição |
|-------|------------|-----------|
| nome | ✅ | Nome completo |
| email | ✅ | Email institucional (único) |
| ra | ✅ | Registro Acadêmico (único) |
| curso | ✅ | Nome do curso |
| periodo | ✅ | Número do período (1-10) |
| modalidade | ❌ | EAD, PRESENCIAL ou SEMIPRESENCIAL (padrão: PRESENCIAL) |
| senha | ❌ | Senha inicial (padrão: enadia123) |

### Formato CSV para Professores

```
nome,email,ra,disciplina,senha
Prof. Dr. Carlos,carlos@unifecaf.br,PROF001,Engenharia de Software,prof123
```

| Campo | Obrigatório | Descrição |
|-------|------------|-----------|
| nome | ✅ | Nome completo |
| email | ✅ | Email institucional (único) |
| ra | ✅ | Registro (único) |
| disciplina | ✅ | Disciplina que leciona |
| senha | ❌ | Senha inicial (padrão: enadia123) |

### Como Importar

#### Opção 1: Pelo Painel Master (Interface Web)

1. Faça login como MASTER (master@unifecaf.br)
2. Vá na aba **Alunos** ou **Docentes**
3. Clique em **Importar CSV**
4. Cole o conteúdo do CSV ou use o template
5. Clique em **Importar**

#### Opção 2: Via API (curl)

**Importar Alunos:**
```bash
curl -X POST https://seudominio.com/api/auth/users/csv-import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_MASTER" \
  -d '{
    "role": "ALUNO",
    "format": "csv",
    "data": "nome,email,ra,curso,periodo,modalidade,senha\nJoão Silva,joao@unifecaf.br,2024001,Ciência da Computação,6,PRESENCIAL,joao123",
    "defaultPassword": "enadia123"
  }'
```

**Importar Professores:**
```bash
curl -X POST https://seudominio.com/api/auth/users/csv-import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_MASTER" \
  -d '{
    "role": "PROFESSOR",
    "format": "csv",
    "data": "nome,email,ra,disciplina,senha\nProf. Carlos,carlos@unifecaf.br,PROF001,Engenharia de Software,prof123"
  }'
```

#### Opção 3: Via JSON (array)

```bash
curl -X POST https://seudominio.com/api/auth/users/csv-import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_MASTER" \
  -d '{
    "role": "ALUNO",
    "data": [
      {"name": "João Silva", "email": "joao@unifecaf.br", "ra": "2024001", "curso": "Ciência da Computação", "periodo": "6", "modalidade": "PRESENCIAL", "senha": "joao123"},
      {"name": "Ana Oliveira", "email": "ana@unifecaf.br", "ra": "2024002", "curso": "Sistemas de Informação", "periodo": "4", "senha": "ana123"}
    ]
  }'
```

### Dicas para CSV Grande

- Se o CSV tiver **cabeçalho** (nome,email,ra...), ele será detectado automaticamente
- Emails e RAs duplicados são **ignorados** (não causam erro)
- Se não incluir a coluna **senha**, todos receberão a senha padrão `enadia123`
- Use `defaultPassword` para definir uma senha padrão diferente
- O resultado inclui: sucesso, erros e detalhes de cada erro

---

## 4. Deploy no Netlify

### Pré-requisitos
- Conta no [Netlify](https://netlify.com) (pode usar GitHub para login)
- Código no GitHub (recomendado) ou deploy manual

### Opção A: Deploy via GitHub (Recomendado)

#### Passo 1: Subir o código para o GitHub

```bash
# Inicializar git (se ainda não tiver)
git init
git add .
git commit -m "EnadIA TECH - versão Supabase"

# Criar repositório no GitHub e fazer push
git remote add origin https://github.com/SEU_USER/enadia-tech.git
git push -u origin main
```

⚠️ **NÃO suba** o `.env.local` ou `db/` para o GitHub! Adicione ao `.gitignore`:
```
.env.local
.env
db/
migration-data.json
```

#### Passo 2: Configurar no Netlify

1. Acesse [https://app.netlify.com](https://app.netlify.com)
2. Clique em **Add new site** → **Import an existing project**
3. Conecte ao GitHub e selecione o repositório `enadia-tech`
4. Configure o build:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Clique em **Show advanced** e adicione as variáveis de ambiente:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://postgres.REF:SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | `postgresql://postgres.REF:SENHA@aws-0-sa-east-1.supabase.com:5432/postgres` |
| `JWT_SECRET` | Sua chave secreta gerada com `openssl rand -hex 32` |

6. Clique em **Deploy site**

#### Passo 3: Instalar plugin do Next.js

O Netlify tem um plugin oficial para Next.js que é instalado automaticamente.
Se não for, adicione ao `netlify.toml`:

```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Opção B: Deploy Manual (CLI)

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Fazer login
netlify login

# Build do projeto
npm run build

# Deploy
netlify deploy --prod --dir=.next

# Ou deploy de preview
netlify deploy --dir=.next
```

### Configuração do netlify.toml

Crie um arquivo `netlify.toml` na raiz do projeto:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[context.production.environment]
  NODE_ENV = "production"
```

---

## 5. Variáveis de Ambiente

### Para Desenvolvimento Local (`.env.local`)

```env
DATABASE_URL="postgresql://postgres.[REF]:[SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[SENHA]@aws-0-sa-east-1.supabase.com:5432/postgres"
JWT_SECRET="sua-chave-secreta-gerada-com-openssl"
```

### Para Netlify (Settings → Environment variables)

As mesmas variáveis acima, configuradas no painel do Netlify.

### Para Produção (Após Deploy)

⚠️ **IMPORTANTE**: Troque as senhas padrão!
1. Faça login como MASTER
2. Edite a senha do usuário master
3. Peça para professores e alunos trocarem suas senhas

---

## 6. Resolução de Problemas

### Erro: "P1001: Can't reach database server"
- Verifique se as URLs do Supabase estão corretas
- Confirme se o projeto Supabase está ativo (não pausado)
- Teste a conexão: `bunx prisma db pull` (deve conectar sem erro)

### Erro: "JWT_SECRET não definido"
- Certifique-se de que a variável `JWT_SECRET` está no `.env.local` ou no Netlify
- Reinicie o servidor de desenvolvimento após alterar o `.env.local`

### Erro: "Role MASTER não encontrado"
- Execute o seed: `bun run prisma/seed.ts`
- Verifique se o banco Supabase tem a tabela User com dados

### Erro no Netlify: "Build failed"
- Verifique se as variáveis de ambiente estão configuradas no Netlify
- Confirme se o `DATABASE_URL` usa a URL com `?pgbouncer=true` (pooler)
- Confirme se o `DIRECT_URL` NÃO tem `?pgbouncer=true`

### Erro de CORS no Netlify
- O Next.js no Netlify deve lidar com CORS automaticamente
- Se necessário, adicione headers no `netlify.toml`:
```toml
[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type, Authorization"
```

### Erro: "Prisma Client could not be generated"
```bash
# Regenerate o client
bunx prisma generate

# Se persistir, limpe e reinstale
rm -rf node_modules/.prisma
bunx prisma generate
```

### Dica: Monitorar o Supabase
- No painel do Supabase, vá em **Logs** → **Postgres** para ver queries
- Vá em **Database** → **Replication** para monitorar performance
- Vá em **Settings** → **Database** → **Connection pooling** para configurar pool

---

## Resumo Rápido

```bash
# 1. Configurar .env.local com URLs do Supabase
# 2. Gerar Prisma Client
bunx prisma generate

# 3. Criar tabelas no Supabase
bunx prisma db push

# 4. Semear dados iniciais
bun run prisma/seed.ts
bun run prisma/seed-questions.ts

# 5. Testar localmente
bun run dev

# 6. Fazer deploy
# - Push para GitHub → Netlify detecta e faz deploy automático
# - OU: netlify deploy --prod
```

---

**EnadIA TECH** — ENADE 2026 🎓
