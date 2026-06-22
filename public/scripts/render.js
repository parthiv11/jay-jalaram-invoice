import { D } from './data.js';

const fmt = n => Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

let requestId = 0;

export function collect() {
  const g = id => document.getElementById(id).value;
  D.seller.name = g('sName');
  D.seller.address = g('sAddr');
  D.seller.phone = g('sPhone');
  D.seller.gstin = g('sGstin');
  D.seller.stateCode = g('sSC');
  D.seller.pan = g('sPan');
  D.inv.number = g('iNum');
  D.inv.date = g('iDate');
  D.inv.state = g('iState');
  D.inv.rc = g('iRC');
  D.inv.vehicle = g('iVeh');
  D.buyer.name = g('bName');
  D.buyer.address = g('bAddr');
  D.buyer.gstin = g('bGstin');
  D.buyer.stateCode = g('bSC');
  D.buyer.state = g('bState');
  D.bank.accName = g('bkAccName');
  D.bank.accNo = g('bkAccNo');
  D.bank.ifsc = g('bkIfsc');
  D.bank.swift = g('bkSwift');
  D.bank.bank = g('bkBank');
  D.bank.branch = g('bkBranch');
  D.terms = g('terms').split('\n').filter(t => t.trim());
  D.paid = parseFloat(g('amtPaid')) || 0;
}

export function getInvoicePayload() {
  collect();
  return structuredClone(D);
}

const updateTotals = totals => {
  const finalText = '₹ ' + fmt(totals.final);

  document.getElementById('tTaxable').textContent = '₹ ' + fmt(totals.taxable);
  document.getElementById('tCgst').textContent = '₹ ' + fmt(totals.cgst);
  document.getElementById('tSgst').textContent = '₹ ' + fmt(totals.sgst);
  document.getElementById('tTax').textContent = '₹ ' + fmt(totals.tax);
  document.getElementById('tFinal').textContent = finalText;
  document.getElementById('tBal').textContent = '₹ ' + fmt(totals.bal);

  const topFinal = document.getElementById('topFinal');
  if (topFinal) topFinal.textContent = finalText;
};

export async function render() {
  collect();
  const currentRequestId = ++requestId;

  try {
    const response = await fetch('/api/invoice-preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(D)
    });

    if (!response.ok) {
      throw new Error('Preview API failed');
    }

    const result = await response.json();

    if (currentRequestId !== requestId) {
      return;
    }

    updateTotals(result.totals || {});
    document.getElementById('invoice').innerHTML = result.html || '';
  } catch (error) {
    if (currentRequestId !== requestId) {
      return;
    }

    document.getElementById('invoice').innerHTML = '<div class="inv-thanks">Unable to render preview.</div>';
    console.error(error);
  }
}
