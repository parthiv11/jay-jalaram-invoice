import { D } from './data.js';
import { calcItem, calcTotals } from './calculations.js';
import { n2w } from './utils.js';

export function downloadPDF() {
  const inv = document.getElementById('invoice').outerHTML;
  const w = window.open('', '_blank', 'width=900,height=750');
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head>
  <meta charset="UTF-8">
  <title>Invoice ${D.inv.number}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{padding:10mm;background:#fff;font-family:Arial,Helvetica,sans-serif}
    .invoice{background:#fff;width:750px;min-height:1060px;padding:14px 16px 16px;font-size:10.5px;color:#000;line-height:1.4;margin:0 auto}
    .inv-thankyou{text-align:center;font-size:9.5px;color:#444;margin-bottom:6px;font-style:italic;letter-spacing:.2px}
    .inv-sheet{border:2px solid #000}
    .inv-header-wrap{padding:10px 12px 8px;text-align:center;border-bottom:1.5px solid #000}
    .inv-seller-name{font-size:16px;font-weight:bold;margin-bottom:4px;line-height:1.2}
    .inv-seller-addr{font-size:10px;color:#333;margin-bottom:2px}
    .inv-seller-phone{font-size:10px;font-weight:600;margin:3px 0 4px}
    .inv-seller-meta{font-size:9.5px;margin-top:3px}
    .state-chip{display:inline-block;border:1px solid #000;padding:1px 6px;border-radius:4px;margin-left:6px;font-size:9px}
    .inv-type-row{background:#d9ebff;border-bottom:1px solid #000;padding:6px 10px;text-align:center;position:relative}
    .inv-type-title{font-size:16px;font-weight:bold;letter-spacing:1px}
    .inv-type-note{position:absolute;right:10px;top:50%;transform:translateY(-50%);font-style:italic;font-size:10px}
    .inv-meta{display:grid;grid-template-columns:55% 45%;border-bottom:1px solid #000}
    .inv-meta-left{padding:6px 10px}
    .inv-meta-right{padding:6px 10px;border-left:1px solid #000;display:flex;align-items:flex-start;justify-content:space-between}
    .inv-meta-row{display:flex;justify-content:space-between;gap:10px;font-size:10px;font-weight:600;width:100%}
    .inv-meta-row .val{font-weight:700}
    .inv-dtable{width:100%;font-size:9.5px;border-collapse:collapse}
    .inv-dtable tr td{padding:2px 3px;vertical-align:top}
    .inv-dtable tr td:first-child{font-weight:600;white-space:nowrap;width:58%}
    .inv-dtable tr td:last-child{font-weight:700;text-align:right}
    .inv-receiver{border-bottom:1px solid #000}
    .inv-receiver-title{font-weight:bold;font-size:10.5px;padding:4px 8px;background:#d9ebff;border-bottom:1px solid #000;text-align:center}
    .inv-receiver-body{padding:6px 10px}
    .inv-rgrid{display:grid;grid-template-columns:auto 1fr;gap:2px 10px;font-size:9.5px}
    .inv-rgrid .lbl{font-weight:bold;white-space:nowrap}
    .inv-items{width:100%;border-collapse:collapse;font-size:9.5px;border-bottom:1px solid #000}
    .inv-items th,.inv-items td{border:1px solid #000;padding:3px 5px;text-align:center;vertical-align:middle}
    .inv-items th{background:#d9ebff;font-weight:bold;font-size:9px;line-height:1.3}
    .inv-items td.al{text-align:left}
    .inv-items td.ar{text-align:right}
    .inv-items td.taxable-col{background:#d9ebff;font-weight:600}
    .inv-items tfoot td{font-weight:bold;background:#d9ebff}
    .inv-bottom{border-bottom:1px solid #000;display:grid;grid-template-columns:55% 45%}
    .inv-words-bank{padding:7px 10px;border-right:1px solid #000;font-size:9.5px}
    .inv-words-label{font-weight:bold;font-size:10px;text-align:center}
    .inv-words-text{font-weight:700;margin-top:2px;font-size:10px;text-align:center}
    .inv-bank-title{font-weight:bold;font-size:10px;margin-top:8px;margin-bottom:4px;color:#1e5aa7;display:flex;align-items:center;gap:5px}
    .inv-bgrid{display:grid;grid-template-columns:auto 1fr;gap:2px 6px;font-size:9px}
    .inv-bgrid .lbl{font-weight:bold}
    .inv-summary{padding:0;font-size:9.5px}
    .inv-stbl{width:100%;border-collapse:collapse}
    .inv-stbl td{padding:4px 6px;vertical-align:middle;border:1px solid #000}
    .inv-stbl td:last-child{text-align:right;font-weight:bold;white-space:nowrap}
    .inv-stbl .head td,.inv-stbl .total td,.inv-stbl .final td{background:#d9ebff;font-weight:bold}
    .inv-stbl .bal td{font-weight:bold}
    .inv-footer{display:grid;grid-template-columns:55% 45%}
    .inv-terms{padding:7px 10px;border-right:1px solid #000;font-size:9px;line-height:1.5}
    .inv-terms-title{font-weight:bold;margin-bottom:4px;font-size:9.5px}
    .inv-certified{margin-bottom:6px;font-size:8.5px;color:#444;text-align:left;font-style:italic}
    .inv-signatory{padding:7px 10px;text-align:center;font-size:9.5px;display:flex;flex-direction:column;justify-content:space-between}
    .inv-sig-co{font-weight:bold;font-size:10px}
    .inv-sig-space{height:38px}
    .inv-sig-label{font-size:9px;color:#444}
    .inv-thanks{font-size:9px;color:#444;margin-top:6px;text-align:center;font-style:italic}
    @page{margin:10mm;size:A4}
  </style>
  </head><body>${inv}
  <script>window.onload=function(){window.print();setTimeout(()=>window.close(),800)}<\/script>
  </body></html>`);
  w.document.close();
}

export function downloadExcel() {
  const T = calcTotals();
  const wb = XLSX.utils.book_new();
  const s = D.seller;
  const iv = D.inv;
  const b = D.buyer;
  const bk = D.bank;

  const rows = [
    ['TAX INVOICE'],
    [],
    ['SELLER INFORMATION', '', '', '', 'INVOICE DETAILS'],
    ['Company Name', s.name, '', '', 'Invoice No.', iv.number],
    ['Address', s.address, '', '', 'Invoice Date', iv.date],
    ['Phone', s.phone, '', '', 'State', iv.state],
    ['GSTIN', s.gstin, '', '', 'Reverse Charge', iv.rc],
    ['State Code', s.stateCode, '', '', 'Vehicle Number', iv.vehicle],
    ['PAN', s.pan],
    [],
    ['BUYER / RECEIVER INFORMATION'],
    ['Name', b.name],
    ['Address', b.address],
    ['GSTIN', b.gstin],
    ['State Code', b.stateCode],
    ['State', b.state],
    [],
    ['ITEMS'],
    ['Sr.', 'Product Name', 'Description', 'QTY', 'Unit', 'Rate (₹)', 'Taxable Value', 'CGST %', 'CGST Amt', 'SGST %', 'SGST Amt', 'Total'],
    ...D.items.map((it, i) => {
      const c = calcItem(it);
      return [
        i + 1,
        it.name,
        it.desc,
        it.qty,
        it.unit,
        it.rate,
        c.taxable,
        it.cgst,
        c.cgstAmt,
        it.sgst,
        c.sgstAmt,
        c.total
      ];
    }),
    ['', 'TOTAL', '', T.qty, '', '', T.taxable, '', T.cgst, '', T.sgst, T.final],
    [],
    ['SUMMARY'],
    ['Total Amount Before Tax', T.taxable],
    ['Add: CGST', T.cgst],
    ['Add: SGST', T.sgst],
    ['Total Tax Amount', T.tax],
    ['Final Invoice Amount', T.final],
    ['Amount Paid', D.paid],
    ['Balance Due', T.bal],
    [],
    ['BANK DETAILS'],
    ['Account Name', bk.accName],
    ['Account No.', bk.accNo],
    ['IFSC Code', bk.ifsc],
    ['Bank Name', bk.bank],
    ['Branch Name', bk.branch],
    ['Swift Code', bk.swift],
    [],
    ['Amount in Words', n2w(T.final)]
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [
    { wch: 20 }, { wch: 32 }, { wch: 22 }, { wch: 8 }, { wch: 8 },
    { wch: 14 }, { wch: 16 }, { wch: 8 }, { wch: 14 }, { wch: 8 }, { wch: 14 }, { wch: 16 }
  ];

  if (!ws['A1'].s) ws['A1'].s = {};
  ws['A1'].s = { font: { bold: true, sz: 14 } };

  XLSX.utils.book_append_sheet(wb, ws, 'Invoice');
  XLSX.writeFile(wb, `Invoice_${iv.number}_${b.name.replace(/\s+/g, '_')}.xlsx`);
}
