# Task 2 - Auth API Routes

## Agent: full-stack-developer

## Work Summary

Created and updated all authentication API routes for the EnadIA project, adding support for new user fields (curso, periodo, modalidade, disciplina).

## Files Created
- `src/app/api/auth/register/route.ts` - New registration endpoint
- `src/app/api/auth/forgot-password/route.ts` - New forgot password endpoint

## Files Updated
- `src/app/api/auth/login/route.ts` - Added new fields to response
- `src/app/api/auth/me/route.ts` - Added new fields to select
- `src/app/api/auth/users/route.ts` - Added new fields to GET and POST
- `src/app/api/auth/users/[id]/route.ts` - Added new fields to GET, PUT

## Key Details

### Register Endpoint
- Validates: name, email, password, ra (required for both roles)
- ALUNO: requires curso and periodo, modalidade defaults to PRESENCIAL
- PROFESSOR: requires disciplina
- Checks for duplicate email and RA
- Returns user + JWT token (same format as login)

### Forgot Password Endpoint
- Always returns success to prevent email enumeration
- Placeholder for future email integration

### All Updated Endpoints
- Added curso, periodo, modalidade, disciplina to all select queries and responses
- PUT endpoint on users/[id] supports updating all new fields
