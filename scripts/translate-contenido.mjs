#!/usr/bin/env node
/* Solved · traduce el contenido editorial (blog y glosario) a en/fr/it/de/pt.
   ------------------------------------------------------------------
   Las 22 páginas comerciales se traducen a mano en i18n/traducciones/ porque
   son el copy que vende. El blog (64 posts) y el glosario (41 términos) son
   otro orden de magnitud —unas 200.000 palabras por idioma— y se traducen con
   el CLI de Claude, cadena a cadena y con caché.

   Se traducen CADENAS, no el HTML entero: se recorre el documento con el mismo
   walker que usa el build (lib/i18n-dom.mjs), se manda la lista de textos y se
   vuelve a inyectar en su sitio. Así el modelo no puede tocar el marcado, ni
   perder un atributo, ni inventarse una etiqueta.

   La caché vive en i18n/cache/<lang>.json y está indexada por la cadena
   española, así que la nav, el pie y los enlaces relacionados —que salen en
   las 105 páginas— se traducen una sola vez.

   Uso:
     npm run translate:contenido -- --lang en                 (todo el inglés)
     npm run translate:contenido -- --lang de --limite 5      (5 páginas)
     npm run translate:contenido -- --lang fr --solo glosario
   Es reanudable: cada página que termina se guarda en la caché. */

import { load } from 'cheerio';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extraer } from './lib/i18n-dom.mjs';
import { cargarCatalogo } from './lib/i18n-catalogo.mjs';
import { paginasContenido } from './lib/i18n-rutas.mjs';
import { LANGS, TARGETS } from '../i18n/config.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODELO = process.env.SOLVED_I18N_MODELO || 'claude-sonnet-5';
/* Cadenas por llamada. Bajó de 120 a 40 el 4 de septiembre de 2026: con 120
   párrafos de blog el prompt se iba a decenas de miles de caracteres y el CLI
   fallaba en la mayoría de las tandas —de 103 páginas sólo entró entre el 12 %
   y el 26 % del texto—. Una tanda que falla se pierde entera, así que el tamaño
   se elige por lo que cuesta reintentarla, no por lo que cabe. */
const POR_TANDA = Number(process.env.SOLVED_I18N_TANDA || 40);

const args = process.argv.slice(2);
const valor = (n, d) => { const i = args.indexOf(n); return i === -1 ? d : args[i + 1]; };
const lang = valor('--lang');
const limite = Number(valor('--limite', '0')) || Infinity;
const solo = valor('--solo');

if (!TARGETS.includes(lang)) {
  console.error(`Falta --lang (${TARGETS.join(', ')})`);
  process.exit(1);
}

// ---------------------------------------------------------------- páginas
/* El recorrido vive en lib/i18n-rutas.mjs, compartido con el build: si aquí se
   tradujeran unas páginas y allí se construyeran otras, la diferencia sólo se
   vería en el sitio publicado. `--solo` filtra por carpeta (blog, glosario). */
const paginasDeContenido = () =>
  paginasContenido(RAIZ, solo ? [solo] : undefined);

// ---------------------------------------------------------------- caché
const dirCache = path.join(RAIZ, 'i18n/cache');
mkdirSync(dirCache, { recursive: true });
const ficheroCache = path.join(dirCache, `${lang}.json`);
const cache = existsSync(ficheroCache) ? JSON.parse(readFileSync(ficheroCache, 'utf8')) : {};
const { porIdioma } = cargarCatalogo(RAIZ);
const aMano = porIdioma[lang] || {};   // el catálogo escrito a mano manda

const guardar = () => writeFileSync(ficheroCache, JSON.stringify(cache, null, 1) + '\n');

// ---------------------------------------------------------------- motor
/* Pausa síncrona: el bucle de traducción es secuencial a propósito (la caché se
   guarda página a página), así que no hay nada que hacer mientras se espera. */
const esperar = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

