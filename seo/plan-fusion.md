# Plan de fusión de artículos duplicados

**No ejecuta nada.** Es la lista de decisiones para que alguien las tome y luego
las aplique en WordPress. Fecha del análisis: **3 de septiembre de 2026**.

## De dónde salen los números

Search Console, propiedad `sc-domain:trysolved.com`, **1 jun – 31 ago 2026**,
dimensión `page`, leída con el escenario de Make `SEO Loop · GSC Reader` (9519508).
En cada celda: **impresiones · posición media · clics**. Las fechas de publicación
salen de la WP REST API de `trysolved.es`.

Tres avisos sobre los datos:

1. **`— · — · —` no significa "no funciona", significa "no hay ventana".**
   34 de los 90 artículos se publicaron después del 1 de agosto de 2026 y quince
   de ellos son justo los "duplicados" nuevos. Un artículo de dos semanas sin
   impresiones no ha fracasado: no ha empezado.
2. **La posición media de Search Console mezcla consultas.** Sirve para comparar
   dos artículos del mismo tema, no como nota absoluta.
3. Los datos son de España e incluyen marca.

## Cuatro cosas que conviene saber antes de decidir

### 1. Las páginas puente están tapando a los artículos reales

Las URLs viejas de la época WordPress se sirven hoy como páginas puente
(`noindex, follow` + refresh). Google no solo las sigue mostrando: en varios casos
**posiciona mejor la puente que el artículo canónico**, y los clics se los lleva ella.

| Página puente (noindex) | Impresiones | Pos. | Clics | El artículo real (`/blog/…`) |
|---|---|---|---|---|
| `/como-realizar-una-auditoria-de-calidad-interna-paso-a-paso/` | 1448 | 10.1 | 8 | 172 · 13.2 · 0 |
| `/como-configurar-alertas-automaticas-para-incidencias-criticas-en-la-linea-de-produccion/` | 1336 | 6.4 | 9 | 732 · 8.1 · 1 |
| `/importancia-de-la-trazabilidad/` | 997 | 7.4 | 4 | 300 · 17.4 · 2 |
| `/auditoria-de-proveedores-de-calidad/` | 940 | 6.9 | 9 | 1074 · 9.6 · 3 |
| `/normas-y-estandares-de-calidad/` | 768 | 12.3 | 9 | 339 · 9.9 · 2 |
| `/automatizacion-de-reportes-de-calidad/` | 493 | 7.5 | 1 | 51 · 11.1 · 1 |
| `/tipos-de-auditoria-de-calidad/` | 438 | 16.8 | 0 | 550 · 9.7 · 3 |
| `/gestion-de-calidad-ventaja-competitiva/` | 329 | 6.1 | 7 | 300 · 7.2 · 3 |
| `/comparativa-gestion-de-incidencias-en-excel-vs-software-especializado/` | 309 | 10.3 | 0 | 73 · 10.6 · 0 |
| `/documentar-incidencias-evidencias-digitales/` | 218 | 5 | 2 | 82 · 13.3 · 2 |

En total, **23 páginas puente suman 8.303 impresiones y 56 clics** en el trimestre.
Para comparar: el artículo del blog con más impresiones tiene 2.202, y el que más
clics tiene, 18. Es decir, hay más tráfico de búsqueda entrando por páginas que le
dicen a Google que no las indexe que por cualquier artículo del sitio.

Esto cambia cómo se lee la tabla de fusiones: cuando un artículo parece muerto
(cero clics) puede ser que su tráfico esté entrando por la puerta de al lado. Por eso
cada fila lleva el dato de su puente cuando existe.

**No se toca nada de esto en este plan** —las puentes están bien construidas y
`check:seo` las valida—, pero sí hay que tenerlo en cuenta al fusionar: si el
artículo que desaparece tiene puente, **el puente hay que reapuntarlo al
superviviente** en `seo/redirects.json`, no borrarlo.

### 2. La extensión no distingue a nadie

