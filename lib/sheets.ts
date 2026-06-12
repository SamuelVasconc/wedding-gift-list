import { google } from 'googleapis';
import { Gift } from './types';

const SHEET_NAME = 'Presentes';

function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

export async function getGifts(): Promise<Gift[]> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A2:F`,
  });

  const rows = response.data.values || [];

  return rows.map((row) => ({
    id: row[0] || '',
    nome: row[1] || '',
    descricao: row[2] || '',
    imagemUrl: row[3] || '',
    status: (row[4] || 'disponivel') as 'disponivel' | 'reservado',
    reservadoPor: row[5] || '',
  }));
}

export async function claimGift(giftId: string, nome: string): Promise<{ success: boolean; error?: string }> {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  try {
    // First, get all gifts to find the row index
    const gifts = await getGifts();
    const giftIndex = gifts.findIndex((g) => g.id === giftId);

    if (giftIndex === -1) {
      return { success: false, error: 'Presente não encontrado' };
    }

    const gift = gifts[giftIndex];

    // Check if already reserved
    if (gift.status === 'reservado') {
      return { success: false, error: 'Alguém acabou de presentear antes de você!' };
    }

    // Update the row (add 2 because: 1 for 0-index, 1 for header row)
    const rowNumber = giftIndex + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!E${rowNumber}:F${rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['reservado', nome]],
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error claiming gift:', error);
    return { success: false, error: 'Erro ao presentear' };
  }
}
