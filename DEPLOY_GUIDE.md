# 🚀 Guia de Deploy — EnadIA (Netlify + Supabase)

## Arquitetura

```
┌───────────────────────────────────────────────────────────┐
│                    SUPABASE (1 banco)                      │
│                                                             │
│  📋 Questões, Microareas, Elements   ← COMPARTILHADAS      │
│  👥 Users (coluna "instance")        ← ISOLADAS            │
│  📊 Responses (referenciam user)     ← ISOLADAS            │
│  🏆 Ranking (calculado por instance) ← ISOLADAS            │
│                                                             │
│  instance = 'ENADIA'   → Site 1                            │
│  instance = 'FECAP'    → Site 2                            │
│  instance = 'UNIFECAF' → Site 3                            │
└───────────────────────────────────────────────────────────┘
        │                    │                    │
   ┌────▼─────┐        ┌─────▼──────┐      ┌──────▼───────┐
   │ NETLIFY  │        │  NETLIFY   │      │   NETLIFY    │
   │ Site 1   │        │  Site 2    │      │   Site 3     │
   │ EnadIA   │        │  EnadIA    │      │   EnadIA     │
   │ (geral)  │        │  FECAP     │      │   UNIFECAF   │
   └──────────┘        └────────────┘      └──────────────┘
```

## Status atual (2026-08-23)

- ✅ Projeto Supabase já existe e está com o schema novo aplicado (`prisma db push` com `prisma/schema.supabase.prisma`)
- ✅ 15 microáreas seedadas
- ✅ Contas existentes reimportadas: 6 alunos + 1 master em `FECAP`, 1 master em `UNIFECAF`
- ⬜ Sites do Netlify: a criar

Isso significa que **PASSO 1 e PASSO 2 abaixo já foram feitos** para este projeto — deixados aqui só como referência caso precise recriar do zero no futuro (ex: outro Supabase, outro cliente).

---

## PASSO 0 — Schemas Prisma (já configurado, não precisa fazer nada)

O projeto tem 2 schemas Prisma:
- `prisma/schema.prisma` → SQLite (desenvolvimento local, `npm run dev`)
- `prisma/schema.supabase.prisma` → PostgreSQL (produção, Supabase)

O `netlify.toml` já roda `npx prisma generate --schema=prisma/schema.supabase.prisma` no build, então o site em produção sempre usa o schema do Postgres automaticamente — **não precisa copiar/trocar arquivos antes do deploy**.

---

## PASSO 1 — Criar o projeto no Supabase (referência — já feito)

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Anote a **senha** do banco (você vai precisar)
3. Vá em **Settings → Database → Connect → Direct connection**
4. Copie a connection string (direta, porta 5432)

## PASSO 2 — Criar o schema (referência — já feito)

Não use o arquivo `supabase/migration.sql` manualmente — ele ficou desatualizado (nomes de tabela em `snake_case` incompatíveis com o Prisma). Em vez disso, rode direto do terminal:

```bash
DATABASE_URL="postgresql://postgres:[SENHA]@db.[PROJETO_ID].supabase.co:5432/postgres" \
DIRECT_URL="postgresql://postgres:[SENHA]@db.[PROJETO_ID].supabase.co:5432/postgres" \
npx prisma db push --schema=prisma/schema.supabase.prisma
```

Isso cria as tabelas exatamente como o Prisma espera (evita qualquer divergência entre schema SQL escrito à mão e o schema real).

## PASSO 3 — Criar os 3 sites no Netlify

Para cada site:
1. Faça login em [netlify.com](https://netlify.com)
2. **Add new site → Import an existing project → GitHub**
3. Conecte o repositório `enadia-tech` (mesmo repo e mesma branch nos 3 sites)
4. Configure as variáveis de ambiente do site correspondente (veja abaixo)
5. Deploy

---

## Variáveis de Ambiente (Netlify → Site Settings → Environment Variables)

### Comuns aos 3 sites:
| Variável | Valor | Descrição |
|----------|-------|------------|
| `DATABASE_URL` | `postgresql://postgres:[SENHA]@db.[PROJETO_ID].supabase.co:5432/postgres` | Connection string do Supabase |
| `DIRECT_URL` | (igual ao `DATABASE_URL`) | Usada por migrações do Prisma |
| `GROQ_API_KEY` | `gsk_...` | Chave da API do Groq (console.groq.com/keys) — pode ser a mesma nos 3 sites |

### Site 1 — EnadIA (geral):
| Variável | Valor |
|----------|-------|
| `APP_INSTANCE` | `ENADIA` |
| `JWT_SECRET` | chave única gerada para esse site (não reutilizar) |
| `NEXT_PUBLIC_APP_NAME` | `EnadIA` |
| `NEXT_PUBLIC_APP_SUBTITLE` | `ENADE Assistant` |
| `NEXT_PUBLIC_APP_BRAND` | `EnadIA TECH` |
| `NEXT_PUBLIC_APP_FOOTER` | `EnadIA TECH` |

### Site 2 — EnadIA FECAP:
| Variável | Valor |
|----------|-------|
| `APP_INSTANCE` | `FECAP` |
| `JWT_SECRET` | chave única gerada para esse site (não reutilizar) |
| `NEXT_PUBLIC_APP_NAME` | `EnadIA` |
| `NEXT_PUBLIC_APP_SUBTITLE` | `ENADE Assistant` |
| `NEXT_PUBLIC_APP_BRAND` | `Centro Universitário FECAP` |
| `NEXT_PUBLIC_APP_FOOTER` | `Centro Universitário FECAP` |

### Site 3 — EnadIA UNIFECAF:
| Variável | Valor |
|----------|-------|
| `APP_INSTANCE` | `UNIFECAF` |
| `JWT_SECRET` | chave única gerada para esse site (não reutilizar) |
| `NEXT_PUBLIC_APP_NAME` | `EnadIA` |
| `NEXT_PUBLIC_APP_SUBTITLE` | `ENADE Assistant` |
| `NEXT_PUBLIC_APP_BRAND` | `UNIFECAF` |
| `NEXT_PUBLIC_APP_FOOTER` | `UNIFECAF` |

> As 3 chaves `JWT_SECRET` foram geradas e compartilhadas fora deste arquivo (não devem ser commitadas em lugar nenhum). Guarde-as em local seguro (gerenciador de senhas ou nas próprias configurações do Netlify).

---

## Como funciona o isolamento

- Quando um aluno se cadastra, a coluna `instance` recebe `APP_INSTANCE` (ex: `FECAP`)
- O token JWT inclui o `instance` do usuário
- Todas as queries de ranking, dashboard e relatórios filtram por `instance`
- Um aluno do site FECAP **nunca** aparece no ranking do site ENADIA ou UNIFECAF
- Questões e microáreas são **compartilhadas** entre os três sites

---

## Testar localmente contra o Supabase (opcional)

```bash
DATABASE_URL="postgresql://postgres:[SENHA]@db.[PROJETO_ID].supabase.co:5432/postgres" \
DIRECT_URL="postgresql://postgres:[SENHA]@db.[PROJETO_ID].supabase.co:5432/postgres" \
npx prisma generate --schema=prisma/schema.supabase.prisma

DATABASE_URL="postgresql://postgres:[SENHA]@db.[PROJETO_ID].supabase.co:5432/postgres" \
npm run dev
```

> ⚠️ Nunca coloque a connection string real do Supabase no `.env` que vai para o Git — use apenas localmente ou nas variáveis de ambiente do Netlify.
