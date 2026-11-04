import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData } from './lib/session';
import { isAuthBypassed } from './lib/auth-bypass';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (isAuthBypassed()) {
    // Skip the password screen entirely
    if (request.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/gifts', request.url));
    }
    return response;
  }

  // Only protect /gifts route
  if (request.nextUrl.pathname.startsWith('/gifts')) {
    try {
      const session = await getIronSession<SessionData>(
        request,
        response,
        {
          password: process.env.SESSION_SECRET!,
          cookieName: 'wedding-gift-session',
          cookieOptions: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: undefined,
            sameSite: 'lax',
            path: '/',
          },
        }
      );

      if (!session.isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/gifts/:path*', '/login'],
};
