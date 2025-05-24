
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { pedido, fecha_entrega, notas } = await req.json();

    const existingPdfBytes = await readFile(join(process.cwd(), 'public', 'actualizacion_pedido_hm_editable.pdf'));
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const page = pages[0];

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;
    const color = rgb(0, 0, 0);

    // Altura total de página A4 en puntos
    const altura = 841.89;

    // Coordenadas corregidas
    page.drawText(pedido, { x: 49.90, y: altura - 107.01, size: fontSize, font, color });
    page.drawText(fecha_entrega, { x: 67.80, y: altura - 116.35, size: fontSize, font, color });
    page.drawText(notas, { x: 47.53, y: altura - 125.45, size: fontSize, font, color });

    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="actualizacion_pedido.pdf"',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
