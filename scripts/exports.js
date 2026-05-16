import { D } from './data.js';
import { calcItem, calcTotals } from './calculations.js';
import { n2w } from './utils.js';

export function downloadPDF() {
  const inv = document.getElementById('invoice').innerHTML;
  const w = window.open('', '_blank', 'width=900,height=750');
  w.document.write(`<!DOCTYPE html><html><head>
  <meta charset="UTF-8">
  <title>Invoice ${D.inv.number}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,Helvetica,sans-serif;padding:10mm;font-size:10.5px;color:#000}
    .inv-thankyou{text-align:center;font-size:9.5px;color:#555;margin-bottom:5px;font-style:italic}
    .inv-header-wrap{border:1px solid #000}
    .inv-header-top{display:grid;grid-template-columns:55% 45%;border-bottom:1px solid #000}
    .inv-seller{padding:8px 10px;border-right:1px solid #000}
    .inv-seller-name{font-size:14px;font-weight:bold;margin-bottom:3px}
    .inv-seller-addr{font-size:9px;color:#333;margin-bottom:1px}
    .inv-seller-phone{font-size:9px;margin-bottom:3px}
    .inv-seller-meta{font-size:9px;margin-top:3px}
    .inv-details{padding:8px 10px}
    .inv-dtable{width:100%;font-size:9.5px;border-collapse:collapse}
    .inv-dtable td{padding:2px 3px;vertical-align:top}
    .inv-dtable td:first-child{font-weight:bold;white-space:nowrap;width:48%}
    .inv-receiver{border:1px solid #000;border-top:none}
    .inv-receiver-title{font-weight:bold;font-size:10px;padding:3px 8px;background:#f0f0f0;border-bottom:1px solid #000}
    .inv-receiver-body{padding:5px 8px}
    .inv-rgrid{display:grid;grid-template-columns:auto 1fr;gap:2px 10px;font-size:9.5px}
    .inv-rgrid .lbl{font-weight:bold;white-space:nowrap}
    .inv-items{width:100%;border-collapse:collapse;font-size:9.5px}
    .inv-items th,.inv-items td{border:1px solid #000;padding:3px 5px;text-align:center;vertical-align:middle}
    .inv-items th{background:#f5f5f5;font-weight:bold;font-size:9px;line-height:1.3}
    .inv-items td.al{text-align:left}
    .inv-items td.ar{text-align:right}
    .inv-items tfoot td{font-weight:bold;background:#fafafa}
    .inv-bottom{border:1px solid #000;border-top:none;display:grid;grid-template-columns:55% 45%}
    .inv-words-bank{padding:7px 10px;border-right:1px solid #000;font-size:9.5px}
    .inv-words-label{font-weight:bold;font-size:10px}
    .inv-words-text{font-style:italic;margin-top:2px;font-size:9px}
    .inv-bank-title{font-weight:bold;font-size:9.5px;margin-top:8px;margin-bottom:4px}
    .inv-bgrid{display:grid;grid-template-columns:auto 1fr;gap:2px 6px;font-size:9px}
    .inv-bgrid .lbl{font-weight:bold}
    .inv-summary{padding:7px 10px;font-size:9.5px}
    .inv-stbl{width:100%;border-collapse:collapse}
    .inv-stbl td{padding:2px 2px;vertical-align:middle}
    .inv-stbl td:last-child{text-align:right;font-weight:bold;white-space:nowrap}
    .inv-stbl .sep td{border-top:1px solid #888}
    .inv-stbl .bsep td{border-top:1.5px solid #000;font-weight:bold;font-size:10px}
    .inv-stbl .bal td{color:#cc0000;font-weight:bold}
    .inv-footer{border:1px solid #000;border-top:none;display:grid;grid-template-columns:55% 45%}
    .inv-terms{padding:7px 10px;border-right:1px solid #000;font-size:9px;line-height:1.5}
    .inv-terms-title{font-weight:bold;margin-bottom:4px;font-size:9.5px}
    .inv-certified{margin-top:6px;font-style:italic;font-size:8.5px;color:#444}
    .inv-signatory{padding:7px 10px;text-align:right;font-size:9.5px;display:flex;flex-direction:column;justify-content:space-between}
    .inv-sig-co{font-weight:bold;font-size:10px}
    .inv-sig-space{height:38px}
    .inv-sig-label{font-size:9px;color:#444}
    .inv-thanks{font-size:8.5px;color:#666;margin-top:3px}
    .inv-type-badge{text-align:center;font-weight:bold;font-size:11px;padding:5px;border:1px solid #000;border-top:none;background:#f5f5f5;letter-spacing:1px}
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
