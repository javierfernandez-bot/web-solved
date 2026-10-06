// Construye la copia de preview pública que se sirve en javifer31.github.io.
//
// La 3.0 no está publicada: su sitio vive en local y en un repo privado. Esta
// copia existe sólo para poder enseñarla desde fuera, y por eso sale distinta
// del original en cuatro cosas, todas para no hacerle daño a trysolved.com:
//
//   1. Cada página lleva <meta name="robots" content="noindex,nofollow">.
//   2. Se le quitan canonical, hreflang y og:url, que apuntan a trysolved.com.
//      Un noindex sobre una página cuyo canonical señala a producción puede
//      propagar el noindex al destino — es decir, a las páginas vivas.
//   3. No se copian ni el sitemap, ni llms.txt, ni la documentación interna
//      (CLAUDE.md, DECISIONS, guidelines, seo/), ni el material de montaje de
//      los vídeos. En un repo público no pintan nada.
//   4. Cada página abre con una pantalla de contraseña (`_acceso.js`).
//
// Sobre la contraseña, para que nadie se confíe: es una cortina, no una
// cerradura. El sitio es estático, así que la comprobación ocurre en el
// navegador y se salta con las herramientas de desarrollo o con curl; y el
// repo de la preview es público —los user sites de GitHub no pueden ser
// privados—, así que el HTML se lee en GitHub sin pasar por ella. Sirve para
// que quien llegue de casualidad a la URL no vea el borrador. Si hace falta
// cerrar de verdad, la preview tiene que salir de GitHub Pages.
//
// Uso: node scripts/build-preview.mjs [destino]
//      PREVIEW_PASS=… node scripts/build-preview.mjs   (cambia la contraseña)

import { promises as fs } from 'node:fs';
import { createHash, randomBytes } from 'node:crypto';
import path from 'node:path';

const ORIGEN = process.cwd();
const DESTINO = path.resolve(process.argv[2] || path.join(ORIGEN, '..', 'web-solved-3-preview'));

const CONTRASENA = process.env.PREVIEW_PASS || 'solved-cabf6a';
const SAL = 'web-solved-3-preview';
const HASH = createHash('sha256').update(`${SAL}:${CONTRASENA}`).digest('hex');

// Directorios que no se copian nunca, en cualquier nivel del árbol.
const DIRS_FUERA = new Set([
  '.git', '.github', '.claude', '.cache', 'node_modules',
  'scripts', 'i18n', 'guidelines', 'seo', '_dev',
]);

// Rutas concretas (relativas a la raíz) que no se copian.
const RUTAS_FUERA = new Set([
  'sitemap.xml',            // lo generaría con URLs de trysolved.com
  'llms.txt',               // invita a los rastreadores de IA
  'robots.txt',             // se escribe uno propio más abajo
  'package.json',
  'package-lock.json',
  'assets/incidencias/broll',
  'assets/incidencias/musica',
]);

const esDocInterno = (nombre) => nombre.endsWith('.md');

const META_ROBOTS = '<meta name="robots" content="noindex,nofollow">';
const GUION_ACCESO = '<script src="/_acceso.js"></script>';

