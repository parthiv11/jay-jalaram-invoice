import { D } from './data.js';
import { esc } from './utils.js';
import { render } from './render.js';

export function renderItemsList() {
  const el = document.getElementById('itemsList');
  el.innerHTML = '';
  D.items.forEach((it, i) => {
    const d = document.createElement('div');
    const collapsed = Boolean(it.collapsed);
    const toggleIcon = collapsed ? '▸' : '▾';
    const toggleClass = collapsed ? '' : 'open';
    d.className = `item-card${collapsed ? ' collapsed' : ''}`;
    d.innerHTML = `
      <div class="item-card-hdr">
        <div class="item-card-title">
          <span class="item-badge">Item #${i + 1}</span>
          <span class="item-title-text" id="itemTitle-${i}">${esc(it.name) || 'New Item'}</span>
        </div>
        <div class="item-actions">
          <button class="item-toggle ${toggleClass}" onclick="toggleItem(${i})" aria-label="Toggle item" aria-expanded="${!collapsed}">${toggleIcon}</button>
          ${D.items.length > 1 ? `<button class="btn-rm" onclick="removeItem(${i})">✕ Remove</button>` : ''}
        </div>
      </div>
      <div class="item-card-body">
        <div class="g2">
          <div class="field"><label>Product Name</label>
            <input type="text" value="${esc(it.name)}" oninput="upd(${i},'name',this.value)">
          </div>
          <div class="field"><label>Description / HSN</label>
            <input type="text" value="${esc(it.desc)}" oninput="upd(${i},'desc',this.value)">
          </div>
        </div>
        <div class="g5">
          <div class="field"><label>Qty</label>
            <input type="number" value="${it.qty}" oninput="upd(${i},'qty',+this.value)">
          </div>
          <div class="field"><label>Unit</label>
            <input type="text" value="${esc(it.unit)}" oninput="upd(${i},'unit',this.value)">
          </div>
          <div class="field"><label>Rate ₹</label>
            <input type="number" value="${it.rate}" oninput="upd(${i},'rate',+this.value)">
          </div>
          <div class="field"><label>CGST %</label>
            <input type="number" step="0.5" value="${it.cgst}" oninput="upd(${i},'cgst',+this.value)">
          </div>
          <div class="field"><label>SGST %</label>
            <input type="number" step="0.5" value="${it.sgst}" oninput="upd(${i},'sgst',+this.value)">
          </div>
        </div>
      </div>
    `;
    el.appendChild(d);
  });
}

export function upd(i, k, v) {
  D.items[i][k] = v;
  if (k === 'name') updateItemTitle(i, v);
  render();
}

export function updateItemTitle(i, name) {
  const el = document.getElementById(`itemTitle-${i}`);
  if (el) el.textContent = name || 'New Item';
}

export function addItem() {
  D.items.push({ name: '', desc: '', qty: 1, unit: 'TON', rate: 0, cgst: 2.5, sgst: 2.5, collapsed: false });
  renderItemsList();
  render();
}

export function removeItem(i) {
  D.items.splice(i, 1);
  renderItemsList();
  render();
}

export function toggleItem(i) {
  D.items[i].collapsed = !D.items[i].collapsed;
  renderItemsList();
}
