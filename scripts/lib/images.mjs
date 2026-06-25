// =========================================================
// Descarga imágenes de WordPress y las sirve LOCALES y optimizadas.
//  - WebP + AVIF en varios anchos (responsive) para <picture>.
//  - JPG de respaldo SOLO para la imagen destacada (og:image robusto).
//  - Caché en .cache/blog-images: si ya se descargó/recodificó, no se repite.
// Nada de hotlink a /wp-content.
// =========================================================
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { config } from '../config.mjs';

const { IMAGE_WIDTHS, IMG_OUT_DIR, CACHE_DIR } = config;
const SRC_CACHE = path.join(CACHE_DIR, 'src');
const ENC_CACHE = path.join(CACHE_DIR, 'enc');

async function ensureDir(d) { await fs.mkdir(d, { recursive: true }); }
async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }

function keyFor(url) { return createHash('sha1').update(url).digest('hex').slice(0, 12); }

// Descarga el original (cacheado por URL) y devuelve su ruta local.
async function downloadOriginal(url) {
  await ensureDir(SRC_CACHE);
  const key = keyFor(url);
  const ext = (path.extname(new URL(url).pathname) || '.img').split('?')[0];
  const cached = path.join(SRC_CACHE, key + ext);
  if (await exists(cached)) return cached;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo descargar imagen ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(cached, buf);
  return cached;
}

// Recodifica a un formato/ancho concreto, con caché por (key,width,fmt).
async function encodeVariant(srcPath, key, width, fmt) {
  await ensureDir(ENC_CACHE);
  await ensureDir(IMG_OUT_DIR);
  const name = `${key}-${width}.${fmt}`;
  const cachePath = path.join(ENC_CACHE, name);
  const outPath = path.join(IMG_OUT_DIR, name);
  if (!(await exists(cachePath))) {
    let pipe = sharp(srcPath).resize({ width, withoutEnlargement: true });
    if (fmt === 'avif') pipe = pipe.avif({ quality: 50 });
    else if (fmt === 'webp') pipe = pipe.webp({ quality: 78 });
    else pipe = pipe.jpeg({ quality: 80, mozjpeg: true });
    await pipe.toFile(cachePath);
  }
  await fs.copyFile(cachePath, outPath); // colocar en el árbol publicable
  return name;
}

/**
 * Optimiza una imagen remota.
 * @returns {Promise<object|null>} imageData o null si falla (para no romper el build).
 */
export async function optimizeImage(url, { jpeg = false } = {}) {
  try {
    const srcPath = await downloadOriginal(url);
    const meta = await sharp(srcPath).metadata();
    const intrinsicW = meta.width || Math.max(...IMAGE_WIDTHS);
    const intrinsicH = meta.height || Math.round(intrinsicW * 0.625);
    const key = keyFor(url);

    // Anchos a emitir: los configurados que no superen el original; al menos uno.
    let widths = IMAGE_WIDTHS.filter((w) => w <= intrinsicW);
    if (widths.length === 0) widths = [intrinsicW];
    const largest = Math.max(...widths);

    const variants = [];
    for (const w of widths) {
      const webp = await encodeVariant(srcPath, key, w, 'webp');
      const avif = await encodeVariant(srcPath, key, w, 'avif');
      variants.push({ w, webp, avif });
    }

    let jpg = null;
    if (jpeg) jpg = await encodeVariant(srcPath, key, largest, 'jpg');

    const scale = largest / intrinsicW;
    return {
      key,
      variants,            // [{w, webp, avif}]
      jpg,                 // filename | null
      displayW: largest,
      displayH: Math.round(intrinsicH * scale),
      largestWebp: `${key}-${largest}.webp`,
    };
  } catch (err) {
    console.warn(`  ⚠️  imagen omitida (${err.message}): ${url}`);
    return null;
  }
}

function esc(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Construye el markup <picture> para una imagen ya optimizada.
 * blogPrefix = ruta desde la página actual hasta /blog/ (p. ej. '../' en un post).
 */
export function buildPicture(img, { blogPrefix, alt = '', eager = false, sizes = '(max-width: 760px) 100vw, 720px', className = '' } = {}) {
  if (!img) return '';
  const base = `${blogPrefix}assets/`;
  const srcset = (fmt) => img.variants.map((v) => `${base}${v[fmt]} ${v.w}w`).join(', ');
  const fallback = img.jpg ? `${base}${img.jpg}` : `${base}${img.largestWebp}`;
  const loading = eager ? 'eager' : 'lazy';
  const fp = eager ? ' fetchpriority="high"' : '';
  const cls = className ? ` class="${className}"` : '';
  return (
    `<picture${cls}>` +
      `<source type="image/avif" srcset="${srcset('avif')}" sizes="${esc(sizes)}">` +
      `<source type="image/webp" srcset="${srcset('webp')}" sizes="${esc(sizes)}">` +
      `<img src="${fallback}" width="${img.displayW}" height="${img.displayH}" alt="${esc(alt)}" loading="${loading}" decoding="async"${fp}>` +
    `</picture>`
  );
}

// Limpia blog/assets antes de un build (las imágenes se regeneran desde la caché).
export async function cleanImageOutput() {
  await fs.rm(IMG_OUT_DIR, { recursive: true, force: true });
}
