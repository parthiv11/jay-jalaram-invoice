import { D } from './data.js';
import { calcItem, calcTotals } from './calculations.js';
import { fmt, n2w } from './utils.js';

function collect() {
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

export function render() {
  collect();
  const T = calcTotals();

  document.getElementById('tTaxable').textContent = '₹ ' + fmt(T.taxable);
  document.getElementById('tCgst').textContent = '₹ ' + fmt(T.cgst);
  document.getElementById('tSgst').textContent = '₹ ' + fmt(T.sgst);
  document.getElementById('tTax').textContent = '₹ ' + fmt(T.tax);
  document.getElementById('tFinal').textContent = '₹ ' + fmt(T.final);
  document.getElementById('tBal').textContent = '₹ ' + fmt(T.bal);

  const itemRows = D.items.map((it, i) => {
    const c = calcItem(it);
    return `<tr>
      <td>${i + 1}</td>
      <td class="al"><strong>${it.name || '—'}</strong><br><span style="font-size:8.5px;color:#555;">${it.desc || ''}</span></td>
      <td>${it.qty}</td>
      <td>${it.unit}</td>
      <td class="ar">${fmt(it.rate)}</td>
      <td class="ar taxable-col">${fmt(c.taxable)}</td>
      <td>${Number(it.cgst).toFixed(2)}%</td>
      <td class="ar">${fmt(c.cgstAmt)}</td>
      <td>${Number(it.sgst).toFixed(2)}%</td>
      <td class="ar">${fmt(c.sgstAmt)}</td>
      <td class="ar" style="font-weight:bold;">₹ ${fmt(c.total)}</td>
    </tr>`;
  }).join('');

  const termsHtml = D.terms.map((t, i) => `${i + 1}. ${t}`).join('<br>');

  const s = D.seller;
  const iv = D.inv;
  const b = D.buyer;
  const bk = D.bank;

  document.getElementById('invoice').innerHTML = `
    <div class="inv-thankyou">🙏 Thank-you for doing business with us</div>

    <div class="inv-sheet">
      <div class="inv-header-wrap">
        <div class="inv-seller-name">${s.name}</div>
        <div class="inv-seller-addr">${s.address}</div>
        <div class="inv-seller-phone">📞 ${s.phone}</div>
        <div class="inv-seller-meta"><strong>GSTIN :</strong> ${s.gstin} <span class="state-chip">State Code : ${s.stateCode}</span></div>
        <div class="inv-seller-meta"><strong>PAN :</strong> ${s.pan}</div>
      </div>

      <div class="inv-type-row">
        <div class="inv-type-title">TAX INVOICE</div>
        <div class="inv-type-note">Original For Recipient</div>
      </div>

      <div class="inv-meta">
        <div class="inv-meta-left">
          <table class="inv-dtable">
            <tr><td>Invoice Number</td><td>${iv.number}</td></tr>
            <tr><td>Invoice Date</td><td>${iv.date}</td></tr>
            <tr><td>State</td><td>${iv.state}</td></tr>
            <tr><td>Reverse Charge</td><td>${iv.rc}</td></tr>
          </table>
        </div>
        <div class="inv-meta-right">
          <div class="inv-meta-row"><span>Vehicle Number</span><span class="val">${iv.vehicle}</span></div>
        </div>
      </div>

      <div class="inv-receiver">
        <div class="inv-receiver-title">Details of Receiver | Billed to</div>
        <div class="inv-receiver-body">
          <div class="inv-rgrid">
            <span class="lbl">Name:</span><span>${b.name}</span>
            <span class="lbl">Address:</span><span>${b.address}</span>
            <span class="lbl">GSTIN:</span><span>${b.gstin} <span class="state-chip">State Code : ${b.stateCode}</span></span>
            <span class="lbl">State:</span><span>${b.state}</span>
          </div>
        </div>
      </div>

      <table class="inv-items">
        <thead>
          <tr>
            <th rowspan="2" style="width:28px;">Sr.<br>No.</th>
            <th rowspan="2">Name of Product</th>
            <th rowspan="2" style="width:36px;">QTY</th>
            <th rowspan="2" style="width:38px;">Unit</th>
            <th rowspan="2" style="width:60px;">Rate</th>
            <th rowspan="2" style="width:70px;">Taxable<br>Value</th>
            <th colspan="2">CGST</th>
            <th colspan="2">SGST</th>
            <th rowspan="2" style="width:76px;">Total</th>
          </tr>
          <tr>
            <th style="width:42px;">Rate</th>
            <th style="width:60px;">Amount</th>
            <th style="width:42px;">Rate</th>
            <th style="width:60px;">Amount</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td></td>
            <td class="al">Total</td>
            <td>${T.qty}</td>
            <td></td><td></td>
            <td class="ar taxable-col">₹ ${fmt(T.taxable)}</td>
            <td></td>
            <td class="ar">₹ ${fmt(T.cgst)}</td>
            <td></td>
            <td class="ar">₹ ${fmt(T.sgst)}</td>
            <td class="ar">₹ ${fmt(T.final)}</td>
          </tr>
        </tfoot>
      </table>

      <div class="inv-bottom">
        <div class="inv-words-bank">
          <div class="inv-words-label">Total Invoice Amount in words</div>
          <div class="inv-words-text">${n2w(T.final)}</div>

          <div class="inv-bank-title">🏦 Bank and Payment Details</div>
          <div class="inv-bgrid">
            <span class="lbl">Account Name</span><span>${bk.accName}</span>
            <span class="lbl">Account No.</span><span>${bk.accNo}</span>
            <span class="lbl">IFSC Code</span><span>${bk.ifsc}</span>
            <span class="lbl">Bank Name</span><span>${bk.bank}</span>
            <span class="lbl">Branch Name</span><span>${bk.branch}</span>
            <span class="lbl">Swift Code</span><span>${bk.swift}</span>
          </div>
        </div>

        <div class="inv-summary">
          <table class="inv-stbl">
            <tr class="head"><td>Total Amount Before Tax</td><td>₹ ${fmt(T.taxable)}</td></tr>
            <tr><td>Add : CGST</td><td>₹ ${fmt(T.cgst)}</td></tr>
            <tr><td>Add : SGST</td><td>₹ ${fmt(T.sgst)}</td></tr>
            <tr class="total"><td>Total Tax Amount</td><td>₹ ${fmt(T.tax)}</td></tr>
            <tr class="final"><td>Final Invoice Amount</td><td>₹ ${fmt(T.final)}</td></tr>
            <tr class="bal"><td>Balance Due</td><td>₹ ${fmt(T.bal)}</td></tr>
          </table>
        </div>
      </div>

      <div class="inv-footer">
        <div class="inv-terms">
          <div class="inv-terms-title">Terms And Conditions</div>
          ${termsHtml}
        </div>
        <div class="inv-signatory">
          <div class="inv-certified">Certified that the particular given above are true and correct</div>
          <div>
            <div class="inv-sig-co">For, ${s.name}</div>
            <div class="inv-sig-space"></div>
            <div class="inv-sig-label">Authorised Signatory</div>
          </div>
        </div>
      </div>
    </div>

    <div class="inv-thanks">Thankyou for your business</div>
  `;
}