// canonical, cualquier hreflang, og:url y twitter:url.
const FUERA_DE_LA_CABECERA = [
  /^[ \t]*<link[^>]+rel=["']canonical["'][^>]*>[ \t]*\r?\n?/gim,
  /^[ \t]*<link[^>]+hreflang=["'][^"']*["'][^>]*>[ \t]*\r?\n?/gim,
  /^[ \t]*<meta[^>]+(?:property|name)=["'](?:og:url|twitter:url)["'][^>]*>[ \t]*\r?\n?/gim,
];

function despublicar(html) {
  let salida = html;
  for (const patron of FUERA_DE_LA_CABECERA) salida = salida.replace(patron, '');
  // Ojo: 440 páginas traen su propio <meta name="robots" content="index, follow">
  // y el resto un noindex,follow del glosario. Aquí se sustituyen todas — dejarlas
  // pasar porque «ya tienen robots» fue el fallo que casi publica el sitio indexable.
  if (/<meta[^>]+name=["']robots["'][^>]*>/i.test(salida)) {
    let primera = true;
    salida = salida.replace(/<meta[^>]+name=["']robots["'][^>]*>/gi, () => (primera ? ((primera = false), META_ROBOTS) : ''));
  } else {
    // Lo antes posible en el <head>, para que se lea aunque el rastreador corte.
    salida = salida.replace(/<head([^>]*)>/i, `<head$1>\n${META_ROBOTS}`);
  }
  // El guion de acceso va sin defer y lo más arriba posible del <head>: tiene que
  // correr antes de que se pinte nada, o el borrador se ve un instante antes de
  // taparse. Pero detrás del charset (que debe caer en el primer KB) y detrás del
  // CSP, porque una política declarada por <meta> sólo rige lo que va después.
  const csp = salida.match(/<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/i);
  const charset = salida.match(/<meta[^>]+charset=[^>]*>/i);
  const ancla = csp?.[0] || charset?.[0];
  salida = ancla
    ? salida.replace(ancla, `${ancla}\n${GUION_ACCESO}`)
    : salida.replace(/<head([^>]*)>/i, `<head$1>\n${GUION_ACCESO}`);
  return salida;
}

async function copiar(relativo = '') {
  const desde = path.join(ORIGEN, relativo);
  for (const entrada of await fs.readdir(desde, { withFileTypes: true })) {
    const rel = relativo ? path.posix.join(relativo, entrada.name) : entrada.name;
    if (RUTAS_FUERA.has(rel)) continue;
    if (entrada.isDirectory()) {
      if (DIRS_FUERA.has(entrada.name)) continue;
      await fs.mkdir(path.join(DESTINO, rel), { recursive: true });
      await copiar(rel);
      continue;
    }
    if (!entrada.isFile()) continue;
    if (esDocInterno(entrada.name)) continue;
    const destino = path.join(DESTINO, rel);
    if (entrada.name.endsWith('.html')) {
      const html = await fs.readFile(path.join(ORIGEN, rel), 'utf8');
      await fs.writeFile(destino, despublicar(html));
      hechos.html++;
    } else {
      await fs.copyFile(path.join(ORIGEN, rel), destino);
      hechos.otros++;
    }
  }
}

const hechos = { html: 0, otros: 0 };

// Se vacía el destino menos su .git, que es lo que ata la copia a su repo.
await fs.mkdir(DESTINO, { recursive: true });
for (const entrada of await fs.readdir(DESTINO)) {
  if (entrada === '.git') continue;
  await fs.rm(path.join(DESTINO, entrada), { recursive: true, force: true });
}

await copiar();

// Rastreo permitido a propósito: un Disallow impediría leer el noindex, y una
// URL bloqueada puede acabar indexada igual, sin contenido. Para que una página
// salga del índice hay que dejar que la lean y que vean que no debe estar.
await fs.writeFile(path.join(DESTINO, 'robots.txt'), `# Preview privada de Web Solved 3.0 — no es el sitio público.
# El sitio público es https://trysolved.com/ y tiene su propio robots.txt.
#
# Todas las páginas de aquí llevan <meta name="robots" content="noindex,nofollow">.
# El rastreo se permite justamente para que ese noindex se pueda leer: un
# Disallow lo escondería y la URL podría indexarse igual, sin contenido.
User-agent: *
Allow: /
`);

await fs.writeFile(path.join(DESTINO, '_acceso.js'), acceso());

console.log(`Preview en ${DESTINO}`);
console.log(`  ${hechos.html} HTML con noindex, sin canonical/hreflang y con pantalla de acceso`);
console.log(`  ${hechos.otros} ficheros más`);
console.log(`  contraseña: ${CONTRASENA}`);

function acceso() {
  return `// _acceso.js — lo genera scripts/build-preview.mjs. No se edita a mano.
//
// Cortina, no cerradura: esto corre en el navegador de quien mira, así que se
// salta con las herramientas de desarrollo o pidiendo el HTML con curl, y el
// repo de esta preview es público. Está para que quien llegue de casualidad a
// la URL no se encuentre el borrador, nada más.
(function () {
  var HASH = ${JSON.stringify(HASH)};
  var SAL = ${JSON.stringify(SAL)};
  var GUARDADO = 'solved-preview-acceso';
  var raiz = document.documentElement;

  try { if (localStorage.getItem(GUARDADO) === HASH) return; } catch (e) {}

  raiz.className += ' acceso-cerrado';
  var estilo = document.createElement('style');
  estilo.textContent = [
    'html.acceso-cerrado{visibility:hidden;overflow:hidden}',
    'html.acceso-cerrado #acceso{visibility:visible}',
    '#acceso{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;',
      'background:#0f1216;color:#fff;font:400 16px/1.5 "DM Sans",system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:24px}',
    '#acceso .caja{width:100%;max-width:360px;text-align:left}',
    '#acceso img{height:26px;width:auto;margin-bottom:40px;display:block}',
    '#acceso h1{font-size:26px;font-weight:300;letter-spacing:-.01em;margin:0 0 10px}',
    '#acceso p{margin:0 0 28px;color:rgba(255,255,255,.55);font-size:14px;font-weight:300}',
    '#acceso label{display:block;font-size:12px;letter-spacing:.04em;text-transform:uppercase;',
      'color:rgba(255,255,255,.45);margin-bottom:8px}',
    '#acceso input{width:100%;box-sizing:border-box;background:rgba(255,255,255,.06);color:#fff;',
      'border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:13px 14px;font-size:16px;font-family:inherit;outline:none}',
    '#acceso input:focus{border-color:rgba(255,255,255,.5);background:rgba(255,255,255,.09)}',
    '#acceso button{width:100%;margin-top:12px;background:#fff;color:#0f1216;border:0;border-radius:10px;',
      'padding:13px 14px;font-size:15px;font-family:inherit;font-weight:500;cursor:pointer}',
    '#acceso button:hover{background:rgba(255,255,255,.88)}',
    '#acceso .fallo{min-height:20px;margin:12px 0 0;font-size:13px;color:#ff8a7a}',
    '#acceso .pie{margin:36px 0 0;font-size:12px;color:rgba(255,255,255,.3);font-weight:300}'
  ].join('');
  (document.head || raiz).appendChild(estilo);

  function hex(buffer) {
    var vista = new Uint8Array(buffer), salida = '';
    for (var i = 0; i < vista.length; i++) salida += ('0' + vista[i].toString(16)).slice(-2);
    return salida;
  }

  function comprobar(texto) {
    // crypto.subtle sólo existe en contexto seguro; en https de Pages lo hay.
    if (!window.crypto || !crypto.subtle) return Promise.resolve(null);
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(SAL + ':' + texto)).then(hex);
  }

  function montar() {
    var capa = document.createElement('div');
    capa.id = 'acceso';
    capa.innerHTML = '<div class="caja">' +
      '<img src="/assets/logotipo-solved-claro.webp" alt="Solved">' +
      '<h1>Borrador de la web</h1>' +
      '<p>Esta copia no está publicada y no es el sitio de Solved. Para verla hace falta la contraseña.</p>' +
      '<form autocomplete="off">' +
        '<label for="acceso-clave">Contraseña</label>' +
        '<input id="acceso-clave" type="password" autocomplete="current-password" autofocus>' +
        '<button type="submit">Entrar</button>' +
        '<p class="fallo" role="alert"></p>' +
      '</form>' +
      '<p class="pie">El sitio publicado es trysolved.com</p>' +
    '</div>';
    document.body.appendChild(capa);

    var formulario = capa.querySelector('form');
    var campo = capa.querySelector('input');
    var fallo = capa.querySelector('.fallo');

    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      comprobar(campo.value).then(function (resultado) {
        if (resultado === HASH) {
          try { localStorage.setItem(GUARDADO, HASH); } catch (e) {}
          raiz.className = raiz.className.replace(/\\s*acceso-cerrado/, '');
          capa.parentNode.removeChild(capa);
          return;
        }
        fallo.textContent = resultado === null
          ? 'Este navegador no puede comprobar la contraseña.'
          : 'No es esa.';
        campo.value = '';
        campo.focus();
      });
    });
    campo.focus();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();
`;
}
