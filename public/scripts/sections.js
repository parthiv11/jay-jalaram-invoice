export function toggleSec(hdr) {
  const body = hdr.nextElementSibling;
  const arrow = hdr.querySelector('.section-arrow');
  if (body.style.display === 'none') {
    body.style.display = 'flex';
    arrow.classList.add('open');
  } else {
    body.style.display = 'none';
    arrow.classList.remove('open');
  }
}
