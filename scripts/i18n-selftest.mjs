#!/usr/bin/env node
/* Comprueba que cheerio + normalizar() devuelven el fichero tal cual entró.
   Se pasa sobre las versiones de git, que son las que nadie ha tocado. */
import { load } from 'cheerio';
import { execFileSync } from 'node:child_process';
import { serializar } from './lib/html-serie.mjs';

const ficheros = process.argv.slice(2);
let fallos = 0;
for (const f of ficheros) {
  let original;
  try { original = execFileSync('git', ['show', `HEAD:${f}`], { encoding: 'utf8', maxBuffer: 1 << 28 }); }
  catch { console.log(`  · ${f}: no está en HEAD, se salta`); continue; }
  const vuelta = serializar(load(original, { decodeEntities: false }));
  if (vuelta === original) { console.log(`  ok  ${f}`); continue; }
  fallos++;
  console.log(`  FALLA ${f}`);
  const a = original.split('\n'), b = vuelta.split('\n');
  let mostradas = 0;
  for (let i = 0; i < Math.max(a.length, b.length) && mostradas < 4; i++) {
    if (a[i] !== b[i]) { console.log(`     L${i + 1}\n       - ${(a[i]||'').slice(0,150)}\n       + ${(b[i]||'').slice(0,150)}`); mostradas++; }
  }
}
process.exit(fallos ? 1 : 0);
