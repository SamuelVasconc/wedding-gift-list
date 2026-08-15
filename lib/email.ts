import nodemailer from 'nodemailer';

function getOwnerEmails(): string[] {
  return (process.env.OWNER_EMAILS || '')
    .split(',')
    .map((email) => email.trim())
    .filter((email) => email !== '');
}

function getTransporter() {
  const user = process.env.SMTP_USER;
  // O Google exibe a senha de app como "abcd efgh ijkl mnop"; os espaços não fazem parte dela.
  const pass = process.env.SMTP_PASSWORD?.replace(/\s/g, '');

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user, pass },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Notifies the site owners that a gift was reserved.
 * Never throws: a failure here must not undo a reservation that already
 * succeeded in the spreadsheet.
 */
export async function sendGiftClaimedEmail(
  giftName: string,
  claimedBy: string
): Promise<void> {
  const owners = getOwnerEmails();

  if (owners.length === 0) {
    console.warn('OWNER_EMAILS não configurado, e-mail de reserva não enviado');
    return;
  }

  const transporter = getTransporter();

  if (!transporter) {
    console.warn('SMTP_USER/SMTP_PASSWORD não configurados, e-mail de reserva não enviado');
    return;
  }

  const dataHora = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: owners,
      subject: `Presente reservado: ${giftName}`,
      text: [
        'Um presente acabou de ser reservado na lista!',
        '',
        `Presente: ${giftName}`,
        `Reservado por: ${claimedBy}`,
        `Quando: ${dataHora}`,
      ].join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; color: #374151; line-height: 1.6;">
          <h2 style="color: #73a66c; margin-bottom: 16px;">Um presente foi reservado!</h2>
          <p style="margin: 4px 0;"><strong>Presente:</strong> ${escapeHtml(giftName)}</p>
          <p style="margin: 4px 0;"><strong>Reservado por:</strong> ${escapeHtml(claimedBy)}</p>
          <p style="margin: 4px 0;"><strong>Quando:</strong> ${escapeHtml(dataHora)}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Erro ao enviar e-mail de reserva:', error);
  }
}
