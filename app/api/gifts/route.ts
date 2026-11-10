import { NextResponse } from 'next/server';
import { getGifts } from '@/lib/sheets';
import { isAuthenticated } from '@/lib/session';

// Always fetch fresh data from the sheet. Without this, when SKIP_AUTH=true
// the handler never touches cookies(), so Next.js would prerender it once at
// build time and serve a stale snapshot forever.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const gifts = await getGifts();
    return NextResponse.json(gifts);
  } catch (error) {
    console.error('Error fetching gifts:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar presentes' },
      { status: 500 }
    );
  }
}
