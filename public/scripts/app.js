import { D } from './data.js';
import { set } from './utils.js';
import { render } from './render.js';
import { renderItemsList, addItem, removeItem, toggleItem, upd } from './items.js';
import { downloadPDF, downloadExcel } from './exports.js';
import { toggleSec } from './sections.js';

function initForm() {
  const s = D.seller;
  const iv = D.inv;
  const b = D.buyer;
  const bk = D.bank;
  set('sName', s.name);
  set('sAddr', s.address);
  set('sPhone', s.phone);
  set('sGstin', s.gstin);
  set('sSC', s.stateCode);
  set('sPan', s.pan);
  set('iNum', iv.number);
  set('iDate', iv.date);
  set('iState', iv.state);
  document.getElementById('iRC').value = iv.rc;
  set('iVeh', iv.vehicle);
  set('bName', b.name);
  set('bAddr', b.address);
  set('bGstin', b.gstin);
  set('bSC', b.stateCode);
  set('bState', b.state);
  set('bkAccName', bk.accName);
  set('bkAccNo', bk.accNo);
  set('bkIfsc', bk.ifsc);
  set('bkSwift', bk.swift);
  set('bkBank', bk.bank);
  set('bkBranch', bk.branch);
  set('terms', D.terms.join('\n'));
  set('amtPaid', D.paid);
  renderItemsList();
  render();
}

function exposeGlobals() {
  window.render = render;
  window.addItem = addItem;
  window.removeItem = removeItem;
  window.toggleItem = toggleItem;
  window.upd = upd;
  window.toggleSec = toggleSec;
  window.downloadPDF = downloadPDF;
  window.downloadExcel = downloadExcel;
}

exposeGlobals();
initForm();
