import Script from "next/script";

const legacyMarkup = `
<div class="topbar">
  <div class="topbar-left">
    <div class="topbar-icon">📄</div>
    <div>
      <div class="topbar-title">Invoice Builder</div>
      <div class="topbar-sub">Jalaram Traders · Live Preview</div>
    </div>
  </div>
  <div class="btn-group">
    <button class="btn btn-print" onclick="window.print()">🖨 Print / PDF</button>
    <button class="btn btn-pdf" onclick="downloadPDF()">⬇ Save PDF</button>
    <button class="btn btn-excel" onclick="downloadExcel()">📊 Export Excel</button>
  </div>
</div>

<div class="main">
  <div class="editor" id="editor">
    <div class="section">
      <div class="section-header" onclick="toggleSec(this)">
        🏢 Seller / Company <span class="section-arrow open">▶</span>
      </div>
      <div class="section-body">
        <div class="field"><label>Company Name</label><input id="sName" type="text" oninput="render()"></div>
        <div class="field"><label>Address</label><textarea id="sAddr" oninput="render()"></textarea></div>
        <div class="g2">
          <div class="field"><label>Phone</label><input id="sPhone" oninput="render()"></div>
          <div class="field"><label>State Code</label><input id="sSC" oninput="render()"></div>
        </div>
        <div class="g2">
          <div class="field"><label>GSTIN</label><input id="sGstin" oninput="render()"></div>
          <div class="field"><label>PAN</label><input id="sPan" oninput="render()"></div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" onclick="toggleSec(this)">
        📋 Invoice Details <span class="section-arrow open">▶</span>
      </div>
      <div class="section-body">
        <div class="g2">
          <div class="field"><label>Invoice No.</label><input id="iNum" oninput="render()"></div>
          <div class="field"><label>Invoice Date</label><input id="iDate" oninput="render()"></div>
        </div>
        <div class="g2">
          <div class="field"><label>State</label><input id="iState" oninput="render()"></div>
          <div class="field"><label>Reverse Charge</label><select id="iRC" onchange="render()"><option>NO</option><option>YES</option></select></div>
        </div>
        <div class="field"><label>Vehicle Number</label><input id="iVeh" oninput="render()"></div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" onclick="toggleSec(this)">
        👤 Buyer / Receiver <span class="section-arrow open">▶</span>
      </div>
      <div class="section-body">
        <div class="field"><label>Buyer Name</label><input id="bName" oninput="render()"></div>
        <div class="field"><label>Address</label><textarea id="bAddr" oninput="render()"></textarea></div>
        <div class="g2">
          <div class="field"><label>GSTIN</label><input id="bGstin" oninput="render()"></div>
          <div class="field"><label>State Code</label><input id="bSC" oninput="render()"></div>
        </div>
        <div class="field"><label>State</label><input id="bState" oninput="render()"></div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" onclick="toggleSec(this)">
        📦 Items <span class="section-arrow open">▶</span>
      </div>
      <div class="section-body">
        <div id="itemsList"></div>
        <button class="btn-add-item" onclick="addItem()">＋ Add Item</button>
      </div>
    </div>

    <div class="section">
      <div class="section-header" onclick="toggleSec(this)">
        🧮 Live Totals <span class="section-arrow open">▶</span>
      </div>
      <div class="section-body">
        <div class="totals-strip">
          <div class="t-row"><span>Taxable Amount</span><span id="tTaxable">₹ 0.00</span></div>
          <div class="t-row"><span>CGST</span><span id="tCgst">₹ 0.00</span></div>
          <div class="t-row"><span>SGST</span><span id="tSgst">₹ 0.00</span></div>
          <div class="t-row"><span>Total Tax</span><span id="tTax">₹ 0.00</span></div>
          <div class="t-row final"><span>Final Amount</span><span id="tFinal">₹ 0.00</span></div>
          <div class="t-row balance"><span>Balance Due</span><span id="tBal">₹ 0.00</span></div>
        </div>
        <div class="field">
          <label>Amount Paid (₹)</label>
          <input id="amtPaid" type="number" value="0" min="0" oninput="render()">
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" onclick="toggleSec(this)">
        🏦 Bank Details <span class="section-arrow open">▶</span>
      </div>
      <div class="section-body">
        <div class="field"><label>Account Name</label><input id="bkAccName" oninput="render()"></div>
        <div class="field"><label>Account Number</label><input id="bkAccNo" oninput="render()"></div>
        <div class="g2">
          <div class="field"><label>IFSC Code</label><input id="bkIfsc" oninput="render()"></div>
          <div class="field"><label>Swift Code</label><input id="bkSwift" oninput="render()"></div>
        </div>
        <div class="g2">
          <div class="field"><label>Bank Name</label><input id="bkBank" oninput="render()"></div>
          <div class="field"><label>Branch</label><input id="bkBranch" oninput="render()"></div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" onclick="toggleSec(this)">
        📜 Terms & Conditions <span class="section-arrow open">▶</span>
      </div>
      <div class="section-body">
        <div class="field">
          <label>One term per line</label>
          <textarea id="terms" rows="4" oninput="render()"></textarea>
        </div>
      </div>
    </div>
  </div>

  <div class="preview-panel">
    <div class="invoice" id="invoice"></div>
  </div>
</div>
`;

export default function InvoiceBuilderPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: legacyMarkup }} />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/dompurify@3.1.4/dist/purify.min.js" strategy="afterInteractive" />
      <Script src="/scripts/app.js" type="module" strategy="afterInteractive" />
    </>
  );
}
