export function set(id, val) {
  document.getElementById(id).value = val;
}

export function esc(s) {
  return String(s || '').replace(/"/g, '&quot;');
}

export function fmt(n) {
  return Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function n2w(num) {
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens_ = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  function h(n) {
    n = Math.floor(n);
    if (!n) return '';
    if (n < 20) return ones[n];
    if (n < 100) return tens_[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + h(n % 100) : '');
    if (n < 1e5) return h(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + h(n % 1000) : '');
    if (n < 1e7) return h(Math.floor(n / 1e5)) + ' Lakh' + (n % 1e5 ? ' ' + h(n % 1e5) : '');
    return h(Math.floor(n / 1e7)) + ' Crore' + (n % 1e7 ? ' ' + h(n % 1e7) : '');
  }
  const integer = Math.floor(num);
  const paise = Math.round((num - integer) * 100);
  let w = h(integer) || 'Zero';
  if (paise > 0) w += ' and ' + h(paise) + ' Paise';
  return w + ' Rupees Only /-';
}
