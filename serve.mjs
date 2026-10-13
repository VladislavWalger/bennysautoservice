// Minimaler Vorschau-Server für ./dist – `npm run dev`
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = "dist";
const port = Number(process.env.PORT) || 8080;
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
  ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain",
};

createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  let file = join(root, path);
  try {
    if ((await stat(file)).isDirectory()) {
      if (!path.endsWith("/")) { res.writeHead(301, { Location: path + "/" }); return res.end(); }
      file = join(file, "index.html");
    }
    res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { "Content-Type": types[".html"] });
    res.end(await readFile(join(root, "404.html")).catch(() => "404"));
  }
}).listen(port, () => console.log(`Vorschau: http://localhost:${port}`));
