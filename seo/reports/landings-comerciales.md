# Páginas de aterrizaje para 4 consultas comerciales sin página propia

5 octubre 2026. Encargo: crear página dedicada para 4 consultas donde
aparecemos en búsquedas pero sin página propia que capture esa demanda:
"software auditoría alimentaria" (176 imp, pos. 6,5), "checklists
digitales" (209 imp, pos. 9,7), "homologación de proveedores" (239 imp,
pos. 12,4) y "software trazabilidad alimentaria".

## 1. Homologación de proveedores: no se ha creado página nueva

Antes de construir nada se revisó si ya existía contenido para cada
consulta (no hay carpeta `/content` ni `/briefs` en este repo; la única
fuente es el propio sitio). `/homologacion-de-proveedores/` **ya existe**
como página de módulo completa y cumple ya todo lo que pedía el encargo:

- Título y meta propios, canonical correcto, está en `sitemap.xml`.
- FAQ con `FAQPage` en el JSON-LD.
- Sección "Para seguir leyendo" con 4 artículos relacionados (añadida en
  la tarea de enlazado interno, ver `seo/reports/mapa-enlazado.md`).
- CTA de los 5 artículos de blog sobre proveedores apuntando ya a esta
  página (`seo/enlazado.json → productoPorPost`).

Crear una segunda página para la misma consulta habría sido duplicar y
competir contra una página propia ya posicionada en 12,4 — justo lo que
el encargo pedía evitar. No se ha tocado esta página en esta tarea.

## 2. Las 3 páginas nuevas

Mismo patrón que `/homologacion-de-proveedores/` (hero, banda de logos,
puntos de dolor, "cómo funciona" con captura de producto, "para quién
es", testimonios, FAQ+JSON-LD, "para seguir leyendo", formulario de
contacto):

| Página | Consulta objetivo | Título (≤60) | Meta (≤155) |
|---|---|---|---|
| `/software-auditoria-alimentaria/` | software auditoría alimentaria | Software de auditoría alimentaria · Solved | ✓ |
| `/checklists-digitales/` | checklists digitales | Checklists digitales para calidad en planta · Solved | ✓ |
| `/software-trazabilidad-alimentaria/` | software trazabilidad alimentaria | Software de trazabilidad alimentaria · Solved | ✓ |

Todas con canonical a su propia URL, añadidas a `sitemap.xml` (247 URLs
en total ahora) y enlazadas desde el CTA final de su artículo de blog más
afín (`software-de-auditoria-alimentaria-como-elegir`,
`checklists-digitales-para-control-de-calidad`,
`software-de-trazabilidad-alimentaria-como-elegir`), vía nuevas entradas
en `seo/enlazado.json → cta` y `→ productoPorPost`. Ninguna de las 3 está
en el menú principal ni en el footer: siguiendo el patrón ya establecido
en el sitio, `/homologacion-de-proveedores/`, `/industria-alimentaria/` y
las páginas `/software-*` tampoco están ahí; se llega por contenido y
sitemap, no por navegación global.

Ninguna de las 3 inventa funcionalidad: todas las afirmaciones de
producto están tomadas del artículo de blog ya publicado y presumiblemente
revisado para esa misma consulta. Los testimonios (Rosa Gómez/Lácteos
Romar, Sergio Pérez/Fritoper, Álvaro Sobrino/Prilux) son los mismos 3
reales que ya usa `/homologacion-de-proveedores/`, reutilizados tal cual.

## 3. TODOs que requieren tu validación

Dos respuestas de la FAQ de `/software-trazabilidad-alimentaria/` se han
dejado marcadas como TODO en vez de inventar una cifra o un alcance:

- **"¿Se integra con el ERP o con básculas de línea?"** — no he
  encontrado en el blog ni en el resto del sitio una afirmación concreta
  sobre qué sistemas externos soporta la integración. Falta confirmar el
  alcance real antes de publicar una respuesta.
- **"¿En cuánto tiempo se completa un simulacro de recall?"** — mismo
  caso: no hay una cifra publicada en ningún artículo. Falta el tiempo
  real que tarda Solved en un simulacro de retirada.

Hasta que se rellenen, el `<details>` de cada pregunta en el HTML tiene
el texto literal "TODO: ..." visible — **no publicar así**, hay que
sustituirlo por la respuesta real o quitar la pregunta antes de pasar
esta rama a producción.

Todo lo demás (features, "para quién es", pain points) viene de contenido
ya publicado, sin TODOs pendientes.

## 4. Verificación

- `npm run check:seo`: **limpio** (395 páginas, 4629 enlaces internos,
  5044 assets, 431 bloques JSON-LD).
- JSON-LD de las 3 páginas nuevas validado como JSON parseable, con
  `BreadcrumbList` y `FAQPage` más el bloque `Organization` compartido.
- Comprobación visual con `npm run serve`: las 3 páginas devuelven `200`,
  título y H1 correctos, todas las imágenes referenciadas (hero, captura
  de producto, logos de testimonios) devuelven `200`.
- Los 3 artículos de blog modificados por el re-wiring del CTA se
  comprobaron con `grep` del bloque `.post__cta`: los tres apuntan ya a
  su página nueva en vez de a su módulo genérico anterior.

## Lo que no se tocó

- No se ha creado página para "homologación de proveedores": ya existe y
  ya cumple el encargo (ver punto 1).
- No se ha añadido ninguna de las 3 páginas nuevas al menú ni al footer,
  siguiendo el patrón ya existente para páginas comerciales secundarias.
- No se ha cambiado ninguna URL existente ni se ha tocado el contenido
  original de los artículos de blog, solo el bloque de CTA auto-generado.
