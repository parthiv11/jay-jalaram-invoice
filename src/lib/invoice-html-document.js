import { INVOICE_DOCUMENT_STYLES } from "./invoice-document-styles";

export function buildInvoiceHtmlDocument(invoiceHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tax Invoice</title>
  <style>${INVOICE_DOCUMENT_STYLES}</style>
</head>
<body>
  <div class="invoice">${invoiceHtml}</div>
</body>
</html>`;
}

export function buildInvoicePdfFilename(data) {
  const invoiceNumber = String(data?.inv?.number || "Invoice").trim();
  const buyerName = String(data?.buyer?.name || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w.-]/g, "");

  if (buyerName) {
    return `Tax_Invoice_${buyerName}_${invoiceNumber}.pdf`;
  }

  return `Tax_Invoice_${invoiceNumber}.pdf`;
}