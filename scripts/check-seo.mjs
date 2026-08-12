#!/usr/bin/env node
// =========================================================
// Auditoría del HTML del sitio, sin levantar servidor.
//
//   npm run check:seo
//
// Resuelve las rutas como lo hace GitHub Pages (/x/ → x/index.html, /x → x.html
// si existe) y comprueba:
//   1. enlaces internos rotos
//   2. assets referenciados que no están en disco
//   3. páginas sin canonical, o con un canonical que no es su ruta real
//   4. páginas canónicas que sigan enlazando a .html
//   5. JSON-LD que no parsee
//   6. stubs de redirección mal formados
//   7. FAQPage cuyas preguntas no coincidan con las visibles en el HTML
//
// Sale con código 1 si hay algún fallo, para poder usarlo en CI.
// =========================================================
import { promises as fs } from 'node:fs';
import path from 'node:path';

const SITE = 'https://trysolved.com';
const IGNORAR_DIRS = new Set(['node_modules', '.git', '.cache']);

const fallos = [];
const avisos = [];
const fallo = (tipo, file, msg) => fallos.push({ tipo, file, msg });
const aviso = (tipo, file, msg) => avisos.push({ tipo, file, msg });

// ---------- inventario ----------
async function walk(dir, out = []) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = dir === '.' ? e.name : path.join(dir, e.name);
    if (e.isDirectory()) { if (!IGNORAR_DIRS.has(e.name)) await walk(p, out); }
    else out.push(p);
  }
  return out;
}
const todos = await walk('.');
const enDisco = new Set(todos);
const htmls = todos.filter(f => f.endsWith('.html') && !f.startsWith('_ds/'));

const existe = p => enDisco.has(p);

/** Resuelve una ruta de URL a fichero, como GitHub Pages. */
function resolver(urlPath) {
  let p = decodeURIComponent(urlPath).replace(/^\/+/, '');
  if (p === '' || p.endsWith('/')) {
    const idx = p + 'index.html';
    return existe(idx) ? idx : null;
  }
  if (existe(p)) return p;                       // fichero exacto (x.html, .css, .png…)
  if (existe(p + '.html')) return p + '.html';   // extensión implícita
  if (existe(p + '/index.html')) return p + '/index.html'; // Pages redirige a /p/
  return null;
}

/** Ruta canónica que le corresponde a un fichero HTML. */
function rutaDe(file) {
  if (file === 'index.html') return '/';
  if (file.endsWith('/index.html')) return '/' + file.slice(0, -'index.html'.length);
  return '/' + file;
}

const esStub = s => /http-equiv="refresh"/i.test(s);
const esNoindex = s => /<meta name="robots" content="[^"]*noindex/i.test(s);

// ---------- recorrido ----------
let nLinks = 0, nAssets = 0, nLd = 0;

