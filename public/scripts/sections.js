export function toggleSec(hdr) {
  const section = hdr.closest('.section');
  const body = hdr.nextElementSibling;
  const arrow = hdr.querySelector('.section-arrow');
  const isOpen = section.classList.contains('section-open');

  if (isOpen) {
    section.classList.remove('section-open');
    body.style.display = 'none';
    arrow.classList.remove('open');
    hdr.setAttribute('aria-expanded', 'false');
  } else {
    section.classList.add('section-open');
    body.style.display = 'flex';
    arrow.classList.add('open');
    hdr.setAttribute('aria-expanded', 'true');
  }
}

export function initSections() {
  document.querySelectorAll('.section').forEach((section) => {
    const hdr = section.querySelector('.section-header');
    const body = section.querySelector('.section-body');
    const arrow = hdr?.querySelector('.section-arrow');
    const isOpen = section.classList.contains('section-open');

    if (!body || !hdr) return;

    body.style.display = isOpen ? 'flex' : 'none';
    arrow?.classList.toggle('open', isOpen);
    hdr.setAttribute('aria-expanded', String(isOpen));
  });
}