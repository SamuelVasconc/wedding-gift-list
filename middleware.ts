import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData } from './lib/session';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

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
  matcher: '/gifts/:path*',
};
