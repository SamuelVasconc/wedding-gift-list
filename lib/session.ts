import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { isAuthBypassed } from './auth-bypass';

export interface SessionData {
  isAuthenticated: boolean;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'wedding-gift-session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: undefined, // Session cookie (expires when browser closes)
    sameSite: 'lax' as const,
    path: '/',
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function isAuthenticated(): Promise<boolean> {
  if (isAuthBypassed()) return true;
  const session = await getSession();
  return session.isAuthenticated === true;
}
