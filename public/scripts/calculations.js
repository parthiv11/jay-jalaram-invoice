import { D } from './data.js';

export function calcItem(it) {
  const taxable = it.qty * it.rate;
  const cgstAmt = taxable * it.cgst / 100;
  const sgstAmt = taxable * it.sgst / 100;
  return { taxable, cgstAmt, sgstAmt, total: taxable + cgstAmt + sgstAmt };
}

export function calcTotals() {
  let taxable = 0;
  let cgst = 0;
  let sgst = 0;
  let qty = 0;
  D.items.forEach(it => {
    const c = calcItem(it);
    taxable += c.taxable;
    cgst += c.cgstAmt;
    sgst += c.sgstAmt;
    qty += Number(it.qty);
  });
  const tax = cgst + sgst;
  const final = taxable + tax;
  const bal = final - D.paid;
  return { qty, taxable, cgst, sgst, tax, final, bal };
}
