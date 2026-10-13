import { site, hours, huNote, highlights, services, about, gallery, job } from "./content.mjs";
import { icons } from "./icons.mjs";

export const icon = (name, cls = "icon") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const fmtTime = (t) => `${t} Uhr`;
const hoursRows = () =>
  hours
    .map(
      (h) => `<tr data-day="${h.day}"><th scope="row">${h.label}</th><td>${
        h.open ? `${h.open} – ${fmtTime(h.close)}` : "geschlossen"
      }</td></tr>`
    )
    .join("");

const hoursJson = () => JSON.stringify(hours.filter((h) => h.open).map(({ day, open, close }) => ({ day, open, close })));

const structuredData = () =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: site.name,
    url: site.url,
    telephone: "+49 4331 4408244",
    email: site.email,
    image: `${site.url}/assets/img/galerie-3.jpg`,
    logo: `${site.url}/assets/img/logo.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.street,
      postalCode: site.zip,
      addressLocality: site.city,
      addressCountry: "DE",
    },
    openingHoursSpecification: hours
      .filter((h) => h.open)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][h.day]}`,
        opens: h.open,
        closes: h.close,
      })),
    sameAs: [site.facebookUrl],
  });

// ---------------------------------------------------------------- Layout

const header = (active) => `
<a class="skip-link" href="#main">Zum Inhalt springen</a>
<div class="topbar">
  <div class="container topbar__inner">
    <span class="topbar__item">${icon("map-pin")} ${site.street}, ${site.zip} ${site.city}</span>
    <span class="topbar__item open-status" data-open-status>${icon("clock")} <span>Mo–Do 8–17 Uhr · Fr 8–15:30 Uhr</span></span>
    <a class="topbar__item topbar__mail" href="mailto:${site.email}">${icon("mail")} ${site.email}</a>
  </div>
</div>
<header class="site-header" data-header>
  <div class="container site-header__inner">
    <a class="brand" href="/" aria-label="${esc(site.name)} – Startseite">
      <img src="/assets/img/logo.jpg" width="300" height="148" alt="${esc(site.name)} – Kfz-Meisterwerkstatt">
    </a>
    <nav class="nav" id="nav" aria-label="Hauptnavigation" data-nav>
      <ul class="nav__list">
        <li class="nav__item nav__item--has-menu">
          <a class="nav__link${active === "leistungen" ? " is-active" : ""}" href="/#leistungen">Leistungen</a>
          <div class="mega">
            <ul class="mega__grid">
              ${services
                .map(
                  (s) => `<li><a href="/leistungen/${s.slug}/">${icon(s.icon)}<span>${s.title}</span></a></li>`
                )
                .join("")}
            </ul>
          </div>
        </li>
        <li class="nav__item"><a class="nav__link" href="/#ueber-uns">Über uns</a></li>
        <li class="nav__item"><a class="nav__link${active === "jobs" ? " is-active" : ""}" href="/jobs/">Jobs</a></li>
        <li class="nav__item"><a class="nav__link${active === "kontakt" ? " is-active" : ""}" href="/kontakt-anfahrt/">Kontakt &amp; Anfahrt</a></li>
      </ul>
      <a class="btn btn--primary nav__cta" href="${site.phoneHref}">${icon("phone")} ${site.phone}</a>
    </nav>
    <button class="nav-toggle" type="button" aria-controls="nav" aria-expanded="false" data-nav-toggle>
      <span class="visually-hidden">Menü öffnen</span>${icon("menu", "icon icon--open")}${icon("x", "icon icon--close")}
    </button>
  </div>
</header>`;

