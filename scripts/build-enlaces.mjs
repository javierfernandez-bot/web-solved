// build-enlaces.mjs — Enlazado interno del blog y del glosario.
//
// Por que existe: los 61 posts no enlazaban a ninguna de las 40 fichas del
// glosario, las 40 fichas no enlazaban a nada (cero enlaces salientes en el
// cuerpo) y el pie de todos los posts tenia un unico boton, "Volver al blog".
// No habia un solo CTA hacia producto en todo el blog.
//
// Que hace: inyecta un bloque delimitado por los comentarios enlazado:inicio y
// enlazado:fin. En cada post, un listado de terminos del glosario detectados en
// el texto mas un CTA a la pagina de producto de su categoria. En cada ficha del
// glosario, el enlace a la guia completa mas el mismo CTA.
//
// Es idempotente: si el bloque ya existe, se reemplaza. Eso importa porque
// /blog se regenera en cada build (y el bloque se recrea) pero /glosario son
// ficheros estaticos versionados en el repo (y el bloque se sobreescribe).
//
// No falla nunca el build: los problemas se avisan por consola.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const INICIO = '<!-- enlazado:inicio -->';
const FIN = '<!-- enlazado:fin -->';
const ANCLA_POST = '<footer class="post__foot">';
const ANCLA_GLOSARIO = '<p><a class="btn btn--secondary" href="../">';

const avisos = [];
const aviso = (m) => { avisos.push(m); };

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// Sin acentos y en minusculas, para comparar terminos con el texto del post.
const nrm = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// El mapa guarda rutas absolutas ("/incidencias.html"). Tanto /blog/<slug>/ como
// /glosario/<slug>/ estan a dos niveles de la raiz, asi que el prefijo es fijo.
const rel = (abs) => '../..' + abs;

const leerJson = async (rutaRelativa) =>
  JSON.parse(await fs.readFile(path.join(ROOT, rutaRelativa), 'utf8'));

const h1De = (html) => {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? m[1].replace(/<[^>]+>/g, '').trim() : '';
};

const categoriaDe = (html) => {
  const m = html.match(/<span class="post__cat">([\s\S]*?)<\/span>/i);
  return m ? m[1].replace(/<[^>]+>/g, '').trim() : '';
};

// Texto plano del cuerpo del post, para buscar terminos.
const cuerpoDe = (html) => {
  const i = html.indexOf('<div class="post__body">');
  if (i === -1) return '';
  const j = html.indexOf(ANCLA_POST, i);
  return html.slice(i, j === -1 ? html.length : j).replace(/<[^>]+>/g, ' ');
};

function bloqueCta(MAPA, producto) {
  const c = MAPA.cta && MAPA.cta[producto];
  if (!c) { aviso('sin texto de CTA para ' + producto); return ''; }
  return [
    '<aside class="post__cta">',
    '      <h2 class="post__cta-title">' + esc(c.titulo) + '</h2>',
    '      <p>' + esc(c.texto) + '</p>',
    '      <p><a class="btn btn--primary" href="' + rel(producto) + '">' + esc(c.boton) + '</a></p>',
    '    </aside>',
  ].join('\n      ');
}

function bloqueTerminos(items) {
  if (!items.length) return '';
  const lis = items
    .map((t) => '        <li><a href="../../glosario/' + t.slug + '/">' + esc(t.nombre) + '</a></li>')
    .join('\n');
  return [
    '<aside class="post__terms">',
    '      <h2 class="post__terms-title">Terminos relacionados</h2>',
    '      <ul>',
    lis,
    '      </ul>',
    '    </aside>',
  ].join('\n');
}

// Detecta nombres de terminos del glosario dentro del texto, respetando limites
// de palabra y tolerando guiones o espacios entre las palabras del termino.
function detectarTerminos(texto, terminos, max, excluir) {
  const t = nrm(texto);
  const fuera = new Set(excluir || []);
  const hits = [];
  for (const term of terminos) {
    if (hits.length >= max) break;
    if (fuera.has(term.slug)) continue;
    const palabras = nrm(term.nombre).split(/[^a-z0-9]+/).filter(Boolean);
    if (!palabras.length) continue;
    if (palabras.join('').length < 4) continue;
    const patron = '(^|[^a-z0-9])' + palabras.join('[^a-z0-9]+') + '([^a-z0-9]|$)';
    if (new RegExp(patron).test(t)) hits.push(term);
  }
  return hits;
}

function inyectar(html, bloque, ancla) {
  const marcado = INICIO + '\n    ' + bloque + '\n    ' + FIN;
  const a = html.indexOf(INICIO);
  const b = html.indexOf(FIN);
  if (a !== -1 && b !== -1 && b > a) {
    return html.slice(0, a) + marcado + html.slice(b + FIN.length);
  }
  const i = html.indexOf(ancla);
  if (i === -1) return null;
  return html.slice(0, i) + marcado + '\n\n    ' + html.slice(i);
}

