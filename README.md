# Benny´s Autoservice – Website

Neue Website für **Benny´s Autoservice**, Kfz-Meisterwerkstatt in Büdelsdorf
(bisher: <https://www.bennys-autoservice.de>, TYPO3).

Statische Seite ohne Framework und ohne Laufzeit-Abhängigkeiten – schnell, wartungsarm
und DSGVO-freundlich (keine Cookies, kein Tracking, Schriften & Icons lokal).

## Entwicklung

```bash
npm run dev     # baut nach ./dist und startet http://localhost:8080
npm run build   # baut nur nach ./dist
```

Benötigt Node.js ≥ 18. Es gibt keine npm-Abhängigkeiten.

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `src/content.mjs` | **Alle Texte & Daten** (Adresse, Öffnungszeiten, Leistungen, Jobs …) |
| `src/templates.mjs` | HTML-Vorlagen für Layout und Seiten |
| `src/icons.mjs` | Icons (Lucide, ISC-Lizenz) |
| `public/assets/` | CSS, JavaScript, Schriften (Barlow, OFL) und Bilder |
| `build.mjs` | Erzeugt `dist/` inkl. `sitemap.xml` und `robots.txt` |

Die URL-Struktur der alten Seite bleibt erhalten (`/leistungen/inspektion/`, `/jobs/`,
`/kontakt-anfahrt/`, `/impressum/`, `/datenschutz/`), damit Google-Rankings und Links weiter funktionieren.

## Deployment

Den Inhalt von `dist/` auf einen beliebigen Webspace / Static Host (z. B. Netlify,
Cloudflare Pages, Apache) hochladen. `404.html` als Fehlerseite konfigurieren.

## Offene Punkte vor dem Livegang

- [ ] **Datenschutzerklärung** einsetzen (`privacyBody` in `src/templates.mjs` ist ein Platzhalter).
- [ ] **HU-Erinnerung**: Die alte Seite hatte ein TYPO3-Formular für automatische HU-Erinnerungsmails.
      Das braucht ein Backend (z. B. kleines PHP-Script oder Formular-Dienst) – aktuell ersetzt durch
      Terminanfrage per E-Mail.
- [ ] **Bessere Fotos**: Die vorhandenen Bilder haben nur 800 px Breite. Neue Fotos von Werkstatt, Team
      und Benny würden die Seite deutlich aufwerten (idealerweise ≥ 2000 px, querformatig).
- [ ] Logo als SVG/PNG mit transparentem Hintergrund (aktuell JPG).
- [ ] Impressum fachlich prüfen lassen.
