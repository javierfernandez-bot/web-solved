#!/usr/bin/env node
// =========================================================
// RENDER DE LA BANDA DE IA A VÍDEO
//
//   npm run render:ia
//
// Graba `guidelines/ia.banda.reel.html` fotograma a fotograma y lo encadena en
// un MP4 en `assets/ia/`. También deja el póster (el fotograma con la primera
// respuesta puesta), que es lo que se ve antes de que el vídeo arranque.
//
// POR QUÉ FOTOGRAMA A FOTOGRAMA Y NO UNA CAPTURA DE PANTALLA
// Una grabación en tiempo real depende de lo rápida que vaya la máquina: si el
// navegador se salta un repintado, el vídeo se queda con un tirón que ya no se
// puede quitar. Aquí el reloj lo lleva el script: se le dice a la página en qué
// milisegundo tiene que estar, se fotografía, y se avanza. El resultado es el
// mismo en cualquier ordenador, y se puede subir a 60 fps sin tocar nada.
//
// EL BUCLE CIERRA
// La página está hecha para que el último fotograma enlace con el primero (la
// barra no se va nunca), así que el MP4 se puede poner en `loop` sin salto.
//
// Requiere Chrome instalado y ffmpeg en el PATH. Chrome se busca solo; si está
// en otro sitio, `CHROME=/ruta/al/chrome npm run render:ia`.
// =========================================================
import { spawn } from 'node:child_process';
import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const PUERTO  = Number(process.env.PUERTO || 8123);
const FPS     = Number(process.env.FPS || 30);
const ANCHO   = 1400;                 // el tamaño de la página, en px de CSS
const ALTO    = 540;                  // 2,59:1 — el alto justo del contenido
const ESCALA  = 2;                    // se graba al doble y se baja al codificar
const SALIDA  = Number(process.env.SALIDA_ANCHO || 1920);
/* Dos reels con el mismo mecanismo: el de /ia/ y el de /auditorias/. Lo único
   que cambia es qué página se graba y cómo se llama el fichero, así que van por
   variable de entorno y no por script duplicado.
     npm run render:ia          → guidelines/ia.banda.reel.html    → ia-reel
     npm run render:registros   → guidelines/ia.registros.reel.html → registros-reel */
const RUTA    = process.env.REEL   || '/guidelines/ia.banda.reel.html';
const NOMBRE  = process.env.NOMBRE || 'ia-reel';
const DESTINO = path.join(RAIZ, 'assets', 'ia');

const CHROMES = [
  process.env.CHROME,
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium', '/usr/bin/chromium-browser',
  '/opt/google/chrome/chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

function buscarChrome() {
  const c = CHROMES.find((r) => existsSync(r));
  if (!c) throw new Error('No encuentro Chrome. Pásalo con CHROME=/ruta/al/chrome.');
  return c;
}

/** Levanta el servidor del propio repo, para no depender de que esté puesto. */
function servidor() {
  const hijo = spawn(process.execPath, [path.join(RAIZ, 'scripts', 'serve.mjs'), String(PUERTO)], {
    cwd: RAIZ, stdio: 'ignore',
  });
  return new Promise((listo, falla) => {
    const intenta = (quedan) => {
      const req = http.get({ host: '127.0.0.1', port: PUERTO, path: RUTA }, (res) => {
        res.resume();
        listo(hijo);
      });
      req.on('error', () => {
        if (!quedan) return falla(new Error('El servidor local no arrancó'));
        setTimeout(() => intenta(quedan - 1), 150);
      });
    };
    intenta(40);
  });
}

const reloj = (ms) => (ms / 1000).toFixed(1) + ' s';

async function main() {
  await fs.mkdir(DESTINO, { recursive: true });

  const serv = await servidor();
  const navegador = await puppeteer.launch({
    executablePath: buscarChrome(),
    headless: 'new',
    args: [
      '--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb',
      // Sin esto, el suavizado de la letra cambia entre máquinas y el texto
      // "vibra" de un fotograma a otro.
      '--font-render-hinting=none', '--disable-lcd-text',
    ],
  });

  try {
    const pagina = await navegador.newPage();
    await pagina.setViewport({ width: ANCHO, height: ALTO, deviceScaleFactor: ESCALA });
    await pagina.goto(`http://127.0.0.1:${PUERTO}${RUTA}`, { waitUntil: 'networkidle0' });
    await pagina.waitForFunction('window.reelListo === true', { timeout: 30000 });

    const duracion = await pagina.evaluate(() => window.DURACION);
    const total = Math.round(duracion / 1000 * FPS);
    console.log(`${NOMBRE}: ${reloj(duracion)} · ${total} fotogramas a ${FPS} fps · ${ANCHO}×${ALTO}@${ESCALA}x`);

    const mp4 = path.join(DESTINO, NOMBRE + '.mp4');
    const ff = spawn('ffmpeg', [
      '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
      '-vf', `scale=${SALIDA}:-2:flags=lanczos`,
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '22',
      '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.1',
      // Sin audio: es una pieza de interfaz, va en `muted` y en bucle.
      '-an', '-movflags', '+faststart',
      mp4,
    ], { stdio: ['pipe', 'ignore', 'inherit'] });

    const escribir = (buf) => new Promise((ok) => {
      if (ff.stdin.write(buf)) ok(); else ff.stdin.once('drain', ok);
    });

    // El póster es el fotograma en que la primera respuesta ya está entera: una
    // barra vacía no cuenta nada, y es lo que vería quien no reproduce el vídeo.
    const tPoster = await pagina.evaluate(() => {
      // teclear + posar + buscar + entrar + un tercio de la lectura
      const q = document.querySelector('.reel__t').dataset.q.length;
      return q * 26 + 360 + 1000 + 320 + 1000;
    });
    let poster = null;

    for (let f = 0; f < total; f++) {
      const t = f * 1000 / FPS;
      await pagina.evaluate((ms) => window.pintar(ms), t);
      const png = await pagina.screenshot({ type: 'jpeg', quality: 96, optimizeForSpeed: true });
      await escribir(png);
      if (poster === null && t >= tPoster) poster = await pagina.screenshot({ type: 'png' });
      if (f % 60 === 0) process.stdout.write(`\r  ${f}/${total}`);
    }
    process.stdout.write(`\r  ${total}/${total}\n`);

    ff.stdin.end();
    await new Promise((ok, falla) => ff.on('close', (c) => c === 0 ? ok() : falla(new Error('ffmpeg salió con ' + c))));

    if (poster) {
      await sharp(poster).resize({ width: SALIDA }).webp({ quality: 82 }).toFile(path.join(DESTINO, NOMBRE + '-poster.webp'));
    }

    const { size } = await fs.stat(mp4);
    console.log(`✔ assets/ia/${NOMBRE}.mp4 — ${(size / 1048576).toFixed(1)} MB`);
    console.log(`✔ assets/ia/${NOMBRE}-poster.webp`);
  } finally {
    await navegador.close();
    serv.kill();
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
