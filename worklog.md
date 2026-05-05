---
Task ID: 1
Agent: Main Agent
Task: Generate Supabase code, CSV import guide, and Netlify deployment instructions

Work Log:
- Read and analyzed entire project structure (schema, auth, API routes, components, store, middleware)
- Created `prisma/schema.supabase.prisma` with complete PostgreSQL schema (including EssayAnswer, Modalidade enum, all User fields)
- Kept `prisma/schema.prisma` as SQLite for local dev compatibility
- Updated `.env` with Supabase variable templates (DATABASE_URL, DIRECT_URL, JWT_SECRET)
- Created `src/app/api/auth/users/csv-import/route.ts` - API endpoint for batch CSV/JSON user import (ALUNO and PROFESSOR)
- Updated `prisma/seed.ts` with all 3 default users (MASTER, PROFESSOR, ALUNO)
- Created `scripts/migrate-to-supabase.ts` - migration script with export/import commands
- Created `csv-templates/alunos-template.csv` and `csv-templates/professores-template.csv`
- Created `netlify.toml` with Next.js plugin config and CORS headers
- Updated `next.config.ts` with image remote patterns
- Created comprehensive `DEPLOY_GUIDE.md` covering Supabase setup, DB migration, CSV import, Netlify deploy
- Fixed lint by adding `upload/**` to eslint ignores
- Regenerated Prisma Client for SQLite compatibility

Stage Summary:
- All Supabase-ready code is in place but NOT active yet (SQLite schema still active for local dev)
- To migrate: copy schema.supabase.prisma → schema.prisma, set .env, run prisma generate + db push
- CSV import endpoint available at POST /api/auth/users/csv-import (MASTER only)
- Complete deploy guide in DEPLOY_GUIDE.md
- Local dev still works with SQLite