const footer = () => `
<footer class="site-footer">
  <div class="container site-footer__grid">
    <div class="site-footer__brand">
      <img src="/assets/img/logo.jpg" width="300" height="148" alt="${esc(site.name)}" loading="lazy">
      <p>${about.quote}</p>
      <a class="social" href="${site.facebookUrl}" target="_blank" rel="noopener" aria-label="${esc(site.name)} auf Facebook">${icon("facebook")}</a>
    </div>
    <div>
      <h2 class="site-footer__title">Kontakt</h2>
      <address>
        ${site.name}<br>${site.street}<br>${site.zip} ${site.city}
      </address>
      <p><a href="${site.phoneHref}">${site.phone}</a><br><a href="mailto:${site.email}">${site.email}</a></p>
    </div>
    <div>
      <h2 class="site-footer__title">Öffnungszeiten</h2>
      <table class="hours hours--compact"><tbody>${hoursRows()}</tbody></table>
      <p class="site-footer__note">${huNote}</p>
    </div>
    <div>
      <h2 class="site-footer__title">Leistungen</h2>
      <ul class="site-footer__links">
        ${services.map((s) => `<li><a href="/leistungen/${s.slug}/">${s.title}</a></li>`).join("")}
      </ul>
    </div>
  </div>
  <div class="container site-footer__bottom">
    <span>© ${new Date().getFullYear()} ${site.name}</span>
    <nav aria-label="Rechtliches">
      <a href="/kontakt-anfahrt/">Kontakt</a>
      <a href="/impressum/">Impressum</a>
      <a href="/datenschutz/">Datenschutz</a>
    </nav>
  </div>
</footer>
<div class="mobile-bar">
  <a class="btn btn--primary" href="${site.phoneHref}">${icon("phone")} Anrufen</a>
  <a class="btn btn--dark" href="${site.mapsUrl}" target="_blank" rel="noopener">${icon("navigation")} Route</a>
</div>`;

export const layout = ({ title, description, path, active, body }) => `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${site.url}${path}">
<meta name="theme-color" content="#00427f">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${site.url}${path}">
<meta property="og:image" content="${site.url}/assets/img/galerie-3.jpg">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/barlow-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/barlow-condensed-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/style.css">
<script type="application/ld+json">${structuredData()}</script>
<script>window.OPENING_HOURS=${hoursJson()};</script>
<script src="/assets/js/main.js" defer></script>
</head>
<body>
${header(active)}
<main id="main">
${body}
</main>
${footer()}
</body>
</html>
`;

// ---------------------------------------------------------------- Bausteine

const serviceCard = (s) => `
<li>
  <a class="service-card" href="/leistungen/${s.slug}/">
    <span class="service-card__icon">${icon(s.icon)}</span>
    <h3 class="service-card__title">${s.title}</h3>
    <p class="service-card__text">${s.teaser}</p>
    <span class="service-card__more">Mehr erfahren ${icon("arrow-right")}</span>
  </a>
</li>`;

const hoursCard = (heading = "Öffnungszeiten") => `
<div class="card card--hours">
  <div class="card__head">
    <h2 class="card__title">${icon("clock")} ${heading}</h2>
    <span class="status-pill" data-open-pill hidden></span>
  </div>
  <table class="hours"><tbody>${hoursRows()}</tbody></table>
  <p class="hu-note">${icon("badge-check")} <span><strong>Hauptuntersuchung:</strong> Montag, Mittwoch und Freitag nach Vereinbarung</span></p>
</div>`;

const contactCard = () => `
<div class="card card--contact">
  <h2 class="card__title">${icon("map-pin")} So finden Sie uns</h2>
  <address class="contact-list">
    <span>${icon("map-pin")}<span>${site.name}<br>${site.street}<br>${site.zip} ${site.city}</span></span>
    <a href="${site.phoneHref}">${icon("phone")}<span>${site.phone}</span></a>
    <a href="mailto:${site.email}">${icon("mail")}<span>${site.email}</span></a>
  </address>
  <div class="btn-row">
    <a class="btn btn--primary" href="${site.phoneHref}">${icon("phone")} Jetzt anrufen</a>
    <a class="btn btn--outline" href="${site.mapsUrl}" target="_blank" rel="noopener">${icon("navigation")} Route planen</a>
  </div>
</div>`;

