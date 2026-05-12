# Task 2 — Fix Professor User Access

## Agent: full-stack-developer

## Summary
Fixed three root causes preventing professor users from accessing the system properly.

## Changes Made

### 1. `src/store/app-store.ts` — restoreSession panel auto-set
- **Problem**: After page refresh, `restoreSession` fetched the user but didn't set `currentPanel` based on role. The panel defaulted to `'student'`, so professors saw the student view instead of ProfessorPanel.
- **Fix**: Added auto-detection of panel based on user role in `restoreSession`:
  - `MASTER` → `'master'`
  - `PROFESSOR` → `'professor'`
  - `ALUNO` → `'student'`

### 2. `src/store/app-store.ts` — Persist currentPanel
- **Problem**: `currentPanel` was not included in the Zustand persist `partialize` config, so it was never saved to localStorage. Even after setting it, a page refresh would lose it.
- **Fix**: Added `currentPanel: state.currentPanel` to the `partialize` function.

### 3. `src/app/api/questions/[id]/test/route.ts` — New route created
- **Problem**: ProfessorPanel's `handleSaveAndTest` function POSTs to `/api/questions/${questionId}/test`, but this route didn't exist. The POST would fail with a 404.
- **Fix**: Created the missing route with:
  - PROFESSOR/MASTER role requirement
  - Ownership validation (professors can only test their own questions)
  - Status validation (only RASCUNHO/AGUARDANDO_TESTE → EM_TESTE transition)
  - Proper error handling consistent with other routes

## Investigation Results
- Seed data is correct (professor@seuemail.com.br / prof123, role PROFESSOR, active true)
- Login flow works correctly — LoginForm calls `setPanel('professor')` after PROFESSOR login
- page.tsx correctly renders ProfessorPanel when `currentPanel === 'professor' && user.role === 'PROFESSOR'`
- ProfessorPanel does NOT access `/api/auth/users` (MASTER-only route) — no issue there
- All ProfessorPanel API calls (`/api/questions`, `/api/microareas`, `/api/dashboard/collective`, `/api/ranking`) support PROFESSOR role