for (const file of htmls) {
  const s = await fs.readFile(file, 'utf8');
  const dir = path.dirname(file);
  const stub = esStub(s);
  const noindex = esNoindex(s);
  const canonico = !stub && !noindex;

  // --- 5. JSON-LD ---
  for (const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    nLd++;
    try { JSON.parse(m[1]); }
    catch (e) { fallo('json-ld', file, `no parsea: ${e.message}`); }
  }

  // --- 6. stubs ---
  if (stub) {
    const dest = (s.match(/content="0;\s*url=([^"]+)"/) || [])[1];
    const canon = (s.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    if (!dest) fallo('stub', file, 'sin meta refresh con destino');
    else if (!resolver(dest)) fallo('stub', file, `redirige a ${dest}, que no existe`);
    if (!noindex) fallo('stub', file, 'un stub debe llevar robots noindex');
    if (!canon) fallo('stub', file, 'sin canonical');
    else if (dest && canon !== SITE + dest) fallo('stub', file, `canonical ${canon} ≠ destino ${dest}`);
    if (!/location\.replace/.test(s)) aviso('stub', file, 'sin fallback JS');
    if (!/<a href=/.test(s)) aviso('stub', file, 'sin enlace manual para navegación sin JS');
  }

  // --- 3. canonical ---
  const canon = (s.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (canonico) {
    if (!canon) fallo('canonical', file, 'página indexable sin canonical');
    else {
      const esperado = SITE + rutaDe(file);
      if (canon !== esperado) fallo('canonical', file, `dice ${canon}, su ruta real es ${esperado}`);
    }
  }

  // --- 1 y 2. enlaces y assets ---
  for (const m of s.matchAll(/(?:href|src|poster)="([^"]+)"/g)) {
    const raw = m[1];

    // Hotlinks al WordPress viejo: ese dominio lo sirve ahora el sitio
    // estático, así que /wp-content/ da 404 en producción. Se detectan aparte
    // porque son URLs absolutas y el resto de comprobaciones las ignora.
    if (/^https?:\/\/(www\.)?trysolved\.com\/wp-(content|includes)\//i.test(raw)) {
      fallo('wp-legacy', file, `hotlink al WordPress viejo (404 en producción): ${raw}`);
      continue;
    }

    if (/^(https?:|\/\/|#|mailto:|tel:|data:|javascript:)/i.test(raw)) continue;
    const limpio = raw.split('#')[0].split('?')[0];
    if (!limpio) continue;

    // Resolver relativo al directorio del documento. Ojo: normalize('blog/x/../../')
    // devuelve './', que es la raíz del sitio, no un directorio llamado ".".
    let abs;
    if (limpio.startsWith('/')) {
      abs = limpio;
    } else {
      let j = path.posix.normalize(path.posix.join(dir === '.' ? '' : dir, limpio));
      if (j === '.' || j === './') j = '';
      if (j.startsWith('../')) { fallo('enlace', file, `${raw} se sale de la raíz del sitio`); continue; }
      abs = '/' + j;
    }

    const esAsset = /\.[a-z0-9]{2,5}$/i.test(abs) && !abs.endsWith('.html');
    if (esAsset) nAssets++; else nLinks++;

    if (!resolver(abs)) {
      fallo(esAsset ? 'asset' : 'enlace', file, `${raw} → ${abs} no existe`);
    }

    // --- 4. páginas canónicas que sigan enlazando a .html ---
    if (canonico && /\.html$/i.test(abs) && abs !== '/404.html') {
      fallo('enlace-html', file, `${raw} apunta a un .html (debería ser /ruta/)`);
    }
  }

  // --- 7. FAQPage contra el HTML visible ---
  for (const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let d; try { d = JSON.parse(m[1]); } catch { continue; }
    const nodos = d['@graph'] || (Array.isArray(d) ? d : [d]);
    for (const nodo of nodos) {
      if (nodo['@type'] !== 'FAQPage') continue;
      const visibles = [...s.matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>/g)]
        .map(x => x[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
      for (const q of nodo.mainEntity || []) {
        const texto = (q.name || '').replace(/\s+/g, ' ').trim();
        if (visibles.length && !visibles.some(v => v === texto)) {
          aviso('faq', file, `la pregunta "${texto.slice(0, 60)}…" no aparece igual en el HTML`);
        }
      }
    }
  }
}

// ---------- sitemap ----------
if (existe('sitemap.xml')) {
  const xml = await fs.readFile('sitemap.xml', 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const vistos = new Set();
  for (const loc of locs) {
    if (vistos.has(loc)) fallo('sitemap', 'sitemap.xml', `URL duplicada: ${loc}`);
    vistos.add(loc);
    if (!loc.startsWith(SITE)) { fallo('sitemap', 'sitemap.xml', `URL de otro dominio: ${loc}`); continue; }
    const rel = loc.slice(SITE.length) || '/';
    if (rel.endsWith('.html')) fallo('sitemap', 'sitemap.xml', `URL con .html: ${loc}`);
    const f = resolver(rel);
    if (!f) { fallo('sitemap', 'sitemap.xml', `URL que no existe: ${loc}`); continue; }
    const s = await fs.readFile(f, 'utf8');
    if (esStub(s)) fallo('sitemap', 'sitemap.xml', `URL que es un stub: ${loc}`);
    if (esNoindex(s)) fallo('sitemap', 'sitemap.xml', `URL noindex: ${loc}`);
  }
  const sinLastmod = [...xml.matchAll(/<url>[\s\S]*?<\/url>/g)].filter(b => !b[0].includes('<lastmod>'));
  if (sinLastmod.length) fallo('sitemap', 'sitemap.xml', `${sinLastmod.length} URLs sin lastmod`);
  console.log(`sitemap.xml: ${locs.length} URLs`);
}

// ---------- informe ----------
console.log(`HTML revisados: ${htmls.length} | enlaces internos: ${nLinks} | assets: ${nAssets} | bloques JSON-LD: ${nLd}`);

const agrupar = (lista) => {
  const por = {};
  for (const x of lista) (por[x.tipo] ||= []).push(x);
  return por;
};

if (avisos.length) {
  console.log(`\n--- AVISOS (${avisos.length}) ---`);
  for (const [tipo, xs] of Object.entries(agrupar(avisos))) {
    console.log(`\n[${tipo}] ${xs.length}`);
    for (const x of xs.slice(0, 10)) console.log(`  ${x.file}: ${x.msg}`);
    if (xs.length > 10) console.log(`  … y ${xs.length - 10} más`);
  }
}

if (!fallos.length) {
  console.log('\n✔ Sin fallos.');
  process.exit(0);
}
console.log(`\n--- FALLOS (${fallos.length}) ---`);
for (const [tipo, xs] of Object.entries(agrupar(fallos))) {
  console.log(`\n[${tipo}] ${xs.length}`);
  for (const x of xs.slice(0, 15)) console.log(`  ${x.file}: ${x.msg}`);
  if (xs.length > 15) console.log(`  … y ${xs.length - 15} más`);
}
process.exit(1);