const GLOSARIO = readFileSync(path.join(RAIZ, 'i18n/GLOSARIO.md'), 'utf8')
  .split('## Reglas')[0];

function instruccion(cadenas) {
  return `Traduce del español a ${LANGS[lang].nombre} (${lang}) los textos de una web B2B de software industrial.

Contexto de terminología —respétalo, es un glosario de marca:
${GLOSARIO}

Reglas:
- Devuelve SOLO un array JSON de cadenas, del mismo tamaño y en el mismo orden que la entrada.
- Traduce cada elemento por separado. Son fragmentos de una página: pueden ser una frase a medias, un título o dos palabras. Mantén el registro y la longitud aproximada.
- No añadas ni quites puntuación de los extremos, ni comillas, ni HTML.
- No traduzcas: marcas (Solved), nombres propios, siglas de norma (ISO 9001, IFS, BRC, HACCP), códigos ni URLs.
- Si un elemento no debe traducirse, devuélvelo tal cual.

Entrada:
${JSON.stringify(cadenas, null, 0)}`;
}

function traducirTanda(cadenas) {
  let salida;
  try {
    salida = execFileSync('claude', ['-p', '--model', MODELO, instruccion(cadenas)], {
      encoding: 'utf8', maxBuffer: 1 << 26, timeout: 600000,
    });
  } catch (e) {
    // El mensaje que trae execFileSync es la orden entera —con el prompt dentro—
    // y no dice nada de por qué falló. Lo que sirve está en stderr.
    const motivo = (e.stderr || e.stdout || '').toString().trim().split('\n').slice(-3).join(' | ');
    throw new Error(`claude ${e.status ?? e.code ?? ''}: ${motivo.slice(0, 300) || 'sin salida'}`);
  }
  const limpio = salida.replace(/^[\s\S]*?```(?:json)?\s*/m, '').replace(/```[\s\S]*$/m, '').trim();
  const bruto = limpio.startsWith('[') ? limpio : salida.slice(salida.indexOf('['), salida.lastIndexOf(']') + 1);
  const trads = JSON.parse(bruto);
  if (!Array.isArray(trads) || trads.length !== cadenas.length) {
    throw new Error(`el modelo devolvió ${trads.length} de ${cadenas.length}`);
  }
  return trads;
}

// ---------------------------------------------------------------- ejecución
const paginas = paginasDeContenido().slice(0, limite);
console.log(`${lang} · ${paginas.length} páginas de contenido · modelo ${MODELO}`);

let nuevas = 0, saltadas = 0;
for (const [i, rel] of paginas.entries()) {
  const $ = load(readFileSync(path.join(RAIZ, rel), 'utf8'), { decodeEntities: false });
  const pendientes = [...new Set(extraer($))].filter((c) => !aMano[c] && !cache[c]);
  if (!pendientes.length) { saltadas++; continue; }

  process.stdout.write(`  [${i + 1}/${paginas.length}] ${rel} · ${pendientes.length} cadenas`);
  for (let j = 0; j < pendientes.length; j += POR_TANDA) {
    const tanda = pendientes.slice(j, j + POR_TANDA);
    let trads;
    for (let intento = 1; intento <= 4; intento++) {
      try { trads = traducirTanda(tanda); break; }
      catch (e) {
        if (intento === 4) { console.log(`\n     ! ${rel}: ${e.message}`); break; }
        // Espera creciente: casi todos los fallos son de ritmo, no de contenido.
        esperar(5000 * 2 ** (intento - 1));
      }
    }
    if (!trads) continue;
    tanda.forEach((es, k) => { if (trads[k]) cache[es] = trads[k]; });
    nuevas += tanda.length;
  }
  guardar();
  console.log(' ·ok');
}
guardar();
console.log(`${lang} · ${nuevas} cadenas nuevas · ${saltadas} páginas ya cubiertas · caché: ${Object.keys(cache).length}`);
