const toNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const fmt = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const n2w = (num) => {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const inWords = (n) => {
    const value = Math.floor(n);

    if (!value) {
      return "";
    }

    if (value < 20) {
      return ones[value];
    }

    if (value < 100) {
      return tens[Math.floor(value / 10)] + (value % 10 ? ` ${ones[value % 10]}` : "");
    }

    if (value < 1000) {
      return (
        `${ones[Math.floor(value / 100)]} Hundred` +
        (value % 100 ? ` ${inWords(value % 100)}` : "")
      );
    }

    if (value < 1e5) {
      return `${inWords(Math.floor(value / 1000))} Thousand${value % 1000 ? ` ${inWords(value % 1000)}` : ""}`;
    }

    if (value < 1e7) {
      return `${inWords(Math.floor(value / 1e5))} Lakh${value % 1e5 ? ` ${inWords(value % 1e5)}` : ""}`;
    }

    return `${inWords(Math.floor(value / 1e7))} Crore${value % 1e7 ? ` ${inWords(value % 1e7)}` : ""}`;
  };

  const integer = Math.floor(toNumber(num));
  const paise = Math.round((toNumber(num) - integer) * 100);
  let words = inWords(integer) || "Zero";

  if (paise > 0) {
    words += ` and ${inWords(paise)} Paise`;
  }

  return `${words} Rupees Only /-`;
};

const calculateLine = (item) => {
  const qty = toNumber(item?.qty);
  const rate = toNumber(item?.rate);
  const cgst = toNumber(item?.cgst);
  const sgst = toNumber(item?.sgst);
  const taxable = qty * rate;
  const cgstAmt = (taxable * cgst) / 100;
  const sgstAmt = (taxable * sgst) / 100;

  return {
    qty,
    rate,
    cgst,
    sgst,
    taxable,
    cgstAmt,
    sgstAmt,
    total: taxable + cgstAmt + sgstAmt,
  };
};

const calculateTotals = (items, paid) => {
  let taxable = 0;
  let cgst = 0;
  let sgst = 0;
  let qty = 0;

  for (const item of items) {
    const line = calculateLine(item);
    taxable += line.taxable;
    cgst += line.cgstAmt;
    sgst += line.sgstAmt;
    qty += line.qty;
  }

  const tax = cgst + sgst;
  const final = taxable + tax;
  const bal = final - toNumber(paid);

  return { qty, taxable, cgst, sgst, tax, final, bal };
};

const sanitizeInput = (data = {}) => ({
  seller: data.seller || {},
  inv: data.inv || {},
  buyer: data.buyer || {},
  bank: data.bank || {},
  terms: Array.isArray(data.terms) ? data.terms : [],
  items: Array.isArray(data.items) ? data.items : [],
  paid: toNumber(data.paid),
});

