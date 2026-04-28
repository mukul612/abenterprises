/* ─────────────────────────────────────────────
   AB Induction · Site interactions
   ───────────────────────────────────────────── */

(function () {
  "use strict";

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ── Footer year ─────────────────────────── */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Sticky nav shadow ───────────────────── */
  const nav = $("#nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-stuck", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu toggle ──────────────────── */
  const toggle = $(".nav__toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$(".nav__links a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ── Reveal on scroll ────────────────────── */
  const revealTargets = [
    ".section__head",
    ".product",
    ".cap",
    ".ind",
    ".step",
    ".why__copy",
    ".quote",
    ".cta__copy",
    ".form",
  ];
  const revealEls = $$(revealTargets.join(","));
  revealEls.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ── Counter animation ───────────────────── */
  const counters = $$("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const dur = 1400;
          const start = performance.now();
          const tick = (t) => {
            const k = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - k, 3);
            const v = target * eased;
            el.textContent = target >= 100
              ? Math.round(v).toLocaleString()
              : v.toFixed(target % 1 ? 1 : 0);
            if (k < 1) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString();
          };
          requestAnimationFrame(tick);
          co.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => co.observe(el));
  }

  /* ── Product card cursor glow ────────────── */
  $$(".product").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
    });
  });

  /* ── Coil readout: live ticker ───────────── */
  const oscillators = {
    freq:  { el: $('[data-osc="freq"]'),  base: 25.4, range: 1.2, decimals: 1 },
    temp:  { el: $('[data-osc="temp"]'),  base: 1080, range: 40,  decimals: 0 },
    power: { el: $('[data-osc="power"]'), base: 86,   range: 8,   decimals: 0 },
  };
  let phase = 0;
  let lastTick = 0;
  const tickReadout = (t) => {
    if (t - lastTick > 220) {
      lastTick = t;
      phase += 0.6;
      Object.values(oscillators).forEach((o, i) => {
        if (!o.el) return;
        const v = o.base + Math.sin(phase + i * 1.4) * o.range
                + (Math.random() - 0.5) * o.range * 0.3;
        o.el.textContent = o.decimals === 0
          ? Math.round(v).toString()
          : v.toFixed(o.decimals);
      });
    }
    requestAnimationFrame(tickReadout);
  };
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    requestAnimationFrame(tickReadout);
  }

  /* ── Form submission (no backend yet) ────── */
  const form = $(".form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const original = btn.innerHTML;
      btn.disabled = true;
