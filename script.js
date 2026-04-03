(function () {
  const storageKey = "portfolio-reduced-motion";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reducedMotionSaved = localStorage.getItem(storageKey) === "true";
  const state = {
    reducedMotion: prefersReducedMotion.matches || reducedMotionSaved,
    cursorX: window.innerWidth / 2,
    cursorY: window.innerHeight / 2
  };

  const body = document.body;
  const cursorLight = document.querySelector(".cursor-light");
  const motionToggle = document.querySelector(".motion-toggle");
  const revealItems = document.querySelectorAll(".reveal");
  const interactiveItems = document.querySelectorAll(".glow-card, .button, .site-nav a, .motion-toggle");
  const tiltItems = document.querySelectorAll(".tilt-card");
  const magneticItems = document.querySelectorAll(".magnetic");
  const contactForm = document.querySelector(".contact-form");

  function applyMotionPreference() {
    body.classList.toggle("is-reduced-motion", state.reducedMotion);
    if (motionToggle) {
      motionToggle.dataset.active = String(state.reducedMotion);
      motionToggle.setAttribute("aria-pressed", String(state.reducedMotion));
      motionToggle.textContent = state.reducedMotion ? "Motion Reduced" : "Reduce Motion";
    }
  }

  function setPointerGlow(event, element) {
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    element.style.setProperty("--pointer-x", `${x}%`);
    element.style.setProperty("--pointer-y", `${y}%`);
  }

  function animateCursorLight() {
    if (!cursorLight || state.reducedMotion || window.innerWidth < 720) {
      return;
    }
    cursorLight.style.transform = `translate3d(${state.cursorX - 144}px, ${state.cursorY - 144}px, 0)`;
  }

  function setupCursorTracking() {
    if (!cursorLight) return;
    document.addEventListener("pointermove", (event) => {
      state.cursorX = event.clientX;
      state.cursorY = event.clientY;
      animateCursorLight();
    });
  }

  function setupHoverGlow() {
    interactiveItems.forEach((item) => {
      item.addEventListener("pointermove", (event) => setPointerGlow(event, item));
    });
  }

  function setupReveals() {
    if (state.reducedMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  function setupTiltCards() {
    if (state.reducedMotion) return;

    tiltItems.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateX(${py * -7}deg) rotateY(${px * 9}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  function setupMagneticButtons() {
    if (state.reducedMotion) return;

    magneticItems.forEach((item) => {
      item.addEventListener("pointermove", (event) => {
        const rect = item.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        item.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
      });
      item.addEventListener("pointerleave", () => {
        item.style.transform = "";
      });
    });
  }

  function setupPageTransitions() {
    if (!document.startViewTransition || state.reducedMotion) return;

    const links = document.querySelectorAll('a[href$=".html"]');
    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const href = link.getAttribute("href");
        if (!href) return;
        event.preventDefault();
        document.startViewTransition(() => {
          window.location.href = href;
        });
      });
    });
  }

  function setupMotionToggle() {
    if (!motionToggle) return;
    motionToggle.addEventListener("click", () => {
      state.reducedMotion = !state.reducedMotion;
      localStorage.setItem(storageKey, String(state.reducedMotion));
      applyMotionPreference();
      if (state.reducedMotion) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
      }
    });
  }

  function setupContactForm() {
    if (!contactForm) return;
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const name = (formData.get("name") || "").toString().trim();
      const email = (formData.get("email") || "").toString().trim();
      const brand = (formData.get("brand") || "").toString().trim();
      const service = (formData.get("service") || "").toString().trim();
      const scope = (formData.get("scope") || "").toString().trim();

      const subject = `Project Brief from ${name || "Website Inquiry"}`;
      const body = [
        "Hi Ritesh,",
        "",
        "I want to discuss a project with Motionxframe.",
        "",
        `Name: ${name || "-"}`,
        `Email: ${email || "-"}`,
        `Brand / Business: ${brand || "-"}`,
        `Service Needed: ${service || "-"}`,
        "",
        "Project Scope:",
        scope || "-",
        "",
        "Sent from the Motionxframe website."
      ].join("\n");

      const gmailUrl =
        "https://mail.google.com/mail/?view=cm&fs=1" +
        `&to=${encodeURIComponent("ranaritesh0802@gmail.com")}` +
        `&su=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      const fallbackUrl =
        `mailto:ranaritesh0802@gmail.com?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      const popup = window.open(gmailUrl, "_blank", "noopener");
      if (!popup) {
        window.location.href = fallbackUrl;
      }
    });
  }

  prefersReducedMotion.addEventListener("change", (event) => {
    state.reducedMotion = event.matches || localStorage.getItem(storageKey) === "true";
    applyMotionPreference();
  });

  applyMotionPreference();
  setupCursorTracking();
  setupHoverGlow();
  setupReveals();
  setupTiltCards();
  setupMagneticButtons();
  setupPageTransitions();
  setupMotionToggle();
  setupContactForm();
  animateCursorLight();
})();
