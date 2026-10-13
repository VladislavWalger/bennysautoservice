# Benny´s Autoservice – Website

Neue Website für **Benny´s Autoservice**, Kfz-Meisterwerkstatt in Büdelsdorf
(bisher: <https://www.bennys-autoservice.de>, TYPO3).

Statische Seite ohne Framework (plus ein kleines PHP-Script für die HU-Erinnerung) – schnell, wartungsarm
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
| `public/api/` | PHP-Backend für die HU-Erinnerung |
| `build.mjs` | Erzeugt `dist/` inkl. `sitemap.xml` und `robots.txt` |

Die URL-Struktur der alten Seite bleibt erhalten (`/leistungen/inspektion/`, `/jobs/`,
`/kontakt-anfahrt/`, `/impressum/`, `/datenschutz/`), damit Google-Rankings und Links weiter funktionieren.

## Deployment (PHP-Webspace)

1. `npm run build` ausführen und den **Inhalt** von `dist/` per FTP in das Web-Verzeichnis hochladen.
2. `404.html` als Fehlerseite einstellen (bei Apache z. B. `ErrorDocument 404 /404.html` in einer `.htaccess`).
3. HU-Erinnerung einrichten (siehe unten).

## HU-Erinnerung

Kunden tragen Kennzeichen, HU-Monat und E-Mail ein und bekommen rechtzeitig eine Erinnerung.
Alternativ können sie den Termin ohne Anmeldung als Kalender-Datei (.ics) oder in Google Kalender speichern –
das funktioniert auch ohne PHP.

**Ablauf:** Anmeldung → Bestätigungsmail (Double-Opt-In) → Erinnerung per Cronjob
`remind_days_before` Tage (Standard: 7) vor dem 1. des HU-Monats → Datensatz wird gelöscht.
Unbestätigte Anmeldungen werden nach 7 Tagen gelöscht.

| Datei | Zweck |
| --- | --- |
| `public/api/config.php` | Einstellungen (Absender, Website-Adresse, Kopie an Werkstatt, Speicherort …) |
| `public/api/hu-erinnerung.php` | Anmeldung, Bestätigung und Abmeldung |
| `public/api/cron-hu-erinnerung.php` | Verschickt fällige Erinnerungen – **täglich ausführen** |

**Einrichtung auf dem Webspace:**

1. Voraussetzungen: PHP ≥ 8.1 mit `pdo_sqlite` (bei IONOS, Strato, All-Inkl & Co. Standard) und Versand per `mail()`.
2. In `public/api/config.php` prüfen: `site_url`, `mail_from` (muss eine Adresse der eigenen Domain sein),
   optional `notify_email` für eine Kopie an die Werkstatt.
3. Im Kundenmenü des Hosters einen **täglichen Cronjob** anlegen:
   `php /pfad/zum/webordner/api/cron-hu-erinnerung.php`
   Falls der Hoster nur URL-Cronjobs kann: in `config.php` einen langen, zufälligen `cron_key` setzen und
   `https://www.bennys-autoservice.de/api/cron-hu-erinnerung.php?key=…` aufrufen lassen.
4. Die Datenbank liegt in `api/data/` und ist per `.htaccess` gesperrt (Apache). Bei nginx-Hosting oder zur
   Sicherheit `data_dir` in `config.php` auf einen Ordner **außerhalb** des Web-Verzeichnisses setzen.

**Lokal testen** (`npm run dev` kann kein PHP):

```bash
npm run build
# in dist/api/config.php: 'site_url' => 'http://localhost:8000', 'mail_transport' => 'log'
php -S localhost:8000 -t dist
php dist/api/cron-hu-erinnerung.php   # Cronjob manuell auslösen
```

Mails landen dann in `dist/api/data/mail.log` statt im Postfach.

## Offene Punkte vor dem Livegang

- [ ] **Datenschutzerklärung** einsetzen (`privacyBody` in `src/templates.mjs` ist ein Platzhalter).
- [ ] **HU-Erinnerung** auf dem Webspace einrichten: `config.php` prüfen, Cronjob anlegen, einmal selbst testen.
- [ ] Bestehende Einträge der alten HU-Erinnerung (TYPO3) übernehmen oder Kunden informieren.
- [ ] **Bessere Fotos**: Die vorhandenen Bilder haben nur 800 px Breite. Neue Fotos von Werkstatt, Team
      und Benny würden die Seite deutlich aufwerten (idealerweise ≥ 2000 px, querformatig).
- [ ] Logo als SVG/PNG mit transparentem Hintergrund (aktuell JPG).
- [ ] Impressum fachlich prüfen lassen.