async function main() {
  const MAPA = await leerJson(path.join('seo', 'enlazado.json'));
  const max = Number(MAPA.maxTerminosPorPost) || 4;
  const porDefecto = MAPA.productoPorDefecto || '/industria-general.html';

  // 1. Inventario del glosario: slug, nombre visible y fichero.
  const dirGlosario = path.join(ROOT, 'glosario');
  const terminos = [];
  for (const e of await fs.readdir(dirGlosario, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const file = path.join(dirGlosario, e.name, 'index.html');
    let html;
    try { html = await fs.readFile(file, 'utf8'); } catch { continue; }
    const nombre = h1De(html) || e.name;
    terminos.push({ slug: e.name, nombre, file, html });
  }
  // Los terminos mas largos primero: evita que "trazabilidad" tape a
  // "trazabilidad ascendente y descendente".
  terminos.sort((a, b) => b.nombre.length - a.nombre.length);

  for (const t of terminos) {
    if (!MAPA.terminos || !MAPA.terminos[t.slug]) aviso('termino sin mapear en enlazado.json: ' + t.slug);
  }

  // 2. Posts: terminos relacionados + CTA de producto segun categoria.
  const dirBlog = path.join(ROOT, 'blog');
  const postsMapeados = new Set();
  let posts = 0;
  let saltados = 0;
  for (const e of await fs.readdir(dirBlog, { withFileTypes: true })) {
    if (!e.isDirectory() || e.name === 'page') continue;
    const file = path.join(dirBlog, e.name, 'index.html');
    let html;
    try { html = await fs.readFile(file, 'utf8'); } catch { continue; }

    const cat = categoriaDe(html);
    // Un post concreto puede llevar a una pagina de producto propia
    // (productoPorPost). Si no la tiene, manda su categoria.
    const porPost = MAPA.productoPorPost && MAPA.productoPorPost[e.name];
    if (porPost) postsMapeados.add(e.name);
    const producto = porPost || (MAPA.productoPorCategoria && MAPA.productoPorCategoria[cat]) || porDefecto;
    if (!porPost && cat && !(MAPA.productoPorCategoria && MAPA.productoPorCategoria[cat])) {
      aviso('categoria sin producto asignado: ' + cat + ' (' + e.name + ')');
    }

    const relacionados = detectarTerminos(cuerpoDe(html), terminos, max, []);
    const bloque = [bloqueTerminos(relacionados), bloqueCta(MAPA, producto)].filter(Boolean).join('\n\n    ');
    const nuevo = inyectar(html, bloque, ANCLA_POST);
    if (nuevo === null) { saltados++; continue; }
    if (nuevo !== html) await fs.writeFile(file, nuevo, 'utf8');
    posts++;
  }

  for (const slug of Object.keys(MAPA.productoPorPost || {})) {
    if (!postsMapeados.has(slug)) aviso('productoPorPost apunta a un post que no existe en /blog: ' + slug);
  }

  // 3. Fichas del glosario: guia completa + CTA de producto.
  let fichas = 0;
  for (const t of terminos) {
    const cfg = (MAPA.terminos && MAPA.terminos[t.slug]) || {};
    const partes = [];
    if (cfg.articulo) {
      const fArt = path.join(ROOT, 'blog', cfg.articulo, 'index.html');
      let titulo = '';
      try { titulo = h1De(await fs.readFile(fArt, 'utf8')); } catch {
        aviso('el articulo ' + cfg.articulo + ' (termino ' + t.slug + ') no existe en /blog');
      }
      if (titulo) {
        partes.push('<p class="post__more">Guia completa: <a href="../../blog/' + cfg.articulo + '/">' + esc(titulo) + '</a></p>');
      }
    }
    const producto = cfg.producto || porDefecto;
    const cta = bloqueCta(MAPA, producto);
    if (cta) partes.push(cta);
    if (!partes.length) continue;

    const nuevo = inyectar(t.html, partes.join('\n\n    '), ANCLA_GLOSARIO);
    if (nuevo === null) { aviso('no encuentro donde inyectar en ' + t.slug); continue; }
    if (nuevo !== t.html) await fs.writeFile(t.file, nuevo, 'utf8');
    fichas++;
  }

  console.log('  Enlazado: ' + posts + ' posts y ' + fichas + ' fichas de glosario');
  if (saltados) console.log('  ' + saltados + ' ficheros de /blog sin ancla (indices y paginado): saltados');
  for (const a of avisos) console.log('  aviso: ' + a);
}

main().catch((err) => {
  console.error('build:enlaces fallo: ' + (err && err.stack ? err.stack : err));
  process.exit(1);
});
