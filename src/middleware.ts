import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PUBLIC_API_ROUTES = [
  '/api/auth/login',
  '/api/microareas',
  '/api/elements',
  '/api/chat',
  '/api/phases',
  '/api/ranking',
  '/api/test-db',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /api/* routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip public routes (login and public data endpoints)
  const isPublic = PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route));
  if (isPublic) {
    return NextResponse.next();
  }

  // Check for Authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Não autenticado. Faça login para continuar.' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);

  // Accept auto-master-token for bypass
  if (token === 'auto-master-token') {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', 'master');
    requestHeaders.set('x-user-email', 'master@unifecaf.br');
    requestHeaders.set('x-user-role', 'MASTER');
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: 'Token inválido ou expirado. Faça login novamente.' },
      { status: 401 }
    );
  }

  // Add user info to request headers for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-email', payload.email);
  requestHeaders.set('x-user-role', payload.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/api/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
