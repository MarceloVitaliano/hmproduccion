import { google } from "googleapis";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }

  const { nombre, pedido, fechaEntrega, notas, correo } = req.body;

  try {
    // Leer el PDF base
    const pdfPath = path.resolve("./public/actualizacion_pedido_hm_editable.pdf");
    const existingPdfBytes = fs.readFileSync(pdfPath);

    // Cargar PDF y modificar
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const font = await pdfDoc.embedFont(PDFDocument.PDFFont.Helvetica);
    const size = 12;

    firstPage.drawText(pedido, { x: 49.9, y: 660, size, font });
    firstPage.drawText(fechaEntrega, { x: 67.8, y: 640, size, font });
    firstPage.drawText(notas, { x: 47.5, y: 620, size, font });

    const pdfBytes = await pdfDoc.save();

    // Configurar transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"HM Encuadernaciones" <${process.env.GMAIL_USER}>`,
      to: correo,
      subject: "Actualización de su pedido | HM Encuadernaciones",
      text: `Hola ${nombre}, te compartimos la actualización de tu pedido.`,
      attachments: [
        {
          filename: "actualizacion_pedido.pdf",
          content: pdfBytes,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error al enviar PDF:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}
