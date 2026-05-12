# Task 5-6: Update store, page, ranking, sidebar

## Work Summary

### 1. app-store.ts - UserData interface updated
Added new fields: `curso`, `periodo`, `modalidade`, `disciplina` to the `UserData` interface.

### 2. page.tsx - Auto-login removed
- Removed the `useEffect` that auto-logged in as MASTER
- Removed unused `login` and `setPanel` from destructured store
- Routing now purely based on `user.role`:
  - No user → `LoginForm`
  - MASTER → `MasterPanel`
  - PROFESSOR → `ProfessorPanel`
  - ALUNO → Student view (sidebar + chat)

### 3. RankingAlunos.tsx - ALUNO-only + detail badges
- Updated `RankingEntry` interface with `curso`, `modalidade`, `periodo` fields
- Table rows now show curso and modalidade as colored badges below the name
- Podium cards now show curso and modalidade badges below the name

### 4. Ranking API route - ALUNO filter + new fields
- Changed filter from `ALUNO || PROFESSOR` to `ALUNO` only
- Added `curso`, `modalidade`, `periodo` to user select queries
- Added these fields to the response mapping

### 5. JarvisSidebar.tsx - Role-specific info + button text
- ALUNO: shows "curso • período" below name
- PROFESSOR: shows disciplina below name
- MASTER: shows "Gestor Master" below name
- Admin button text: "Painel Gestor" for MASTER, "Painel Professor" for PROFESSOR

## Lint Status
All source files pass lint (pre-existing errors in upload/ directory are unrelated).
