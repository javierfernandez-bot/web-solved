#!/usr/bin/env node
// =========================================================
// Servidor local que replica el comportamiento de GitHub Pages.
//
//   npm run serve            (puerto 8080)
//   npm run serve -- 3000
//
// python3 -m http.server NO vale para este sitio: no implementa peticiones
// Range y los <video> de las heroes se quedan en negro para siempre. Este sí.
//
// Reglas que imita de Pages:
//   /            → index.html
//   /x/          → x/index.html
//   /x           → x.html si existe; si no, redirige 301 a /x/ cuando hay
//                  x/index.html (es lo que hace Pages con los directorios)
//   nada de eso  → 404.html con código 404
// =========================================================
import { createReadStream, promises as fs } from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const puerto = Number(process.argv[2]) || 8080;
const RAIZ = process.cwd();

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
};

async function stat(p) { try { return await fs.stat(p); } catch { return null; } }

/** Devuelve {file} o {redir} o null, con las reglas de Pages. */
async function resolver(urlPath) {
  const rel = decodeURIComponent(urlPath).replace(/^\/+/, '');
  // Nunca salir de la raíz servida.
  const dentro = (p) => {
    const abs = path.resolve(RAIZ, p);
    return abs === RAIZ || abs.startsWith(RAIZ + path.sep) ? abs : null;
  };

  if (rel === '' || rel.endsWith('/')) {
    const p = dentro(rel + 'index.html');
    return p && (await stat(p))?.isFile() ? { file: p } : null;
  }
  const directo = dentro(rel);
  if (directo && (await stat(directo))?.isFile()) return { file: directo };

  const conExt = dentro(rel + '.html');
  if (conExt && (await stat(conExt))?.isFile()) return { file: conExt };

  const idx = dentro(rel + '/index.html');
  if (idx && (await stat(idx))?.isFile()) return { redir: '/' + rel + '/' };

  return null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${puerto}`);
  const hallado = await resolver(url.pathname);

  if (hallado?.redir) {
    res.writeHead(301, { Location: hallado.redir + url.search });
    return res.end();
  }

  let file = hallado?.file;
  let codigo = 200;
  if (!file) {
    file = path.join(RAIZ, '404.html');
    codigo = 404;
    if (!(await stat(file))?.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404');
    }
  }

  const st = await stat(file);
  const tipo = TIPOS[path.extname(file).toLowerCase()] || 'application/octet-stream';
  const rango = req.headers.range;

  // Range: imprescindible para que los <video> arranquen.
  if (rango && codigo === 200) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(rango);
    if (m) {
      let ini = m[1] === '' ? null : Number(m[1]);
      let fin = m[2] === '' ? null : Number(m[2]);
      if (ini === null) { ini = Math.max(0, st.size - (fin ?? 0)); fin = st.size - 1; }
      if (fin === null || fin >= st.size) fin = st.size - 1;
      if (ini > fin || ini >= st.size) {
        res.writeHead(416, { 'Content-Range': `bytes */${st.size}` });
        return res.end();
      }
      res.writeHead(206, {
        'Content-Type': tipo,
        'Content-Range': `bytes ${ini}-${fin}/${st.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': fin - ini + 1,
      });
      return createReadStream(file, { start: ini, end: fin }).pipe(res);
    }
  }

  res.writeHead(codigo, {
    'Content-Type': tipo,
    'Content-Length': st.size,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-cache',
  });
  if (req.method === 'HEAD') return res.end();
  createReadStream(file).pipe(res);
});

server.listen(puerto, () => {
  console.log(`Sirviendo ${RAIZ} en http://localhost:${puerto} (Ctrl+C para parar)`);
});
