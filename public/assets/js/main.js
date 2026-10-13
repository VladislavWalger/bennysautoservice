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

  // ---- HU-Erinnerung
  document.querySelectorAll("[data-hu-form]").forEach((form) => {
    const msg = form.querySelector("[data-hu-msg]");
    const plateInput = form.elements.kennzeichen;
    const showMsg = (text, type = "") => {
      msg.textContent = text;
      msg.className = `hu-form__msg${type ? " is-" + type : ""}`;
      msg.hidden = false;
    };

    // Jahresauswahl immer ab dem aktuellen Jahr anbieten
    const yearSelect = form.querySelector("[data-hu-years]");
    const thisYear = new Date().getFullYear();
    yearSelect.innerHTML = [0, 1, 2, 3].map((i) => `<option>${thisYear + i}</option>`).join("");

    plateInput.addEventListener("input", () => {
      const pos = plateInput.selectionStart;
      plateInput.value = plateInput.value.toUpperCase();
      plateInput.setSelectionRange(pos, pos);
    });

    const dueDate = () => {
      const month = Number(form.elements.monat.value);
      const year = Number(form.elements.jahr.value);
      if (!month || !year) return null;
      return { month, year };
    };
    const pad = (n) => String(n).padStart(2, "0");
    const calendarData = () => {
      if (!form.elements.monat.reportValidity()) return null;
      const due = dueDate();
      const plate = plateInput.value.trim();
      const start = `${due.year}${pad(due.month)}01`;
      const endDate = new Date(Date.UTC(due.year, due.month - 1, 2));
      const end = `${endDate.getUTCFullYear()}${pad(endDate.getUTCMonth() + 1)}${pad(endDate.getUTCDate())}`;
      return {
        start, end,
        title: `HU fällig${plate ? " – " + plate : ""}`,
        details: "Hauptuntersuchung fällig. Termin bei Benny´s Autoservice vereinbaren: 04331-4408244 (TÜV im Haus: Mo, Mi, Fr).",
        location: "Benny´s Autoservice, Wollinstraße 4, 24782 Büdelsdorf",
      };
    };

    form.querySelector("[data-hu-ics]").addEventListener("click", () => {
      const c = calendarData();
      if (!c) return;
      // Zeilen nach RFC 5545 auf max. 75 Zeichen umbrechen (Fortsetzung beginnt mit Leerzeichen)
      const fold = (line) => line.match(/.{1,60}/gu).join("\r\n ");
      const esc = (t) => t.replace(/([,;\\])/g, "\\$1");
      const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
      const ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Bennys Autoservice//HU-Erinnerung//DE", "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        `UID:hu-${c.start}-${Math.random().toString(36).slice(2)}@bennys-autoservice.de`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${c.start}`, `DTEND;VALUE=DATE:${c.end}`,
        `SUMMARY:${esc(c.title)}`, `DESCRIPTION:${esc(c.details)}`, `LOCATION:${esc(c.location)}`,
        "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${esc(c.title)}`, "TRIGGER:-P7D", "END:VALARM",
        "END:VEVENT", "END:VCALENDAR",
      ].map(fold).join("\r\n");
      const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
      const a = Object.assign(document.createElement("a"), { href: url, download: "HU-Erinnerung.ics" });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showMsg("Kalender-Datei erstellt – öffnen Sie sie, um den Termin zu speichern. Ihr Kalender erinnert Sie eine Woche vorher.", "success");
    });

    form.querySelector("[data-hu-google]").addEventListener("click", () => {
      const c = calendarData();
      if (!c) return;
      const params = new URLSearchParams({ action: "TEMPLATE", text: c.title, dates: `${c.start}/${c.end}`, details: c.details, location: c.location });
      window.open(`https://calendar.google.com/calendar/render?${params}`, "_blank", "noopener");
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      showMsg("Wird gesendet …");
      try {
        const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { "X-Requested-With": "fetch" } });
        const data = await res.json();
        if (data.ok) {
          form.classList.add("is-done");
          showMsg(data.message, "success");
        } else {
          showMsg(data.message, "error");
        }
      } catch {
        showMsg("Die E-Mail-Erinnerung ist gerade nicht erreichbar. Nutzen Sie einfach den Kalender-Eintrag unten oder rufen Sie uns an: 04331-4408244.", "error");
      } finally {
        button.disabled = false;
      }
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
