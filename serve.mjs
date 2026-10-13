// Minimaler Vorschau-Server für ./dist – `npm run dev`
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, posix, resolve, sep } from "node:path";

const root = resolve("dist");
const port = Number(process.env.PORT) || 8080;
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
  ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain",
};

const notFound = async (res) => {
  res.writeHead(404, { "Content-Type": types[".html"] });
  res.end(await readFile(join(root, "404.html")).catch(() => "404"));
};

createServer(async (req, res) => {
  // URL-Pfad immer mit "/" behandeln (auch unter Windows), erst danach in einen Dateipfad umwandeln
  const urlPath = posix.normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
  let file = resolve(root, "." + urlPath);
  if (file !== root && !file.startsWith(root + sep)) return notFound(res);
  if (extname(file) === ".php") {
    // Der Node-Vorschauserver kann kein PHP ausführen – zum Testen: php -S localhost:8000 -t dist
    res.writeHead(501, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(JSON.stringify({ ok: false, message: "PHP ist in der Node-Vorschau nicht verfügbar." }));
  }
  try {
    if ((await stat(file)).isDirectory()) {
      if (!urlPath.endsWith("/")) { res.writeHead(301, { Location: urlPath + "/" }); return res.end(); }
      file = join(file, "index.html");
    }
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    notFound(res);
  }
}).listen(port, () => console.log(`Vorschau: http://localhost:${port}`));
