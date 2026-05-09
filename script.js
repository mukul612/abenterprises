(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------- Nav --------
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 12) nav.classList.add('on');
      else nav.classList.remove('on');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // -------- Mobile menu --------
  const ham = document.getElementById('ham');
  const mMenu = document.getElementById('m-menu');
  if (ham && mMenu) {
    const close = () => {
      ham.setAttribute('aria-expanded', 'false');
      mMenu.hidden = true;
    };
    const toggle = () => {
      const open = ham.getAttribute('aria-expanded') === 'true';
      ham.setAttribute('aria-expanded', open ? 'false' : 'true');
      mMenu.hidden = open;
    };
    ham.addEventListener('click', toggle);
    mMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  // -------- Live readout (hero) --------
  const live = {
    t: document.querySelector('[data-live="t"]'),
    p: document.querySelector('[data-live="p"]'),
    f: document.querySelector('[data-live="f"]'),
  };
  if (!reduceMotion && live.t && live.p && live.f) {
    let v = { t: 842, p: 47.2, f: 36.4 };
    const tick = () => {
      v.t = Math.max(720, Math.min(980, v.t + (Math.random() - 0.5) * 22));
      v.p = Math.max(30, Math.min(85, v.p + (Math.random() - 0.5) * 3));
      v.f = Math.max(28, Math.min(48, v.f + (Math.random() - 0.5) * 1.2));
      live.t.textContent = v.t.toFixed(0);
      live.p.textContent = v.p.toFixed(1);
      live.f.textContent = v.f.toFixed(1);
    };
    setInterval(tick, 900);
  }

  // -------- Product table interaction --------
  const PRODUCT_DATA = {
    'abe-15':  { code: 'ABE-15A / ABE-15AB', power: '15 kW',  freq: '30 – 80 kHz',   apps: 'Brazing, soldering, end heating, annealing — small components',
                 img: 'https://2.wlimg.com/product_images/bc-small/dir_23/682280/induction-heating-unit-abe-05a-1697033.jpg' },
    'abe-25':  { code: 'ABE-25AB',           power: '25 kW',  freq: '20 – 50 kHz',   apps: 'Double-station brazing for hand tools and auto components',
                 img: 'https://2.wlimg.com/product_images/bc-small/2024/1/682280/induction-heating-unit-abe-25ab-1706684869-1697055.jpeg' },
    'abe-40':  { code: 'ABE-40AB',           power: '40 kW',  freq: '10 – 30 kHz',   apps: 'CI ring heating, shrink-fit, hardening',
                 img: 'https://abinduction.in/wp-content/uploads/2026/04/2.webp' },
    'abe-50':  { code: 'ABE-50AB',           power: '50 kW',  freq: '8 – 25 kHz',    apps: 'Vertical hardening, axle shafts, dual ring/bush heating',
                 img: 'https://abinduction.in/wp-content/uploads/2024/09/induction-hardening-machine.jpg' },
    'abe-60':  { code: 'ABE-60AB',           power: '60 kW',  freq: '100 – 500 kHz', apps: 'Ultra high-frequency hardening — gears, valves, pins',
                 img: 'https://abinduction.in/wp-content/uploads/2026/02/3.png' },
    'abe-120': { code: 'ABE-120AB',          power: '120 kW', freq: '3 – 10 kHz',    apps: 'Flywheel ring hardening, heavy components',
                 img: 'https://abinduction.in/wp-content/uploads/2026/01/ab-2-400x284.jpeg' },
    'rect':    { code: 'IGBT Rectifier',     power: '12 – 24 V / up to 10,000 A', freq: 'DC',
                 apps: 'Air-cooled IGBT electroplating rectifier',
                 img: 'https://abinduction.in/wp-content/uploads/2026/01/abg-1-400x284.jpeg' },
    'custom':  { code: 'Custom automation',  power: 'Bespoke', freq: 'Bespoke',
                 apps: 'PLC / CNC automation tailored to your part, throughput and cell layout',
                 img: 'https://abinduction.in/wp-content/uploads/2026/02/6.png' },
  };

  const prodTable = document.getElementById('prod-table');
  const prodImg = document.getElementById('prod-img');
  const prodImgWrap = prodImg ? prodImg.parentElement : null;
  const prodTargets = document.querySelectorAll('[data-prod]');

  if (prodTable && prodImg && prodTargets.length) {
    const setActive = (id) => {
      const data = PRODUCT_DATA[id];
      if (!data) return;
      prodTable.querySelectorAll('tbody tr').forEach(tr => {
        tr.classList.toggle('on', tr.dataset.id === id);
      });
      prodTargets.forEach(el => {
        const key = el.dataset.prod;
        if (data[key]) el.textContent = data[key];
      });
      if (prodImgWrap && prodImg.src !== data.img) {
        prodImgWrap.classList.add('fade');
        setTimeout(() => {
          prodImg.src = data.img;
          prodImg.alt = data.code + ' — ' + data.apps;
          prodImg.onload = () => prodImgWrap.classList.remove('fade');
          prodImg.onerror = () => prodImgWrap.classList.remove('fade');
        }, 160);
      }
    };

    prodTable.querySelectorAll('tbody tr').forEach(tr => {
      const id = tr.dataset.id;
      if (!id) return;
      tr.addEventListener('mouseenter', () => setActive(id));
      tr.addEventListener('focusin', () => setActive(id));
      tr.addEventListener('click', () => setActive(id));
    });
  }

  // -------- Contact form --------
  const form = document.getElementById('c-form');
  const sent = document.getElementById('sent');
  const sentReset = document.getElementById('sent-reset');
  if (form && sent) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      Array.from(form.querySelectorAll('input, select, textarea, button[type="submit"], small'))
        .forEach(el => { el.style.display = 'none'; });
      Array.from(form.querySelectorAll('.g2, .fld'))
        .forEach(el => { el.style.display = 'none'; });
      sent.hidden = false;
    });
    if (sentReset) {
      sentReset.addEventListener('click', () => {
        form.reset();
        Array.from(form.querySelectorAll('input, select, textarea, button[type="submit"], small'))
          .forEach(el => { el.style.display = ''; });
        Array.from(form.querySelectorAll('.g2, .fld'))
          .forEach(el => { el.style.display = ''; });
        sent.hidden = true;
      });
    }
  }

  // -------- Reveal on scroll --------
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.sec, .strip, .pair, .ws-grid, .proc-list, .apps-list, .ind-list');
    targets.forEach(t => t.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(t => io.observe(t));
  }

  // -------- Highlight current page link --------
  const path = location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-l a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === path || (path === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

})();
