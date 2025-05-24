
import { readFile } from 'fs/promises';
import { join } from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import nodemailer from 'nodemailer';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { pedido, fecha_entrega, notas, correo } = req.body;

    const pdfPath = join(process.cwd(), 'public', 'actualizacion_pedido_hm_editable.pdf');
    const existingPdfBytes = await readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPage(0);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;
    const color = rgb(0, 0, 0);
    const altura = 841.89;

    // Coordenadas corregidas
    page.drawText(pedido, { x: 49.90, y: altura - 107.01, size: fontSize, font, color });
    page.drawText(fecha_entrega, { x: 67.80, y: altura - 116.35, size: fontSize, font, color });
    page.drawText(notas || '', { x: 47.53, y: altura - 125.45, size: fontSize, font, color });

    const pdfBytes = await pdfDoc.save();

    // Configurar transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hmencuadernaciones@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: 'HM Encuadernaciones <hmencuadernaciones@gmail.com>',
      to: correo,
      subject: 'Actualización de su pedido | HM Encuadernaciones',
      text: 'Estimado cliente, adjuntamos el estado actualizado de su pedido. Saludos cordiales.',
      attachments: [{
        filename: 'actualizacion_pedido.pdf',
        content: Buffer.from(pdfBytes),
        contentType: 'application/pdf'
      }]
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
