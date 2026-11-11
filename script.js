"use strict";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ---------- Year ---------- */
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

/* ---------- Header ---------- */
const header = document.querySelector(".site-header");
if (header) {
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

/* ---------- Mobile menu ---------- */
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
if (menuToggle && primaryNav) {
  const setMenu = (open) => {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "סגירת תפריט" : "פתיחת תפריט");
    primaryNav.classList.toggle("is-open", open);
  };
  menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
  primaryNav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
      setMenu(false);
      menuToggle.focus();
    }
  });
}

/* ---------- Reveal on scroll ---------- */
const revealTargets = document.querySelectorAll(".reveal, .years");
if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  revealTargets.forEach((el) => revealObserver.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- Services: current travelling along the wire ---------- */
const circuit = document.querySelector("[data-circuit]");
if (circuit instanceof HTMLElement) {
  const svg = circuit.querySelector(".circuit-wire");
  const paths = svg ? Array.from(svg.querySelectorAll("path")) : [];
  const current = svg?.querySelector(".wire-current");
  const halo = svg?.querySelector(".wire-current-halo");
  const spark = svg?.querySelector(".wire-spark");
  const services = Array.from(circuit.querySelectorAll(".service"));
  const endMark = circuit.querySelector(".circuit-end");
  const mobileQuery = window.matchMedia("(max-width: 760px)");

  let totalLength = 0;
  let samples = [];          // [{ len, y }] along the path, y non-decreasing
  let nodeLengths = [];      // path length at which each service node is reached
  let shown = 0;             // currently displayed length of current
  let target = 0;
  let frame = 0;

  const centerOf = (el, box) => {
    const r = el.getBoundingClientRect();
    return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
  };

  const lengthAtY = (y) => {
    if (!samples.length) return 0;
    if (y <= samples[0].y) return 0;
    let lo = 0;
    let hi = samples.length - 1;
    if (y >= samples[hi].y) return totalLength;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (samples[mid].y < y) lo = mid; else hi = mid;
    }
    const a = samples[lo];
    const b = samples[hi];
    const t = b.y === a.y ? 0 : (y - a.y) / (b.y - a.y);
    return a.len + (b.len - a.len) * t;
  };

  const build = () => {
    if (!current) return;
    const box = circuit.getBoundingClientRect();
    const mobile = mobileQuery.matches;
    const nodes = services.map((s) => centerOf(s.querySelector(".service-node"), box));
    if (!nodes.length) return;
    // y just below each service's text: the wire runs straight down beside the
    // text before it sweeps across, so it never crosses the copy.
    const exits = services.map((s) => s.getBoundingClientRect().bottom - box.top + 14);

    const start = { x: mobile ? nodes[0].x : box.width / 2, y: 0 };
    const end = endMark ? centerOf(endMark, box) : { x: box.width / 2, y: box.height };
    const f = (n) => n.toFixed(1);
    // vertical tangents at both ends give a soft S between two points
    const curve = (a, b) => {
      const dy = b.y - a.y;
      return ` C${f(a.x)} ${f(a.y + dy * 0.55)} ${f(b.x)} ${f(b.y - dy * 0.55)} ${f(b.x)} ${f(b.y)}`;
    };

    let d = `M${f(start.x)} ${f(start.y)}`;
    let prev = start;
    nodes.forEach((node, i) => {
      d += curve(prev, node);
      prev = node;
      if (exits[i] > node.y + 4) {
        d += ` L${f(node.x)} ${f(exits[i])}`;
        prev = { x: node.x, y: exits[i] };
      }
    });
    d += curve(prev, end);
    paths.forEach((p) => p.setAttribute("d", d));

    totalLength = current.getTotalLength();
    const step = 6;
    samples = [];
    for (let len = 0; len <= totalLength; len += step) {
      samples.push({ len, y: current.getPointAtLength(len).y });
    }
    samples.push({ len: totalLength, y: current.getPointAtLength(totalLength).y });
    // enforce monotonic y for the lookup
    for (let i = 1; i < samples.length; i += 1) {
      if (samples[i].y < samples[i - 1].y) samples[i].y = samples[i - 1].y;
    }
    nodeLengths = nodes.map((n) => lengthAtY(n.y));

    [current, halo].forEach((p) => {
      if (!p) return;
      p.style.strokeDasharray = `${totalLength} ${totalLength}`;
    });
    measureTarget();
    if (reduceMotion.matches) shown = target;
    render();
  };

  const measureTarget = () => {
    const box = circuit.getBoundingClientRect();
    const line = window.innerHeight * 0.62 - box.top;
    target = Math.max(0, Math.min(totalLength, lengthAtY(line)));
  };

  const render = () => {
    const offset = Math.max(0, totalLength - shown);
    if (current) current.style.strokeDashoffset = String(offset);
    if (halo) halo.style.strokeDashoffset = String(offset);
    if (spark && current && totalLength > 0) {
      const p = current.getPointAtLength(Math.max(0, Math.min(totalLength, shown)));
      spark.setAttribute("cx", p.x.toFixed(1));
      spark.setAttribute("cy", p.y.toFixed(1));
    }
    let lastLit = -1;
    services.forEach((s, i) => {
      const lit = shown >= nodeLengths[i] - 1;
      s.classList.toggle("is-lit", lit);
      if (lit) lastLit = i;
    });
    const complete = totalLength > 0 && shown >= totalLength - 2;
    services.forEach((s, i) => s.classList.toggle("is-current", i === lastLit && !complete));
    circuit.classList.toggle("is-complete", complete);
    circuit.classList.toggle("is-started", shown > 2);
  };

  const tick = () => {
    const diff = target - shown;
    shown += Math.abs(diff) < 0.5 ? diff : diff * 0.09;
    render();
    frame = Math.abs(target - shown) >= 0.5 ? requestAnimationFrame(tick) : 0;
  };

  const onScroll = () => {
    measureTarget();
    if (reduceMotion.matches) {
      shown = target;
      render();
      return;
    }
    if (!frame) frame = requestAnimationFrame(tick);
  };

  if (current && svg) {
    circuit.classList.add("is-live");
    build();
    window.addEventListener("scroll", onScroll, { passive: true });
    let resizeTimer = 0;
    const scheduleBuild = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 120);
    };
    if ("ResizeObserver" in window) {
      new ResizeObserver(scheduleBuild).observe(circuit);
    } else {
      window.addEventListener("resize", scheduleBuild);
    }
    if (document.fonts?.ready) document.fonts.ready.then(build).catch(() => {});
    window.addEventListener("load", build);
  }
}