export const renderInvoicePreview = (rawData) => {
  const D = sanitizeInput(rawData);
  const totals = calculateTotals(D.items, D.paid);

  const itemRows = D.items
    .map((item, index) => {
      const line = calculateLine(item);

      return `<tr>
      <td>${index + 1}</td>
      <td class="al"><strong>${escapeHtml(item?.name || "—")}</strong><br><span style="font-size:8.5px;color:#555;">${escapeHtml(item?.desc || "")}</span></td>
      <td>${fmt(line.qty)}</td>
      <td>${escapeHtml(item?.unit || "")}</td>
      <td class="ar">${fmt(line.rate)}</td>
      <td class="ar taxable-col">${fmt(line.taxable)}</td>
      <td>${line.cgst.toFixed(2)}%</td>
      <td class="ar">${fmt(line.cgstAmt)}</td>
      <td>${line.sgst.toFixed(2)}%</td>
      <td class="ar">${fmt(line.sgstAmt)}</td>
      <td class="ar" style="font-weight:bold;">₹ ${fmt(line.total)}</td>
    </tr>`;
    })
    .join("");

  const termsHtml = D.terms.map((term, index) => `${index + 1}. ${escapeHtml(term)}`).join("<br>");

  const html = `
    <div class="inv-thankyou">🙏 Thank-you for doing business with us</div>

    <div class="inv-sheet">
      <div class="inv-header-wrap">
        <div class="inv-seller-name">${escapeHtml(D.seller.name)}</div>
        <div class="inv-seller-addr">${escapeHtml(D.seller.address)}</div>
        <div class="inv-seller-phone">📞 ${escapeHtml(D.seller.phone)}</div>
        <div class="inv-seller-meta"><strong>GSTIN :</strong> ${escapeHtml(D.seller.gstin)} <span class="state-chip">State Code : ${escapeHtml(D.seller.stateCode)}</span></div>
        <div class="inv-seller-meta"><strong>PAN :</strong> ${escapeHtml(D.seller.pan)}</div>
      </div>

      <div class="inv-type-row">
        <div class="inv-type-title">TAX INVOICE</div>
        <div class="inv-type-note">Original For Recipient</div>
      </div>

      <div class="inv-meta">
        <div class="inv-meta-left">
          <table class="inv-dtable">
            <tr><td>Invoice Number</td><td>${escapeHtml(D.inv.number)}</td></tr>
            <tr><td>Invoice Date</td><td>${escapeHtml(D.inv.date)}</td></tr>
            <tr><td>State</td><td>${escapeHtml(D.inv.state)}</td></tr>
            <tr><td>Reverse Charge</td><td>${escapeHtml(D.inv.rc)}</td></tr>
          </table>
        </div>
        <div class="inv-meta-right">
          <div class="inv-meta-row"><span>Vehicle Number</span><span class="val">${escapeHtml(D.inv.vehicle)}</span></div>
        </div>
      </div>

      <div class="inv-receiver">
        <div class="inv-receiver-title">Details of Receiver | Billed to</div>
        <div class="inv-receiver-body">
          <div class="inv-rgrid">
            <span class="lbl">Name:</span><span>${escapeHtml(D.buyer.name)}</span>
            <span class="lbl">Address:</span><span>${escapeHtml(D.buyer.address)}</span>
            <span class="lbl">GSTIN:</span><span>${escapeHtml(D.buyer.gstin)} <span class="state-chip">State Code : ${escapeHtml(D.buyer.stateCode)}</span></span>
            <span class="lbl">State:</span><span>${escapeHtml(D.buyer.state)}</span>
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
            <td>${fmt(totals.qty)}</td>
            <td></td><td></td>
            <td class="ar taxable-col">₹ ${fmt(totals.taxable)}</td>
            <td></td>
            <td class="ar">₹ ${fmt(totals.cgst)}</td>
            <td></td>
            <td class="ar">₹ ${fmt(totals.sgst)}</td>
            <td class="ar">₹ ${fmt(totals.final)}</td>
          </tr>
        </tfoot>
      </table>

      <div class="inv-bottom">
        <div class="inv-words-bank">
          <div class="inv-words-label">Total Invoice Amount in words</div>
          <div class="inv-words-text">${escapeHtml(n2w(totals.final))}</div>

          <div class="inv-bank-title">🏦 Bank and Payment Details</div>
          <div class="inv-bgrid">
            <span class="lbl">Account Name</span><span>${escapeHtml(D.bank.accName)}</span>
            <span class="lbl">Account No.</span><span>${escapeHtml(D.bank.accNo)}</span>
            <span class="lbl">IFSC Code</span><span>${escapeHtml(D.bank.ifsc)}</span>
            <span class="lbl">Bank Name</span><span>${escapeHtml(D.bank.bank)}</span>
            <span class="lbl">Branch Name</span><span>${escapeHtml(D.bank.branch)}</span>
            <span class="lbl">Swift Code</span><span>${escapeHtml(D.bank.swift)}</span>
          </div>
        </div>

        <div class="inv-summary">
          <table class="inv-stbl">
            <tr class="head"><td>Total Amount Before Tax</td><td>₹ ${fmt(totals.taxable)}</td></tr>
            <tr><td>Add : CGST</td><td>₹ ${fmt(totals.cgst)}</td></tr>
            <tr><td>Add : SGST</td><td>₹ ${fmt(totals.sgst)}</td></tr>
            <tr class="total"><td>Total Tax Amount</td><td>₹ ${fmt(totals.tax)}</td></tr>
            <tr class="final"><td>Final Invoice Amount</td><td>₹ ${fmt(totals.final)}</td></tr>
            <tr class="bal"><td>Balance Due</td><td>₹ ${fmt(totals.bal)}</td></tr>
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
            <div class="inv-sig-co">For, ${escapeHtml(D.seller.name)}</div>
            <div class="inv-sig-space"></div>
            <div class="inv-sig-label">Authorised Signatory</div>
          </div>
        </div>
      </div>
    </div>

    <div class="inv-thanks">Thankyou for your business</div>
  `;

  return { html, totals };
};