const requestForm = () => `
<form class="card request-form" data-request-form action="mailto:${site.email}" method="post" enctype="text/plain">
  <h2 class="card__title">${icon("calendar-check")} Termin anfragen</h2>
  <p class="request-form__intro">Schicken Sie uns Ihr Anliegen – wir melden uns schnellstmöglich mit einem Terminvorschlag.</p>
  <div class="field-grid">
    <label class="field"><span>Name *</span><input name="Name" autocomplete="name" required></label>
    <label class="field"><span>Telefon *</span><input name="Telefon" type="tel" autocomplete="tel" required></label>
    <label class="field"><span>Fahrzeug / Kennzeichen</span><input name="Fahrzeug" placeholder="z. B. VW Golf, RD-AB 123"></label>
    <label class="field"><span>Leistung</span>
      <select name="Leistung">
        <option value="">Bitte wählen …</option>
        ${services.map((s) => `<option>${s.title}</option>`).join("")}
        <option>Sonstiges</option>
      </select>
    </label>
    <label class="field field--full"><span>Ihre Nachricht</span><textarea name="Nachricht" rows="4" placeholder="Was dürfen wir für Sie tun?"></textarea></label>
  </div>
  <p class="request-form__privacy">Beim Absenden öffnet sich Ihr E-Mail-Programm mit einer vorausgefüllten Nachricht. Es werden keine Daten über diese Website gespeichert. Mehr in der <a href="/datenschutz/">Datenschutzerklärung</a>.</p>
  <button class="btn btn--primary" type="submit">${icon("mail")} Anfrage per E-Mail senden</button>
</form>`;

const pageHero = ({ eyebrow, title, lead, iconName, crumbs }) => `
<section class="page-hero">
  <div class="container">
    <nav class="breadcrumb" aria-label="Brotkrumen">
      <a href="/">Start</a>${crumbs.map((c) => `${icon("chevron-right")}${c.href ? `<a href="${c.href}">${c.label}</a>` : `<span aria-current="page">${c.label}</span>`}`).join("")}
    </nav>
    <div class="page-hero__head">
      ${iconName ? `<span class="page-hero__icon">${icon(iconName)}</span>` : ""}
      <div>
        ${eyebrow ? `<p class="eyebrow eyebrow--light">${eyebrow}</p>` : ""}
        <h1>${title}</h1>
        ${lead ? `<p class="page-hero__lead">${lead}</p>` : ""}
      </div>
    </div>
  </div>
</section>`;

const ctaBand = () => `
<section class="cta-band">
  <div class="container cta-band__inner">
    <div>
      <h2>Ihr Auto braucht uns? Wir sind für Sie da.</h2>
      <p>Rufen Sie uns an oder kommen Sie direkt vorbei – persönliche Beratung zu fairen Preisen.</p>
    </div>
    <div class="btn-row">
      <a class="btn btn--light" href="${site.phoneHref}">${icon("phone")} ${site.phone}</a>
      <a class="btn btn--ghost" href="/kontakt-anfahrt/">Termin anfragen ${icon("arrow-right")}</a>
    </div>
  </div>
</section>`;

// ---------------------------------------------------------------- Seiten

