/* =============================================================
   EAGLE'S WINGS COMMUNITY GROUP — v4.0 Premium JavaScript
   ============================================================= */

/* ─────────────────────────────────────────────────
   1. SCROLL PROGRESS BAR
───────────────────────────────────────────────── */
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = (window.scrollY / total * 100) + '%';
}, { passive: true });

/* ─────────────────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = -200, my = -200, rx = -200, ry = -200;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

(function lerpRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(lerpRing);
})();

document.querySelectorAll('a, button, [data-tilt], .gal-item, .involve-card, .prog-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ─────────────────────────────────────────────────
   3. MOUSE TRAIL (14 dots)
───────────────────────────────────────────────── */
const TRAIL_COUNT = 14;
const trailDots = [];
for (let i = 0; i < TRAIL_COUNT; i++) {
  const d = document.createElement('div');
  d.style.cssText = `
    position:fixed; pointer-events:none; z-index:9997;
    border-radius:50%; transform:translate(-50%,-50%);
    transition:opacity .4s;
    background:rgba(212,160,23,${(1 - i / TRAIL_COUNT) * 0.45});
    width:${8 - i * 0.4}px; height:${8 - i * 0.4}px;
  `;
  document.body.appendChild(d);
  trailDots.push({ el: d, x: -200, y: -200 });
}

(function trailLoop() {
  let px = mx, py = my;
  trailDots.forEach((t, i) => {
    const lag = 0.25 - i * 0.012;
    t.x += (px - t.x) * lag;
    t.y += (py - t.y) * lag;
    t.el.style.left = t.x + 'px';
    t.el.style.top  = t.y + 'px';
    px = t.x; py = t.y;
  });
  requestAnimationFrame(trailLoop);
})();

/* ─────────────────────────────────────────────────
   4. HERO CANVAS PARTICLE NETWORK
───────────────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - .5) * .6,
      vy: (Math.random() - .5) * .6,
      r:  Math.random() * 2.5 + 1
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 80 }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212,160,23,.55)';
      ctx.fill();
    });
    // Connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(212,160,23,${.18 * (1 - dist / 120)})`;
          ctx.lineWidth = .8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init);
  init(); draw();
})();

/* ─────────────────────────────────────────────────
   5. CLICK PARTICLE BURST
───────────────────────────────────────────────── */
document.addEventListener('click', e => {
  const colors = ['#D4A017','#FFD740','#003DA5','#fff','#1a6ee0'];
  for (let i = 0; i < 14; i++) {
    const spark = document.createElement('div');
    const angle = (Math.PI * 2 / 14) * i;
    const dist  = 50 + Math.random() * 60;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    spark.style.cssText = `
      position:fixed; left:${e.clientX}px; top:${e.clientY}px;
      width:${4 + Math.random() * 5}px; height:${4 + Math.random() * 5}px;
      border-radius:50%; pointer-events:none; z-index:99999;
      background:${colors[Math.floor(Math.random() * colors.length)]};
    `;
    document.body.appendChild(spark);
    spark.animate([
      { transform:'translate(-50%,-50%) translate(0,0) scale(1)', opacity:1 },
      { transform:`translate(-50%,-50%) translate(${tx}px,${ty}px) scale(0)`, opacity:0 }
    ], { duration: 600 + Math.random() * 400, easing:'cubic-bezier(.4,0,.2,1)' }).onfinish = () => spark.remove();
  }
});

/* ─────────────────────────────────────────────────
   6. RIPPLE EFFECT
───────────────────────────────────────────────── */
document.querySelectorAll('.btn, .btn-donate-nav, .btn-submit-form').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const r = document.createElement('span');
    r.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
    this.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });
});

/* ─────────────────────────────────────────────────
   7. NAVBAR SCROLL HANDLER
───────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─────────────────────────────────────────────────
   8. HAMBURGER / MOBILE NAV
───────────────────────────────────────────────── */
const hamburger    = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  mobileOverlay.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileOverlay.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─────────────────────────────────────────────────
   9. SMOOTH SCROLL