Los 90 artículos miden entre 1.079 y 1.884 palabras, con mediana 1.283. Salieron
del mismo generador, así que **"me quedo con el más largo" no es un criterio aquí**.
Lo que decide es la intención de la consulta y el rendimiento.

### 3. Media docena de "duplicados" son de este mes

Fusionar hoy `analisis-de-causa-raiz-en-calidad-como-hacerlo` (28-ago) o
`software-de-calidad-para-congelados-y-pescado` (1-sep) es decidir sin datos. En
esos casos la fusión es **barata** (no hay historial que perder) y por eso se
recomienda igual: lo que sobra no es el artículo, es que existan dos URLs para
la misma consulta. Donde sí se aplaza la decisión, la fila lo dice.

### 4. Fusionar no arregla una consulta de definición

El diagnóstico de origen es que el sitio compite en consultas de definición, donde
Google pone una vista de IA a pantalla completa. Fusionar dos artículos
definicionales deja **un** artículo que tampoco recibirá clics. La fusión sirve
para dejar de competir contra uno mismo; para recuperar clics hace falta cambiar
de consulta. Cuando un par cae entero del lado definicional, la fila lo señala.

## Cómo se decide quién sobrevive

En este orden:

1. **Intención.** Si las dos URLs responden a la misma pregunta, hay fusión. Si una
   es «qué es X» y otra «cómo hacer X», puede que no.
2. **Clics reales**, sumando los de su página puente si la tiene.
3. **Posición media** en el mismo tema.
4. **Antigüedad e historial**: a igualdad de todo lo demás, gana la URL con pasado.
5. **Cuál de los dos títulos persigue una consulta que existe.** Este criterio se
   salta a los anteriores una vez: fila 20.

## Los 23 pares

Columna 3: la URL que se conserva. Columna 4: la que se fusiona en ella y se redirige.

