// =========================================================
// fetch con reintentos + timeout.
// La WP API y el host de imágenes viven en trysolved.es (Hostinger), que
// puntualmente rechaza o corta conexiones desde los runners de GitHub Actions
// (ECONNRESET, ETIMEDOUT, EAI_AGAIN, 5xx del edge…). Un hipo de red no debe
// tumbar el build:blog y dejar el sitio sin el post del día, así que
// reintentamos con backoff exponencial + jitter durante ~1 minuto.
//
// Dos detalles que aprendimos por las malas:
//   - El `fetch` de Node envuelve todo en un `TypeError: fetch failed` sin
//     código. El motivo real vive en `err.cause` (y, con Happy Eyeballs, dentro
//     de un AggregateError). `describeError` lo desentierra para que el log del
//     workflow diga *por qué* falló, no solo que falló.
//   - Los runners de GitHub no tienen salida IPv6, pero trysolved.es publica
//     AAAA. Forzamos IPv4 para no gastar intentos contra direcciones muertas.
// =========================================================
import { setDefaultResultOrder } from 'node:dns';

setDefaultResultOrder('ipv4first');

// Identificarnos evita que el WAF/CDN nos trate como un bot anónimo y deja
// rastro en los logs de Hostinger si algún día hay que investigar un bloqueo.
const USER_AGENT = 'solved-web build:blog (+https://trysolved.com)';

// Desenreda el `TypeError: fetch failed` de undici hasta el error de verdad.
export function describeError(err) {
  const parts = [];
  for (let e = err, depth = 0; e && depth < 4; e = e.cause, depth++) {
    const code = e.code ? ` ${e.code}` : '';
    const addr = e.address ? ` (${e.address}${e.port ? `:${e.port}` : ''})` : '';
    parts.push(`${e.name || 'Error'}${code}: ${e.message}${addr}`);
    // Happy Eyeballs agrupa un fallo por cada dirección probada.
    if (Array.isArray(e.errors) && e.errors.length) {
      parts.push(`[${e.errors.map((x) => `${x.code || x.message}${x.address ? `@${x.address}` : ''}`).join(' | ')}]`);
    }
  }
  return parts.join(' ← ');
}

// Reintenta ante errores de red (ETIMEDOUT, ECONNRESET…), abortos por
// timeout y respuestas transitorias del servidor (429 / 5xx).
// Los 4xx "de verdad" (404…) se devuelven tal cual para que los maneje quien llama.
export async function fetchRetry(url, opts = {}) {
  const {
    retries = 6,          // ~1 min de ventana total: cubre los cortes cortos del edge
    timeoutMs = 30000,
    baseDelayMs = 2000,
    maxDelayMs = 30000,
    ...fetchOpts
  } = opts;
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        ...fetchOpts,
        headers: { 'User-Agent': USER_AGENT, ...fetchOpts.headers },
        signal: ac.signal,
      });
      clearTimeout(timer);
      if (res.status === 429 || res.status >= 500) {
        // Transitorio del servidor/proxy: tratar como reintentable.
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      if (attempt > 1) console.log(`  ✓ recuperado en el intento ${attempt}`);
      return res;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
      if (attempt < retries) {
        // Jitter para no sincronizar los reintentos de todas las imágenes a la vez.
        const backoff = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
        const delay = Math.round(backoff * (0.7 + Math.random() * 0.6));
        console.warn(`  ⚠ fetch falló (intento ${attempt}/${retries}): ${describeError(err)} — reintento en ${Math.round(delay / 1000)}s`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw new Error(`fetch agotó ${retries} intentos: ${describeError(lastErr)} → ${url}`);
}
