#!/usr/bin/env node
// =========================================================
// RENDER DE LAS CAPAS DEL VÍDEO DE INCIDENCIAS
//
//   npm run render:incidencias
//
// Graba `guidelines/incidencias.reel.html` fotograma a fotograma. A diferencia
// del render de la banda de IA, aquí NO sale un MP4 opaco: sale la CAPA, con
// fondo transparente, para que ffmpeg la componga encima de los planos reales.
//
//   assets/incidencias/capa/  → secuencia PNG con alfa
//
// Si existen los planos (`assets/incidencias/plano-1.mp4` … `plano-5.mp4`), el
// script los encadena y compone la capa encima. Si no existen todavía, deja la
// secuencia y monta un MP4 de previsualización sobre grafito, que sirve para
// juzgar la animación sin esperar a los planos.
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
// MÚSICA
// El MP4 sale con una cama de música por debajo. La pista vive en
// `assets/incidencias/musica/` y se elige con la constante MUSICA de abajo o
// con la variable de entorno `MUSICA=/ruta/pista.mp3 npm run render:incidencias`.
// Si el fichero no está, el render sigue y sale mudo: la música no puede ser
// el motivo de que no se pueda regenerar el vídeo.
// Licencia y procedencia de las pistas: assets/incidencias/musica/FUENTES.md.
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
const ANCHO   = 1280;                 // el tamaño de la página, en px de CSS
const ALTO    = 720;                  // 16:9, el formato del vídeo
// Se graba al doble y se baja al codificar. Configurable porque una pasada de
// previsualización a ESCALA=1 tarda la cuarta parte y sirve para juzgar ritmo.
const ESCALA  = Number(process.env.ESCALA || 2);
const SALIDA  = Number(process.env.SALIDA_ANCHO || 1920);
const RUTA    = '/guidelines/incidencias.reel.html';
const DESTINO = path.join(RAIZ, 'assets', 'incidencias');

/* La pista por defecto. Se cambia aquí o con `MUSICA=` en la línea de órdenes;
   con `MUSICA=` vacío el vídeo sale mudo. */
const MUSICA = process.env.MUSICA !== undefined
  ? (process.env.MUSICA ? path.resolve(process.env.MUSICA) : '')
  : path.join(RAIZ, 'assets', 'incidencias', 'musica', 'breakbeat-mixkit-1103.mp3');

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
    await pagina.waitForFunction('typeof window.pintar === "function"', { timeout: 30000 });

    const duracion = await pagina.evaluate(() => window.DURACION);
    const total = Math.round(duracion / 1000 * FPS);
    console.log(`Incidencias: ${reloj(duracion)} · ${total} fotogramas a ${FPS} fps · ${ANCHO}×${ALTO}@${ESCALA}x`);

    /* El reel ya trae los planos dentro, así que aquí no se compone nada:
       entra la secuencia y sale el MP4. Los planos que falten se ven como
       bloque de color con su nota, para poder juzgar el montaje sin ellos. */
    const mp4 = path.join(DESTINO, 'incidencias.mp4');

    /* La cama de música. `-stream_loop -1` la repite por si algún día se cambia
       por una pista más corta que el reel; `-t` la corta a la duración exacta
       del vídeo, así que el bucle nunca llega a oírse. Entra y sale con fundido
       —milisegundo cero y último segundo y medio— porque un corte seco en el
       primer fotograma se oye como un fallo de reproducción. Y baja a -6 dB:
       esto es fondo, no banda sonora; si tapa el vídeo, sobra. */
    const segundos = duracion / 1000;
    const conMusica = existsSync(MUSICA);
    if (!conMusica && MUSICA) console.log(`  (sin música: no está ${path.relative(RAIZ, MUSICA)})`);

    const ff = spawn('ffmpeg', [
      '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
      ...(conMusica ? ['-stream_loop', '-1', '-i', MUSICA] : []),
      '-vf', `scale=${SALIDA}:-2:flags=lanczos`,
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '21',
      '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.1',
      ...(conMusica
        ? ['-map', '0:v:0', '-map', '1:a:0',
           '-af', `volume=-6dB,afade=t=in:st=0:d=1.2,afade=t=out:st=${(segundos - 1.6).toFixed(2)}:d=1.6`,
           '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2',
           '-t', segundos.toFixed(3)]
        : ['-an']),
      '-movflags', '+faststart',
      mp4,
    ], { stdio: ['pipe', 'ignore', 'inherit'] });

    const escribir = (buf) => new Promise((ok) => {
      if (ff.stdin.write(buf)) ok(); else ff.stdin.once('drain', ok);
    });

    // El póster es el fotograma en que la primera respuesta ya está entera: una
    // barra vacía no cuenta nada, y es lo que vería quien no reproduce el vídeo.
    // El póster es el fotograma en que la ficha de la escena 2 ya está entera:
    // una escena de canales sueltos no cuenta lo que hace el producto.
    const tPoster = await pagina.evaluate(() => window.ESCENAS[2].desde + 4200);
    let poster = null;

    for (let f = 0; f < total; f++) {
      const t = f * 1000 / FPS;
      await pagina.evaluate((ms) => window.pintar(ms), t);
      await pagina.evaluate(() => window.listo());
      const png = await pagina.screenshot({ type: 'jpeg', quality: 95, optimizeForSpeed: true });
      await escribir(png);
      if (poster === null && t >= tPoster) poster = await pagina.screenshot({ type: 'png' });
      if (f % 60 === 0) process.stdout.write(`\r  ${f}/${total}`);
    }
    process.stdout.write(`\r  ${total}/${total}\n`);

    ff.stdin.end();
    await new Promise((ok, falla) => ff.on('close', (c) => c === 0 ? ok() : falla(new Error('ffmpeg salió con ' + c))));

    if (poster) {
      await sharp(poster).resize({ width: SALIDA }).webp({ quality: 82 }).toFile(path.join(DESTINO, 'incidencias-poster.webp'));
    }

    const { size } = await fs.stat(mp4);
    console.log(`✔ assets/incidencias/incidencias.mp4 — ${(size / 1048576).toFixed(1)} MB`);
    console.log(`✔ assets/incidencias/incidencias-poster.webp`);
  } finally {
    await navegador.close();
    serv.kill();
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