───────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────────────────
   10. SCROLL SPY (IntersectionObserver)
───────────────────────────────────────────────── */
const sections    = document.querySelectorAll('section[id]');
const navLinks    = document.querySelectorAll('.nav-center .nav-link');
const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-center .nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => spyObserver.observe(s));

/* ─────────────────────────────────────────────────
   11. SCROLL REVEAL
───────────────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─────────────────────────────────────────────────
   12. IMPACT COUNTERS (cubic ease)
───────────────────────────────────────────────── */
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.target);
    const dur    = 1800;
    const start  = performance.now();
    (function update(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor(easeOut(p) * target);
      if (p < 1) requestAnimationFrame(update);
      else el.textContent = target;
    })(start);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* ─────────────────────────────────────────────────
   13. TESTIMONIAL CAROUSEL (touch + autoplay)
───────────────────────────────────────────────── */
(function initCarousel() {
  const track = document.getElementById('testiTrack');
  const dots  = document.querySelectorAll('.testi-dot');
  const cards = document.querySelectorAll('.testi-card');
  if (!track || cards.length === 0) return;

  let current = 0;
  let timer;

  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  document.getElementById('testiPrev').addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  document.getElementById('testiNext').addEventListener('click', () => { goTo(current + 1); resetTimer(); });
  dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.index); resetTimer(); }));

  // Touch swipe
  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetTimer(); }
  });

  function resetTimer() { clearInterval(timer); timer = setInterval(() => goTo(current + 1), 5000); }
  resetTimer();
})();

/* ─────────────────────────────────────────────────
   14. GALLERY LIGHTBOX (keyboard nav)
───────────────────────────────────────────────── */
(function initLightbox() {
  const lb       = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lbImg');
  const lbCap    = document.getElementById('lbCaption');
  const items    = Array.from(document.querySelectorAll('.gal-item'));
  if (!lb) return;
  let current = 0;

  function open(idx) {
    current = idx;
    const item = items[idx];
    lbImg.src = item.dataset.src;
    lbCap.textContent = item.dataset.caption || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  function prev() { open((current - 1 + items.length) % items.length); }
  function next() { open((current + 1) % items.length); }

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', prev);
  document.getElementById('lbNext').addEventListener('click', next);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });
})();

/* ─────────────────────────────────────────────────
   15. HERO PARALLAX
───────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  document.querySelectorAll('.orb-1').forEach(o => o.style.transform = `translate(${sy*.08}px,${sy*.1}px)`);
  document.querySelectorAll('.orb-2').forEach(o => o.style.transform = `translate(-${sy*.06}px,${sy*.08}px)`);
  document.querySelectorAll('.hero-right').forEach(el => {
    el.style.transform = `translateY(${sy*.06}px)`;
  });
}, { passive: true });

/* ─────────────────────────────────────────────────
   16. MAGNETIC BUTTONS
───────────────────────────────────────────────── */
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * 0.3;
    const dy = (e.clientY - cy) * 0.3;
    this.style.transform = `translate(${dx}px,${dy}px) scale(1.04)`;
  });
  btn.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

/* ─────────────────────────────────────────────────
   17. 3D TILT CARDS
───────────────────────────────────────────────── */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect  = this.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    this.style.transform = `perspective(700px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale(1.03)`;
  });
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';
    this.style.transition = 'transform .4s ease';
  });
  card.addEventListener('mouseenter', function() { this.style.transition = 'none'; });
});

