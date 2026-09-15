/* ===== DARK MODE (sets BOTH data-theme + data-bs-theme so Bootstrap also goes dark) ===== */
const root = document.documentElement;
const metaTheme = document.getElementById('metaTheme');

function applyTheme(t){
  const dark = t === 'dark';
  root.setAttribute('data-theme', t);
  root.setAttribute('data-bs-theme', t);   /* ⭐ Bootstrap 5.3 native dark mode */
  ['themeIcon','themeIconM'].forEach(id=>{
    const i = document.getElementById(id);
    if(i) i.className = dark ? 'bi bi-sun' : 'bi bi-moon-stars';
  });
  if(metaTheme) metaTheme.setAttribute('content', dark ? '#0b1322' : '#38bdf8');
  try{ localStorage.setItem('pp-theme', t); }catch(e){}
}
(function(){
  let saved = null; try{ saved = localStorage.getItem('pp-theme'); }catch(e){}
  applyTheme(saved ? saved : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
})();
function toggleTheme(){ applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); }
document.getElementById('themeBtn').addEventListener('click', toggleTheme);
document.getElementById('themeBtnM').addEventListener('click', toggleTheme);

/* ===== PRELOADER ===== */
(function(){
  const fill = document.getElementById('plFill');
  const pct  = document.getElementById('plPct');
  const pre  = document.getElementById('preloader');
  const DUR  = 1800;
  const start = performance.now();
  root.classList.add('lock');
  function step(now){
    const p = Math.min(100, Math.round((now - start) / DUR * 100));
    fill.style.width = p + '%';
    pct.textContent = p + '%';
    if(p < 100){ requestAnimationFrame(step); }
    else{
      setTimeout(()=>{
        pre.classList.add('done');
        document.body.classList.add('loaded');
        root.classList.remove('lock');
      }, 250);
    }
  }
  requestAnimationFrame(step);
})();

/* ===== MOBILE MENU ===== */
const mMenu = document.getElementById('mMenu'), mOverlay = document.getElementById('mOverlay');
function openMenu(){
  mMenu.classList.add('open'); mOverlay.classList.add('show');
  mMenu.setAttribute('aria-hidden','false');
  document.body.classList.add('lock');
}
function closeMenu(){
  mMenu.classList.remove('open'); mOverlay.classList.remove('show');
  mMenu.setAttribute('aria-hidden','true');
  document.body.classList.remove('lock');
}
document.getElementById('burger').addEventListener('click', openMenu);
document.getElementById('mClose').addEventListener('click', closeMenu);
mOverlay.addEventListener('click', closeMenu);
mMenu.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', closeMenu));
addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });

/* ===== ID CARD — shake on tap ===== */
const hang = document.getElementById('hang'), card = document.getElementById('card');
function shakeCard(){ hang.classList.remove('shaking'); void hang.offsetWidth; hang.classList.add('shaking'); }
hang.addEventListener('animationend', e => { if(e.animationName === 'shakeA') hang.classList.remove('shaking'); });
card.addEventListener('click', shakeCard);
card.addEventListener('keydown', e => {
  if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); shakeCard(); }
});

/* ===== scroll reveal ===== */
const io = new IntersectionObserver(es => es.forEach(e => {
  if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
}), {threshold:.12});
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* ===== active nav link ===== */
const secs = document.querySelectorAll('section[id], header[id]');
addEventListener('scroll', () => {
  let cur = 'home';
  secs.forEach(s => { if(scrollY >= s.offsetTop - 140) cur = s.id; });
  document.querySelectorAll('.d-links a, .m-links a').forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
});

/* ===== contact form → WhatsApp ===== */
document.getElementById('waForm').addEventListener('submit', e => {
  e.preventDefault();
  const n  = document.getElementById('fName').value.trim();
  const em = document.getElementById('fEmail').value.trim();
  const p  = document.getElementById('fProj').value.trim();
  const m  = document.getElementById('fMsg').value.trim();
  const text =
`Hi Prashanth! 👋

My name is ${n}.

Email:
 ${em}

I'm interested in:
 ${p || '—'}

Message:
 ${m}

I found your portfolio and would like to connect.`;
  window.open('https://wa.me/919966391419?text=' + encodeURIComponent(text), '_blank');
});