// src/utils/generateInvoicePDF.ts
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

import type { Invoice } from "../types";

// Registrar las fuentes correctamente
// Definir tipos mínimos para evitar 'any'
type PdfMakeType = typeof pdfMake & { vfs: { [file: string]: string } };
type PdfFontsType = typeof pdfFonts & { pdfMake: { vfs: { [file: string]: string } } };
(pdfMake as PdfMakeType).vfs = (pdfFonts as PdfFontsType).pdfMake.vfs;

export const generateInvoicePDF = (
  invoice: Invoice,
  action: "download" | "open" | "print" = "download"
) => {
  const docDefinition: TDocumentDefinitions = {
    content: [
      { text: "ServiCollantas", style: "header" },
      { text: "Factura Electrónica", style: "subheader" },
      { text: `Factura N°: ${invoice.id}`, margin: [0, 20, 0, 10] },
      { text: `Cliente: ${invoice.clientName}` },
      { text: `Email: ${invoice.clientEmail}` },
      { text: `Vehículo: ${invoice.vehicle}`, margin: [0, 0, 0, 20] },
      {
        table: {
          widths: ["*", "auto"],
          body: [
            ["Servicio", "Precio"],
            ...invoice.services.map((s) => [s.name, `$${s.price.toFixed(2)}`]),
            [{ text: "Total", bold: true }, `$${invoice.total.toFixed(2)}`],
          ],
        },
      },
      {
        text: `Fecha: ${new Date(invoice.date).toLocaleString()}`,
        margin: [0, 20, 0, 0],
      },
    ],
    styles: {
      header: { fontSize: 22, bold: true, alignment: "center" },
      subheader: { fontSize: 16, margin: [0, 10, 0, 5], alignment: "center" },
    },
  };

  const pdf = pdfMake.createPdf(docDefinition);

  if (action === "download") {
    pdf.download(`factura-${invoice.id}.pdf`);
  } else if (action === "open") {
    pdf.open();
  } else if (action === "print") {
    pdf.print();
  }
};