/* ─────────────────────────────────────────────────
   18. CTA MINI PARTICLES
───────────────────────────────────────────────── */
(function ctaParticles() {
  const container = document.getElementById('ctaParticles');
  if (!container) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    const size = 2 + Math.random() * 4;
    p.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px; border-radius:50%;
      background:rgba(255,255,255,${Math.random() * .3 + .05});
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      animation:ctaPFloat ${4 + Math.random() * 6}s ease-in-out infinite;
      animation-delay:-${Math.random() * 5}s;
    `;
    container.appendChild(p);
  }
  if (!document.querySelector('#ctaPStyle')) {
    const s = document.createElement('style');
    s.id = 'ctaPStyle';
    s.textContent = `
      @keyframes ctaPFloat {
        0%,100% { transform:translateY(0) scale(1); opacity:.5; }
        50%      { transform:translateY(-24px) scale(1.2); opacity:1; }
      }`;
    document.head.appendChild(s);
  }
})();

/* ─────────────────────────────────────────────────
   19. INPUT LABEL GLOW ON FOCUS
───────────────────────────────────────────────── */
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
  const group = input.closest('.form-group');
  input.addEventListener('focus', () => group.classList.add('glow'));
  input.addEventListener('blur',  () => group.classList.remove('glow'));
});

/* ─────────────────────────────────────────────────
   20. SECTION GLOW BORDER ON ENTER
───────────────────────────────────────────────── */
const glowObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('section-glow-active');
    else e.target.classList.remove('section-glow-active');
  });
}, { threshold: 0.2 });
document.querySelectorAll('.section').forEach(s => glowObs.observe(s));

/* ─────────────────────────────────────────────────
   21. BACK TO TOP
───────────────────────────────────────────────── */
const backTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─────────────────────────────────────────────────
   22. WEB3FORMS HANDLERS
───────────────────────────────────────────────── */
function handleForm(formId, successId) {
  const form    = document.getElementById(formId);
  const success = document.getElementById(successId);
  const btn     = form ? form.querySelector('button[type=submit]') : null;
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    btn.disabled = true;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const data = await res.json();
      if (data.success) {
        form.reset();
        success.style.display = 'block';
        setTimeout(() => { success.style.display = 'none'; }, 6000);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch {
      alert('Network error. Please check your connection.');
    } finally {
      btn.disabled   = false;
      btn.innerHTML  = originalHTML;
    }
  });
}

handleForm('donateForm',    'donateSuccess');
handleForm('volunteerForm', 'volunteerSuccess');
handleForm('contactForm',   'contactSuccess');

/* ─────────────────────────────────────────────────
   23. CODE PROTECTION
───────────────────────────────────────────────── */
(function protect() {

  // Disable right-click context menu
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });

  // Block common DevTools keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    const blocked = (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I','J','C','U'].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && ['U','S'].includes(e.key.toUpperCase())) ||
      (e.metaKey && e.altKey && e.key === 'I')
    );
    if (blocked) { e.preventDefault(); e.stopPropagation(); return false; }
  });

  // Disable text selection on non-input elements
  document.addEventListener('selectstart', function(e) {
    if (!['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) {
      e.preventDefault();
    }
  });

  // Console warning
  const style = 'color:#D4A017;font-size:20px;font-weight:bold;';
  const sub   = 'color:#fff;background:#003DA5;padding:4px 10px;border-radius:4px;font-size:13px;';
  console.log('%c Stop!', style);
  console.log('%c This website was built for Eagle\'s Wings Community Group. Unauthorized copying or reproduction is prohibited.', sub);

  // DevTools size-change detection
  const threshold = 160;
  setInterval(function() {
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      document.body.innerHTML = '';
      document.body.style.cssText = 'background:#0a0f1e;display:flex;align-items:center;justify-content:center;height:100vh;';
      const msg = document.createElement('div');
      msg.style.cssText = 'color:#D4A017;font-family:sans-serif;text-align:center;';
      msg.innerHTML = '<h2 style="font-size:2rem;margin-bottom:10px;">Access Denied</h2><p style="color:rgba(255,255,255,.6)">Please close Developer Tools and refresh.</p>';
      document.body.appendChild(msg);
    }
  }, 1000);

})();
