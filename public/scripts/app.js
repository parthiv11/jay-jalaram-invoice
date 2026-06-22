import { D } from './data.js';
import { set } from './utils.js';
import { render, getInvoicePayload } from './render.js';
import { renderItemsList, addItem, removeItem, toggleItem, upd } from './items.js';
import { toggleSec, initSections } from './sections.js';

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

function setView(view) {
  document.body.dataset.view = view;

  document.querySelectorAll('.view-tab, .mobile-bar-tab').forEach((tab) => {
    const isActive = tab.dataset.view === view;
    tab.classList.toggle('active', isActive);
    if (tab.matches('.view-tab')) {
      tab.setAttribute('aria-selected', String(isActive));
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function exposeGlobals() {
  window.render = render;
  window.addItem = addItem;
  window.removeItem = removeItem;
  window.toggleItem = toggleItem;
  window.upd = upd;
  window.toggleSec = toggleSec;
  window.getInvoicePayload = getInvoicePayload;
  window.setView = setView;
  window.downloadPDF =
    window.downloadPDF ||
    (() => alert("PDF download is still loading. Please try again in a moment."));
}

function initSectionsForViewport() {
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  document.querySelectorAll('.section').forEach((section) => {
    if (!isMobile) {
      section.classList.add('section-open');
    }
  });

  initSections();
}

exposeGlobals();
initForm();
initSectionsForViewport();
setView('edit');

window.addEventListener('resize', () => {
  initSectionsForViewport();
});
