# 🚀 Guia de Deploy — EnadIA (Netlify + Supabase)

## Arquitetura

```
┌───────────────────────────────────────────────────────┐
│                  SUPABASE (1 banco)                   │
│                                                        │
│  📋 Questões, Microareas, Elements  ← COMPARTILHADAS  │
│  👥 Users (coluna "instance")         ← ISOLADAS      │
│  📊 Responses (referenciam user)      ← ISOLADAS      │
│  🏆 Ranking (calculado por instance)  ← ISOLADAS      │
│                                                        │
│  instance = 'ENADIA'  → Site 1                            │
│  instance = 'FECAP'   → Site 2                            │
└───────────────────────────────────────────────────────┘
         │                            │
    ┌────▼─────┐              ┌──────▼─────┐
    │ NETLIFY  │              │  NETLIFY   │
    │ Site 1   │              │  Site 2    │
    │ EnadIA   │              │  EnadIA    │
    │ TECH     │              │  FECAP     │
    └──────────┘              └────────────┘
```

---

## PASSO 0 — Trocar o Prisma Schema para PostgreSQL

Antes de fazer deploy, é preciso trocar o schema do Prisma:

```bash
# O projeto tem 2 schemas Prisma:
#   prisma/schema.prisma          → SQLite (desenvolvimento local)
#   prisma/schema.supabase.prisma → PostgreSQL (deploy Supabase)

cp prisma/schema.supabase.prisma prisma/schema.prisma
```

Faça isso **antes** do commit que vai para o Netlify.

---

## PASSO 1 — Criar o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Anote a **senha** do banco (você vai precisar)
3. Vá em **Settings → Database → Connection string → URI**
4. Copie as strings de conexão (pooler e direta)

## PASSO 2 — Executar o Schema SQL

1. No Supabase, vá em **SQL Editor**
2. Abra o arquivo `supabase/migration.sql` do projeto
3. Cole todo o conteúdo e clique em **Run**
4. Isso cria todas as tabelas, índices e views

## PASSO 3 — Criar os 2 sites no Netlify

### Site 1: EnadIA TECH
1. Faça login em [netlify.com](https://netlify.com)
2. **Add new site → Import an existing project → GitHub**
3. Conecte seu repositório
4. Configure as variáveis de ambiente (veja abaixo)
5. Deploy

### Site 2: EnadIA FECAP
1. **Add new site → Import an existing project → GitHub** (mesmo repo!)
2. Mesmo branch
3. Configure as variáveis de ambiente DIFERENTES (veja abaixo)
4. Deploy

---

## Variáveis de Ambiente (Netlify → Site Settings → Environment Variables)

### Comum a ambos os sites:
| Variável | Exemplo | Descrição |
|----------|---------|------------|
| `DATABASE_URL` | `postgresql://postgres.xxx...` | Connection string via pooler |
| `DIRECT_URL` | `postgresql://postgres.xxx...` | Connection string direta |
| `JWT_SECRET` | `sua-chave-super-secreta` | **USE CHAVES DIFERENTES** para cada site |
| `GROQ_API_KEY` | `gsk_...` | Chave da API do Groq (console.groq.com/keys) — pode ser a **mesma** para os 2 sites, ou uma para cada se quiser limites separados |

### Site 1 — EnadIA TECH:
| Variável | Valor |
|----------|-------|
| `APP_INSTANCE` | `ENADIA` |
| `NEXT_PUBLIC_APP_NAME` | `EnadIA` |
| `NEXT_PUBLIC_APP_SUBTITLE` | `ENADE Assistant` |
| `NEXT_PUBLIC_APP_BRAND` | `EnadIA TECH` |
| `NEXT_PUBLIC_APP_FOOTER` | `EnadIA TECH` |

### Site 2 — EnadIA FECAP:
| Variável | Valor |
|----------|-------|
| `APP_INSTANCE` | `FECAP` |
| `NEXT_PUBLIC_APP_NAME` | `EnadIA` |
| `NEXT_PUBLIC_APP_SUBTITLE` | `ENADE Assistant` |
| `NEXT_PUBLIC_APP_BRAND` | `Centro Universitário FECAP` |
| `NEXT_PUBLIC_APP_FOOTER` | `Centro Universitário FECAP` |

---

## PASSO 4 — Gerar o Prisma Client (primeiro deploy)

No terminal local, antes de fazer push:

```bash
# Instalar dependências
npm install

# Gerar o Prisma Client para PostgreSQL
npx prisma generate

# (Opcional) Testar localmente com:
# cp .env.example .env.local
# (preencha com suas credenciais Supabase)
# npx prisma db push
# npm run dev
```

---

## Como funciona o isolamento

- Quando um aluno se cadastra, a coluna `instance` recebe `APP_INSTANCE` (ex: `FECAP`)
- O token JWT inclui o `instance` do usuário
- Todas as queries de ranking, dashboard e relatórios filtram por `instance`
- Um aluno do site FECAP **nunca** aparece no ranking do site ENADIA
- Questões e microáreas são **compartilhadas** entre os dois sites

---

## Estrutura de Connection String do Supabase

```
# Pooler (para queries normais - adiciona ?pgbouncer=true)
DATABASE_URL="postgresql://postgres.PROJETO_ID:[SENHA]@aws-1-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direta (para migrações - SEM pgbouncer)
DIRECT_URL="postgresql://postgres.PROJETO_ID:[SENHA]@aws-1-south-1.pooler.supabase.com:5432/postgres"
```

> ⚠️ Substitua `PROJETO_ID` e `[SENHA]` pelos valores reais do seu Supabase.
> A região pode variar (south-1, east-1, etc).