export const homePage = () =>
  layout({
    title: `${site.name} – Kfz-Meisterwerkstatt in Büdelsdorf`,
    description:
      "Ihre freie Kfz-Meisterwerkstatt in Büdelsdorf: Inspektion, Ölwechsel, HU/AU mit TÜV im Haus, Reifenservice, Diagnose, Klimaservice, Unfall- und Karosseriearbeiten für alle Marken. Jetzt Termin vereinbaren!",
    path: "/",
    active: "home",
    body: `
<section class="hero">
  <div class="container hero__inner">
    <div class="hero__content">
      <p class="eyebrow eyebrow--light">Freier Kfz-Meisterbetrieb · Alle Marken</p>
      <h1>Ihre Kfz-Meisterwerkstatt in <span class="hl">Büdelsdorf</span></h1>
      <p class="hero__lead">Inspektion, HU/AU, Reifen, Diagnose oder Unfallschaden – wir kümmern uns um Ihr Fahrzeug. <strong>Fair, ehrlich und kompetent.</strong></p>
      <div class="btn-row">
        <a class="btn btn--primary btn--lg" href="${site.phoneHref}">${icon("phone")} ${site.phone}</a>
        <a class="btn btn--ghost btn--lg" href="/kontakt-anfahrt/">${icon("calendar-check")} Termin anfragen</a>
      </div>
      <p class="hero__status" data-open-status-hero>${icon("clock")} <span>Mo–Do 8:00–17:00 · Fr 8:00–15:30 Uhr</span></p>
    </div>
    <div class="hero__media">
      <img src="/assets/img/galerie-3.jpg" width="800" height="600" alt="${gallery[0].alt}" fetchpriority="high">
      <div class="hero__badge">
        <span class="hero__badge-icon">${icon("badge-check")}</span>
        <span><strong>TÜV im Haus</strong><br>Mo · Mi · Fr</span>
      </div>
    </div>
  </div>
</section>

<section class="highlights" aria-label="Unsere Stärken">
  <div class="container">
    <ul class="highlights__grid">
      ${highlights
        .map(
          (h) => `<li class="highlight"><span class="highlight__icon">${icon(h.icon)}</span><span><strong>${h.title}</strong><br>${h.text}</span></li>`
        )
        .join("")}
    </ul>
  </div>
</section>

<section class="section" id="leistungen">
  <div class="container">
    <div class="section__head">
      <p class="eyebrow">Unsere Leistungen</p>
      <h2>Alles rund um Ihr Fahrzeug – aus einer Hand</h2>
      <p>Vom Ölwechsel bis zur Unfallinstandsetzung: Wir betreuen Pkw aller Marken, Transporter, Wohnmobile und Anhänger.</p>
    </div>
    <ul class="services-grid">${services.map(serviceCard).join("")}
      <li>
        <a class="service-card service-card--cta" href="${site.phoneHref}">
          <span class="service-card__icon">${icon("phone")}</span>
          <h3 class="service-card__title">Ihr Anliegen ist nicht dabei?</h3>
          <p class="service-card__text">Rufen Sie uns einfach an – wir finden eine Lösung.</p>
          <span class="service-card__more">${site.phone} ${icon("arrow-right")}</span>
        </a>
      </li>
    </ul>
  </div>
</section>

<section class="section section--tint" id="ueber-uns">
  <div class="container about">
    <div class="about__media">
      <img class="about__img about__img--main" src="/assets/img/galerie-2.jpg" width="800" height="600" alt="${gallery[1].alt}" loading="lazy">
      <img class="about__img about__img--sub" src="/assets/img/galerie-1.jpg" width="800" height="600" alt="${gallery[2].alt}" loading="lazy">
    </div>
    <div class="about__content">
      <p class="eyebrow">Über uns</p>
      <h2>${about.title}</h2>
      ${about.paragraphs.map((p) => `<p>${p}</p>`).join("")}
      <blockquote class="quote">„${about.quote}“<footer>— ${site.owner}, Inhaber</footer></blockquote>
      <ul class="checklist checklist--two">
        <li>Herstellerneutrale Beratung</li>
        <li>Faire, transparente Preise</li>
        <li>Transporter &amp; Wohnmobile</li>
        <li>Leihwagen auf Wunsch</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--hu">
  <div class="container hu">
    <div class="hu__icon">${icon("badge-check")}</div>
    <div class="hu__text">
      <h2>HU &amp; AU ohne Umwege</h2>
      <p>Der TÜV kommt <strong>montags, mittwochs und freitags</strong> direkt zu uns in die Werkstatt. Mängel? Beheben wir gleich vor Ort.</p>
    </div>
    <a class="btn btn--light" href="/leistungen/haupt-abgasuntersuchung/">HU-Termin vereinbaren ${icon("arrow-right")}</a>
  </div>
</section>

<section class="section" id="kontakt">
  <div class="container">
    <div class="section__head">
      <p class="eyebrow">Öffnungszeiten &amp; Kontakt</p>
      <h2>Wir freuen uns auf Ihren Besuch</h2>
    </div>
    <div class="contact-grid">
      ${hoursCard()}
      ${contactCard()}
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="container">
    <a class="job-teaser" href="/jobs/">
      <span class="job-teaser__icon">${icon("briefcase")}</span>
      <span class="job-teaser__text"><span class="eyebrow eyebrow--light">Wir stellen ein</span><strong>${job.title}</strong><span>Vollzeit oder auf Stundenbasis – werde Teil unseres Teams!</span></span>
      <span class="btn btn--light">Zur Stelle ${icon("arrow-right")}</span>
    </a>
  </div>
</section>
`,
  });

