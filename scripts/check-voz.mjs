/* =========================================================
   check:voz — la ficha de voz, ejecutable
   ---------------------------------------------------------
   `guidelines/voz.md` explica el registro; esto lo comprueba. Existe porque un
   documento que hay que acordarse de leer se salta solo: en dos días se
   escribieron tres páginas nuevas y ninguna siguió la ficha. Un script que sale
   con código 1 no se salta.

   Revisa las páginas comerciales —no el blog, que se regenera desde WordPress,
   ni el glosario, que es definicional— y avisa de:

     · titular sin promesa (una ficha técnica en vez de un verbo y un resultado)
     · titular, meta y encabezados fuera de las medidas de SEO
     · segunda persona del plural, que no se usa en ninguna parte
     · coloquialismos y escena cotidiana
     · «herramienta» y «plataforma» fuera de donde la ficha las permite
     · signos de exclamación

   LO QUE NO MIRA, Y ES DELIBERADO
   Las citas de clientes (`.quote`, `blockquote`, `figcaption`), el texto de las
   pantallas de producto (`ds/app.css`, el tour, los aparatos) y los nombres de
   función del propio producto. Cambiar eso no es cambiar el registro: es
   falsificar una cita o inventar una interfaz.

   Uso:  npm run check:voz            todas las páginas
         npm run check:voz -- ruta    una sola
   ========================================================= */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

/* Páginas comerciales: la raíz y un nivel de carpetas, menos lo que se genera
   o no es copy de venta. */
/* `en`, `fr`, `it`, `de` y `pt` quedan fuera porque son artefactos: los escribe
   build-i18n.mjs desde el catálogo, y la ficha de voz está escrita en y para el
   castellano —las medidas de caracteres, «vosotros», los coloquialismos—. Pasada
   sobre las traducciones daba 146 fallos que no se pueden arreglar en la página,
   sólo en i18n/traducciones/. */
const FUERA = new Set(['blog','glosario','node_modules','assets','ds','_ds','scripts','seo',
                       'guidelines','author','category','tag','.git','.github','.cache',
                       'en','fr','it','de','pt','i18n']);
const LEGAL = /politica-de-|aviso-legal/;

function paginas() {
  const out = [];
  for (const e of readdirSync(RAIZ)) {
    if (e.endsWith('.html') && !LEGAL.test(e)) out.push(e);
    else if (!FUERA.has(e) && !e.startsWith('.') && !LEGAL.test(e)) {
      try {
        if (!statSync(join(RAIZ, e)).isDirectory()) continue;
        const i = join(e, 'index.html');
        statSync(join(RAIZ, i)); out.push(i);
        for (const s of readdirSync(join(RAIZ, e))) {          // un nivel más (casos)
          try { statSync(join(RAIZ, e, s, 'index.html')); out.push(join(e, s, 'index.html')); } catch {}
        }
      } catch {}
    }
  }
  return [...new Set(out)].sort();
}

/* — Verbos con los que arranca una promesa. Ampliar cuando haga falta: la lista
     es la que distingue «Gestiona las incidencias…» de «Gestión de incidencias…». */
const VERBOS = /\b(registra|gestiona|controla|digitaliza|cierra|conecta|ten|mantén|prepara|homologa|descubre|pon|pregunta|estandariza|deja|evita|reduce|documenta|demuestra|saca|lleva|haz|consigue|olvídate|elimina|unifica|centraliza|convierte|planifica|revisa|resuelve|anticipa|cumple|ahorra|multiplica|acaba|empieza|monta|integra|sustituye|libera|gana|sube|baja|mide|audita|firma|rellena|abre|asigna|programa|detecta|analiza|organiza|visualiza)\b/i;

const REGLAS = [
  { id:'vosotros',   grave:true,
    rx:/\b(vuestro|vuestra|vuestros|vuestras|tenéis|usáis|trabajáis|queréis|vais|sois|hacéis|podéis|os dan|os falta)\b/i,
    dice:'segunda persona del plural: el sitio habla de «tú» en la promesa y en impersonal en el cuerpo' },
  { id:'exclamacion', grave:true, rx:/!/, dice:'signo de exclamación' },
  { id:'coloquial',  grave:true,
    rx:/\b(a mano|de memoria|sin caos|papeles sueltos|boli|lío|chapuza|se acabó|al final del turno|el lunes|de golpe|un click|un clic|ni idea|pásate|échale|no os dan|nadie se entera|empieza la búsqueda)\b/i,
    dice:'coloquialismo o escena cotidiana' },
  /* «la herramienta de mantenimiento» del cliente es un sistema ajeno con nombre
     común, y ahí la palabra es correcta. Lo que baja de registro es Solved
     llamándose a sí mismo herramienta, que es el caso sin «de» detrás. */
  { id:'herramienta', grave:false, rx:/\b(la|una|misma|esta|nuestra) herramienta\b(?!\s+de\s)/i,
    dice:'«herramienta» baja de registro: sistema, software o el nombre del módulo' },
];

/* Contextos donde «plataforma» sí vale: capa técnica y productos ajenos. */
const PLATAFORMA_OK = /(api|integraci|créditos|creditos|ia\b|de cae|coordinación de actividades)/i;

