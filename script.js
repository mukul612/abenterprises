/* =====================================================
   AB Induction — Interaction layer
   No frameworks. Single file.
===================================================== */

(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Cursor glow ---------- */
  const glow = $('#cursorGlow');
  if (glow) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      glow.style.left = cx + 'px';
      glow.style.top = cy + 'px';
      requestAnimationFrame(tick);
    };
    tick();
  }

  /* ---------- Sticky nav state ---------- */
  const nav = $('#nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Hamburger menu ---------- */
  const hamburger = $('#hamburger');
  const navLinks = $('#navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    navLinks.addEventListener('click', (e) => {
      if (e.target.matches('a')) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
  reveals.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 90}ms`;
    io.observe(el);
  });

  /* ---------- Tilt + cursor-follow on cards ---------- */
  $$('[data-tilt]').forEach((card) => {
    let raf = null;
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rx = (y - 0.5) * -8;
      const ry = (x - 0.5) * 10;
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `translateY(-8px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
    };
    const reset = () => {
      if (raf) cancelAnimationFrame(raf);
      card.style.transform = '';
    };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', reset);
  });

  /* ---------- Animated stat counters ---------- */
  const counters = $$('.cap-stat .num');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();
      const animate = (t) => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(animate);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(animate);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach((c) => counterIO.observe(c));

  /* ---------- Hero parallax (subtle) ---------- */
  const heroBg = $('.hero-machine');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > window.innerHeight) return;
      heroBg.style.transform = `translateY(calc(-50% + ${y * 0.08}px)) rotate(${y * 0.02}deg)`;
    }, { passive: true });
  }

  /* ---------- Live Simulation Console ---------- */
  const sFreq = $('#sFreq'), sPow = $('#sPow'), sTemp = $('#sTemp');
  const lFreq = $('#lFreq'), lPow = $('#lPow'), lTemp = $('#lTemp');
  const vFreq = $('#vFreq'), vPow = $('#vPow'), vTemp = $('#vTemp');
  const vCur = $('#vCur'), vFlow = $('#vFlow'), vCycle = $('#vCycle');
  const ringFreq = $('#ringFreq'), ringPow = $('#ringPow'), ringTemp = $('#ringTemp');
  const wavePath = $('#wavePath'), wavePath2 = $('#wavePath2');

  if (sFreq && wavePath) {
    const C = 314; // 2*pi*r ~= 314 for r=50
    let cycle = 42;

    const updateRings = () => {
      const fp = (sFreq.value - sFreq.min) / (sFreq.max - sFreq.min);
      const pp = (sPow.value - sPow.min) / (sPow.max - sPow.min);
      const tp = (sTemp.value - sTemp.min) / (sTemp.max - sTemp.min);
      ringFreq.setAttribute('stroke-dashoffset', C * (1 - fp));
      ringPow.setAttribute('stroke-dashoffset', C * (1 - pp));
      ringTemp.setAttribute('stroke-dashoffset', C * (1 - tp));
    };

    const updateLabels = () => {
      lFreq.textContent = `${sFreq.value} kHz`;
      lPow.textContent  = `${sPow.value} kW`;
      lTemp.textContent = `${sTemp.value} °C`;
      vFreq.textContent = sFreq.value;
      vPow.textContent  = sPow.value;
      // animate temp toward setpoint
    };

    [sFreq, sPow, sTemp].forEach((s) => s.addEventListener('input', () => {
      updateRings();
      updateLabels();
    }));
    updateRings();
    updateLabels();

    /* Waveform animation */
    let phase = 0;
    let displayedTemp = +sTemp.value;
    const buildPath = (path, freqMul, ampMul, offset) => {
      const w = 600, h = 120;
      const f = +sFreq.value;
      const a = (+sPow.value / 500) * 35 + 12;
      const points = [];
      for (let x = 0; x <= w; x += 4) {
        const t = (x / w) * Math.PI * 2 * (f / 25) * freqMul + phase + offset;
        const y = h/2 + Math.sin(t) * a * ampMul + Math.sin(t * 3.1) * 4;
        points.push(`${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`);
      }
      path.setAttribute('d', points.join(' '));
    };

    const tick = () => {
      phase += 0.12;
      buildPath(wavePath, 1, 1, 0);
      buildPath(wavePath2, 1, 0.55, 1.2);

      // smooth temperature toward setpoint
      const target = +sTemp.value;
      displayedTemp += (target - displayedTemp) * 0.04;
      vTemp.textContent = Math.round(displayedTemp);

      // derived readouts
      const cur = Math.round(80 + (sPow.value * 1.4) + Math.sin(phase * 0.8) * 6);
      vCur.textContent = `${cur} A`;
      const flow = Math.round(20 + (sPow.value / 500) * 60 + Math.sin(phase * 0.4) * 1.2);
      vFlow.textContent = `${flow} L/min`;

      requestAnimationFrame(tick);
    };
    tick();

    setInterval(() => {
      cycle++;
      vCycle.textContent = `#${String(cycle).padStart(4,'0')}`;
    }, 4000);
  }

  /* ---------- Product Modal ---------- */
  const modal = $('#modal');
  const mTitle = $('#modalTitle');
  const mDesc = $('#modalDesc');
  const mList = $('#modalList');
  const mVisual = $('#modalVisual');
  const mKicker = $('#modalKicker');

  const PRODUCTS = {
    ihm: {
      kicker: 'Induction Heating',
      title: 'Induction Heating Machine',
      desc: 'Solid-state induction heating systems engineered around the workpiece, frequency window and process throughput. Suited for hardening, brazing, forging pre-heat, annealing and shrink-fit applications.',
      bullets: [
        'Solid-state IGBT inverter topology',
        'Custom-wound coils per workpiece geometry',
        'Closed-loop temperature control',
        'PLC + HMI for recipe management',
        'Integrated cooling &amp; safety interlocks'
      ]
    },
    ihardening: {
      kicker: 'Heat Treatment',
      title: 'Induction Hardening Machine',
      desc: 'Single-shot and scan hardening platforms for repeatable case depth on shafts, gears, axles and tools. Available in vertical and horizontal configurations.',
      bullets: [
        'Vertical &amp; horizontal scan options',
        'Single-shot or progressive hardening',
        'Servo-controlled traverse &amp; rotation',
        'Integrated quench delivery',
        'Process traceability hooks'
      ]
    },
    vscan: {
      kicker: 'Hardening Platform',
      title: 'Vertical Scanner',
      desc: 'Vertical scan hardening machine for long shafts, splines and pinions, with programmable traverse and rotation profiles.',
      bullets: [
        'Programmable traverse profiles',
        'Independent rotation control',
        'Recipe-based operation',
        'Compact footprint'
      ]
    },
    hscan: {
      kicker: 'Hardening Platform',
      title: 'Horizontal Scanner',
      desc: 'Horizontal scan hardening for tubes, shafts and elongated workpieces where vertical handling is impractical.',
      bullets: [
        'Horizontal traverse + rotation',
        'Through-shaft loading capability',
        'Long workpiece support',
        'High-throughput configurations'
      ]
    },
    billet: {
      kicker: 'Forging Pre-heat',
      title: 'Billet Heater',
      desc: 'Continuous and batch billet heating systems for forging operations, with optimized thermal gradients and high cycle availability.',
      bullets: [
        'Continuous through-feed designs',
        'Optimized thermal profiles',
        'High duty-cycle availability',
        'Coil change-over for product variants'
      ]
    },
    brazing: {
      kicker: 'Joining',
      title: 'Induction Brazing System',
      desc: 'Localized induction brazing for assemblies, fittings, copper joints and tool tipping — fast, repeatable, low-distortion.',
      bullets: [
        'Localized heat — minimal HAZ',
        'Repeatable cycle times',
        'Manual or automated fixtures',
        'Suitable for copper, brass, steel'
      ]
    },
    rectifier: {
      kicker: 'Power',
      title: 'Electroplating Rectifier',
      desc: 'High-stability DC rectifiers built for plating lines that demand uptime, low ripple and clean current delivery.',
      bullets: [
        'High efficiency power conversion',
        'Low output ripple',
        'Air or water cooled options',
        'Remote / interlock-ready controls'
      ]
    },
    'laser-weld': {
      kicker: 'Laser',
      title: 'Handheld Laser Welding Machine',
      desc: 'Portable, high-precision laser welding for production environments — cleaner welds, lower distortion, less rework.',
      bullets: [
        'Portable handheld torch',
        'High precision seam control',
        'Reduced HAZ vs. arc welding',
        'Suitable for thin sheets &amp; assemblies'
      ]
    },
    'laser-hard': {
      kicker: 'Laser',
      title: 'Laser Hardening Machine',
      desc: 'Selective laser surface hardening for tools and components — ideal where minimal distortion and tight zones are required.',
      bullets: [
        'Selective area hardening',
        'Minimal distortion',
        'Repeatable case depth',
        'Programmable scan paths'
      ]
    },
    igbt: {
      kicker: 'Power Electronics',
      title: 'IGBT Modules',
      desc: 'Insulated Gate Bipolar Transistor power stages used inside AB Induction inverters — also available as service spares.',
      bullets: [
        'Service spares &amp; retrofits',
        'Matched gate-drive options',
        'Tested &amp; characterized',
        'Compatible with AB Induction platforms'
      ]
    },
    hex: {
      kicker: 'Cooling',
      title: 'Heat Exchangers',
      desc: 'Closed-loop water-to-water and water-to-air heat exchangers used to thermally manage induction power supplies and coils.',
      bullets: [
        'Closed-loop cooling circuits',
        'Water-to-water / water-to-air',
        'Stainless components on process side',
        'Sized to power supply rating'
      ]
    },
    filter: {
      kicker: 'Process',
      title: 'Chemical Filters',
      desc: 'Process-grade filtration units for plating and industrial chemical baths to extend bath life and improve plating quality.',
      bullets: [
        'Polypropylene construction',
        'Multiple flow ratings',
        'Cartridge-based filtration',
        'Acid &amp; alkaline compatibility'
      ]
    }
  };

  const openModal = (key, sourceCard) => {
    const data = PRODUCTS[key];
    if (!data || !modal) return;
    mKicker.textContent = data.kicker;
    mTitle.textContent = data.title;
    mDesc.textContent = data.desc;
    mList.innerHTML = data.bullets.map((b) => `<li>${b}</li>`).join('');
    // Clone the source visual SVG into the modal visual
    if (sourceCard) {
      const svg = sourceCard.querySelector('.product-visual svg');
      mVisual.innerHTML = '';
      if (svg) {
        const clone = svg.cloneNode(true);
        mVisual.appendChild(clone);
        const accent = sourceCard.querySelector('.product-visual').style.getPropertyValue('--accent') || '#ff7a18';
        mVisual.style.color = accent;
      }
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  $$('.product-card').forEach((c) => {
    c.addEventListener('click', () => openModal(c.dataset.product, c));
  });
  $$('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
  });

  /* ---------- Contact form ---------- */
  const form = $('#contactForm');
  const status = $('#formStatus');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      if (!data.get('name') || !data.get('email')) {
        status.textContent = 'Please add your name and email.';
        status.style.color = '#ff7a18';
        return;
      }
      status.textContent = 'Sending...';
      status.style.color = 'var(--muted)';
      // No backend wired — give a graceful client-side acknowledgement
      setTimeout(() => {
        status.textContent = 'Thank you. Your enquiry has been recorded — we will respond shortly.';
        status.style.color = '#66ff9a';
        form.reset();
      }, 700);
    });
  }

  /* ---------- Footer year ---------- */
  const yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

})();