| # | Familia | Se conserva | Se fusiona y se redirige | Por qué |
|---|---|---|---|---|
| 1 | Auditoría interna | `como-realizar-una-auditoria-de-calidad-interna-paso-a-paso`<br>172 · 13.2 · 0 <br>*+puente 1448 · 10.1 · 8* | `auditoria-interna-de-calidad-sin-sustos`<br>455 · 16.8 · 0<br>*pub. 2026-07-29* | Misma consulta y misma intención de tarea. El superviviente es el único de los cuatro que arrastra clics (8, vía su página puente); el otro lleva 455 impresiones y cero clics en posición 16,8. |
| 2 | Auditoría interna | `como-realizar-una-auditoria-de-calidad-interna-paso-a-paso`<br>172 · 13.2 · 0 <br>*+puente 1448 · 10.1 · 8* | `auditoria-de-calidad-sin-errores-ni-sustos`<br>112 · 27.8 · 0 <br>*+puente 14 · 42.9 · 0*<br>*pub. 2026-07-02* | Posición 27,8: no compite por nada. Su único valor es el texto único que se pueda rescatar. |
| 3 | ISO 22000 | `iso-22000-la-guia-practica-y-definitiva`<br>1490 · 11.6 · 6 | `iso-22000-que-es-y-a-quien-le-exige-certificarse`<br>— · — · —<br>*pub. 2026-08-27* | El nuevo repite el ángulo con el que ya se retituló el viejo («qué es y qué exige la norma»). El viejo tiene 1.490 impresiones y 6 clics; el nuevo, una semana de vida. Rescatar «a quién le exige certificarse» como sección. |
| 4 | Causa raíz | `analisis-de-causa-raiz-que-evita-recaidas`<br>152 · 6.6 · 0 | `analisis-de-causa-raiz-en-calidad-como-hacerlo`<br>— · — · —<br>*pub. 2026-08-28* | Duplicado exacto de intención. Gana el que tiene historial y posición 6,6. |
| 5 | Alérgenos | `control-de-alergenos-sin-riesgos`<br>343 · 8.7 · 0 | `alergenos-alimentarios-control-y-gestion-en-planta`<br>— · — · —<br>*pub. 2026-08-29* | Duplicado exacto. El viejo ya está en posición 8,7 con 343 impresiones. |
| 6 | BRC / BRCGS | `certificacion-brc-la-guia-definitiva`<br>776 · 11.4 · 2 | `brcgs-que-es-y-que-exige-la-certificacion`<br>— · — · —<br>*pub. 2026-08-24* | La norma se llama BRCGS desde 2019 y la gente sigue buscando «BRC». Un solo artículo que cubra los dos nombres, en la URL que ya tiene 776 impresiones. |
| 7 | Auditoría ISO 9001 | `checklist-auditoria-iso-9001-imprescindible`<br>1148 · 7.3 · 16 | `criterios-de-auditoria-iso-9001-lo-esencial`<br>245 · 5.1 · 2<br>*pub. 2026-07-07* | El checklist es el segundo artículo del sitio en clics (16) y está en posición 7,3 para una consulta de tarea. «Criterios» es la misma búsqueda con otras palabras. |
| 8 | Auditoría ISO 9001 | `checklist-auditoria-iso-9001-imprescindible`<br>1148 · 7.3 · 16 | `auditoria-iso-9001`<br>64 · 10 · 0 <br>*+puente 198 · 7.4 · 1*<br>*pub. 2025-10-30* | Cabecera genérica con 64 impresiones y 0 clics contra 1.148 y 16. El slug corto es tentador, pero el rendimiento manda. |
| 9 | Software por sector | `software-de-control-de-calidad-para-industria-alimentaria`<br>622 · 7.4 · 2 | `software-de-calidad-para-fabricas-de-piensos`<br>— · — · —<br>*pub. 2026-08-18* | Mismo artículo con el sector cambiado. Sin nada específico que decir del sector, es canibalización pura del pilar. |
| 10 | Software por sector | `software-de-control-de-calidad-para-industria-alimentaria`<br>622 · 7.4 · 2 | `software-de-calidad-para-la-industria-pet-food`<br>— · — · —<br>*pub. 2026-08-19* | Ídem. Convertir en sección del pilar. |
| 11 | Software por sector | `software-de-control-de-calidad-para-industria-alimentaria`<br>622 · 7.4 · 2 | `software-de-calidad-para-congelados-y-pescado`<br>— · — · —<br>*pub. 2026-09-01* | Ídem. Publicado el 1-sep-2026: se fusiona antes de que acumule historial que perder. |
| 12 | Proveedores | `auditoria-de-proveedores-de-calidad`<br>1074 · 9.6 · 3 <br>*+puente 940 · 6.9 · 9* | `control-de-calidad-de-proveedores-evita-fallos`<br>197 · 12.1 · 0<br>*pub. 2026-07-09* | Se solapan de lleno. El superviviente suma 1.074 impresiones propias más 940 de su puente y 12 clics entre los dos. |
| 13 | Trazabilidad | `trazabilidad-alimentaria-que-es-y-como-gestionarla-bien`<br>1038 · 13.3 · 3 | `importancia-de-la-trazabilidad`<br>300 · 17.4 · 2 <br>*+puente 997 · 7.4 · 4*<br>*pub. 2025-10-22* | El segundo va de trazabilidad en la gestión de incidencias y está en posición 17,4. Su puente (997 impresiones, 4 clics) hay que reapuntarlo al superviviente en `seo/redirects.json`. |
| 14 | KPIs | `7-kpis-de-control-de-calidad-que-si-importan`<br>709 · 6.8 · 12 | `kpis-de-calidad`<br>13 · 19.9 · 0 <br>*+puente 20 · 6.4 · 0*<br>*pub. 2025-11-12* | 13 impresiones en posición 19,9 contra 709 en 6,8 con 12 clics. No hay debate. |
| 15 | KPIs | `7-kpis-de-control-de-calidad-que-si-importan`<br>709 · 6.8 · 12 | `indicadores-de-no-calidad-cuales-medir-y-por-que`<br>— · — · —<br>*pub. 2026-08-23* | Mismo tema con otro nombre. **Decisión aplazada**: publicado el 23-ago-2026, aún sin datos. Revisar el 23-oct-2026. |
| 16 | Excel vs software | `gestion-de-incidencias-en-excel`<br>275 · 8.2 · 4 <br>*+puente 98 · 8.1 · 0* | `comparativa-gestion-de-incidencias-en-excel-vs-software-especializado`<br>73 · 10.6 · 0 <br>*+puente 309 · 10.3 · 0*<br>*pub. 2025-12-03* | La misma consulta. Y es la consulta que importa: en 955 reuniones de venta el rival es Excel (50 % de los clientes), no otro software. |
| 17 | Elegir software | `software-de-gestion-de-incidencias-guia-para-elegir`<br>314 · 7.6 · 1 | `gestor-de-incidencias-como-elegir-el-mejor`<br>140 · 5.8 · 0<br>*pub. 2026-07-18* | Misma intención de decisión, dos títulos. Gana el de más impresiones (314 contra 140). |
| 18 | Normas | `normas-iso-clave-en-la-industria-alimentaria`<br>686 · 7.8 · 7 | `normas-y-estandares-de-calidad`<br>339 · 9.9 · 2 <br>*+puente 768 · 12.3 · 9*<br>*pub. 2025-10-31* | 7 clics contra 2. Cuidado: el puente del fusionado tiene 768 impresiones y 9 clics, más que el propio post; hay que reapuntarlo. |
| 19 | No conformidades | `gestion-de-no-conformidades-en-alimentacion-guia-completa`<br>297 · 5.9 · 10 | `no-conformidad-que-es-y-como-gestionarla`<br>— · — · —<br>*pub. 2026-08-26* | El superviviente tiene el mejor CTR del blog (10 clics sobre 297 impresiones, posición 5,9). El nuevo es definicional: exactamente la intención que la vista de IA se come. |
| 20 | Registros de calidad | `registro-de-calidad-que-debe-incluir-y-como-llevarlo`<br>— · — · — | `deja-de-perder-registros-de-control-de-calidad`<br>51 · 7.3 · 0<br>*pub. 2026-07-15* | **Excepción a la regla**: aquí gana el nuevo. El viejo tiene 51 impresiones y 0 clics, y su título no persigue ninguna consulta; el nuevo va a «qué debe incluir un registro de calidad», que sí se busca. |
| 21 | Cuadro de mando | `cuadro-de-mando-de-calidad-en-tiempo-real`<br>77 · 7.1 · 1 | `automatizacion-de-reportes-de-calidad`<br>51 · 11.1 · 1 <br>*+puente 493 · 7.5 · 1*<br>*pub. 2025-11-13* | Mismo tema (informes automáticos de calidad). El puente del fusionado tiene 493 impresiones: reapuntar. |
| 22 | Incidencias repetidas | `incidencias-recurrentes`<br>319 · 5.3 · 3 | `como-detectar-patrones-de-incidencias`<br>27 · 5.4 · 0 <br>*+puente 123 · 6.5 · 1*<br>*pub. 2025-10-21* | Detectar patrones es el método; las recurrentes, el problema. Una sola pieza. 319 impresiones y 3 clics contra 27 y 0. |
| 23 | APPCC digital | `/software-appcc/ (página de producto)` | `appcc-digital-como-pasar-del-papel-al-software-en-tu-empresa`<br>132 · 6.2 · 0<br>*pub. 2026-07-10* | **Decisión aplazada**: el post persigue «appcc digital» con 132 impresiones y 0 clics, y ahora hay una página de producto para esa consulta. Si en 60 días el post sigue a cero, fusionarlo en la página. Antes no: la página aún no tiene historial. |

