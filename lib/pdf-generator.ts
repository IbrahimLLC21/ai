// lib/pdf-generator.ts
import { PDFDocument, rgb } from "pdf-lib";

export async function generatePDF(jobDescription: string, personalInfo: string): Promise<string> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const { height } = page.getSize();

  page.drawText(`Job Description:\n${jobDescription}`, {
    x: 50,
    y: height - 100,
    size: 12,
    color: rgb(0, 0, 0),
  });

  page.drawText(`\n\nPersonal Information:\n${personalInfo}`, {
    x: 50,
    y: height - 200,
    size: 12,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  const pdfBase64 = Buffer.from(pdfBytes).toString("base64");
  const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;

  return pdfDataUri;
}
