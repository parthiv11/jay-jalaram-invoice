import { D } from './data.js';
import { calcItem, calcTotals } from './calculations.js';
import { n2w } from './utils.js';

export async function downloadPDF() {
  if (typeof window.downloadPDF === 'function') {
    return window.downloadPDF();
  }

  alert('PDF download is not available.');
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