import { NextRequest, NextResponse } from 'next/server';
import { claimGift } from '@/lib/sheets';
import { sendGiftClaimedEmail } from '@/lib/email';
import { isAuthenticated } from '@/lib/session';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { nome } = await request.json();

    if (!nome || nome.trim() === '') {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    const result = await claimGift(id, nome.trim());

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 409 }
      );
    }

    // A planilha já foi atualizada: o e-mail é best-effort e nunca falha a reserva.
    await sendGiftClaimedEmail(result.giftName || id, nome.trim());

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error claiming gift:', error);
    return NextResponse.json(
      { error: 'Erro ao reservar presente' },
      { status: 500 }
    );
  }
}
