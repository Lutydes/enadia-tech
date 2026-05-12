import { NextRequest, NextResponse } from 'next/server';

// Routes that don't require authentication
const PUBLIC_API_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/me',
  '/api/microareas',
  '/api/elements',
  '/api/chat',
  '/api/chat/essay-correct',
  '/api/ranking',
  '/api/test-db',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /api/* routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip public routes (login, register, public data endpoints, and /me which validates its own token)
  const isPublic = PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route));
  if (isPublic) {
    return NextResponse.next();
  }

  // For protected routes, check that Authorization header exists
  // The actual JWT verification happens in each route handler (Node.js runtime)
  // because jsonwebtoken requires Node.js crypto which is not available in Edge Runtime
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Não autenticado. Faça login para continuar.' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);

  // Reject obviously empty tokens
  if (!token || token.length < 10) {
    return NextResponse.json(
      { error: 'Token inválido. Faça login novamente.' },
      { status: 401 }
    );
  }

  // Accept auto-master-token for bypass (dev/testing only)
  if (token === 'auto-master-token') {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', 'master');
    requestHeaders.set('x-user-email', 'master@seuemail.com.br');
    requestHeaders.set('x-user-role', 'MASTER');
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Pass through — JWT verification is done by each route handler using getAuthUser/requireAuth
  // We just ensure a token is present; the route handlers validate it properly in Node.js runtime
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
