const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const year = document.querySelector("#current-year");
const revealElements = document.querySelectorAll(".reveal");
const heroScene = document.querySelector(".energy-scene");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const contactForm = document.querySelector("#contact-form");
const contactDialog = document.querySelector("#contact-options");
const contactDialogTrigger = document.querySelector(".contact-options-trigger");
const contactDialogClose = document.querySelector(".contact-options-close");
const serviceStage = document.querySelector(".service-stage");
const serviceButtons = document.querySelectorAll(".service-row[data-service]");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (header) {
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.setAttribute("aria-label", expanded ? "פתיחת תפריט" : "סגירת תפריט");
    primaryNav.classList.toggle("is-open", !expanded);
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "פתיחת תפריט");
      primaryNav.classList.remove("is-open");
    }
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

if (serviceStage instanceof HTMLElement && serviceButtons.length > 0) {
  const serviceTitle = document.querySelector("#service-visual-title");
  const serviceCount = serviceStage.querySelector("[data-service-count]");
  const serviceImage = serviceStage.querySelector("#service-render");

  const selectService = (button) => {
    const serviceId = button.dataset.service;
    const serviceName = button.querySelector(".service-name")?.textContent?.trim();
    const serviceIndex = button.querySelector(".service-index")?.textContent?.trim();
    if (!serviceId || !serviceName || !serviceIndex) return;

    serviceButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    serviceStage.dataset.activeService = serviceId;
    if (serviceImage instanceof HTMLImageElement) {
      const imageSource = button.dataset.serviceImage;
      const imageDescription = button.dataset.serviceAlt;
      if (imageSource && imageDescription) {
        serviceImage.src = imageSource;
        serviceImage.alt = imageDescription;
        serviceImage.classList.remove("service-image-in");
        void serviceImage.offsetWidth;
        serviceImage.classList.add("service-image-in");
      }
    }
    if (serviceTitle) serviceTitle.textContent = serviceName;
    if (serviceCount) serviceCount.textContent = `${serviceIndex.padStart(2, "0")} / ${String(serviceButtons.length).padStart(2, "0")}`;
  };

  serviceButtons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) return;
    button.addEventListener("click", () => selectService(button));
    button.addEventListener("focus", () => selectService(button));
    button.addEventListener("pointerenter", () => selectService(button));
  });
}

if (heroScene && !reduceMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      heroScene.style.transform = `translate3d(${x * 9}px, ${y * 8}px, 0)`;
    }, { passive: true });

    hero.addEventListener("pointerleave", () => {
      heroScene.style.transform = "";
    });
  }
}

if (contactForm instanceof HTMLFormElement) {
  const formStatus = document.querySelector("#contact-form-status");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const honeypot = contactForm.elements.namedItem("_gotcha");
  const pageLoadedAt = Date.now();

  const showFormStatus = (message, state) => {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.dataset.state = state;
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (honeypot instanceof HTMLInputElement && honeypot.value.trim()) {
      showFormStatus("לא ניתן לשלוח את הפנייה כרגע. אפשר ליצור קשר בטלפון או ב-WhatsApp.", "error");
      return;
    }

    if (Date.now() - pageLoadedAt < 2000) {
      showFormStatus("נראה שהטופס נשלח מהר מדי. נסו שוב בעוד רגע.", "error");
      return;
    }

    const endpoint = contactForm.dataset.formspreeEndpoint?.trim();
    if (!endpoint) {
      showFormStatus("הטופס עדיין לא חובר ל-Formspree. אפשר ליצור קשר בטלפון או ב-WhatsApp.", "error");
      return;
    }

    let endpointUrl;
    try {
      endpointUrl = new URL(endpoint);
    } catch {
      showFormStatus("הטופס לא הוגדר כראוי. אפשר ליצור קשר בטלפון או ב-WhatsApp.", "error");
      return;
    }

    if (endpointUrl.origin !== "https://formspree.io" || !/^\/f\/[A-Za-z0-9]+$/.test(endpointUrl.pathname)) {
      showFormStatus("כתובת הטופס לא תקינה. אפשר ליצור קשר בטלפון או ב-WhatsApp.", "error");
      return;
    }

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-label", "שולחים את הפנייה");
    }
    contactForm.setAttribute("aria-busy", "true");
    showFormStatus("הפנייה נשלחת…", "pending");

    let response;
    try {
      response = await fetch(endpointUrl, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });
    } catch {
      showFormStatus("השליחה נכשלה בגלל בעיית תקשורת. נסו שוב או צרו קשר בטלפון או ב-WhatsApp.", "error");
      response = null;
    } finally {
      contactForm.removeAttribute("aria-busy");
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-label");
      }
    }

    if (!response) return;
    if (!response.ok) {
      showFormStatus("לא הצלחנו לשלוח את הפנייה. נסו שוב או צרו קשר בטלפון או ב-WhatsApp.", "error");
      return;
    }

    contactForm.reset();
    showFormStatus("תודה, הפנייה נשלחה בהצלחה. צבי יחזור אליכם בהקדם.", "success");
  });
}

if (contactDialog instanceof HTMLDialogElement) {
  const closeContactDialog = () => {
    contactDialog.close();
    if (contactDialogTrigger instanceof HTMLButtonElement) contactDialogTrigger.focus();
  };

  if (contactDialogTrigger instanceof HTMLButtonElement) {
    contactDialogTrigger.addEventListener("click", () => contactDialog.showModal());
  }

  if (contactDialogClose instanceof HTMLButtonElement) {
    contactDialogClose.addEventListener("click", closeContactDialog);
  }

  contactDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeContactDialog();
  });

  contactDialog.addEventListener("click", (event) => {
    if (event.target === contactDialog) closeContactDialog();
  });
}
