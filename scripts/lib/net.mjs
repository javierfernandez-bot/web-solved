// =========================================================
// fetch con reintentos + timeout.
// La WP API y el host de imágenes viven en trysolved.es, que puede no
// responder puntualmente desde los runners de GitHub Actions (ETIMEDOUT,
// 5xx del proxy, etc.). Un solo hipo de red no debe tumbar el build:blog,
// así que reintentamos con backoff exponencial antes de rendirnos.
// =========================================================

// Reintenta ante errores de red (ETIMEDOUT, ECONNRESET…), abortos por
// timeout y respuestas transitorias del servidor (429 / 5xx).
// Los 4xx "de verdad" (404…) se devuelven tal cual para que los maneje quien llama.
export async function fetchRetry(url, opts = {}) {
  const { retries = 4, timeoutMs = 25000, baseDelayMs = 1500, ...fetchOpts } = opts;
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...fetchOpts, signal: ac.signal });
      clearTimeout(timer);
      if (res.status === 429 || res.status >= 500) {
        // Transitorio del servidor/proxy: tratar como reintentable.
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      return res;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
      if (attempt < retries) {
        const delay = baseDelayMs * 2 ** (attempt - 1);
        console.warn(`  ⚠ fetch falló (intento ${attempt}/${retries}): ${err.message || err} — reintento en ${Math.round(delay / 1000)}s`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw new Error(`fetch agotó ${retries} intentos: ${lastErr?.message || lastErr} → ${url}`);
}