const SALTAR_CLASE = /(app__|app--|device|ficha__|canal|aiband__|svt-|res__|res-pill|int-item|hub__tag|step__when|ds-stat|scene__glow|vcase__meta|quote|bridge__|stage__|iaq__i)/;
const SALTAR_BLOQUE = /<(figure|blockquote)[\s\S]*?<\/\1>|<[^>]*class="[^"]*\bquote\b[^"]*"[\s\S]*?<\/[a-z]+>/gi;

const limpio = (s) => s.replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&laquo;|&raquo;/g,'«')
  .replace(/&[a-z]+;/g,'').replace(/\s+/g,' ').trim();

let fallos = 0, avisos = 0;
const objetivo = process.argv[2];
const lista = objetivo ? [objetivo.replace(/^\.\//,'')] : paginas();

for (const f of lista) {
  let t;
  try { t = readFileSync(join(RAIZ, f), 'utf8'); } catch { console.log(`· ${f}: no existe`); continue; }
  t = t.replace(/<!--[\s\S]*?-->/g, '').replace(/<script[\s\S]*?<\/script>/g, '')
       .replace(/<style[\s\S]*?<\/style>/g, '').replace(SALTAR_BLOQUE, '');
  const linea = [];

  const noindex = /<meta name="robots"[^>]*noindex/i.test(t);
  const titulo  = limpio((t.match(/<title>([\s\S]*?)<\/title>/) || [,''])[1]);
  const meta    = limpio((t.match(/<meta name="description" content="([^"]*)"/) || [,''])[1]);
  const h1s     = [...t.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => limpio(m[1]));

  if (!noindex) {
    if (titulo.length < 50 || titulo.length > 60) linea.push([true, `<title> de ${titulo.length} caracteres (50-60): ${titulo}`]);
    if (meta.length   < 150 || meta.length   > 160) linea.push([true, `meta description de ${meta.length} caracteres (150-160)`]);
    if (h1s.length !== 1) linea.push([true, `${h1s.length} <h1> en la página (tiene que haber uno)`]);
    /* LAS LANDINGS DE CASO NO PROMETEN, ENGANCHAN.
       El titular de un caso es la cifra del cliente —«Dos horas diarias…», «De dos
       plantas a cinco»—, no una promesa de producto: la promesa la firma Solved y
       el caso lo firma quien sale en el vídeo. Lo que sí se les exige es el dato:
       un gancho sin cifra es sólo una frase. */
    const esCaso = /^casos-de-exito\/[^/]+\/index\.html$/.test(f);
    const CIFRA = /\d|\b(un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|quince|veinte|treinta|cuarenta|cincuenta|cien|mil)\b/i;
    if (h1s[0] && esCaso && !CIFRA.test(h1s[0]))
      linea.push([true, `titular de caso sin cifra: «${h1s[0].slice(0,90)}»`]);
    if (h1s[0] && !esCaso && !VERBOS.test(h1s[0]))
      linea.push([true, `titular sin promesa —no hay verbo—, es una ficha técnica: «${h1s[0].slice(0,90)}»`]);
  }

  for (const m of t.matchAll(/<(h1|h2|h3|h4|p|li|summary|a|span|b|button)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
    const [, tag, attrs, cont] = m;
    if (SALTAR_CLASE.test(attrs)) continue;
    if (/<(h1|h2|h3|h4|p|li|summary|div)\b/.test(cont)) continue;   // sólo hojas
    const txt = limpio(cont);
    if (txt.length < 8 || txt.startsWith('«')) continue;            // «…» es cita
    for (const r of REGLAS) {
      const hit = txt.match(r.rx);
      if (hit) linea.push([r.grave, `${r.dice} → «${hit[0]}» en: ${txt.slice(0,110)}`]);
    }
    const pl = txt.match(/\bplataforma\b/i);
    if (pl && !PLATAFORMA_OK.test(txt))
      linea.push([false, `«plataforma» fuera de la capa técnica en: ${txt.slice(0,110)}`]);
  }

  /* — ENCUADRE: Solved no es sólo calidad —
     De las 955 reuniones de venta, mantenimiento aparece en el 43,7 % del lado
     del cliente y es el 49 % de la cartera; producción, en el 32 %. Una página
     que repite «calidad» y no nombra ni mantenimiento ni producción deja fuera a
     la mitad de quien la lee, y es el sesgo que arrastra el sitio desde la 2.0.
     Se avisa, no se falla: hay páginas que son de calidad por definición
     —APPCC, ISO 22000, certificaciones, software-calidad—, y ahí es correcto. */
  const cuerpo = limpio(t);
  const cal = (cuerpo.match(/\bcalidad\b/gi) || []).length;
  const otras = /\b(mantenimiento|producción|averí|activo)/i.test(cuerpo);
  const esNorma = /(appcc|iso-22000|certificaciones|alimentaria|software-calidad)/.test(f);
  if (cal >= 3 && !otras && !esNorma)
    linea.push([false, `encuadre sólo de calidad: ${cal} menciones y ninguna a mantenimiento ni producción`]);

  if (linea.length) {
    console.log(`\n${f}`);
    for (const [grave, msg] of linea) { console.log(`  ${grave ? '✗' : '·'} ${msg}`); grave ? fallos++ : avisos++; }
  }
}

console.log(`\nPáginas revisadas: ${lista.length} | fallos: ${fallos} | avisos: ${avisos}`);
if (fallos) { console.log('\nLa ficha está en guidelines/voz.md.'); process.exit(1); }
console.log('✔ El registro se sostiene.');