export const servicePage = (s) =>
  layout({
    title: `${s.title} in Büdelsdorf – ${site.name}`,
    description: `${s.headline}. ${s.teaser} Ihre Kfz-Meisterwerkstatt in Büdelsdorf – jetzt Termin vereinbaren unter ${site.phone}.`,
    path: `/leistungen/${s.slug}/`,
    active: "leistungen",
    body: `
${pageHero({ eyebrow: "Leistungen", title: s.headline, iconName: s.icon, crumbs: [{ label: "Leistungen", href: "/#leistungen" }, { label: s.title }] })}
<section class="section">
  <div class="container detail">
    <article class="prose">${s.body}</article>
    <aside class="detail__aside">
      <div class="card card--cta">
        <h2 class="card__title">Termin vereinbaren</h2>
        <p>Rufen Sie uns an – wir beraten Sie gern persönlich.</p>
        <a class="btn btn--primary btn--block" href="${site.phoneHref}">${icon("phone")} ${site.phone}</a>
        <a class="btn btn--outline btn--block" href="/kontakt-anfahrt/">${icon("calendar-check")} Online anfragen</a>
      </div>
      ${hoursCard()}
    </aside>
  </div>
</section>
<section class="section section--tint">
  <div class="container">
    <div class="section__head"><h2>Weitere Leistungen</h2></div>
    <ul class="services-grid services-grid--compact">${services.filter((o) => o.slug !== s.slug).slice(0, 4).map(serviceCard).join("")}</ul>
  </div>
</section>
${ctaBand()}`,
  });

export const jobsPage = () =>
  layout({
    title: `Jobs: ${job.title} in Büdelsdorf – ${site.name}`,
    description: `${job.intro} Jetzt bei ${site.name} in Büdelsdorf bewerben.`,
    path: "/jobs/",
    active: "jobs",
    body: `
${pageHero({ eyebrow: "Karriere", title: `${job.title} in Büdelsdorf`, lead: job.intro, iconName: "briefcase", crumbs: [{ label: "Jobs" }] })}
<section class="section">
  <div class="container detail">
    <article class="prose">
      <h2>Werde ein Teil von Benny´s Autoservice</h2>
      <p>${job.pitch}</p>
      <div class="two-lists">
        <div><h3>Was du mitbringen solltest</h3><ul class="checklist">${job.bring.map((b) => `<li>${b}</li>`).join("")}</ul></div>
        <div><h3>Was wir dir bieten</h3><ul class="checklist">${job.offer.map((b) => `<li>${b}</li>`).join("")}<li>… und vieles mehr</li></ul></div>
      </div>
      <h2>Jetzt bewerben!</h2>
      <p>Gerne schriftlich mit Lebenslauf, Zeugnissen und ggf. Zertifikaten – per Post, per E-Mail an <a href="mailto:${site.email}?subject=Bewerbung%20Kfz-Mechatroniker%2Fin">${site.email}</a> oder du schaust einfach direkt bei uns vorbei.</p>
      <p><strong>${site.name}</strong><br>${site.owner}<br>${site.street}<br>${site.zip} ${site.city}</p>
      <p>Wir freuen uns auf deine Bewerbung!</p>
    </article>
    <aside class="detail__aside">
      <div class="card card--cta">
        <h2 class="card__title">Fragen zur Stelle?</h2>
        <p>Ruf uns einfach an oder schreib uns.</p>
        <a class="btn btn--primary btn--block" href="${site.phoneHref}">${icon("phone")} ${site.phone}</a>
        <a class="btn btn--outline btn--block" href="mailto:${site.email}?subject=Bewerbung%20Kfz-Mechatroniker%2Fin">${icon("mail")} Bewerbung per E-Mail</a>
      </div>
    </aside>
  </div>
</section>`,
  });

