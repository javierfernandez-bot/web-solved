# Mapa de enlazado artículo/glosario → módulo

5 octubre 2026. Objetivo: que el tráfico del blog llegue a los módulos que
peor rinden: `/no-conformidades/` (pos. 9,5), `/auditorias/` (pos. 12,3) e
`/incidencias/` (pos. 17,3). Antes de tocar nada, medí cuántos de los 103
artículos reales del blog ya enlazaban a cada uno: **1, 8 y 20**
respectivamente. El diagnóstico del encargo era correcto: estos tres
módulos apenas recibían enlaces internos.

## 1. La matriz artículo → módulo

Clasificación automática por coincidencia de palabras clave en título y
cuerpo (peso extra al título), con la categoría de WordPress como respaldo
cuando la señal es débil o ambigua. Datos completos en `seo/modulos.json`.
8 casos con señal nula o casi nula se revisaron y corrigieron a mano
(`control-de-proceso`, `control-estadistico-de-proceso-spc`,
`punto-de-control-critico-pcc`, `mejora-continua-kaizen`, `mermas`,
`inocuidad-alimentaria`, `mes` en el glosario; `reclamación a proveedor`
en el blog, que WordPress tenía mal categorizada).

| Módulo | URL | Artículos de blog | Fichas de glosario |
|---|---|---|---|
| No conformidades | `/no-conformidades/` | 5 | 3 |
| Auditorías | `/auditorias/` | 32 | 14 |
| Incidencias | `/incidencias/` | 17 | 1 |
| Checklists / KPIs | `/dashboard/` | 18 | 8 |
| Trazabilidad | `/industria-alimentaria/` | 19 | 12 |
| Proveedores | `/homologacion-de-proveedores/` | 10 | 3 |
| **Total** | | **101** | **40** |

"Checklists" y "trazabilidad" no tienen página de módulo propia en este
sitio: se mapean a `/dashboard/` (KPIs e indicadores) y a
`/industria-alimentaria/` (la página de producto para el sector) por ser
las rutas más cercanas que ya existen — no se ha creado ninguna página
nueva, tal y como pedía el encargo.

## 2. Enlaces contextuales insertados (2-3 por artículo)

Mecanismo: `scripts/build-enlaces.mjs` (nueva función `bloqueModulo()`)
inyecta el bloque dentro del mismo sistema automático que ya ponía los
términos de glosario y el CTA de producto — no son 101+40 ediciones a
mano, es una extensión del pipeline existente que corre en cada build.

- **351 enlaces nuevos** repartidos en **141 páginas** (101 posts + 40
  fichas), 2-3 por página.
- El texto del ancla rota entre 4 variantes por módulo según un hash del
  slug, para no repetir siempre la misma frase (ver `seo/modulos.json →
  modulos.*.anclas`). Ejemplos para "auditorías": *"el módulo de
  auditorías de Solved"*, *"cómo preparar tus auditorías"*, *"checklists
  de auditoría digitales"*, *"gestión de auditorías internas y
  externas"*.

**Páginas que ahora enlazan a cada módulo** (antes → después):

| Módulo | Antes | Después |
|---|---|---|
| `/no-conformidades/` | 1 | 9 |
| `/auditorias/` | 8 | 47 |
| `/incidencias/` | 20 | 22 |
| `/dashboard/` | — | 58 |
| `/industria-alimentaria/` | — | 42 |
| `/homologacion-de-proveedores/` | — | 13 |

`/incidencias/` sube menos en proporción porque ya tenía bastante
enlazado antes del cambio (y es el módulo con más posts realmente afines:
17). Aun así gana 2 páginas más y, sobre todo, deja de depender solo de
menciones sueltas: ahora tiene un bloque dedicado y constante.

## 3. CTA al final de cada artículo y a mitad de los 20 con más impresiones

- **Al final**: ya existía (el bloque `.post__cta` que inyecta
  `build-enlaces.mjs` desde antes de esta tarea) y sigue en los 101
  posts, con el texto propio de cada producto.
