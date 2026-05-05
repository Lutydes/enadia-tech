# Task 1 — Remove Phase System + Add Microarea/Element CRUD APIs

## Agent: full-stack-developer

## Work Completed

### Part A: Clean up Phase System
- Removed `PhaseConfig` model from `prisma/schema.prisma`
- Deleted `/api/phases/` folder (route.ts + [id]/route.ts)
- Removed `/api/phases` from `PUBLIC_API_ROUTES` in `src/middleware.ts`
- Simplified `src/hooks/usePhaseAccess.ts` — only exports `hasFeature: () => true` and `isViewEnabled: () => true`
- Ran `bun run db:push --accept-data-loss` — PhaseConfig table dropped, database synced

### Part B: Microarea/Element CRUD APIs
- **`/api/microareas/route.ts`**: GET (list, public) + POST (create, MASTER only)
- **`/api/microareas/[id]/route.ts`**: GET (single with elements+counts) + PUT (MASTER) + DELETE (MASTER, cascade)
- **`/api/elements/route.ts`**: GET (list with filters, public) + POST (create, MASTER only)
- **`/api/elements/[id]/route.ts`**: GET + PUT (MASTER) + DELETE (MASTER)

### Part C: Fix MASTER Question Deletion
- `/api/questions/[id]/route.ts` DELETE: MASTER bypasses RASCUNHO/REPROVADA status check

### Part D: Fix dissertativa question creation
- `/api/questions/route.ts` POST: Only requires `statement + microareaId`; OBJETIVA additionally requires alternatives
- Alternatives creation is conditional, allowing DISSERTATIVA without alternatives

## Status: ✅ Complete
