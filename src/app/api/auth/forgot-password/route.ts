import { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Always return success to prevent email enumeration
    // In production, this would send a password reset email
    if (email) {
      // Check if user exists (but don't reveal this to the client)
      // const user = await db.user.findUnique({ where: { email } });
      // if (user) { sendResetEmail(user.email); }
    }

    return jsonResponse({
      message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    // Still return success to prevent enumeration
    return jsonResponse({
      message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.',
    });
  }
}
