/* ═══════════════════════════════════════════════════════════
   PORTFOLIO MEHDI ENNAR  script.js
   ═══════════════════════════════════════════════════════════ */

/* ─── NAVIGATION (SPA) ───────────────────────────────────────── */
let currentPage = 'home';

function navigateTo(pageId) {
  if (pageId === currentPage) return;

  const oldPage = document.getElementById('page-' + currentPage);
  const newPage = document.getElementById('page-' + pageId);
  if (!newPage) return;

  if (oldPage) oldPage.classList.remove('active');

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === pageId);
  });

  newPage.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  currentPage = pageId;

  setTimeout(() => {
    initReveal();
    if (pageId === 'home') initGauges();
  }, 30);
}

function bindNavLinks() {
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-page]');
    if (a) {
      e.preventDefault();
      navigateTo(a.dataset.page);
      document.getElementById('nav-links').classList.remove('open');
    }
  });

  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (toggle) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  }
}

/* ─── NAV SCROLL EFFECT / BACK TO TOP ────────────────────────── */
window.addEventListener('scroll', () => {
  const btn = document.getElementById('back-to-top');
  if (btn) btn.classList.toggle('visible', window.scrollY > 300);
});

document.getElementById('back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── REVEAL ON SCROLL (discret, une seule fois) ─────────────── */
let revealObserver;
function initReveal() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('.bar-fill[data-width]').forEach(bar => {
          if (!bar.dataset.animated) {
            bar.style.width = bar.dataset.width + '%';
            bar.dataset.animated = 'true';
          }
        });
        if (entry.target.classList.contains('skill-card')) {
          const val = entry.target.dataset.skillVal;
          const fill = entry.target.querySelector('.skill-meter-fill');
          if (fill && !fill.dataset.animated) {
            fill.style.width = val + '%';
            fill.dataset.animated = 'true';
          }
        }
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('#page-' + currentPage + ' .reveal').forEach(el => {
    if (!el.classList.contains('visible')) revealObserver.observe(el);
  });
}

function initGauges() {
  document.querySelectorAll('.skill-card[data-skill-val]').forEach(card => {
    const fill = card.querySelector('.skill-meter-fill');
    if (fill && !fill.dataset.animated) {
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          fill.style.width = card.dataset.skillVal + '%';
          fill.dataset.animated = 'true';
          obs.disconnect();
        }
      }, { threshold: 0.2 });
      obs.observe(card);
    }
  });
}

/* ─── COUNTER ANIMATION (stats veille) ───────────────────────── */
function animateCounters() {
  document.querySelectorAll('.veille-stat strong').forEach(el => {
    if (el.dataset.counted) return;
    const raw = el.textContent.trim();
    const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return;
    const suffix = raw.replace(/[0-9.]/g, '').trim();
    el.dataset.counted = '1';
    const duration = 900;
    const start = performance.now();
    (function update(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      const val = num < 10 ? (ease * num).toFixed(1) : Math.floor(ease * num);
      el.textContent = val + (suffix ? ' ' + suffix : '');
      if (p < 1) requestAnimationFrame(update);
      else el.textContent = raw;
    })(start);
  });
}

function initVeilleCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounters(); obs.disconnect(); } });
  }, { threshold: 0.3 });
  document.querySelectorAll('.veille-stats-grid').forEach(el => obs.observe(el));
}

/* ─── BAR FILLS OBSERVER (page d'accueil) ─────────────────────── */
function initBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill[data-width]').forEach(bar => {
          if (!bar.dataset.animated) {
            bar.style.width = bar.dataset.width + '%';
            bar.dataset.animated = 'true';
          }
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.skill-bars').forEach(el => obs.observe(el));
}

/* ─── INIT ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  bindNavLinks();
  initReveal();
  initGauges();
  initBars();
  initVeilleCounters();

  const homePage = document.getElementById('page-home');
  if (homePage) homePage.classList.add('active');
});