## Lo que NO se fusiona

Solapan en título pero no en intención, o tienen señal propia que merece protegerse.

| URL | Por qué se queda |
|---|---|
| `tipos-de-auditoria-de-calidad`<br>550 · 9.7 · 3 | Intención distinta: comparar tipos de auditoría, no ejecutar una. 550 impresiones, posición 9,7, 3 clics. Se queda. |
| `trazabilidad-iso-9001-guia-practica-real`<br>403 · 5.8 · 3 | Trazabilidad bajo ISO 9001 no es trazabilidad alimentaria: otro público y otra norma. Posición 5,8. |
| `gfsi-que-es-y-que-norma-te-conviene`<br>792 · 7.8 · 1 | Responde a «qué esquema me conviene», que es una consulta de decisión. 792 impresiones en posición 7,8. |
| `kpis-clave-para-medir-la-eficacia-de-la-gestion-de-incidencias-en-la-industria`<br>200 · 6.4 · 3 | KPIs de incidencias, no de calidad. Público distinto. |
| `software-de-auditoria-alimentaria-como-elegir`<br>37 · 3.7 · 0 | Posición 3,7 con tres semanas de vida. Es de las mejores señales del sitio: no se toca. |
| `software-de-calidad-para-industria-carnica`<br>99 · 12.9 · 0 | Cárnica y láctea sí tienen mercado propio. **Condición**: reescribirlas con lo que cambia de verdad en ese sector; si en 60 días siguen siendo el pilar con el sector cambiado, se fusionan. |
| `software-de-calidad-para-la-industria-lactea`<br>46 · 9.6 · 1 | Ídem. 1 clic en dos semanas es más de lo que tienen muchos artículos de un año. |
| `homologacion-de-proveedores-guia-practica`<br>423 · 12.1 · 0 | Homologar, inspeccionar en recepción y reclamar son tres pasos distintos del mismo proceso. Se mantienen los tres y se enlazan en clúster hacia `/homologacion-de-proveedores/`. |
| `inspeccion-de-recepcion-de-materia-prima`<br>131 · 5.5 · 2 | Ídem. Posición 5,5 con 2 clics. |
| `reclamacion-a-proveedor-como-gestionarla-bien`<br>— · — · — | Ídem. Publicado el 25-ago-2026. |
| `gestion-de-calidad-ventaja-competitiva`<br>300 · 7.2 · 3 | Se solapa con «mejora continua con datos», pero las dos son flojas y ninguna es claramente la superviviente. Va al ciclo de refuerzos (reescribir título y meta), no a fusión. |
| `certificacion-ifs-food-guia-esencial`<br>2103 · 12.3 · 3 | 2.103 impresiones, las terceras del sitio. Norma distinta de BRCGS, ISO 22000 y FSSC: nada que fusionar. |
| `fssc-22000-que-es-y-como-obtener-la-certificacion`<br>— · — · — | Publicado el 20-ago-2026. FSSC no es ISO 22000 aunque se apoye en ella; esperar datos. |
| `software-de-trazabilidad-alimentaria-como-elegir`<br>— · — · — | Publicado el 2-sep-2026. Intención comercial, no informativa: no compite con el pilar de trazabilidad. |