export const contactPage = () =>
  layout({
    title: `Kontakt & Anfahrt – ${site.name} in Büdelsdorf`,
    description: `So erreichen Sie ${site.name}: ${site.street}, ${site.zip} ${site.city}. Telefon ${site.phone}. Öffnungszeiten Mo–Do 8–17 Uhr, Fr 8–15:30 Uhr.`,
    path: "/kontakt-anfahrt/",
    active: "kontakt",
    body: `
${pageHero({ eyebrow: "Kontakt & Anfahrt", title: "Nehmen Sie Kontakt zu uns auf", lead: "Am schnellsten erreichen Sie uns telefonisch – oder Sie schicken uns eine Terminanfrage.", iconName: "phone", crumbs: [{ label: "Kontakt & Anfahrt" }] })}
<section class="section">
  <div class="container contact-page">
    ${requestForm()}
    <div class="contact-page__side">
      ${contactCard()}
      ${hoursCard()}
    </div>
  </div>
</section>
<section class="section section--tight">
  <div class="container">
    <a class="map-card" href="${site.mapsUrl}" target="_blank" rel="noopener">
      <img src="/assets/img/start.jpg" width="800" height="250" alt="Werkstattgebäude von Benny´s Autoservice an der Wollinstraße" loading="lazy">
      <span class="map-card__overlay">
        <span class="map-card__pin">${icon("map-pin")}</span>
        <span><strong>${site.street}, ${site.zip} ${site.city}</strong><br>Route in Google Maps öffnen ${icon("arrow-right")}</span>
      </span>
    </a>
  </div>
</section>`,
  });

export const legalPage = ({ slug, title, body }) =>
  layout({
    title: `${title} – ${site.name}`,
    description: `${title} von ${site.name}, ${site.city}.`,
    path: `/${slug}/`,
    active: slug,
    body: `
${pageHero({ title, crumbs: [{ label: title }] })}
<section class="section">
  <div class="container"><article class="prose prose--narrow">${body}</article></div>
</section>`,
  });

export const imprintBody = () => `
<h2>Angaben gemäß § 5 DDG</h2>
<p>${site.name}<br>${site.street}<br>${site.zip} ${site.city}</p>
<p><strong>Vertreten durch:</strong><br>${site.owner}</p>
<h2>Kontakt</h2>
<p>Telefon: <a href="${site.phoneHref}">${site.phone}</a><br>E-Mail: <a href="mailto:${site.email}">${site.email}</a></p>
<h2>Umsatzsteuer-ID</h2>
<p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br>${site.vatId}</p>
<h2>Verantwortlich für den Inhalt</h2>
<p>${site.owner}<br>${site.street}<br>${site.zip} ${site.city}</p>
<h2>Verbraucherstreitbeilegung</h2>
<p>Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle im Sinne des Verbraucherstreitbeilegungsgesetzes weder verpflichtet noch bereit.</p>`;

// TODO vor dem Livegang: vollständige, auf diese Seite zugeschnittene Datenschutzerklärung einsetzen.
export const privacyBody = () => `
<p class="notice"><strong>Hinweis:</strong> Diese Seite ist ein Platzhalter. Vor der Veröffentlichung muss hier die vollständige Datenschutzerklärung eingefügt werden.</p>
<h2>Verantwortliche Stelle</h2>
<p>${site.name}, ${site.owner}<br>${site.street}, ${site.zip} ${site.city}<br>Telefon: ${site.phone} · E-Mail: <a href="mailto:${site.email}">${site.email}</a></p>
<h2>Kurz zusammengefasst</h2>
<ul class="checklist">
  <li>Diese Website setzt keine Cookies und verwendet kein Tracking.</li>
  <li>Schriftarten und Icons werden lokal ausgeliefert – es werden keine Daten an Google Fonts o. Ä. übertragen.</li>
  <li>Karten werden nicht eingebettet; Google Maps öffnet sich erst nach Klick auf „Route planen“.</li>
  <li>Das Anfrageformular speichert nichts, sondern öffnet Ihr E-Mail-Programm.</li>
</ul>`;

export const notFoundPage = () =>
  layout({
    title: `Seite nicht gefunden – ${site.name}`,
    description: "Die angeforderte Seite wurde nicht gefunden.",
    path: "/404.html",
    active: "",
    body: `
${pageHero({ title: "Seite nicht gefunden", lead: "Die gesuchte Seite gibt es leider nicht (mehr).", crumbs: [{ label: "404" }] })}
<section class="section">
  <div class="container">
    <div class="section__head"><h2>Vielleicht suchen Sie eine dieser Leistungen?</h2></div>
    <ul class="services-grid">${services.map(serviceCard).join("")}</ul>
  </div>
</section>`,
  });