/* ---------- Contact form (Netlify Forms) ---------- */
const formArea = document.querySelector("[data-form-area]");
const form = document.querySelector("[data-contact-form]");
if (formArea instanceof HTMLElement && form instanceof HTMLFormElement) {
  const fallback = formArea.querySelector("[data-form-fallback]");
  const status = form.querySelector("[data-form-status]");
  const submitButton = form.querySelector('button[type="submit"]');
  const params = new URLSearchParams(window.location.search);
  const testMode = params.get("form-test") === "1";
  const ready = formArea.dataset.formReady === "true" || testMode;
  const openedAt = Date.now();
  const MAIL = "zvikatzman@gmail.com";

  const setStatus = (message, state, withMailLink = false) => {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
    if (withMailLink) {
      const link = document.createElement("a");
      link.href = `mailto:${MAIL}`;
      link.textContent = MAIL;
      status.append(" ", link);
    }
  };

  if (ready) {
    form.hidden = false;
    if (fallback instanceof HTMLElement) fallback.hidden = true;
    if (testMode && formArea.dataset.formReady !== "true") {
      setStatus("מצב בדיקה: הטופס מוצג לצורך בדיקת השליחה באתר המפורסם.", "pending");
    }
  }

  const fields = {
    name: form.elements.namedItem("name"),
    phone: form.elements.namedItem("phone"),
    email: form.elements.namedItem("email"),
    message: form.elements.namedItem("message"),
  };

  const validators = {
    name: (v) => (v.trim().length >= 2 ? "" : "נא לכתוב שם מלא."),
    phone: (v) => {
      const clean = v.trim();
      const digits = clean.replace(/\D/g, "");
      if (!clean) return "נא לכתוב מספר טלפון.";
      if (!/^\+?[\d\s()-]+$/.test(clean) || digits.length < 9 || digits.length > 13) return "מספר הטלפון אינו תקין.";
      return "";
    },
    email: (v) => {
      const clean = v.trim();
      if (!clean) return "";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean) ? "" : "כתובת האימייל אינה תקינה.";
    },
    message: (v) => (v.trim().length >= 5 ? "" : "נא לכתוב כמה מילים על העבודה."),
  };

  const showFieldError = (key, message) => {
    const input = fields[key];
    if (!(input instanceof HTMLElement)) return;
    const wrapper = input.closest(".field");
    const holder = wrapper?.querySelector(".field-error");
    wrapper?.classList.toggle("has-error", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (holder) holder.textContent = message;
  };

  const validate = () => {
    let firstInvalid = null;
    Object.keys(validators).forEach((key) => {
      const input = fields[key];
      if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) return;
      const message = validators[key](input.value);
      showFieldError(key, message);
      if (message && !firstInvalid) firstInvalid = input;
    });
    return firstInvalid;
  };

  Object.keys(validators).forEach((key) => {
    const input = fields[key];
    if (!(input instanceof HTMLElement)) return;
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") {
        showFieldError(key, validators[key](input.value));
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const invalid = validate();
    if (invalid) {
      invalid.focus();
      setStatus("נא לתקן את השדות המסומנים.", "error");
      return;
    }

    const trap = form.elements.namedItem("bot-field");
    if (trap instanceof HTMLInputElement && trap.value) {
      setStatus("לא ניתן לשלוח את הפנייה. אפשר לפנות ישירות במייל:", "error", true);
      return;
    }
    if (Date.now() - openedAt < 3000) {
      setStatus("הטופס נשלח מהר מדי. נסו שוב בעוד רגע.", "error");
      return;
    }

    if (submitButton instanceof HTMLButtonElement) submitButton.disabled = true;
    form.setAttribute("aria-busy", "true");
    setStatus("שולחים את הפנייה…", "pending");

    try {
      const body = new URLSearchParams(new FormData(form)).toString();
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      setStatus("תודה, הפנייה נשלחה. צבי יחזור אליכם בהקדם.", "success");
    } catch {
      setStatus("השליחה לא הצליחה. אפשר לנסות שוב, להתקשר או לכתוב ישירות:", "error", true);
    } finally {
      form.removeAttribute("aria-busy");
      if (submitButton instanceof HTMLButtonElement) submitButton.disabled = false;
    }
  });
}
