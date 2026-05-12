/* ====================================================================
   AB INDUCTION  ·  Cinematic Factory Journey
   GSAP + ScrollTrigger + Lenis powered interaction layer.
==================================================================== */

(() => {

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(hover: none)').matches;

  // GSAP plugin registration (libraries loaded via CDN)
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* --------------------------------------------------------------
     01 · PRELOADER — Ignite the factory
  -------------------------------------------------------------- */
  document.body.classList.add('loading');
  const preloader = $('#preloader');
  const plBar = $('#plBar');
  const plPct = $('#plPct');
  const plStatus = $('#plStatus');

  const dismissPreloader = () => {
    if (!preloader) return;
    preloader.classList.add('done');
    document.body.classList.remove('loading');
    setTimeout(() => preloader.remove(), 900);
  };

  if (preloader) {
    if (prefersReducedMotion) {
      dismissPreloader();
    } else {
      let pct = 0;
      const stages = [
        'IGNITING SYSTEMS',
        'WARMING COILS',
        'PRESSURISING',
        'SYNCING TELEMETRY',
        'OPENING DOORS'
      ];
      const tick = () => {
        const inc = Math.random() * 6 + (pct < 70 ? 4 : 1.2);
        pct = Math.min(100, pct + inc);
        plBar.style.width = pct + '%';
        plPct.textContent = String(Math.floor(pct)).padStart(2, '0');
        const stageIndex = Math.min(stages.length - 1, Math.floor((pct / 100) * stages.length));
        plStatus.innerHTML = `${stages[stageIndex]} · <em id="plPct">${String(Math.floor(pct)).padStart(2, '0')}</em>%`;
        if (pct < 100) {
          setTimeout(tick, 120 + Math.random() * 100);
        } else {
          setTimeout(dismissPreloader, 350);
        }
      };
      // Begin after a brief moment
      setTimeout(tick, 200);
      // Safety fallback
      setTimeout(dismissPreloader, 6000);
    }
  } else {
    document.body.classList.remove('loading');
  }

  /* --------------------------------------------------------------
     02 · LENIS SMOOTH SCROLL
  -------------------------------------------------------------- */
  let lenis = null;
  if (window.Lenis && !prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Bridge Lenis ↔ ScrollTrigger
    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* --------------------------------------------------------------
     03 · CUSTOM CURSOR HALO
  -------------------------------------------------------------- */
  const halo = $('#cursorHalo');
  const dot = $('#cursorDot');
  if (halo && dot && !isCoarse) {
    let tx = 0, ty = 0, hx = 0, hy = 0;
    document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    const tick = () => {
      hx += (tx - hx) * 0.18;
      hy += (ty - hy) * 0.18;
      halo.style.transform = `translate(${hx}px, ${hy}px) translate(-50%, -50%)`;
      dot.style.transform  = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();

    // Hover targets
    const hoverSelector = 'a, button, [data-tilt], [data-magnetic], input, textarea, label, .product-card, .ind-card, .hud-list li';
    document.body.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverSelector)) halo.classList.add('hover');
    });
    document.body.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverSelector)) halo.classList.remove('hover');
    });
  } else if (halo && dot) {
    halo.style.display = 'none';
    dot.style.display = 'none';
  }

  /* --------------------------------------------------------------
     04 · PARTICLE CANVAS — ambient sparks / embers
  -------------------------------------------------------------- */
  const canvas = $('#particles');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width  = window.innerWidth  + 'px';
      canvas.style.height = window.innerHeight + 'px';
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#ff7a18', '#ffb84d', '#ff5a3d', '#ffd791', '#fff5d6'];
    const MAX = (window.innerWidth < 720) ? 32 : 70;

    const spawn = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 80 * dpr,
        vx: (Math.random() - 0.5) * 0.6 * dpr,
        vy: -(Math.random() * 0.8 + 0.4) * dpr,
        r: (Math.random() * 1.6 + 0.4) * dpr,
        a: Math.random() * 0.6 + 0.2,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 0,
        max: Math.random() * 220 + 180
      });
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      while (particles.length < MAX) spawn();

      particles = particles.filter(p => p.life < p.max);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const fadeIn = Math.min(1, p.life / 40);
        const fadeOut = Math.min(1, (p.max - p.life) / 60);
        const alpha = p.a * fadeIn * fadeOut;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, p.c);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.globalAlpha = alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    };
    tick();
  } else if (canvas) {
    canvas.style.display = 'none';
  }

  /* --------------------------------------------------------------
     05 · NAVIGATION (sticky / mobile / active link)
  -------------------------------------------------------------- */
  const nav = $('#nav');
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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

  // Smooth anchor scrolling via Lenis (for nav & HUD)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: -40, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });

  /* --------------------------------------------------------------
     06 · JOURNEY HUD — right-side scene tracker
  -------------------------------------------------------------- */
  const hud = $('#journeyHud');
  const hudItems = $$('#journeyHud .hud-list li');
  if (hud) {
    setTimeout(() => hud.classList.add('ready'), 1200);

    hudItems.forEach(li => {
      li.addEventListener('click', () => {
        const target = document.querySelector(li.dataset.target);
        if (target && lenis) lenis.scrollTo(target, { offset: -40, duration: 1.4 });
        else if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Update active scene on scroll
    const scenes = $$('.scene');
    if (window.ScrollTrigger && !prefersReducedMotion) {
      scenes.forEach((scene) => {
        ScrollTrigger.create({
          trigger: scene,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) {
              hudItems.forEach(li => li.classList.toggle('active', li.dataset.target === '#' + scene.id));
              // Update nav link
              $$('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + scene.id));
            }
          }
        });
      });
    }
  }

  /* --------------------------------------------------------------
     07 · HERO — Title reveal + sub fade-in
  -------------------------------------------------------------- */
  if (window.gsap && !prefersReducedMotion) {
    const tl = gsap.timeline({ delay: 0.4 });
    tl.from('.hero-title .word', {
      yPercent: 110,
      duration: 1.05,
      stagger: 0.12,
      ease: 'expo.out',
    })
    .from('.eyebrow', { y: 16, opacity: 0, duration: .8, ease: 'power2.out' }, '-=.7')
    .from('.hero-sub', { y: 24, opacity: 0, duration: .8, ease: 'power2.out' }, '-=.55')
    .from('.hero-cta .btn', { y: 16, opacity: 0, duration: .7, stagger: .1, ease: 'power2.out' }, '-=.5')
    .from('.hero-stats .stat-pod', { y: 24, opacity: 0, duration: .7, stagger: .08, ease: 'power2.out' }, '-=.35')
    .from('.hero-meta div', { y: 16, opacity: 0, duration: .55, stagger: .06, ease: 'power2.out' }, '-=.35')
    .from('.scroll-cue', { opacity: 0, y: 20, duration: .8, ease: 'power2.out' }, '-=.3');

    // Hero machine drift on scroll
    gsap.to('.hero-machine', {
      yPercent: 30,
      rotate: 8,
      scale: 1.05,
      ease: 'none',
      scrollTrigger: {
        trigger: '.scene-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  /* --------------------------------------------------------------
     08 · PARALLAX DEPTH LAYERS  (per-scene)
  -------------------------------------------------------------- */
  if (window.gsap && !prefersReducedMotion) {
    $$('.scene').forEach((scene) => {
      $$('.layer', scene).forEach((layer) => {
        const depth = parseFloat(layer.dataset.depth) || 0.3;
        gsap.to(layer, {
          yPercent: -25 * depth,
          ease: 'none',
          scrollTrigger: {
            trigger: scene,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });
    });

    // Floor rail moves with scroll (under-floor effect)
    const floor = $('#floorRail');
    if (floor) {
      gsap.to(floor, {
        backgroundPositionY: '-1200px',
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        }
      });
    }
  }

  /* --------------------------------------------------------------
     09 · SECTION HEADS — staggered reveal
  -------------------------------------------------------------- */
  if (window.gsap && !prefersReducedMotion) {
    $$('.section-head').forEach((head) => {
      const target = head.querySelectorAll('.kicker, h2, .lead');
      gsap.from(target, {
        y: 40,
        opacity: 0,
        duration: .9,
        stagger: .12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: head,
          start: 'top 80%'
        }
      });
    });

    // Scene labels enter from right
    $$('.scene-label').forEach((label) => {
      gsap.from(label, {
        x: 30,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: label.closest('.scene'),
          start: 'top 90%'
        }
      });
    });
  }

  /* --------------------------------------------------------------
     10 · REVEAL ON SCROLL (cards + generic)
  -------------------------------------------------------------- */
  const reveals = $$('.reveal');
  if (window.ScrollTrigger && !prefersReducedMotion) {
    reveals.forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: .9,
        ease: 'power2.out',
        delay: Math.min(i % 4, 3) * 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
  } else {
    // Fallback IntersectionObserver
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
  }

  /* --------------------------------------------------------------
     11 · TRANSITIONS BETWEEN SCENES — cinematic timelines
  -------------------------------------------------------------- */
  if (window.gsap && !prefersReducedMotion) {

    // Doorway transition
    const doorway = $('.transition-doorway .doorway-light');
    if (doorway) {
      gsap.fromTo(doorway,
        { scale: .3, opacity: .2 },
        {
          scale: 1.6, opacity: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: '.transition-doorway',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        }
      );
    }

    // Iris transition — sweep open
    const irisL = $('.iris .iris-l');
    const irisR = $('.iris .iris-r');
    if (irisL && irisR) {
      gsap.fromTo([irisL, irisR],
        { xPercent: 0 },
        {
          xPercent: (i) => i === 0 ? -60 : 60,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: '.transition-iris',
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          }
        }
      );
    }

    // Tunnel — pull viewer through
    const tunnel = $('.tunnel');
    if (tunnel) {
      gsap.fromTo(tunnel,
        { scale: 1 },
        {
          scale: 1.6,
          ease: 'none',
          scrollTrigger: {
            trigger: '.transition-tunnel',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        }
      );
    }

    // Rack — pan across
    const rack = $('.transition-rack .rack');
    if (rack) {
      gsap.fromTo(rack,
        { xPercent: -10 },
        {
          xPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: '.transition-rack',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        }
      );
    }

    // Final approach — zoom into command center
    const finalGlow = $('.transition-final .final-glow');
    if (finalGlow) {
      gsap.fromTo(finalGlow,
        { scale: .4 },
        {
          scale: 1.8,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: '.transition-final',
            start: 'top bottom',
            end: 'bottom 20%',
            scrub: 1
          }
        }
      );
    }

    // Transition captions slide-in
    $$('.transition-caption').forEach((cap) => {
      gsap.from(cap, {
        x: -20,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: cap.parentElement, start: 'top 70%' }
      });
    });
  }

  /* --------------------------------------------------------------
     12 · MAGNETIC BUTTONS
  -------------------------------------------------------------- */
  if (!isCoarse) {
    $$('[data-magnetic]').forEach((btn) => {
      let raf = null;
      const onMove = (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          btn.style.transform = `translate(${x * 0.25}px, ${y * 0.3}px)`;
        });
      };
      const reset = () => {
        if (raf) cancelAnimationFrame(raf);
        btn.style.transform = '';
      };
      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', reset);
    });
  }

  /* --------------------------------------------------------------
     13 · TILT + SPOTLIGHT ON CARDS
  -------------------------------------------------------------- */
  if (!isCoarse) {
    $$('[data-tilt]').forEach((card) => {
      let raf = null;
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const rx = (y - 0.5) * -7;
        const ry = (x - 0.5) * 9;
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
  }

  /* --------------------------------------------------------------
     14 · ANIMATED STAT COUNTERS (capabilities + hero)
  -------------------------------------------------------------- */
  const animateCounter = (el, target, suffix, duration = 1800) => {
    const start = performance.now();
    const animate = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(animate);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(animate);
  };

  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.4 });

  $$('.cap-stat .num').forEach((c) => counterIO.observe(c));

  // Hero stats: animate when hero enters
  const heroStatsIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('strong[data-stat-num]').forEach((s) => {
        const t = +s.dataset.statNum;
        const suf = s.dataset.statSuffix || '';
        animateCounter(s, t, suf, 1400);
      });
      heroStatsIO.unobserve(e.target);
    });
  }, { threshold: 0.4 });

  const heroStats = $('.hero-stats');
  if (heroStats) heroStatsIO.observe(heroStats);

  /* --------------------------------------------------------------
     15 · LIVE CONSOLE — preserved from original site
  -------------------------------------------------------------- */
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
    };

    [sFreq, sPow, sTemp].forEach((s) => s.addEventListener('input', () => {
      updateRings();
      updateLabels();
    }));
    updateRings();
    updateLabels();

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

      const target = +sTemp.value;
      displayedTemp += (target - displayedTemp) * 0.04;
      vTemp.textContent = Math.round(displayedTemp);

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

  /* --------------------------------------------------------------
     16 · PRODUCT MODAL — preserved from original site
  -------------------------------------------------------------- */
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
        'Integrated cooling & safety interlocks'
      ]
    },
    ihardening: {
      kicker: 'Heat Treatment',
      title: 'Induction Hardening Machine',
      desc: 'Single-shot and scan hardening platforms for repeatable case depth on shafts, gears, axles and tools. Available in vertical and horizontal configurations.',
      bullets: [
        'Vertical & horizontal scan options',
        'Single-shot or progressive hardening',
        'Servo-controlled traverse & rotation',
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
        'Suitable for thin sheets & assemblies'
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
        'Service spares & retrofits',
        'Matched gate-drive options',
        'Tested & characterized',
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
        'Acid & alkaline compatibility'
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
    if (lenis) lenis.stop();
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  };

  $$('.product-card').forEach((c) => {
    c.addEventListener('click', () => openModal(c.dataset.product, c));
  });
  $$('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
  });

  /* --------------------------------------------------------------
     17 · CONTACT FORM
  -------------------------------------------------------------- */
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
      status.textContent = 'Transmitting to command center…';
      status.style.color = 'var(--muted)';
      setTimeout(() => {
        status.textContent = 'Received. We will respond shortly.';
        status.style.color = '#66ff9a';
        form.reset();
      }, 800);
    });
  }

  /* --------------------------------------------------------------
     18 · FOOTER YEAR
  -------------------------------------------------------------- */
  const yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* --------------------------------------------------------------
     19 · GRACEFUL FALLBACK if image backgrounds fail to load
     We test one URL; if it fails, signal CSS to swap to gradient.
  -------------------------------------------------------------- */
  const probe = new Image();
  probe.onerror = () => document.documentElement.classList.add('no-bg-images');
  probe.src = 'https://images.unsplash.com/photo-1565793979206-2d4e6c40d5e7?auto=format&fit=crop&w=300&q=60';

})();
