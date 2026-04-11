// ============================================
//  SUN SEEKERS TRAVELS — MAIN.JS
// ============================================

const navbar = document.querySelector('.navbar');
if (navbar) window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 40));

const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open'); mobileNav.classList.remove('open'); document.body.style.overflow = '';
  }));
}

const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

function reObserve() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

function showLoader(id, count, height) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = Array(count).fill(`
    <div style="background:var(--navy-mid);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden">
      <div style="height:${height || 200}px;background:var(--navy-light);opacity:0.5"></div>
      <div style="padding:20px">
        <div style="height:16px;background:var(--navy-light);border-radius:3px;width:65%;margin-bottom:10px;opacity:0.5"></div>
        <div style="height:11px;background:var(--navy-light);border-radius:3px;width:85%;opacity:0.4"></div>
      </div>
    </div>`).join('');
}

async function submitBooking(form) {
  const btn = form.querySelector('[type=submit]');
  const orig = btn.innerHTML;
  btn.innerHTML = '⏳ Sending…'; btn.disabled = true;
  const data = { status:'New', source: location.pathname };
  form.querySelectorAll('input:not([type=submit]),select,textarea').forEach(f => {
    const lbl = (f.closest('.form-group')?.querySelector('.form-label')?.textContent || f.placeholder || '').toLowerCase();
    const v = f.value.trim(); if (!v) return;
    if (lbl.includes('name') && !lbl.includes('vehicle')) data.name = v;
    else if (lbl.includes('phone')) data.phone = v;
    else if (lbl.includes('email')) data.email = v;
    else if ((lbl.includes('travel') && lbl.includes('date')) || lbl === 'travel date') { if (!data.travelDate) data.travelDate = v; }
    else if (lbl.includes('vehicle')) data.vehicle = v;
    else if (lbl.includes('service')) data.service = v;
    else if (lbl.includes('passenger')) data.passengers = v;
    else if (lbl.includes('pickup')) data.pickup = v;
    else if (f.tagName === 'TEXTAREA') data.notes = v;
  });
  try {
    if (typeof db !== 'undefined') {
      await db.collection('bookings').add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    }
  } catch(e) { console.warn('Firebase:', e.message); }
  btn.innerHTML = '✅ Booking Sent! We\'ll call you shortly.';
  btn.style.cssText = 'background:linear-gradient(135deg,#22C55E,#16A34A);color:#fff';
  setTimeout(() => { btn.innerHTML = orig; btn.style.cssText = ''; btn.disabled = false; form.reset(); }, 4000);
}

document.querySelectorAll('#bookingForm,#contactBookingForm').forEach(f => {
  f.addEventListener('submit', e => { e.preventDefault(); submitBooking(f); });
});
