export const INVOICE_DOCUMENT_STYLES = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  width: 210mm;
  margin: 0;
  padding: 0;
  background: #fff;
  color: #000;
  font-family: Arial, Helvetica, sans-serif;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.invoice {
  background: #fff;
  width: 100%;
  max-width: 210mm;
  min-height: auto;
  padding: 6mm 7mm;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 10.5px;
  color: #000;
  line-height: 1.4;
  margin: 0;
}

.inv-thankyou {
  text-align: center;
  font-size: 9.5px;
  color: #444;
  margin-bottom: 6px;
  font-style: italic;
  letter-spacing: 0.2px;
}

.inv-sheet { border: 2px solid #000; }

.inv-header-wrap {
  padding: 10px 12px 8px;
  text-align: center;
  border-bottom: 1.5px solid #000;
}
.inv-seller-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
  line-height: 1.2;
}
.inv-seller-addr { font-size: 10px; color: #333; margin-bottom: 2px; }
.inv-seller-phone { font-size: 10px; font-weight: 600; margin: 3px 0 4px; }
.inv-seller-meta { font-size: 9.5px; margin-top: 3px; }
.state-chip {
  display: inline-block;
  border: 1px solid #000;
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 6px;
  font-size: 9px;
}

.inv-type-row {
  background: #d9ebff;
  border-bottom: 1px solid #000;
  padding: 6px 10px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
}
.inv-type-title {
  grid-column: 2;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
  text-align: center;
}
.inv-type-note {
  grid-column: 3;
  justify-self: end;
  font-style: italic;
  font-size: 10px;
  text-align: right;
  white-space: nowrap;
}

.inv-meta {
  display: grid;
  grid-template-columns: 55% 45%;
  border-bottom: 1px solid #000;
}
.inv-meta-left { padding: 6px 10px; }
.inv-meta-right {
  padding: 6px 10px;
  border-left: 1px solid #000;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.inv-meta-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 10px;
  font-weight: 600;
  width: 100%;
}
.inv-meta-row .val { font-weight: 700; }
.inv-dtable { width: 100%; font-size: 9.5px; border-collapse: collapse; }
.inv-dtable tr td { padding: 2px 3px; vertical-align: top; }
.inv-dtable tr td:first-child { font-weight: 600; white-space: nowrap; width: 58%; }
.inv-dtable tr td:last-child { font-weight: 700; text-align: right; }

.inv-receiver { border-bottom: 1px solid #000; }
.inv-receiver-title {
  font-weight: bold;
  font-size: 10.5px;
  padding: 4px 8px;
  background: #d9ebff;
  border-bottom: 1px solid #000;
  text-align: center;
}
.inv-receiver-body { padding: 6px 10px; }
.inv-rgrid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2px 10px;
  font-size: 9.5px;
}
.inv-rgrid .lbl { font-weight: bold; white-space: nowrap; }

.inv-items {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 9.5px;
  border-bottom: 1px solid #000;
}
.inv-items th, .inv-items td {
  border: 1px solid #000;
  padding: 3px 5px;
  text-align: center;
  vertical-align: middle;
}
.inv-items th {
  background: #d9ebff;
  font-weight: bold;
  font-size: 9px;
  line-height: 1.3;
}
.inv-items td.al { text-align: left; }
.inv-items td.ar { text-align: right; }
.inv-items td.taxable-col { background: #d9ebff; font-weight: 600; }
.inv-items tfoot td { font-weight: bold; background: #d9ebff; }

.inv-bottom {
  border-bottom: 1px solid #000;
  display: grid;
  grid-template-columns: 55% 45%;
}
.inv-words-bank {
  padding: 7px 10px;
  border-right: 1px solid #000;
  font-size: 9.5px;
}
.inv-words-label { font-weight: bold; font-size: 10px; text-align: center; }
.inv-words-text { font-weight: 700; margin-top: 2px; font-size: 10px; text-align: center; }

.inv-bank-title {
  font-weight: bold;
  font-size: 10px;
  margin-top: 8px;
  margin-bottom: 4px;
  color: #1e5aa7;
}
.inv-bgrid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2px 6px;
  font-size: 9px;
}
.inv-bgrid .lbl { font-weight: bold; }

.inv-summary { padding: 0; font-size: 9.5px; }
.inv-stbl { width: 100%; border-collapse: collapse; }
.inv-stbl td {
  padding: 4px 6px;
  vertical-align: middle;
  border: 1px solid #000;
}
.inv-stbl td:last-child { text-align: right; font-weight: bold; white-space: nowrap; }
.inv-stbl .head td,
.inv-stbl .total td,
.inv-stbl .final td { background: #d9ebff; font-weight: bold; }
.inv-stbl .bal td { font-weight: bold; }

.inv-footer {
  border-bottom: none;
  display: grid;
  grid-template-columns: 55% 45%;
}
.inv-terms {
  padding: 7px 10px;
  border-right: 1px solid #000;
  font-size: 9px;
  line-height: 1.5;
}
.inv-terms-title { font-weight: bold; margin-bottom: 4px; font-size: 9.5px; }
.inv-certified {
  margin-bottom: 6px;
  font-size: 8.5px;
  color: #444;
  text-align: left;
  font-style: italic;
}

.inv-signatory {
  padding: 7px 10px;
  text-align: center;
  font-size: 9.5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.inv-sig-co { font-weight: bold; font-size: 10px; }
.inv-sig-space { height: 38px; }
.inv-sig-label { font-size: 9px; color: #444; }
.inv-thanks { font-size: 9px; color: #444; margin-top: 6px; text-align: center; font-style: italic; }

@page { margin: 0; size: A4 portrait; }
`;