- **A mitad del artículo**: nuevo en esta tarea, en los 20 posts con más
  impresiones. Es un prompt corto (`.post__cta-inline`), no una copia del
  CTA completo — insertarlo duplicado habría quedado redundante, visible
  dos veces con el mismo texto en el mismo artículo. Se coloca junto al
  `<h2>` más cercano al punto medio real del cuerpo (por caracteres, sin
  contar el primer ni el último H2, para no caer pegado al principio o al
  final). 4 frases de apertura rotan igual que las anclas, para variar.

**Los 20 posts** (impresiones de `seo/plan-fusion.md`, jun-ago 2026 —
**dato histórico, no un pull de GSC de hoy**; es lo más reciente
disponible por artículo sin pedir otro export):

certificacion-ifs-food-guia-esencial (2103), iso-22000-la-guia-practica-y-definitiva (1490),
checklist-auditoria-iso-9001-imprescindible (1148), auditoria-de-proveedores-de-calidad (1074),
trazabilidad-alimentaria-que-es-y-como-gestionarla-bien (1038), gfsi-que-es-y-que-norma-te-conviene (792),
certificacion-brc-la-guia-definitiva (776), 7-kpis-de-control-de-calidad-que-si-importan (709),
normas-iso-clave-en-la-industria-alimentaria (686), software-de-control-de-calidad-para-industria-alimentaria (622),
tipos-de-auditoria-de-calidad (550), homologacion-de-proveedores-guia-practica (423),
trazabilidad-iso-9001-guia-practica-real (403), control-de-alergenos-sin-riesgos (343),
incidencias-recurrentes (319), software-de-gestion-de-incidencias-guia-para-elegir (314),
gestion-de-calidad-ventaja-competitiva (300), gestion-de-no-conformidades-en-alimentacion-guia-completa (297),
gestion-de-incidencias-en-excel (275), kpis-clave-para-medir-la-eficacia-de-la-gestion-de-incidencias-en-la-industria (200).

Al revisar el CTA de "gestión de no conformidades..." encontré que
WordPress lo tiene categorizado como "Gestión de incidencias" (error de
taxonomía ajeno a este repo), así que su CTA — final y de mitad — apuntaba
a `/incidencias/` en vez de a `/no-conformidades/`. Añadido un override en
`seo/enlazado.json → productoPorPost` para corregirlo de forma permanente,
no solo en este artículo.

## 4. Enlaces desde cada módulo a 3-5 artículos relacionados

Sección "Para seguir leyendo" añadida antes del formulario de contacto en
las 6 páginas de módulo, con artículos elegidos a mano (no automático) por
relevancia real, no solo por la clasificación de la matriz:

| Módulo | Artículos enlazados |
|---|---|
| `/no-conformidades/` | 5 |
| `/auditorias/` | 5 |
| `/incidencias/` | 5 |
| `/dashboard/` | 5 |
| `/industria-alimentaria/` | 5 |
| `/homologacion-de-proveedores/` | 4 (solo hay 10 artículos candidatos para este módulo; de ahí se eligieron los 4 más directamente relevantes) |

## 5. Verificación de enlaces rotos

`npm run check:seo` limpio después de cada fase (clasificación, enlazado
temático, CTA de mitad, enlaces desde módulo):

```
HTML revisados: 392 | enlaces internos: 4617 | assets: 4993 | bloques JSON-LD: 425
✔ Sin fallos.
```

4617 enlaces internos frente a los 4190 de antes de esta tarea: **427 más**
(351 de enlazado temático + 29 de las 6 páginas de módulo + los que
arrastra el ajuste de categoría de "no conformidades", ya contados en el
total anterior).

## Lo que no se tocó

- No se ha editado el texto original de ningún artículo ni ficha de
  glosario — todo el enlazado nuevo vive en el bloque auto-generado o,
  en el caso de las 6 páginas de módulo, en una sección nueva y separada.
- No se ha creado ninguna página de módulo nueva ("checklists" y
  "trazabilidad" usan rutas que ya existían).
- La clasificación automática es una aproximación razonable, no una
  revisión editorial artículo por artículo de los 141; los 8 casos de
  señal débil se corrigieron, pero con 141 páginas es posible que quede
  algún encaje mejorable. `seo/modulos.json` queda como la fuente de
  verdad para ajustar cualquier caso suelto sin tocar código.
