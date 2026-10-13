(() => {
  document.documentElement.classList.add("js");

  // ---- Mobile Navigation
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  }

  // ---- Header-Schatten beim Scrollen
  const header = document.querySelector("[data-header]");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---- Öffnungsstatus (Zeitzone der Werkstatt)
  const hours = window.OPENING_HOURS || [];
  const now = new Date();
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(now).map((p) => [p.type, p.value])
  );
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const today = hours.find((h) => h.day === day);
  const isOpen = !!today && minutes >= toMin(today.open) && minutes < toMin(today.close);

  const dayNames = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  let next = null;
  for (let i = 0; i < 8 && !next; i++) {
    const d = (day + i) % 7;
    const h = hours.find((x) => x.day === d);
    if (h && (i > 0 || minutes < toMin(h.open))) next = { ...h, offset: i };
  }
  const nextLabel = next
    ? `${next.offset === 0 ? "heute" : next.offset === 1 ? "morgen" : dayNames[next.day]} ab ${next.open} Uhr`
    : "";
  const text = isOpen ? `Jetzt geöffnet · bis ${today.close} Uhr` : `Geschlossen · öffnet ${nextLabel}`;

  document.querySelectorAll("[data-open-status], [data-open-status-hero]").forEach((el) => {
    const span = el.querySelector("span");
    if (span) span.innerHTML = isOpen ? `<strong>Jetzt geöffnet</strong> · bis ${today.close} Uhr` : text;
    el.classList.toggle("is-open", isOpen);
  });
  document.querySelectorAll("[data-open-pill]").forEach((el) => {
    el.textContent = isOpen ? "Jetzt geöffnet" : "Geschlossen";
    el.classList.toggle("is-open", isOpen);
    el.hidden = false;
  });
  document.querySelectorAll(`.hours tr[data-day="${day}"]`).forEach((tr) => tr.classList.add("is-today"));

  // ---- Terminanfrage: öffnet das E-Mail-Programm mit vorausgefüllter Nachricht
  document.querySelectorAll("[data-request-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const lines = [];
      for (const [key, value] of data) if (String(value).trim()) lines.push(`${key}: ${value}`);
      const to = form.getAttribute("action").replace(/^mailto:/, "");
      const subject = `Terminanfrage${data.get("Leistung") ? " – " + data.get("Leistung") : ""}`;
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    });
  });

  // ---- Sanftes Einblenden beim Scrollen
  const revealTargets = document.querySelectorAll(".service-card, .highlight, .about__media, .about__content, .card, .job-teaser, .hu");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    revealTargets.forEach((el) => { el.setAttribute("data-reveal", ""); io.observe(el); });
  }
})();
