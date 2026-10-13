// Erzeugt die statische Website in ./dist (ohne externe Abhängigkeiten).
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { site, services } from "./src/content.mjs";
import {
  homePage, servicePage, jobsPage, contactPage, legalPage,
  imprintBody, privacyBody, notFoundPage,
} from "./src/templates.mjs";

const out = "dist";

const pages = {
  "index.html": homePage(),
  "jobs/index.html": jobsPage(),
  "kontakt-anfahrt/index.html": contactPage(),
  "impressum/index.html": legalPage({ slug: "impressum", title: "Impressum", body: imprintBody() }),
  "datenschutz/index.html": legalPage({ slug: "datenschutz", title: "Datenschutz", body: privacyBody() }),
  "404.html": notFoundPage(),
  ...Object.fromEntries(services.map((s) => [`leistungen/${s.slug}/index.html`, servicePage(s)])),
};

await rm(out, { recursive: true, force: true });
await cp("public", out, { recursive: true });

for (const [file, html] of Object.entries(pages)) {
  const target = join(out, file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html);
}

const urls = Object.keys(pages)
  .filter((f) => f !== "404.html")
  .map((f) => `${site.url}/${f.replace(/index\.html$/, "")}`);
await writeFile(
  join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u}</loc></url>`)
    .join("\n")}\n</urlset>\n`
);
await writeFile(join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`✔ ${Object.keys(pages).length} Seiten nach ./${out} geschrieben`);