## La familia «software de calidad para [sector]», aparte

Son seis URLs compitiendo entre sí y con el pilar:

- `software-de-control-de-calidad-para-industria-alimentaria` — 622 · 7,4 · 2 (el pilar)
- `software-de-calidad-para-industria-carnica` — 99 · 12,9 · 0 (14-ago)
- `software-de-calidad-para-la-industria-lactea` — 46 · 9,6 · 1 (17-ago)
- `software-de-calidad-para-fabricas-de-piensos` — sin datos (18-ago)
- `software-de-calidad-para-la-industria-pet-food` — sin datos (19-ago)
- `software-de-calidad-para-congelados-y-pescado` — sin datos (1-sep)

El problema de fondo no es que sean seis: es que **son el mismo artículo con el
nombre del sector cambiado**, y además son consultas comerciales viviendo en el
blog. La recomendación tiene dos partes:

1. **Fusionar piensos, pet food y congelados** en el pilar, como secciones («qué
   cambia en…»), y redirigir. Es lo que recogen las filas 9, 10 y 11.
2. **Cárnica y láctea se quedan, con condición**: reescribirlas con lo que de
   verdad cambia en ese sector (temperaturas y cadena de frío, alérgenos lácteos,
   limpieza CIP, normativa específica). Si el 3 de noviembre de 2026 siguen siendo
   el pilar con el sector cambiado, se fusionan también.

