import Script from "next/script";
import InvoicePDF from "@/components/InvoicePDF";

const legacyMarkup = `
<div class="topbar">
  <div class="topbar-left">
    <div class="topbar-icon" aria-hidden="true">JT</div>
    <div>
      <div class="topbar-title">Invoice Builder</div>
      <div class="topbar-sub">Jalaram Traders</div>
    </div>
  </div>
  <div class="topbar-amount" id="topFinal" aria-live="polite">₹ 0.00</div>
  <div class="btn-group btn-group-desktop">
    <button type="button" class="btn btn-pdf" onclick="downloadPDF()">Save PDF</button>
  </div>
</div>

<div class="view-tabs" id="viewTabs" role="tablist" aria-label="Invoice views">
  <div class="view-tabs-track">
    <button type="button" role="tab" class="view-tab active" data-view="edit" aria-selected="true" onclick="setView('edit')">Edit</button>
    <button type="button" role="tab" class="view-tab" data-view="preview" aria-selected="false" onclick="setView('preview')">Preview</button>
  </div>
</div>

<div class="main">
  <div class="editor" id="editor">
    <div class="section" data-section="seller">
      <button type="button" class="section-header" onclick="toggleSec(this)" aria-expanded="false">
        <span class="section-label">Seller / Company</span>
        <span class="section-arrow">▶</span>
      </button>
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

    <div class="section section-open" data-section="invoice">
      <button type="button" class="section-header" onclick="toggleSec(this)" aria-expanded="true">
        <span class="section-label">Invoice Details</span>
        <span class="section-arrow open">▶</span>
      </button>
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

    <div class="section" data-section="buyer">
      <button type="button" class="section-header" onclick="toggleSec(this)" aria-expanded="false">
        <span class="section-label">Buyer / Receiver</span>
        <span class="section-arrow">▶</span>
      </button>
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

    <div class="section section-open" data-section="items">
      <button type="button" class="section-header" onclick="toggleSec(this)" aria-expanded="true">
        <span class="section-label">Items</span>
        <span class="section-arrow open">▶</span>
      </button>
      <div class="section-body">
        <div id="itemsList"></div>
        <button class="btn-add-item" onclick="addItem()">＋ Add Item</button>
      </div>
    </div>

    <div class="section section-open" data-section="totals">
      <button type="button" class="section-header" onclick="toggleSec(this)" aria-expanded="true">
        <span class="section-label">Payment & Totals</span>
        <span class="section-arrow open">▶</span>
      </button>
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

    <div class="section" data-section="bank">
      <button type="button" class="section-header" onclick="toggleSec(this)" aria-expanded="false">
        <span class="section-label">Bank Details</span>
        <span class="section-arrow">▶</span>
      </button>
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

    <div class="section" data-section="terms">
      <button type="button" class="section-header" onclick="toggleSec(this)" aria-expanded="false">
        <span class="section-label">Terms & Conditions</span>
        <span class="section-arrow">▶</span>
      </button>
      <div class="section-body">
        <div class="field">
          <label>One term per line</label>
          <textarea id="terms" rows="4" oninput="render()"></textarea>
        </div>
      </div>
    </div>
  </div>

  <div class="preview-panel">
    <p class="preview-hint">Swipe left or right to view the full invoice</p>
    <div class="invoice" id="invoice"></div>
  </div>
</div>

<nav class="mobile-bar" aria-label="Quick actions">
  <button type="button" class="mobile-bar-tab active" data-view="edit" onclick="setView('edit')">
    <span class="mobile-bar-tab-label">Edit</span>
  </button>
  <button type="button" class="mobile-bar-tab" data-view="preview" onclick="setView('preview')">
    <span class="mobile-bar-tab-label">Preview</span>
  </button>
  <button type="button" class="btn btn-pdf mobile-bar-save" onclick="downloadPDF()">Save PDF</button>
</nav>
`;

export default function InvoiceBuilderPage() {
  return (
    <>
      <InvoicePDF />
      <div dangerouslySetInnerHTML={{ __html: legacyMarkup }} />
      <Script src="https://cdn.jsdelivr.net/npm/dompurify@3.1.4/dist/purify.min.js" strategy="afterInteractive" />
      <Script src="/scripts/app.js" type="module" strategy="afterInteractive" />
    </>
  );
}
