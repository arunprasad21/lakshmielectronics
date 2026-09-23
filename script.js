/* ── THEME ── */
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('le-theme', t);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

/* Initial load: saved preference → system preference */
(function () {
  const saved = localStorage.getItem('le-theme');
  if (saved) { applyTheme(saved); return; }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
})();

/* ── MOBILE MENU ── */
function toggleMenu() {
  const h = document.getElementById('hamburger');
  const n = document.getElementById('mobileNav');
  h.classList.toggle('open');
  n.classList.toggle('open');
  document.body.style.overflow = n.classList.contains('open') ? 'hidden' : '';
}

function closeMenu() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobileNav').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── FORM ── */
const WEB3FORMS_KEY = '9f904cf8-4d38-4dce-ba0f-a64747791f82';

async function handleSubmit() {
  const name  = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const brand = document.getElementById('brand').value;
  const issue = document.getElementById('issue').value.trim();

  if (!name || !phone) { alert('Please enter your name and phone number.'); return; }

  const btn = document.querySelector('.form-submit');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `TV Repair Enquiry – ${name}`,
        from_name: 'Lakshmi Electronics Website',
        replyto: 'Lakshmielectronics1988@gmail.com',
        phone,
        name,
        brand: brand || 'Not specified',
        issue: issue || 'Not specified'
      })
    });

    const data = await res.json();
    if (data.success) {
      document.getElementById('form-success').style.display = 'block';
      ['name', 'phone', 'issue'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('brand').selectedIndex = 0;
    } else {
      alert('Something went wrong. Please try again.');
    }
  } catch {
    alert('Network error. Please try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send message';
  }
}
