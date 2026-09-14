/* ===== DARK MODE (apply BEFORE preloader ends so theme is correct) ===== */
const root = document.documentElement;
const icons = ['themeIcon','themeIconM'].map(id=>document.getElementById(id));
function applyTheme(t){
  root.setAttribute('data-theme', t);
  icons.forEach(i=>{ if(i) i.className = t==='dark' ? 'bi bi-sun' : 'bi bi-moon-stars'; });
  try{ localStorage.setItem('pp-theme', t); }catch(e){}
}
(function(){
  let saved=null; try{ saved=localStorage.getItem('pp-theme'); }catch(e){}
  const dark = saved ? saved==='dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(dark?'dark':'light');
})();
function toggleTheme(){ applyTheme(root.getAttribute('data-theme')==='dark'?'light':'dark'); }
document.getElementById('themeBtn').addEventListener('click', toggleTheme);
document.getElementById('themeBtnM').addEventListener('click', toggleTheme);

/* ===== PRELOADER — starting page with progress, then reveal portfolio ===== */
(function(){
  const fill = document.getElementById('plFill');
  const pct  = document.getElementById('plPct');
  const pre  = document.getElementById('preloader');
  const DUR  = 1800;                     /* total loading time */
  const start = performance.now();

  function step(now){
    const p = Math.min(100, Math.round((now - start) / DUR * 100));
    fill.style.width = p + '%';
    pct.textContent = p + '%';
    if(p < 100){
      requestAnimationFrame(step);
    }else{
      /* fade out loader, then start the experience */
      setTimeout(()=>{
        pre.classList.add('done');
        document.body.classList.add('loaded');   /* triggers ID card drop + sway */
        document.documentElement.style.overflow = '';
      }, 250);
    }
  }
  document.documentElement.style.overflow = 'hidden';  /* block scroll while loading */
  requestAnimationFrame(step);
})();

/* ===== MOBILE MENU ===== */
const mMenu=document.getElementById('mMenu'), mOverlay=document.getElementById('mOverlay');
function openMenu(){ mMenu.classList.add('open'); mOverlay.classList.add('show');
  mMenu.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeMenu(){ mMenu.classList.remove('open'); mOverlay.classList.remove('show');
  mMenu.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
document.getElementById('burger').addEventListener('click', openMenu);
document.getElementById('mClose').addEventListener('click', closeMenu);
mOverlay.addEventListener('click', closeMenu);
mMenu.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click', closeMenu));
addEventListener('keydown', e=>{ if(e.key==='Escape') closeMenu(); });

/* ===== ID CARD — shake on touch ===== */
const hang=document.getElementById('hang'), card=document.getElementById('card');
function shakeCard(){ hang.classList.remove('shaking'); void hang.offsetWidth; hang.classList.add('shaking'); }
hang.addEventListener('animationend', e=>{
  if(e.animationName==='shakeA') hang.classList.remove('shaking');
});
card.addEventListener('click', shakeCard);
card.addEventListener('keydown', e=>{
  if(e.key==='Enter'||e.key===' '){ e.preventDefault(); shakeCard(); }
});

/* ===== scroll reveal (starts after loading) ===== */
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* ===== active nav link ===== */
const secs=document.querySelectorAll('section[id], header[id]');
addEventListener('scroll',()=>{
  let cur='home';
  secs.forEach(s=>{ if(scrollY>=s.offsetTop-140) cur=s.id; });
  document.querySelectorAll('.d-links a, .m-links a').forEach(a=>
    a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
});

/* ===== contact form → WhatsApp ===== */
document.getElementById('waForm').addEventListener('submit',e=>{
  e.preventDefault();
  const n=document.getElementById('fName').value.trim();
  const em=document.getElementById('fEmail').value.trim();
  const p=document.getElementById('fProj').value.trim();
  const m=document.getElementById('fMsg').value.trim();
  const text=
`Hi Prashanth! 👋

My name is ${n}.

Email:
 ${em}

I'm interested in:
 ${p || '—'}

Message:
 ${m}

I found your portfolio and would like to connect.`;
  window.open('https://wa.me/919966391419?text='+encodeURIComponent(text),'_blank');
});