Y una observación que excede a este plan: estas páginas persiguen intención
comercial. Su sitio natural no es `/blog/`, sino páginas de producto como las tres
que se acaban de crear (`/software-appcc/`, `/software-iso-22000/`,
`/homologacion-de-proveedores/`).

## Cómo se ejecuta cada fusión

El repo **no puede borrar un post**: `/blog` se regenera entero desde WordPress en
cada build (`fs.rm` de `/blog` y vuelta a escribir). La secuencia obligatoria es:

1. **En WordPress (`trysolved.es`)**, sobre el artículo que sobrevive: pegar lo que
   sea único del que desaparece (ejemplos, tablas, secciones), revisar que no queden
   repeticiones y actualizar el Extracto si el enfoque cambia.
2. **En WordPress**, mandar el artículo fusionado a la papelera. No basta con
   despublicarlo: mientras siga en la API, el build lo vuelve a escribir.
3. **Solo entonces**, añadir en `seo/redirects.json`:
   `"blog/<slug-que-desaparece>": "/blog/<slug-superviviente>/"`.
   Si el desaparecido tenía además una puente de la época WordPress (clave sin
   `blog/`), **cambiar su destino** al superviviente en la misma línea.
4. `npm run build:blog && npm run build:redirects && npm run build:enlaces && npm run build:sitemap && npm run check:seo`.
5. Revisar `seo/enlazado.json`: si alguna ficha del glosario apuntaba al artículo
   fusionado en su campo `articulo`, cambiarla. `build:enlaces` avisa por consola
   («el articulo X no existe en /blog»), pero no falla el build.

> **Orden invertido = página pisada.** `build-redirects.mjs` escribe
> `<clave>/index.html` sin comprobar si ya existe. Si se añade
> `"blog/<slug>"` al mapa mientras el post sigue publicado, el siguiente build
> **sustituye el artículo vivo por una página puente**. Es el mismo aviso que ya
> lleva el `_readme` del fichero; con claves `blog/…` el riesgo es mayor porque
> `/blog` se regenera en cada pasada.

## Por dónde empezar

Los cuatro primeros bloques recuperan solape sin tocar nada que funcione:

1. **Auditoría interna** (filas 1-2): cuatro URLs para una consulta, 739 impresiones
   repartidas y cero clics propios. Es el peor caso del sitio.
2. **Los seis duplicados de agosto** (filas 3, 4, 5, 6, 19 y 11): fusión barata, sin
   historial que perder, antes de que lo acumulen.
3. **Auditoría ISO 9001** (filas 7-8): protege el artículo con más clics del blog.
4. **Software por sector** (filas 9-11).

El resto puede ir en tandas semanales. **Revisión de las decisiones aplazadas
(filas 15 y 23, y cárnica/láctea): 3 de noviembre de 2026**, con 60 días de datos.

## Lo que este plan no cubre

- Los 63 pares del diagnóstico se contaron comparando títulos. Aquí hay **23 pares
  accionables** y 14 URLs que se quedan; el resto de aquel recuento son solapes de
  título que no lo son de intención (dos artículos pueden llamarse parecido y
  responder a preguntas distintas).
- No se ha medido canibalización real por consulta (qué URL sale para cada query).
  Eso exige la dimensión `query`+`page` cruzada, y afinaría sobre todo las familias
  de trazabilidad y de proveedores.
- La fusión de contenido en sí —qué párrafos se rescatan de cada artículo— no está
  decidida aquí. Es trabajo editorial, artículo por artículo.
