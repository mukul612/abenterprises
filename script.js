/* ============================================================
   BLOOM MMA & FITNESS — 313
   Fight-night interactions: round-card intro, strike-wipe page
   transitions, impact reveals, scorecard counters, round clock.
   ============================================================ */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const round = document.body.dataset.round || "1";

  /* ---------- Round-card intro (plays on every page entry) ---------- */
  function initLoader() {
    const loader = document.querySelector(".round-loader");
    if (!loader) return;
    if (reduceMotion) { loader.remove(); return; }

    const finish = () => {
      loader.classList.add("done");
      setTimeout(() => loader.remove(), 700);
    };
    setTimeout(finish, 1350);
    loader.addEventListener("click", finish, { once: true });
  }

  /* ---------- Strike-wipe transition on internal navigation ---------- */
  function initTransitions() {
    const wipe = document.querySelector(".wipe");
    if (!wipe || reduceMotion) return;

    document.querySelectorAll('a[href$=".html"], a[href="index.html"]').forEach((link) => {
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin) return;
      link.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || link.target === "_blank") return;
        e.preventDefault();
        bell(140);
        wipe.classList.add("strike");
        setTimeout(() => { location.href = link.href; }, 430);
      });
    });

    // Restore state when navigating back from bfcache
    window.addEventListener("pageshow", (e) => {
      if (e.persisted) wipe.classList.remove("strike");
    });
  }

  /* ---------- Sticky nav + burger ---------- */
  function initNav() {
    const nav = document.querySelector(".nav");
    const burger = document.querySelector(".burger");
    const links = document.querySelector(".nav-links");

    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    }, { passive: true });

    if (burger && links) {
      burger.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        burger.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", open);
      });
      links.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => {
          links.classList.remove("open");
          burger.classList.remove("open");
        })
      );
    }
  }

  /* ---------- Strike-in reveals ---------- */
  function initReveals() {
    const items = document.querySelectorAll(".rv, .rv-l, .rv-r");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      items.forEach((el) => el.classList.add("hit"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("hit");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Judges' scorecard counters ---------- */
  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    const run = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const dur = 1400;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window) || reduceMotion) {
      counters.forEach((el) => { el.textContent = el.dataset.count; });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => io.observe(el));
  }

  /* ---------- Round clock: scroll progress as a 5:00 round ---------- */
  function initRoundClock() {
    const clock = document.querySelector(".round-clock");
    if (!clock) return;
    const rd = clock.querySelector(".rc-rd");
    const time = clock.querySelector(".rc-time");
    rd.textContent = "R" + round;

    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      const remaining = Math.round(300 * (1 - p)); // 5:00 round
      const m = Math.floor(remaining / 60);
      const s = String(remaining % 60).padStart(2, "0");
      time.textContent = m + ":" + s;
      clock.classList.toggle("clapper", remaining <= 10); // 10-second clapper
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  /* ---------- Click spark (impact flash at the point of contact) ---------- */
  function initSpark() {
    if (reduceMotion) return;
    document.addEventListener("pointerdown", (e) => {
      const s = document.createElement("span");
      s.className = "spark";
      s.style.left = e.clientX - 7 + "px";
      s.style.top = e.clientY - 7 + "px";
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 450);
    });
  }

  /* ---------- The bell (synthesized, fires on user gesture only) ---------- */
  let audioCtx = null;
  function bell(duration = 400) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const t = audioCtx.currentTime;
      [880, 1318, 1760].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12 / (i + 1), t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + duration / 1000);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + duration / 1000);
      });
    } catch (_) { /* no audio — fight on in silence */ }
  }
  function initBell() {
    document.querySelectorAll(".js-bell").forEach((el) => {
      el.addEventListener("click", () => bell(650));
    });
  }

  /* ---------- Contact form -> opens email app pre-filled ---------- */
  function initFightForm() {
    const form = document.querySelector(".fight-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      bell(650);
      const v = (name) => (form.elements[name] ? form.elements[name].value.trim() : "");
      const subject = encodeURIComponent("Free Trial Request — " + (v("name") || "New Fighter"));
      const body = encodeURIComponent(
        "Fighter name: " + v("name") +
        "\nPhone: " + v("phone") +
        "\nEmail: " + v("email") +
        "\nDivision (program): " + v("program") +
        "\nExperience: " + v("level") +
        "\n\nGame plan / message:\n" + v("message") +
        "\n\n— Sent from bloommma313.com"
      );
      location.href = "mailto:bloommma313@gmail.com?subject=" + subject + "&body=" + body;
      const note = form.querySelector(".form-sent");
      if (note) note.hidden = false;
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    const y = document.querySelector("[data-year]");
    if (y) y.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initTransitions();
    initNav();
    initReveals();
    initCounters();
    initRoundClock();
    initSpark();
    initBell();
    initFightForm();
    initYear();
  });
})();
