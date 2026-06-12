import { NextResponse } from 'next/server';
import { getGifts } from '@/lib/sheets';
import { isAuthenticated } from '@/lib/session';

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
