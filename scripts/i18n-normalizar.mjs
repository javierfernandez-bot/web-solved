#!/usr/bin/env node
/* Devuelve un HTML a la serialización de la casa (ver lib/html-serie.mjs).
   Uso: node scripts/i18n-normalizar.mjs pagina.html [otra.html …] */
import { load } from 'cheerio';
import { readFileSync, writeFileSync } from 'node:fs';
import { serializar } from './lib/html-serie.mjs';
for (const f of process.argv.slice(2)) {
  const antes = readFileSync(f, 'utf8');
  const despues = serializar(load(antes, { decodeEntities: false }));
  if (antes !== despues) { writeFileSync(f, despues); console.log('normalizado', f); }
}
