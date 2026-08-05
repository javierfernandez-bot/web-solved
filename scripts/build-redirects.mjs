#!/usr/bin/env node
// =========================================================
// build-redirects.mjs - Paginas puente para las URLs de la epoca WordPress.
//
//   npm run build:redirects
//
// Google sigue teniendo indexadas rutas del WordPress anterior que hoy
// devuelven 404. GitHub Pages no puede hacer un 301 de servidor, asi que la
// unica via es una pagina HTML minima con
// <meta http-equiv="refresh" content="0; url=..."> mas <link rel="canonical">.
// Google trata el refresh a 0 segundos como redireccion permanente y traslada
// las senales de la URL antigua a la de destino.
//
// El mapa vive en seo/redirects.json. Idempotente: reescribe en cada pasada.
// Quitar una entrada del JSON NO borra el fichero ya generado; hay que borrarlo
// a mano. Es a proposito: asi un descuido en el mapa no puede tumbar una ruta.
// =========================================================
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { config } from './config.mjs';

const MAP_FILE = 'seo/redirects.json';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function existe(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function bridgePage(dest) {
  const safe = esc(config.SITE_URL + dest);
  return [
    '<!doctype html>',
    '<html lang="es">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<meta http-equiv="refresh" content="0; url=' + safe + '">',
    '<link rel="canonical" href="' + safe + '">',
    '<title>Esta pagina se ha movido - Solved</title>',
    '</head>',
    '<body>',
    '<p>Esta pagina se ha movido. Si tu navegador no te lleva solo, <a href="' + safe + '">continua aqui</a>.</p>',
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

async function main() {
  let map;
  try {
    map = JSON.parse(await fs.readFile(MAP_FILE, 'utf8'));
  } catch (err) {
    console.error('::error::No se pudo leer ' + MAP_FILE + ': ' + err.message);
    process.exitCode = 1;
    return;
  }

  const entries = Object.entries(map).filter(([from]) => !from.startsWith('_'));
  const avisos = [];
  let escritos = 0;

  for (const [from, to] of entries) {
    const origen = String(from).replace(/^\/+/, '').replace(/\/+$/, '');

    if (!origen || origen.includes('..') || path.isAbsolute(origen)) {
      avisos.push('origen invalido: ' + from);
      continue;
    }
    if (typeof to !== 'string' || !to.startsWith('/')) {
      avisos.push('destino invalido en ' + from + ': debe empezar por / (recibido: ' + to + ')');
      continue;
    }
    if (to.replace(/^\/+/, '').replace(/\/+$/, '') === origen) {
      avisos.push('origen y destino coinciden en ' + from);
      continue;
    }

    // Una pagina puente nunca debe competir con un fichero real del sitio.
    const gemelo = origen + '.html';
    if ((await existe(gemelo)) && to !== '/' + gemelo) {
      avisos.push(origen + ' convive con ' + gemelo + ' y no apunta a el; revisa el mapa');
    }

    const dir = path.join('.', origen);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'index.html'), bridgePage(to), 'utf8');
    escritos += 1;
  }

  console.log('Paginas puente generadas: ' + escritos + ' de ' + entries.length);
  for (const a of avisos) console.error('::warning::' + a);

  if (escritos === 0) {
    console.error('::error::No se genero ninguna pagina puente.');
    process.exitCode = 1;
  }
}

main();
