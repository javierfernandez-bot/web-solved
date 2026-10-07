# Web Solved 3.0 — contexto para trabajar aquí

Sitio estático (HTML + CSS + JS a pelo, **sin build, sin React, sin bundler**) que rehace
trysolved.com. Es una **copia desconectada de producción**: su remoto es un repo privado propio
(`javifer31/web-solved-3`), sin Pages, sin CNAME y con los crons del blog comentados. Lee `AVISO-3.0.md` antes de tocar nada relacionado con publicar.

## Cómo se trabaja

```
npm run serve        # servidor local que imita GitHub Pages (puerto 8080)
npm run check:seo    # auditoría: enlaces rotos, assets, canonicals, JSON-LD, sitemap
npm run render:ia    # graba la banda de IA a MP4 (necesita Chrome y ffmpeg)

npm run i18n:extract          # el catálogo de cadenas españolas + cobertura por idioma
npm run build:i18n            # /en/ /fr/ /it/ /de/ /pt/ · las 22 páginas comerciales
npm run build:i18n:contenido  # /en/ /fr/ /it/ /de/ /pt/ · blog y glosario
npm run build:sitemap         # sitemap con los seis idiomas
```

**Pasa `npm run check:seo` después de cada cambio.** Tiene que decir `✔ Sin fallos`.

**Y `npm run check:voz` si has tocado un texto**, que comprueba lo que dice `guidelines/voz.md`:
titular con promesa, medidas de SEO, nada de «vosotros» ni de coloquialismos. Tiene que decir
`✔ El registro se sostiene`. Está porque se escribieron tres páginas seguidas sin seguir la ficha.

Los HTML de raíz usan rutas absolutas (`/assets/…`, `/ds/…`), así que hay que verlos por el servidor,
no abriendo el fichero. `node_modules` viene copiado: no hace falta `npm ci`.

## Arquitectura de estilos — tres capas, en este orden

1. `_ds/solved-design-system-…/colors-and-type.css` — paquete exportado de Claude Design, **no se
   edita a mano**, tiene su propio juego de tokens (`--blue`, `--ink-…`).
2. `solved.css` — la hoja de la 2.0. 66 KB, todavía sostiene medio sitio.
3. `ds/*.css` — **el sistema de la 3.0, y el que manda.** Va después a propósito.

Índice de `ds/` en [`ds/README.md`](ds/README.md). Lo importante:

| Fichero | Qué es |
|---|---|
| `tokens.css` | Paleta, tipografía, forma, elevación, encuadre. Primero siempre. |
| `site.css` | Piezas de página: titulares, botones, tarjetas, `.ds-stats`, `.ds-dim`, `.section-head--split`. |
| `hero.css` · `hero-wave.js` | La hero y su shader WebGL. Siete entradas: `marca`, `ia` y una por página de módulo (`incidencias`, `registros`, `acciones`, `kpis`, `documentos`). |
| `integrations-weave.js` | «Convergencia»: la variante del haz de la hero de Integraciones. |
| `tint.css` · `scene.css` · `device.css` · `scene-dev.js` | El componente Escena de producto. |
| `app.css` | Las pantallas de la app que van dentro de una escena, en HTML. |
| `documentos.css` | Las cuatro piezas de `/gestor-documental/`: el móvil en planta, la versión validada, la IA que cita el documento y el documento en tres sitios a la vez. |
| `plantilla.css` | «El montaje de una plantilla»: los tres caminos para tener un registro, en bucle. Réplica de la animación de Mitti, con las pantallas reales de la app. |
| `sections.css` | Secciones de contenido: banda de caso, lista de casos, carril, trío y cita. |
| `hsform.css` | El formulario de HubSpot con la estética del sitio. No la carga ninguna página: la inyecta `chrome.js` dentro del iframe. |
| `rotador.js` | El rotador de capacidades (patrón 12 de `sections.css`): la lista se pasa sola y cambia la pantalla de al lado. |
| `dialog.css` · `scene.js` | El diálogo de una escena y el halo del borde. |
| `aiband.css` · `aiband.js` | La banda de IA: barra de prompt en bucle sobre grafito, en web (`.aiband`) y en vídeo (`.iavideo`). Guía en `/guidelines/ia.banda.html`. |
| `ia-dark.css` | El tema oscuro de `/ia/`. Reasigna los alias del DS en `[data-tema="ia"]`. |

## Reglas del sistema que no se negocian

**El registro es corporativo y técnico, y está escrito.** Ficha en
[`guidelines/voz.md`](guidelines/voz.md): titular nominal antes que imperativo, tercera persona en el
cuerpo, vocabulario de proceso (trazabilidad, evidencia auditable, desviación, criticidad) y el rival
—Excel, papel, WhatsApp— fuera de los titulares. Cambiado el 3 de septiembre de 2026 en las 18 páginas
comerciales; el registro llano anterior salía del análisis de las 955 reuniones y se sustituyó por
decisión de negocio. Corporativo **no** es vacío: «optimiza», «revoluciona» y «solución integral»
siguen prohibidos si detrás no hay una función que se pueda enseñar. Las citas de clientes, el texto
de las pantallas de producto y las cifras no se reescriben nunca.


**Nada de negrita.** Tres pesos: 300 thin, 400 regular, 500 medium. Se barrieron las 110
declaraciones de 600/700/800 que había. Si algo se ve flojo, no se sube el peso: se sube el tamaño.

**El tinte de una escena lo dicta su módulo.** No hay forma de pasarle un color: el único selector que
pinta lienzo es `.scene[data-module="…"]` con seis valores cerrados. En Solved el color codifica
módulo, conformidad y prioridad — si los lienzos se tiñen al gusto, el sistema se rompe. Detalle en
`ds/scene.prompt.md`.

**Todo lo de IA va sobre grafito.** No sólo el lienzo de las escenas: etiquetas, paneles y cualquier
pieza nueva. El morado sobre blanco ni contrasta a tamaño pequeño ni se lee como la capa de IA, que en
el producto es oscura.

**Tinte ≠ material de gradiente.** El tinte es plano, al 10 %, repetible. El material —la onda del
hero— tiene filamentos y presupuesto de dos apariciones grandes por página. El material dentro de una
escena es un anti-patrón.

**Las pantallas de la app se maquetan en HTML, no se capturan.** Es decisión del cliente: así ajusta
el contenido sobre lo que ve, y la pantalla no envejece con cada release. Maquetarla no es permiso
para inventarla — mismo azul, Roboto, misma densidad, y sólo columnas y paneles que el producto
tenga. La referencia es el tour de `/incidencias/`, que se hizo contra capturas. Ficha en `ds/app.css`.

**El encuadre es continuo.** Los raíles verticales (`.frame`, `section > .wrap`) recorren la página
entera. Por eso `ds/site.css` aplana toda `<section class>` en escritorio; ojo, esa regla
(`section[class]`, 0-1-1) gana a cualquier clase suelta y ya rompió `no-conformidades/` una vez.

**Sobre una foto, nunca un elemento blanco plano.** Un `.res`, un `.ntf` o cualquier pieza de producto
que caiga encima de `.scene[data-canvas="foto"]` se lee como una pegatina si es blanco sólido —se
despega de la fotografía en vez de parecer parte de ella—. Ahí va **vidrio esmerilado** (`background:
rgba(255,255,255,.46)`, `backdrop-filter:blur(22px) saturate(1.3)`, borde y sombra con blanco
translúcido — el mismo ESTILO HIELO de `.ntf`, `.compo--hielo` y, desde el 1 de octubre de 2026,
`.scene[data-canvas="foto"] .res` en `ds/scene.css`) o una pieza real de la interfaz de Solved, nunca
una tarjeta opaca inventada para la ocasión. Fuera de un lienzo de foto —sobre el tinte plano de
módulo— el blanco sólido sigue siendo correcto: ahí sí lee como tarjeta, no como pegatina.

**Ningún componente puede tapar la escena de la foto** (regla del 5 de octubre de 2026, a raíz de que
un `.device` entero —iPhone, iPad o ventana de navegador— tapaba casi por completo al protagonista de
las cuatro fotos de `/software-gmao/`). Antes de dar por buena una creatividad sobre
`.scene[data-canvas="foto"]`, hay que comprobar que la persona de la foto se sigue viendo entera, no
sólo un brazo o un hombro en el borde. Si el componente no encaja sin taparla, la salida **no** es
encoger el componente a la fuerza hasta que el texto deje de leerse: es ser más conservador —una ficha
pequeña y suelta en el hueco que deja libre la foto (`.app__mcard` u otra pieza real de tamaño de
recurso, nunca la pantalla entera con su marco de aparato) o, si ni así cabe, otra foto con más hueco
compuesto a propósito. Referencia del cliente: **mitti.com/es/activos** — la persona ocupa un lado del
encuadre y el resto es cielo o fondo liso, con fichas de activo pequeñas y sueltas flotando ahí, nunca
sobre ella.

## Estado a 7 octubre 2026 — los cuatro vídeos de casos de éxito, desbloqueados: fuera el gate de correo

Petición del cliente: quitar el gate de correo de las cuatro landings de caso
(`/casos-de-exito/<caso>/`) y que el vídeo se reproduzca directamente. Decisión
de negocio explícita, confirmada antes de tocar nada: se pierde la captura de
lead de estas cuatro páginas a cambio de que el vídeo se vea sin fricción.

**Las cuatro páginas pierden el formulario de HubSpot, el candado y
`ds/gate.js` entero.** El `<video>` pasa de `data-src` (lo ponía el script al
abrir) a `src` directo, con `controls` nativo y el mismo `poster`; sin JS que
lo abra no hace falta. `ds/gate.css` se reescribe para un solo estado —ya no
hay «cerrado»/«abierto»—: `.gate--hero` es una columna (texto arriba, vídeo
centrado debajo, máximo 860px), que es literalmente el layout que antes sólo
se veía tras dejar el correo. Se borra `ds/gate.js` del repositorio: sin
botón que abrir, sin formulario que escuchar por `postMessage` y sin
`localStorage` que marcar, no quedaba nada que hiciera. `ds/gate.css` sube a
`?v=20261007a` en las cinco páginas que lo cargan (el índice + los cuatro
casos).

**El índice (`/casos-de-exito/`) cambia el candado por un icono de play** en
las cuatro tarjetas (`.vcase__lockicon` → `.vcase__playicon`): prometía «hay
que dejar el correo» y ya no es cierto. El SVG es un triángulo de play, no un
candado.

**El JSON-LD de los cuatro `VideoObject` pasa `isAccessibleForFree` de
`false` a `true`**, que es lo que ahora es verdad.

`npm run check:seo` (819 HTML, ✔ sin fallos) y `npm run check:voz` (53
páginas, ✔, los dos avisos de «plataforma» en `industria-alimentaria/` e
`integraciones/` son previos y ajenos a este cambio) pasan. `npm run
build:i18n` propagó el cambio a las 19 páginas de cada uno de los cinco
idiomas. Verificado en el navegador: el vídeo de Carnavi reproduce al pulsar
play, sin ningún formulario de por medio.

**Pendiente de negocio, ahora irrelevante para estas cuatro páginas:** el
pendiente #0 sobre crear el formulario corto de vídeo en HubSpot
(`formIdVideo` en `chrome.js`) ya no aplica aquí — el componente `hs-contact-
form[data-hs-form="video"]` que lo necesitaba se ha retirado de las cuatro
landings. Si `chrome.js` sigue sirviendo ese tipo de formulario en algún otro
sitio, revisar si conviene retirarlo también de ahí.

## Estado a 30 septiembre 2026 (8) — cuándo se mueve una animación, en todo el sitio: empieza al llegar, y el acordeón no repite en bucle

Petición del cliente: revisar las animaciones de producto de todas las páginas para que arranquen al
llegar el visitante a esa parte de la página (no antes), que las secciones de tipo acordeón —el
rotador de capacidades, patrón 12— cuenten su gesto una vez y se queden ahí en vez de repetirlo en
bucle mientras siga elegida, y que sí se repitan si se sale de la sección y se vuelve.

**El sitio ya tenía la mitad del mecanismo, y estaba mal repartido.** `ds/scene.js` pausaba con
`IntersectionObserver` lo que saliera de pantalla marcando `data-offscreen`, pero la regla que
traducía eso a `--play:paused` sólo alcanzaba a `.app` (`.scene[data-offscreen] .app{--play:paused}`,
en `ds/app.css`): una escena sin `.app` dentro —un `.res`, un `.qrscan`, la pila de `.montaje`— seguía
corriendo fuera de pantalla, y **`/dashboard/` y `/casos-de-exito/`, que cargan `ds/scene.css` sin
`ds/app.css`, no pausaban nada en absoluto**. Y de las cuarenta y pico animaciones de `ds/scene.css`,
sólo dieciocho obedecían `--play`; el resto (`res-row-in`, `qrscan-sweep`, `planalt-a/b`,
`regpush-*`, `regchk-*`, `regprog-fill`, `res-swap-*`…) corrían en bucle infinito desde que cargaba
la página, sin mirar la pantalla.

**Arreglado, y movido a `ds/scene.css` para que alcance a toda página que monte una escena**, la
tenga o no `ds/app.css`:

- **`--play` pasa a pausar la escena entera** (`.scene[data-offscreen]{--play:paused}`), no sólo lo
  de dentro de `.app`. Las animaciones que no lo obedecían en `ds/scene.css`, `ds/app.css`,
  `ds/plantilla.css`, `ds/documentos.css` y `ds/celdas.css` ganan su
  `animation-play-state:var(--play,running)` — mecánico, con un script de una sola vez y verificado
  bloque a bloque contra el fichero (ningún `--play` sin su pareja).
- **Y al volver a pantalla, se reinicia, no se reanuda.** `--play:paused` por sí solo deja el
  fotograma donde estaba —pausado a los 3 s de un ciclo de 8, seguiría a los 3 al volver—, y lo que
  pide el cliente es que se cuente otra vez desde el principio. `ds/scene.js` ahora reconoce cuándo
  una escena que YA llevaba `data-offscreen` deja de llevarlo, y en ese instante pone a 0 todos sus
  fotogramas (`getAnimations({subtree:true}).forEach(a=>a.currentTime=0)`) antes de que `--play`
  vuelva a `running`. La primera vez que una escena entra en pantalla no cuenta como «vuelta» —no
  llevaba el atributo— y no se toca: ya empieza desde su principio de verdad.

**El acordeón (rotador de capacidades) es el caso aparte, y costó más.** Poner
`animation-iteration-count:1` sin más rompía la mitad de las piezas: muchas de estas animaciones
fabrican su fotograma del 100 % IGUAL al del 0 % A PROPÓSITO, para que la costura del bucle no se
note —el check de «leído» se apaga otra vez a los 100 %, el acto A de un cruce de opacidad vuelve a
hacerse visible—. Congelar ahí con `animation-fill-mode:forwards` no enseña la historia resuelta,
enseña el reinicio del bucle: el check «leído» desaparecido, la ficha equivocada encima.

**La solución reutiliza lo que el propio sistema ya tenía escrito y vetado: el estado de
`@media (prefers-reduced-motion:reduce)`.** Cada pieza narrativa del sitio ya lleva su propio bloque
de movimiento reducido con el comentario «se queda en su estado resuelto —el que cuenta la historia
entera—»: son, literalmente, los valores que hacían falta. Cada uno de esos bloques (23 en total,
entre `ds/scene.css`, `ds/app.css`, `ds/plantilla.css`, `ds/documentos.css` y `ds/celdas.css`) se
duplica tal cual —mismos selectores, mismas declaraciones, generado con un script y verificado
selector a selector contra el original, cero diferencias— bajo `.scene[data-terminado] …`, sin media
query: el mismo «estado resuelto» sirve para dos preguntas distintas («¿el visitante pidió menos
movimiento?» y «¿la capacidad ya ha terminado su vuelta?»), sin inventar un segundo juego de valores
que hubiera que mantener sincronizado a mano.

**`ds/rotador.js` es quien pone `--iter` y `data-terminado`, no una hoja de estilos**, y es a
propósito: sin el script, el rotador no oculta ningún panel (se ven las cuatro capacidades apiladas y
abiertas, que es el estado seguro sin JS) y capar la vuelta a una sola en CSS puro las habría dejado
corriendo una vez y quietas para siempre en su fotograma de bucle en vez del bucle de toda la vida.
Con el script montado: `--iter:1` una vez, al montar cada rotador; al activar una capacidad se le
quita su `data-terminado` de la vez anterior, se reinician sus fotogramas a 0 y se programa un reloj
—aparte del que avanza de capacidad, que sí se para al pasar el ratón— que pone `data-terminado`
justo cuando su `data-dur` se cumple, ni antes (cortaría el gesto) ni después (enseñaría el reinicio
del bucle). Si el visitante deja el ratón encima —lo que hoy para el avance a la siguiente
capacidad— la que se ve igualmente termina y se queda quieta, en vez de repetirse cada
`data-intervalo`, que era el fallo que se pedía arreglar. Y si sale de la sección del rotador y
vuelve —el mismo `IntersectionObserver` que ya tenía `ds/rotador.js` para pausar el avance—, la
capacidad activa se reactiva entera, con su reloj de «terminado» reiniciado.

Verificado en el navegador (`/auditorias/`, capacidad «Elige entre multitud de controles»): forzado
el reloj con el ratón encima —para el avance—, a los 7 s se pone `data-terminado` y la pantalla se
queda con los cinco controles ya rellenados y firmados, sin volver a vaciarse aunque pasen otros
10 s; al reelegir la misma capacidad, `data-terminado` se quita y las veinte animaciones de dentro
vuelven a arrancar desde 0. `npm run check:seo` (819 HTML, ✔ sin fallos) y `npm run check:voz`
(53 páginas, ✔, ningún texto tocado) pasan. `ds/scene.css` sube a `?v=20260930b`, `ds/app.css` a
`?v=20260930q`, `ds/sections.css`, `ds/plantilla.css` y `ds/documentos.css` a `?v=20260930a`,
`ds/scene.js` y `ds/rotador.js` a `?v=20260930a` — bump replicado a mano en las páginas de los cinco
idiomas además de las españolas, como ya se hizo con `hero.css` hoy mismo: es un cambio de
comportamiento, no de cadenas, y el build habría horneado en español el hueco de traducciones
pendiente de otras páginas. `ds/celdas.css` se actualiza igual por coherencia, aunque hoy no la carga
ninguna página (`.montaje` la sustituyó en `/auditorias/`).

**Lo que no se ha tocado:** la banda de IA (`.aiband`, patrón propio con reloj en JavaScript, no
`.scene`) ya pausaba y reanudaba por su cuenta —fuera de pantalla y con la pestaña oculta— y se deja
igual: reanuda a mitad de turno en vez de reiniciar desde el turno 0, que es una mejora más pequeña y
no era el foco de esta petición.

## Estado a 30 septiembre 2026 (7) — `/gestion-de-activos/` estrena la distribución de `/ia/`: titular centrado y la composición justo debajo

Petición del cliente: replicar en Activos la distribución de la hero de `/ia/`, pero con la
composición de planta que ya vivía más abajo en la página —la foto de faena con la ficha del activo
montada en HTML (`.compo`, patrón 11 de `ds/sections.css`)—. Allí lo que va bajo el titular es el
vídeo de la banda de IA; aquí es esa composición, que es la creatividad principal de la página.

**El orden cambia, el contenido no.** La página iba hero → cinta de clientes → composición, o sea el
titular a la izquierda y la pieza que lo ilustra tres pantallas más abajo. Ahora va **hero centrada →
composición → cinta de clientes**, que es el orden literal de `/ia/`. Ni el titular, ni el subtítulo,
ni un solo dato de la composición se han tocado: es una mudanza de bloque, no una reescritura.

**Dos modificadores nuevos en `ds/hero.css`, y los dos son generalizaciones de lo que ya hacía
`/ia/` a mano dentro de `[data-tema="ia"]`:**

- **`.ds-hero--compacta`** — la hero cede alto (`min-height:0`, 52/36 de aire, 18 de hueco). La hero
  del sistema mide el 90 % de la pantalla porque en casi todas las páginas **ella** es el argumento;
  cuando el argumento va debajo, ese 90 % deja la pieza entera fuera de la primera pantalla y la
  distribución se pierde. Medido a nueve anchos: con la clase puesta asoman entre **109 px** (a 320)
  y **357 px** (a 768) de la composición sin bajar nada.
- **`.frame--bajo-hero`** — el marco de la pieza, sin aire propio (`padding-block:0`). Es lo mismo
  que `.frame--ia-video` de `ds/ia-dark.css`, que se queda donde está porque esa hoja sólo la carga
  `/ia/`; el día que se toque, las dos se unifican.

`.ds-hero--centro` no hizo falta tocarlo: ya se generalizó el 14 de septiembre, con su velo radial
—el texto centrado se mete en el haz del shader y el gris de `.ds-dim` necesita el velo detrás—.

**El envoltorio de la composición cambia de familia, y el ancho no se mueve.** Era
`<section class="section section--tight">` con su `.wrap` —unión a sangre y 128 px de aire por
lado—; pasa a `.frame.frame--seam.frame--bajo-hero`. `.frame` y `section > .wrap` declaran
exactamente las mismas medidas (80 % con tope en `--container` y el mismo padding), comprobado
contra el DOM: **1265,99 px los dos**, el mismo que el `.ds-hero__frame` de arriba. Así los `cqw` de
la composición —que es `container-type:inline-size`— siguen dando las mismas cifras y no hubo que
retocar ni uno de los valores en línea (`--compo-ui-w`, `--compo-mira-*`…). La aparición de
secciones de `chrome.js` tampoco se entera: `.compo` está en su lista de exclusiones por su propia
clase, no por la del contenedor.

`ds/hero.css` sube a `?v=20260930a` en las 98 páginas que lo cargan. **El cambio se ha replicado a
mano en las cinco traducciones** (`en/asset-management/`, `fr/gestion-des-actifs/`,
`it/gestione-degli-asset/`, `de/anlagenverwaltung/`, `pt/gestao-de-ativos/`) en vez de lanzar
`build:i18n`: no hay ni una cadena nueva en esta vuelta —es orden y clases—, y el build habría
horneado en español el hueco de cadenas sin traducir que arrastran las vueltas de `/ia/` de hoy.

`check:seo` (819 HTML, ✔ sin fallos) y `check:voz` (53 páginas, ✔) pasan. Verificado en el navegador
en español y en inglés, y con Chrome sin cabeza a 320/375/390/430/600/768/900/1280/1440: la
composición arranca exactamente donde acaba la hero en los nueve anchos y
`document.documentElement.scrollWidth` no supera el del viewport en ninguno.

## Estado a 30 septiembre 2026 (6) — «Importación automática de checklists», tercera vuelta: el reloj dura lo que dura el rotador, y el resultado se rehace contra la pantalla real

Dos peticiones del cliente sobre el panel del estado (4), justo debajo.

**El rotador cortaba la animación a mitad.** El panel iba sobre un reloj de 8 s
(`planalt-a`/`planalt-b`) pero el `<div class="rotador">` de `/ia/` no llevaba
`data-dur` en ese item, así que heredaba el `data-intervalo="7000"` del
contenedor: a los 7 s el rotador saltaba al panel siguiente con la plantilla
a medio rellenar. Se añade `data-dur="8000"` al `.rotador__item` de
«Importación automática de checklists» —el mismo mecanismo que ya usa
`/auditorias/` para su montaje de 21 s, documentado en `ds/rotador.js`—: el
riel de avance y el cambio de panel pasan a durar exactamente el ciclo
completo de la animación, sin cortarla ni dejarla esperando.

**Y se abrió un registro cerrado en `demo.trysolved.com/checklist` para ver
cómo pinta la app un control ya respondido** —Control Almacenes, `26_204`—,
porque el acto B no se parecía a la pantalla real en tres cosas:

1. **Un control resuelto no lleva los DOS botones OK/KO uno al lado del
   otro.** Esa pareja (`.app__opt`/`.app__opts`) es la que ya usa el resto
   del sitio para una elección todavía por hacer, y sigue siendo la
   correcta para eso; pero un control YA respondido, en la app, pinta un
   punto de color y **una sola píldora** con el valor, con la fila entera
   teñida del mismo color. Nuevo componente `.app__iaimprow` (punto + etiqueta
   + píldora), con `.app__iaimprow--ok`/`--ko` para el tinte.
2. **El responsable no es un control más de la lista.** En la app vive en su
   propio bloque «Asignaciones» (Responsable · Ejecutores · Verificador ·
   Creado el · Ejecutado el), separado de las secciones. Aquí pasa a
   `.app__iaimpresp`, una línea aparte con hairline propio, antes de los
   controles.
3. **La cabecera de un registro real lleva un resumen `OK: n% · KO: n%`**,
   lo primero que se lee antes de abrir ninguna sección. Nuevo
   `.app__iaimpresumen`, junto al título de la plantilla.

> ### ⚠️ MISMA TRAMPA DE RECORTE QUE EN LA PRIMERA VUELTA, Y SE REPITIÓ POR NO
> APLICAR LA PROPIA REGLA QUE SE HABÍA ESCRITO
> `.app__iaimprowl{ flex:1 }` empujaba la píldora al borde ancho real del
> dispositivo —no al borde de lo que se ve—, y esa franja es justo la que el
> recorte `dev-br` de este rotador oculta: la píldora existía en el DOM,
> tenía color, pero caía fuera del recuadro visible, comprobado con
> `getBoundingClientRect` contra el límite de `overflow:hidden` de `.scene`
> (1466px), no a ojo. Es el MISMO patrón que ya había mordido con el avatar
> del responsable en la primera vuelta, y la propia nota que quedó escrita
> entonces («con `gap` el contenido no viaja más allá de lo que pesa») ya lo
> avisaba — sólo que el `flex:1` de la etiqueta deshacía ese `gap` sin que se
> notara hasta mirar el DOM. Se quita `flex:1` y la fila pasa a
> `display:inline-flex` sobre un contenedor con `align-items:flex-start`: la
> fila se ajusta a su contenido, no al ancho del aparato, y la píldora se
> queda pegada a la etiqueta, dentro del recorte. **Regla para la próxima
   vez que se toque esta escena: cualquier fila nueva se comprueba con
   `getBoundingClientRect` contra el límite real de `.scene`, no sólo con la
   captura al primer fotograma.**

Huérfano tras el cambio: `.app__incfields`/`.app__incfield` —el componente que
usaba este panel antes de esta vuelta— deja de tener uso en todo el sitio
(«Crear incidencia desde texto», el panel de al lado, se rehizo en paralelo
esta misma tarde con su propia rejilla `.app__incgrid`, sin este nombre). Se
retira entero junto con el comentario que explicaba por qué vivía aparte;
sigue en git si hiciera falta.

`ds/app.css` sube a `?v=20260930l` en las 48 páginas que lo cargan.
`check:seo` (819 HTML, ✔ sin fallos) y `check:voz` sobre `ia/index.html` (✔)
pasan. Verificado en el navegador: `--rot-dur` del item activo en 8 s,
la píldora de cada control dentro del recorte (`getBoundingClientRect`,
no la captura), y el resumen OK/KO y el bloque de Responsable en su sitio.

**Pendiente:** las cadenas nuevas de esta vuelta («OK: 50%», «KO: 50%»,
«Responsable») no están traducidas a los cinco idiomas —mismo hueco ya
pendiente del resto del panel desde la vuelta anterior—.

## Estado a 30 septiembre 2026 (4) — «Importación automática de checklists»: se ve arrastrar, la IA dice que crea la plantilla, y el resultado es la plantilla respondida

Petición del cliente sobre el panel 2 del rotador de `/ia/` («Funciones integradas en el producto»):
el acto A ya enseñaba el fichero puesto dentro de la zona de soltar —nunca se veía arrastrar nada— y
el acto B era el catálogo de tipos de campo (Número, Seleccionable, Archivos, Firma), no una
plantilla rellena. Pidió las tres piezas que faltaban: **el documento arrastrándose hasta la zona,
la IA diciendo que está creando la plantilla, y al final una plantilla de registro con selector de
usuario, controles en OK/KO y firma**.

**Sigue siendo un panel de dos actos** (mismo cruce `planalt-a`/`planalt-b`, 8 s), y dentro del acto A
hay ahora dos tiempos más —mismo patrón que ya usa el acto A de «Crear incidencia desde texto»
(aviso → «Solved AI · Analizando…»)—: una tarjeta suelta con el icono y el nombre del PDF entra en
ángulo, se desplaza hasta el centro de la zona de soltar (`app-iaimp-drag`) mientras la zona enciende
un halo azul de "hover" (`app-iaimp-hover`); al llegar, el fichero se asienta dentro de la zona
(`app-iaimp-fich`) y la barra de subida se llena; toda la zona de soltar se apaga entonces
(`app-iaimpdrop-out`) y **«Solved AI · Creando la plantilla…» entra en el mismo hueco centrado**
—reutiliza tal cual `app-iacrea-ia`/`app-iacrea-spin`, el icono girando del panel de al lado, sin
fotogramas nuevos—.

**El acto B deja de ser el catálogo de tipos y pasa a ser la plantilla ya respondida**: Responsable
(un avatar con inicial + nombre, `.app__user`/`.app__ava`, el mismo componente que ya usa el resto
del sitio para «quién»), dos controles en OK/KO (`.app__opts`/`.app__opt`, la misma píldora de la
home) y, al pie, «Firmado por Marta» con su icono. Marta es el color ya establecido para ese nombre
en el resto del sitio (`#E0489B`), no uno nuevo.

> ### ⚠️ TRAMPA DE ESTE RECORTE, LA QUE SE PILLÓ ANTES DE PUBLICAR: `justify-content:space-between`
> EMPUJA EL VALOR JUSTO AL BORDE QUE EL RECORTE OCULTA
> La primera versión ponía los tres campos en un `<dl class="res__rows--fill">` con `dt`/`dd` a los
> lados (`.res__kv{ justify-content:space-between }`), igual que el catálogo de tipos que sustituye.
> Con el recorte `dev-br` de este rotador sólo se ve una franja del ancho real del dispositivo —el
> resto sangra a propósito, por diseño—, y un valor empujado al extremo derecho por `space-between`
> caía justo en esa franja recortada: el avatar de «Marta» y los dos botones OK/KO no se veían en
> absoluto, aunque el DOM los tenía y el CSS los pintaba bien. Comprobado con `getBoundingClientRect`
> contra el límite real de `overflow:hidden` de `.scene` (no a ojo): el `dd` aterrizaba más allá del
> borde de recorte. Se resuelve pasando los tres campos a **`.app__incfields`/`.app__incfield`**, el
> mismo componente apilado (número + etiqueta encima del valor) que ya usa la ficha de «Crear
> incidencia desde texto» para el mismo problema de fondo: apilado, todo cuelga del margen izquierdo
> y no hay nada que empujar al borde. El escalonado de entrada ya lo trae `.app__incfield:nth-child(n)`
> (4.4/4.9/5.4 s), compartido sin tocarlo. **Si se añade contenido a la derecha de una fila dentro de
> una escena con `dev-br`, hay que comprobar con el DOM real que no cae en la franja recortada — no
> basta con mirar la captura al primer fotograma.**

`ds/app.css` sube a `?v=20260930i` en las 48 páginas que lo cargan. `check:seo` (819 HTML, ✔ sin
fallos) y `check:voz` sobre `ia/index.html` (✔) pasan. Verificado en el navegador fijando
`currentTime` de las animaciones a mano (arrastre, halo de la zona, «creando la plantilla», y la
plantilla final con los tres campos y la firma dentro del recorte) y sin errores en consola.

**Pendiente:** las cadenas nuevas de este panel («Solved AI · Creando la plantilla…», «Responsable»,
«Nivel de aceite», «Firmado por Marta») no están traducidas a los cinco idiomas —entran en el próximo
`i18n:extract` + `build:i18n`—; el resto del panel («Fugas visibles», «Excel, PDF o Word», etc.) ya
estaba sin traducir de antes, hueco previo a esta sesión.

## Estado a 30 septiembre 2026 (5) — Patatas Aguilar: el cierre se alarga con grabación real, no con un congelado

Cuarta vuelta sobre el final del mismo vídeo. El cliente pidió **«en vez de cortar donde corta ahora,
deja 2 segundos más de grabación»** — o sea, lo mismo que pedía el hold de la entrada (2), pero con
vídeo de verdad detrás en lugar de un fotograma clonado, que es justo lo que había rechazado.

**Los 2 segundos exactos no existen como corte limpio.** Medido sobre el audio de la fuente con
`silencedetect` (no con los tiempos de Whisper, que redondean): después de «…nos ha cambiado la vida.»
sólo hay **0,35 s** de silencio real (401,39-401,74), y a partir de ahí José sigue hablando sin parar.
Sumar 2,0 s al límite anterior (401,90 → 403,90) cae **dentro de la palabra «con»** de «con poca
gente»: audio cortado a mitad de sílaba. Los únicos límites limpios cerca son 402,95 (+1,05 s, detrás
de «A mí personalmente,»), 405,45 (+3,55 s) y **414,85 (+12 s)**.

**El cliente eligió el largo, y es el único sitio del webinar donde hay de verdad ~2 s de silencio
detrás.** El corte final pasa de `[394.75, 401.9]` a **`[394.75, 414.8]`** y el vídeo se queda con la
respuesta entera: «A mí personalmente, una empresa pequeñita con poca gente en el departamento,
realmente en la oficina somos dos, en plantas más gente y la carga de trabajo que te quita es
brutal.» — y **1,6 s de silencio real** después (413,22-414,85, comprobado a -50 dB), que es donde
entra el fundido a la cartela de cierre sin pisar a nadie. Se corta en 414,80 y no en 414,90 porque a
-50 dB el anfitrión ya respira a 414,849.

**Nada de lo que entra se repite en el resto del vídeo** (comprobado cruzando el texto de los 19
cortes del EDL: «somos dos», «oficina» y «carga de trabajo» no salían). El límite del corte es lo
único que se toca: ni las cinco tarjetas de pregunta, ni el resto del guión, ni el `replace`, ni las
cartelas. Y **el tercer valor del `edl` —el congelado— sigue sin usarse aquí**, como quedó dicho en la
entrada (3).

El vídeo pasa de 4:09 a **4:22** (262,33 s). `.gate__dur`, el JSON-LD `duration` (`PT4M22S`) y
`.vcase__dur` actualizados en español y propagados a los cinco idiomas con `build:i18n`. Póster
regenerado del fotograma del segundo 8 del 720p nuevo, como manda `NOTAS.md`. `check:seo` (819 HTML,
✔ sin fallos) y `check:voz` (53 páginas, ✔) pasan. Comprobado con fotogramas sueltos a 253, 255 y
257,5 s: la frase entera con su subtítulo, la cara todavía en movimiento después, y la cartela a los
259 sin ningún tramo muerto.

> **La mezcla de música no estaba guardada en ningún script y hubo que reconstruirla.** Los cuatro
> vídeos de caso llevan música desde el 29 de septiembre, pero el comando vivía sólo en la memoria de
> aquella sesión: `loudnorm=I=-28:TP=-3:LRA=4` + `volume=-12dB` + fundidos 1,6 s/3,2 s +
> `amix=normalize=0` + `alimiter`, con `-stream_loop -1` y `-c:v copy`. Se rehízo desde esa
> descripción y **se comprobó que da exactamente la misma mezcla** que el fichero publicado: -43,5 dB
> de media y -25,7 de pico en los 3 s de intro, -20,0 / -1,0 en el tramo 60-80 s, idénticos a
> `patatas-aguilar-v3-final2.mp4`. Queda escrito en `_montaje/NOTAS.md` para no volver a deducirlo.

> **Aviso de sesión en paralelo:** al empezar, `cfg_patatas_aguilar_v3.json` ya estaba en
> `[394.75, 402.95]` (la opción de +1,05 s) con su fragmento recacheado y un render **abortado a
> medias** en `out/` —el MP4 no tenía ni `moov atom`—. No había ningún `ffmpeg` vivo. Se ha construido
> encima, desde el 401,9 que describía la entrada (3), y el `out/` corrupto queda sustituido por el
> render bueno.

## Estado a 30 septiembre 2026 (3) — Patatas Aguilar: el congelado se retira, el corte ya bastaba

El cliente vio el resultado del hold de la entrada anterior y lo rechazó: «No sale bien, ahora hay dos
segundos por detrás que está congelado. Lo que quiero es que se le oiga decir nos ha cambiado la
vida». El hold funcionaba tal y como se había construido —2 s de fotograma clonado con silencio
detrás, comprobado con `ffprobe`—, pero un fotograma inmóvil dos segundos se lee como un vídeo
colgado, no como una pausa. Y no hacía falta: **lo que el cliente pedía —oír la frase entera— ya
estaba resuelto por el ajuste de límite de la entrada anterior a esa** (el corte pasó de acabar en
401,75 a acabar en 401,90, para que el fundido de salida no se comiera «cambiado la vida»). El hold
era una segunda corrección encima de un problema que ya no existía.

**Se revierte el tercer valor del último elemento del `edl`**: `[394.75, 401.9, 2.0]` vuelve a
`[394.75, 401.9]`, sin congelado. Se borra el fragmento cacheado (`work/patatas_aguilar_v3_22.mkv`) y
se regenera. Comprobado extrayendo fotogramas sueltos a los 243, 244 y 246 s: la boca sigue en
movimiento hasta el final de la frase, el subtítulo muestra «…nos ha cambiado la vida.» completo, y
pasa a la tarjeta de cierre sin ningún tramo muerto en medio.

El vídeo vuelve a **4:09** (249,4 s), la duración de antes del hold. `.gate__dur`, el JSON-LD
`duration` (`PT4M9S`) y `.vcase__dur` revertidos a esa cifra. La función de `build.py` que añadió el
tercer valor del `edl` (el hold de congelado) **se queda en el script, sin usar aquí**: quedó
documentada en la entrada anterior y sigue disponible para el día que un vídeo necesite de verdad un
margen de silencio que el propio clip no tiene, que no es este caso. `check:seo` (819 HTML, ✔ sin
fallos) y `check:voz` sobre `casos-de-exito/patatas-aguilar/` (✔) pasan.

## Estado a 30 septiembre 2026 (2) — Patatas Aguilar: «yo lo llamo», no «yo le amo», y el cierre respira

Dos correcciones más del cliente sobre el vídeo, ambas de precisión:

**Fallo de transcripción real, no de montaje.** Whisper transcribió «Yo le amo, entre comillas, para
tontos» — Whisper oye lo que el modelo cree más probable, y «le amo» encajaba mejor en su gramática
que lo que José dice de verdad: «Yo **lo llamo**, entre comillas, para tontos» (le pone ese nombre al
programa, no le declara amor). El audio nunca estuvo mal — es el mismo clip de siempre—, sólo el
subtítulo quemado encima. Un `replace` más en `cfg_patatas_aguilar_v3.json` lo corrige.

**El cierre seguía sin dejarle terminar de verdad.** La sesión anterior ya había movido el límite del
último corte para que el fundido no pisara «cambiado la vida» (estado (9) de ayer), pero el cliente
lo sigue viendo justo. Pidió, literalmente, 2 segundos más detrás. El hueco real de silencio antes de
la frase siguiente en el webinar es de sólo 0,34 s — no hay de dónde sacar 2 segundos de silencio real
sin colarse en la frase de otra persona—, así que la solución no es alargar el corte hacia delante: es
**congelar el último fotograma con silencio detrás**, como un fundido de salida con margen, en vez de
seguir el vídeo real.

**Nuevo en `build.py`, no sólo en este vídeo:** un elemento del `edl` puede ahora ser `[inicio, fin,
segundos_de_congelado]` además de `[inicio, fin]` o la tarjeta `{"card":…}` de la sesión anterior. El
tercer valor usa `tpad=stop_mode=clone` (vídeo) y `apad` (audio) para clonar el último fotograma y
añadir silencio. **Trampa de una vuelta:** el primer intento puso el `-t` del corte real (los segundos
sin contar el congelado) después de `-i`, y ffmpeg lo aplicó como límite de *salida* además de
*entrada* — el `tpad`/`apad` añadían el margen y el mismo `-t` se lo comía otra vez, así que el
fichero salía con la duración de siempre y el hold desaparecía en silencio, sin error. Se arregla
poniendo **dos** `-t`: uno antes de `-i` (cuánto se lee de la fuente) y otro al final, junto a las
opciones de audio (cuánto puede durar la salida, ya con el margen). Comprobado con `ffprobe` sobre el
fragmento suelto antes de tocar el resto: 7,15 s de corte + 2 s de hold = 9,17 s, no 7,17 s como salió
a la primera.

El vídeo pasa de 4:09 a **4:11** (el hold no es exactamente 2 s por el redondeo de fotogramas a 30
fps). `.gate__dur`, el JSON-LD `duration` (`PT4M11S`) y `.vcase__dur` actualizados. `check:seo` (819
HTML, ✔ sin fallos) pasa; `check:voz` se comprobó solo contra `casos-de-exito/patatas-aguilar/`
(✔), no contra el sitio entero, porque sigue habiendo un fallo preexistente en `ia/index.html` de otra
sesión en paralelo, ajeno a esta página.

## Estado a 30 septiembre 2026 — /ia/: las seis funciones, con su gesto, no la lista compartida

`/ia/` había pasado su rejilla estática de seis tarjetas a un rotador (patrón 12 de
`ds/sections.css`, mismo componente que `/auditorias/` y `/gestor-documental/`), con las seis
funciones sobre UNA MISMA pantalla —la lista de ajustes «Funciones de IA» de
`app.trysolved.com/ai`, con la fila activa resaltada y las otras cinco colapsadas—. El cliente pidió
otra vuelta: **«no un chat superpuesto — hazlas más realistas, y si no puedes recrearlas de la
plataforma, haz una animación que lo represente aunque en el producto no vaya a ser exactamente
así»**. La pantalla compartida nombraba la función dos veces (el título del panel, la fila) sin
enseñar el gesto ni una sola vez.

**Los seis botones de la izquierda no cambian.** Lo que cambia es el panel de la derecha: cada uno
monta ahora la pieza que demuestra SU función, con el mismo activo y la misma incidencia que ya cita
la FAQ de esta página (COMP-001 · Compresor de aire, UTD26_175_001) para que crearla en el panel 1 y
citarla en el panel 6 sea el mismo dato:

| # | Función | Pieza |
|---|---|---|
| 1 | Crear incidencia desde texto | el correo de origen y la incidencia rellenándose (`.res`/`.res__rows--fill`, el mismo recurso que usa el resto del sitio) |
| 2 | Importación de checklists | la zona de soltar Excel/PDF/Word —el mismo gesto ya grabado para `/auditorias/` en `guidelines/ia.registros.reel.html`, aquí en HTML/CSS vivo— y detrás la plantilla estructurada, en dos actos (`.planalt`) |
| 3 | Generación de informes con IA | el chat de `.app--ia` que ya usa la home (`.app__chat--guion`): se pide el informe y llega con texto y gráfico |
| 4 | Generador de visualizaciones | se describe un KPI y aparece su gráfico —una dona nueva, para no repetir las barras de los paneles 3 y 6— en el dashboard |
| 5 | Informes semanales por planta | sin nada que teclear, porque nadie lo pide: la espera automática y el informe ya entregado, en dos actos |
| 6 | Pregunta a tus datos | el mismo chat de `.app--ia`, corto y sin gráfico, citando el registro del que sale la respuesta |

**Ninguna de las seis pantallas está comprobada campo a campo contra la aplicación** —a diferencia del
resto del sitio, que exige verla en `demo.trysolved.com` antes de maquetarla—: la función en sí es
real (siguen siendo las seis de «Funciones de IA», con la misma descripción de producto que ya lleva
cada botón de la izquierda); el gesto concreto de cada pantalla es representativo, a petición expresa
del cliente. Se retira `.app__iafn`/`.app__iafnlist` de `ds/app.css` —la pantalla compartida, sin uso
en ningún otro sitio— y entra el bloque nuevo con las seis piezas, cada una con su reloj de 8 s y su
`@media (prefers-reduced-motion:reduce)`.

> ### ⚠️ Y AL MONTARLO SALIÓ UN BUG REAL, ANTERIOR A HOY, EN EL CHAT DE `.app--ia`
> Reusar `.app__chat--guion` para los paneles 3 y 6 —la misma pieza que ya usa la home— dejó ver que
> la pregunta tecleada **nunca se leía entera, ni siquiera en la home**: `.app__ask--escribe > span`
> animaba su `width` de 0 a 100 %, y ese 100 % se resolvía contra el ancho de `.app__ask`, que a su
> vez mide su propio ancho por el contenido de ESE MISMO SPAN (`align-self:flex-end`, sin `width`
> propio) — la dependencia circular que la propia hoja evita en otras piezas («si el containing block
> depende del ancho del elemento, el resultado es indefinido»). Comprobado con `javascript_tool` en
> la home: `scrollWidth` 292px, la animación se congelaba en 247,6px, cortando el final de la
> pregunta sin que ningún `overflow` avisara. Se corrige sustituyendo la animación de `width` por un
> `clip-path` de derecha a izquierda: el span ya no anima su propio tamaño —mide su ancho natural
> desde el primer fotograma, sin ambigüedad para `.app__ask`— y sólo cambia cuánto se ve. Mismo
> nombre de keyframe (`app-ia-teclea`), mismo marcado: **la home no se ha tocado y ahora se lee
> entera por primera vez**. Corregido también el reset de movimiento reducido y la variante de
> teléfono (`@media max-width:600px`), que necesitaban `clip-path:none` junto al `width:auto` que ya
> tenían.

`ds/app.css` sube a `?v=20260930c` en las 43 páginas que lo cargan. `check:seo` (819 HTML, ✔ sin
fallos) y `check:voz` (53 páginas, ✔) pasan. Verificado en el navegador con `javascript_tool` —cada
panel del rotador forzado por turno, geometría de los seis medida contra el DOM real— y con
capturas: la incidencia rellenándose, el archivo cayendo y la plantilla estructurada, el informe con
su gráfico, la dona con su leyenda, la espera automática y el informe entregado, y la pregunta con su
cita abierta.

**Pendiente:** ninguna de las cadenas nuevas de los seis paneles está traducida a los cinco idiomas
—el correo de origen, los rótulos de la plantilla importada, las dos preguntas del chat, la
descripción y la leyenda de la dona, el aviso de generación automática—; entra en el próximo
`i18n:extract` + `build:i18n`.

> **Segunda vuelta, el mismo día: la plantilla importada repetía tipo.** El cliente lo vio y avisó
> —«hay algún ítem que se repite»—: el panel 2 mostraba «Presión de salida» y «Temperatura del
> cabezal» con el mismo `app__tag--tipo` («Número»), y una plantilla pensada para enseñar variedad de
> tipos no puede repetir uno de cuatro. Se sustituye «Temperatura del cabezal» por «Evidencia
> fotográfica» (`Archivos`), y las cuatro filas quedan con tipo distinto —Número, Seleccionable,
> Archivos, Firma—, el mismo cuarteto que ya usa `guidelines/ia.registros.reel.html`.

> **Tercera vuelta, el mismo día: de seis funciones a cuatro ejemplos, y fuera el número del
> titular.** El titular de la sección decía «Seis funciones integradas en el producto…», y el cliente
> pidió quitarlo: **«no menciones que son 6 funciones, porque eso obliga a que en el futuro tengamos
> que actualizarlo cada vez que salga una función nueva»**, y enseñar sólo cuatro ejemplos.
>
> - **El titular pasa de contar a contrastar.** «Seis funciones integradas en el producto, no un chat
>   superpuesto» → **«Funciones integradas en el producto, no un chat superpuesto»**. El contraste
>   —que la IA vive dentro de los módulos, no como un chat aparte— se mantiene; lo que se retira es el
>   compromiso con una cifra que un lanzamiento nuevo dejaría desactualizada al día siguiente.
> - **Salen los dos paneles más próximos en tema a «Generación de informes con IA», que se queda**:
>   el generador de visualizaciones y los informes semanales por planta —los dos son variantes de
>   «la IA analiza y entrega un resultado», y quedarse con uno evita que la sección enseñe tres
>   sabores del mismo argumento—. Quedan los cuatro pilares más distintos entre sí: **crear, importar,
>   analizar y preguntar** (crear incidencia desde texto · importación de checklists · generación de
>   informes con IA · pregunta a tus datos). Retirados de `ia/index.html` el botón y el panel de cada
>   uno, y de `ds/app.css` sus piezas propias (`.app__iavis*`, `.app__iased*`), sin uso en ningún otro
>   sitio.
> - **La lista completa se queda donde sí tiene que ser exhaustiva: la FAQ.** «¿Qué sabe hacer la IA
>   de Solved?» sigue respondiendo con las seis, porque una FAQ contesta una pregunta directa y se
>   revisa cuando hace falta; el titular de la sección, en cambio, es la pieza que se lee de pasada y
>   la que no interesa tener que reescribir en cada lanzamiento. No se ha tocado.
> - **La meta description, `og:description`, `twitter:description` y el JSON-LD `SoftwareApplication`
>   llevaban la misma cadena, «Seis funciones de IA integradas en Solved…», cuatro veces.** Mismo
>   argumento, mismo arreglo: pasan a «Funciones de IA integradas en Solved: crea incidencias desde un
>   correo, importa checklists, genera informes y responde preguntas citando el registro de origen.»,
>   sin el número, en las cuatro. `check:voz` cazó la primera reescritura —148 caracteres, corta para
>   su regla de 150-160— y la segunda ya entra.
>
> `ds/app.css` sube a `?v=20260930d`. `check:seo` (819 HTML, ✔ sin fallos) y `check:voz` (53 páginas,
> ✔) pasan.

> **Cuarta vuelta, el mismo día: el correo entra como un aviso real, no como una fila de bandeja, y
> con una referencia del cliente delante.** El panel 1 (crear incidencia desde texto) mostraba una
> tarjeta de bandeja de Gmail —remitente, asunto, fragmento— seguida de un «Leyendo el correo con
> IA…». El cliente trajo una captura real (`~/Descargas/ejemplo-popup-gmail.jpg`, el aviso de macOS
> «Gmail · New Email from…» con su «Close») y pidió calcarla, con la secuencia en tres tiempos: **el
> aviso primero, «Solved AI» diciendo que analiza después, y sólo entonces la plantilla real ya
> rellena**, con una línea que diga quién la ha completado.
>
> - **El icono de Gmail se rehace** para parecerse al de la captura —sobre, borde y solapa en rojo,
>   fondo blanco— en vez del envoltorio genérico de la vuelta anterior; sigue siendo un dibujo propio,
>   no el asset oficial, mismo criterio que Excel/PDF/Word.
> - **La tarjeta pasa de fila de bandeja a aviso flotante**: se desliza desde arriba del marco de
>   navegador —como lo haría un aviso real por encima de cualquier ventana—, se lee, y se va sola; no
>   la cierra nadie, aunque lleve su «Cerrar» de adorno, como la captura.
> - **Entra un segundo tiempo que no existía**: cuando el aviso se ha ido, «Solved AI · Analizando el
>   correo…» ocupa el mismo hueco —no se apilan, se turnan—, con el mismo icono de chispa animado que
>   ya usa el resto de la página para «esto lo hace la IA».
> - **La plantilla añade quién la ha rellenado**: «Completado por Solved AI» al pie de la ficha, bajo
>   el hairline que ya separa sus filas, con el mismo icono de chispa. Reutiliza `res-row-in` (el
>   mismo keyframe de las filas) en vez de inventar uno nuevo, con `animation-delay:5.8s` para entrar
>   justo después de la última fila.
>
> `ds/app.css` sube a `?v=20260930f`. `check:seo` (819 HTML, ✔ sin fallos) y `check:voz` (53 páginas,
> ✔) pasan. Verificado en el navegador forzando el panel activo y pausando el rotador (`mouseenter`
> sintético sobre `.rotador`, que es lo que de verdad detiene su avance —un `.click()` por JS no lo
> hace, y el intervalo de 7 s pisaba cualquier estado forzado a mano—): las tres fases, con capturas
> reales de cada una.

> **Quinta vuelta, el mismo día: el logo real de Gmail, un asunto concreto, y la ficha como en la app
> real de escritorio.** Tres peticiones del cliente sobre el mismo panel:
>
> - **El logo de Gmail deja de ser un dibujo propio y pasa a ser la marca real.** El cliente aportó
>   `~/Descargas/gmail.jpeg` (la versión con degradado, 2020+, fondo blanco sólido —es JPEG, no admite
>   alfa—). Se recorta el blanco a transparente (umbral >245 en los tres canales) y se convierte a
>   WebP: `assets/ia/gmail-icon.webp` (11,7 KB), documentado en el `FUENTES.md` nuevo de esa carpeta.
>   **No se ha tocado `assets/integraciones/gmail.webp`** —la versión plana que ya usa la rejilla de
>   `/integraciones/`—: son dos versiones reales del mismo logotipo en dos sitios distintos del sitio,
>   y el cliente pidió expresamente la de la captura, no la ya presente.
>   > ### ⚠️ Y EL `<img>` SALIÓ GIGANTE: LA SÉPTIMA VEZ DE LA MISMA TRAMPA DE ESPECIFICIDAD
>   > `.app img{width:auto;height:auto;max-width:none}` (0-1-1) le ganaba a `.app__iamailpopico`
>   > (0-1-0) —el mismo patrón que ya mordió con `.app__qrimg`, `.fic__foto` y otros cuatro casos
>   > documentados en este fichero—: el logotipo, con su tamaño intrínseco de 501×399 y sin límite de
>   > ancho, se comía la pantalla entera. Comprobado con capturas reales, no sólo sospechado. Se ancla
>   > con `.app .app__iamailpopico` (0-2-0), que gana.
> - **El asunto del correo pasa a ser uno concreto**: «Incidencia en el pedido Nº67/2026», en vez del
>   genérico «Nuevo correo de Cliente industrial…» de la vuelta anterior.
> - **La ficha del acto B deja de ser la tarjeta flotante de resumen y pasa a seguir la anatomía real
>   de `/incidents/incident-details/<id>`**, consultada con la skill `solved` (que lee
>   `references/incidencias.md`, ya verificado contra la app en una sesión anterior, no comprobado de
>   nuevo esta vez): cabecera con código y título, los badges de estado y prioridad, una fila de
>   iconos (favorito, chat, historial, descargar), la barra de clasificación centro·categoría·tipo de
>   producto, y los campos numerados de la plantilla —el mismo círculo azul que ya usa el asistente de
>   alta (`.app__pregn`) para numerar—. El código sigue el patrón verificado
>   `<prefijo><año>_<contador>_<sufijo de departamento>` con el sufijo real de Reclamación (`REC`):
>   `UTD26_223_REC`, contador de ejemplo, sin comprobar contra un caso real. Los tres campos que trae
>   la plantilla —Nº de pedido, Descripción, Evidencia— cascadean igual que antes
>   (`.app__incfield`, mismo `res-row-in` con retardos de 4,4/4,9/5,4 s), y el código y el título del
>   asistente ya no dependen de COMP-001/UTD26_175_001 —esos siguen citados en los paneles 3 y 6, pero
>   este panel cuenta un caso distinto, una reclamación de pedido, y forzar la misma máquina en los
>   dos habría sido inventar una relación que no pinta nada—.
>
> `ds/app.css` sube a `?v=20260930h`. `check:seo` (819 HTML, ✔ sin fallos) y `check:voz` (53 páginas,
> ✔) pasan. Verificado en el navegador, con recarga forzada tras el bump de versión —el primer intento
> de comprobar el logo seguía sirviendo `?v=20260930g` desde caché pese al `no-cache` del servidor, la
> URL con `?_=` en la query lo destrabó—: la notificación con el logo a tamaño real, y la ficha con
> sus tres campos entrando en cascada.

> **Sexta vuelta, el mismo día: la ficha se cortaba de verdad, y no era la sangría a propósito del
> componente.** El cliente avisó de que la pantalla «no se ve bien, se corta» y pidió centrar la
> animación. Comprobado con `javascript_tool` contra el DOM real, no a ojo: la escena mide 504px de
> alto y el recorte `dev-br` que comparten los cuatro paneles de este rotador sólo enseña ~380px de
> eso —el resto es sangrado a propósito, la misma regla del fragmento que se sale por el borde en
> todo el sitio—. Para las otras tres pantallas ese sangrado se comía hueco vacío, porque su
> contenido no llegaba a esa altura. La mía sí: `.app__incficha` llevaba `height:100%` para llenar el
> acto entero, y el pie «Completado por Solved AI» iba con `margin-top:auto` empujándolo al fondo de
> esa caja de 468px —exactamente donde el recorte ya no enseña nada—. El pie **no se veía nunca**,
> en ningún fotograma del bucle: no era una sangría estética, era contenido real invisible.
>
> Se corrige quitando el `height:100%` —la ficha pasa a medir lo que pesa de verdad, unos 280px— y
> cambiando el `margin-top:auto` del pie por uno fijo, para que ya no dependa de una caja estirada
> que no vuelve a existir; y se añade `align-items:flex-start` al acto (`.app__iacrea__act--res`)
> para que el propio `flex` no la vuelva a estirar por su cuenta. Con eso la ficha entera —cabecera,
> iconos, clasificación, los tres campos y el pie— cae dentro de los ~380px visibles con margen de
> sobra, sin tocar ni un dato de los que ya pedía la vuelta anterior.
>
> `ds/app.css` sube a `?v=20260930j`. `check:seo` (819 HTML, ✔ sin fallos) y `check:voz` (53 páginas,
> ✔) pasan. Verificado con `javascript_tool` midiendo la posición del pie contra el borde real de la
> escena antes y después del arreglo (antes: pie a 543-565px sobre una escena de 504px, fuera del
> todo; después: 430-452px, dentro) y con capturas reales de las tres fases.

> **Séptima vuelta, el mismo día: la ficha, calcada de la app real navegada en vivo, no sólo de la
> ficha escrita del MCP.** El cliente pidió mirar «en la demo cómo es la plantilla de una incidencia
> por dentro» y hacerla así, con «descripción e imágenes arriba, bajo el resto de campos». Se entró
> de verdad en `demo.trysolved.com/incidents/incident-details/<id>` (Ultimate Demo 6, `UTD26_249_001`,
> vía el MCP `solved-onboarding` para el `switch_company` y `claude-in-chrome` para navegar), no sólo
> se releyó el resumen de `references/incidencias.md`. La anatomía real, de arriba abajo:
>
> - **Cabecera**: código en píldora azul sólida, «Abierto» y «Alta» en píldoras de borde y fondo
>   clarito del color, con su icono; a la derecha, la fila de iconos (favorito, chat, análisis, árbol,
>   acciones, historial, descargar, duplicar, borrar).
> - **Barra de clasificación**: «Centro: [píldora azul]  Categoría: [píldora verde]  Tipo de
>   producto: [píldora lila]» —tres colores distintos, no un breadcrumb de texto plano, que es lo que
>   había puesto la vuelta anterior sin haberlo comprobado en vivo—.
> - **Los campos 1 y 2 van SIEMPRE en su propia fila de dos columnas, antes que el resto**: 1
>   Descripción (la caja ancha) y 2 Foto(s) (la zona de adjuntos, más estrecha) — es así en cualquier
>   plantilla de incidencia, no una elección de esta página.
> - **El resto de campos, 3 en adelante, en una rejilla de TRES columnas**, cada uno con su círculo
>   de número y su valor dentro de una caja con borde —como el propio formulario—, con la flechita de
>   desplegable en los campos que son un `<select>` en la app real (Priority, Responsable).
>
> La ficha de `/ia/` se rehace entera con esta anatomía: código, «Abierto», «Alta»; clasificación
> Planta Alzira · Reclamaciones · Compresores, cada una con su color; Descripción y Foto(s) en su fila
> de dos columnas; y una rejilla de tres campos —Nº de pedido, Responsable (vacío, con la flechita:
> la IA no asigna responsable, sólo crea la incidencia), Priority (duplicado con la píldora de la
> cabecera, que es lo que hace la app real)—.
>
> > ### ⚠️ Y AL MONTARLO SALIÓ UN CHOQUE DE NOMBRES CON EL PANEL DE AL LADO
> > `.app__incfields`/`.app__incfield`/`.app__incfieldl` ya estaban en uso —por «Importación de
> > checklists», el panel de al lado, para su plantilla ya montada (responsable, OK/KO, firma)—, con
> > un diseño de fila simple sin caja. Reescribir esos nombres para la nueva rejilla de casillas
> > habría roto esa otra pantalla sin tocarla —pasó, de hecho, durante el montaje: el panel de
> > importación se quedó sin su componente de campos hasta que se corrigió—. La rejilla nueva vive en
> > su propio espacio de nombres (`.app__incgrid`, `.app__incgriditem`, `.app__inclabel`); `.app__incfields`
> > y compañía se quedan intactos, tal y como los usaba el otro panel, y sólo `.app__incfieldn` —el
> > círculo del número, idéntico en los dos sitios— se sigue compartiendo.
>
> `ds/app.css` sube a `?v=20260930k`. `check:seo` (819 HTML, ✔ sin fallos) y `check:voz` (53 páginas,
> ✔) pasan. Verificado en el navegador: la ficha nueva con sus cinco campos y el panel de importación
> de checklists, comprobado aparte para confirmar que no se había roto.

> **Octava vuelta, el mismo día: «eso no se parece a ningún registro», y el panel de al lado también
> se rehace contra la app real —esta vez de verdad—.** El cliente lo dijo sin nombrar el panel, así
> que primero hubo que averiguar cuál: el de al lado, «Importación de checklists», que ya llevaba dos
> pasadas de correcciones ese mismo día (ver el bloque de arriba, «SEGUNDA VUELTA» en el comentario de
> `ds/app.css`) pero seguía sin acertar la pieza clave —un control de un registro ya respondido no es
> un punto de color con una píldora de valor al lado, aunque eso fue lo que la vuelta anterior creyó
> haber visto—. Se entró en `demo.trysolved.com/checklist`, se abrió un registro cerrado (Control
> Almacenes, 26_204) y se expandió una sección control a control —no sólo el resumen colapsado—: cada
> control lleva su propio número —el mismo círculo verde o rojo, según OK/KO, que ya usa la ficha de
> incidencia de al lado (`.app__incfieldn`)—, la etiqueta en negrita, el valor debajo, y una píldora
> **«Completado» siempre verde** —dice que el control tiene respuesta, no cuál es— con su check.
>
> Se rehacen `.app__iaimprow`/`.app__iaimprown`/`.app__iaimprowl`/`.app__iaimprowv`/
> `.app__iaimprowdone` con esa anatomía. Y salió, de nuevo, la misma trampa que esta pantalla ya había
> sufrido dos veces antes en el mismo día —documentada en su propio comentario de `ds/app.css`—: la
> píldora «Completado», con `flex:1` en el bloque de al lado empujándola al margen derecho de una fila
> que mide el ancho ENTERO del dispositivo (697px), caía fuera de los ~585px que el recorte `dev-br`
> de este rotador deja ver —comprobado con `javascript_tool`: su borde izquierdo empezaba en el
> píxel 680 de una escena de 672px, completamente invisible—. Se corrige quitando el `flex:1` y
> metiendo la píldora EN LA MISMA LÍNEA que el valor («OK ✓ Completado»), no empujada al borde: nada
> en esta pantalla puede depender de un ancho que no se ve entero, y ya van tres veces que esta regla
> hay que aprenderla por las malas en el mismo componente.
>
> `ds/app.css` sube a `?v=20260930n`. `check:seo` (819 HTML, ✔ sin fallos) y `check:voz` (53 páginas,
> ✔) pasan. Verificado con `javascript_tool` midiendo la posición de la píldora contra el borde real
> de la escena antes y después (antes: 680-752px sobre 672px de escena, fuera; después: 163-236px,
> dentro) y con capturas reales del panel ya corregido.

> **Novena vuelta, el mismo día: cada panel dura lo que tarda su propio gesto, no los 7 s genéricos
> del contenedor.** Petición del cliente sobre el mismo rotador: que las animaciones «duren el tiempo
> justo para que finalicen y pase al siguiente». El rotador ya soportaba esto —`data-dur` por
> `.rotador__item`, el mismo mecanismo que ya usa «El montaje de una plantilla» en `/auditorias/` con
> sus 21 s—, pero de las cuatro capacidades de aquí sólo «Importación automática de checklists» lo
> tenía puesto (8000). Las otras tres se quedaban con el `data-intervalo="7000"` del contenedor, que
> no es el reloj de ninguna de ellas:
>
> - **«Crear incidencia desde texto»** corre sobre el mismo cruce `planalt-a`/`planalt-b` de 8 s que
>   «Importación» —mismos retardos, 4.3-5.6 s, el pie «Completado por Solved AI» termina de aparecer a
>   los 6.4 s—. Con 7000 se cortaba 1 s antes de que el gesto completara su propio ciclo. **Sube a
>   `data-dur="8000"`**, igual que su hermano.
> - **«Generación de informes con IA»** y **«Pregunta a tus datos»** comparten `.app__chat--guion`, el
>   componente que el propio CSS documenta como «un solo reloj de 12 s para los cuatro tiempos»
>   (teclear 0-18 %, pensar 18-30 %, texto 30-40 %, barras 42-54 %). Con 7000 el caso más cargado —el
>   informe, que además sube las seis barras del gráfico— terminaba de revelarse a los 6,88 s: cabía,
>   pero con 120 ms de margen sobre un reloj pensado para 12 s enteros, frágil ante cualquier retoque
>   futuro del contenido. **Suben los dos a `data-dur="12000"`**, el reloj completo que ya llevan
>   escrito en su propio comentario, en vez de una cifra ajustada a lo justo-justo.
>
> Las cuatro capacidades duran ahora lo que dura su propia pantalla —8, 8, 12 y 12 s— y no lo que dura
> el contenedor: ninguna se corta a media revelación ni se queda esperando de más una vez terminada,
> que es la misma regla que ya se escribió para `/auditorias/` el 29 de septiembre.
>
> `check:seo` (819 HTML, ✔ sin fallos) y `check:voz` (53 páginas, ✔) pasan. Verificado con
> `javascript_tool`: los cuatro `data-dur` en el DOM, `--rot-dur` reflejando el del panel activo en
> cada caso, y el reloj de avance real cronometrado contra `performance.now()` confirmando que ningún
> panel cambia antes de su propio tiempo.

## Estado a 30 septiembre 2026 — Patatas Aguilar: fuera el bloque del coste

Petición del cliente sobre la v3 de ayer (estado (19), justo debajo): quitar el bloque «El coste de
pedir un cambio» —la tarjeta 4 y los tres cortes que llevaban a «es tipo Netflix»—. Se retira entero:
la tarjeta `cards/p4_coste.png` y los cortes `[808.30,818.00]`, `[824.20,845.60]` y `[852.75,862.38]`
de `cfg_patatas_aguilar_v3.json`. Las cuatro tarjetas restantes (checklist, resumen, equipo,
indeciso) y el resto del guión no se tocan.

El vídeo baja de 4:52 a **4:09**. `.gate__dur` y el JSON-LD `duration` bajan a `PT4M9S` en
`casos-de-exito/patatas-aguilar/index.html` y en la tarjeta del índice (`.vcase__dur`); ni
`.ds-hero__sub` ni la descripción del `VideoObject` mencionaban el argumento del precio, así que no
hace falta tocarlos. `check:seo` (819 HTML, ✔ sin fallos) pasa; `check:voz` da un fallo en
`ia/index.html` que no toca esta página ni esta sesión —confirmado pasando el check solo contra
`casos-de-exito/patatas-aguilar/index.html`, que sale limpio—, así que es de otra sesión en paralelo
y se deja para quien esté tocando esa página.

Las traducciones de las cuatro cadenas que se van (`Es tipo Netflix…`, `No pagas, te cobran…`, etc.)
se quedan en `i18n/traducciones/22-patatas-aguilar.json` sin usar, igual que en otras podas de este
repositorio: no estorban y ahorran volver a traducirlas si el bloque vuelve.

## Estado a 29 septiembre 2026 (19) — Patatas Aguilar v3: el vídeo rehecho con tarjetas de pregunta

El cliente vio la v2 (estado (9) de hoy) y siguió sin convencerle: «sigue sin gustarme, incluso ahora
está peor». Dos peticiones más, la primera muy concreta —«en la web no se entiende "una hora, o dos,
cada mes"»— y la segunda de fondo —«rehaz el guión para que se entienda mejor, no hagas tantos cortes
pequeños, si tiene que ser más largo no pasa nada»—.

**La frase de la web se arregla aparte del vídeo.** `.vcase__hook` en `/casos-de-exito/` llevaba «Una
hora, o dos, cada mes.» como titular en negrita de la tarjeta, y solo, sin el resto de la frase, no
dice nada: le falta el verbo. Las tarjetas hermanas sí son autosuficientes («Dos horas diarias.», «De
dos plantas a cinco.»). Se cambia a «Una hora, o dos, paseando la planta cada mes.», que ya se
sostiene sola.

**El vídeo se rehace con cortes mucho más largos, no con más cortes.** La v2 tiraba de 19 fragmentos
cortos de sitios distintos del webinar; la v3 usa **7 tramos, casi todos de 15-30 s y algunos
literalmente continuos** (sin ningún corte interno), dejando que José termine sus frases en vez de
saltar de una a otra. Dos hallazgos releyendo la transcripción entera, verificados contra el audio:

- **«Una hora, o dos» nunca sonaba en el vídeo.** Es una frase real de José —«pasear con la empresa
  durante una hora, durante dos, y hacerlo»—, pero ni la v1 ni la v2 la incluían: el titular prometía
  algo que el vídeo no enseñaba. Ahora sí está, dentro del primer bloque continuo.
- **La v1/v2 cortaban justo el contraste que hacía legible el relato.** Entre «antes creábamos un
  Excel» y «¿qué suponía esto antes?» hay, en el original, una descripción de **cómo es el registro
  nuevo en Solved** (móvil, cámara, OK/KO, informe al momento) que las versiones previas se saltaban
  entera — así que las dos preguntas sobre «antes» quedaban pegadas sin el «ahora» en medio, y sonaba
  a repetirse. Se incluye.

**Y se añade contenido nuevo, con el mismo criterio de tramos largos**, todo verificado contra el
mismo verificador de límites de palabra de las sesiones anteriores (`s < a < e` contra
`aguilar_words.json`, en un script de una sola vez, sin guardar):
- Por qué **un ERP no les sirvió** antes de Solved («pesado, farragoso, no era nada fácil»).
- **De dos registros a todo centralizado**, con el ejemplo real de qué pasa cuando otro departamento
  pide uno nuevo.
- El **contexto completo de la reacción de los auditores** («Los auditores vienen de Sanidad, de
  supermercados, de clientes, y alucinan cuando ven...»), antes cortado a mitad de frase.
- **El coste de pedir un cambio en otro software** («cámbiame el botoncito... pasas por caja, pasas
  por caja») que hace entender por qué «es tipo Netflix» es un argumento y no una ocurrencia.
- El **consejo a un responsable indeciso**, de cuando el anfitrión se lo pregunta directamente.

### La idea que lo resolvió de verdad: tarjetas con la pregunta

Con los cortes más largos, el cliente seguía sin verlo claro — el problema no era ya el corte en sí,
era que el vídeo saltaba de tema en tema sin avisar. Su propia pregunta —«¿tiene sentido meter cortes
con pantalla blanca y la pregunta a la que responde la respuesta?»— es la que lo arregla: **cinco
tarjetas intermedias**, mismo lenguaje visual que la cartela de apertura (blanco, azul de marca, la
tipografía del sistema), cada una con la pregunta real del anfitrión entrecomillada cuando existe, o
un título de tema neutro cuando José se adelanta sin que se la pregunten:

| Tarjeta | Texto | Fuente |
|---|---|---|
| 1 | «En esta parte · El checklist mensual, antes de Solved» | tema, sin pregunta literal — el webinar empieza a mitad de respuesta |
| 2 | «La pregunta · ¿Por qué decidisteis dar el paso con Solved, y qué habéis conseguido desde entonces?» | cita condensada del anfitrión, min. 16:00 |
| 3 | «La pregunta · ¿Cómo lo recibió el equipo?» | cita casi literal, min. 6:54 |
| 4 | «En esta parte · El coste de pedir un cambio» | tema — José lo cuenta él solo, sin que nadie se lo pregunte |
| 5 | «La pregunta · ¿Qué le dirías a un responsable que todavía se lo está pensando?» | cita casi literal, min. 24:49 |

**Nuevo en el pipeline de montaje, no solo en este vídeo:** `build.py` aceptaba hasta hoy un `edl` de
solo `[inicio, fin]` sobre el vídeo fuente. Ahora un elemento puede ser también
`{"card": "ruta.png", "dur": segundos}` — genera un clip estático con audio en silencio del mismo
formato que los cortes reales (mismo `fps`, `yuv420p`, `pcm_s16le`) y entra en la misma cadena de
`xfade`/`acrossfade` sin tratamiento especial; el paso de subtítulos simplemente lo salta. Sirve para
cualquier vídeo de caso futuro que quiera el mismo recurso. `cards/gen_cards.py` gana una función
`pregunta()` reutilizable, y `cards/gen_preguntas_aguilar.py` es el script de una sola vez con las
cinco tarjetas de este vídeo — el patrón para el próximo caso que las necesite.

**Efecto colateral bueno, no buscado:** el lower-third (nombre y cargo de José) se pinta sobre los
primeros 6,4 s del cuerpo del vídeo sin mirar qué hay debajo, así que también aparece sobre la primera
tarjeta de pregunta — el resultado es una cartela de «capítulo» con el tema y quién va a hablar a la
vez, que es exactamente lo que se buscaba sin tener que montarlo aparte.

**El vídeo sube a 4:52** (v1 fue 2:05, v2 2:29) — el cliente ya había dicho que la duración no era el
problema. `assets/casos/caso-patatas-aguilar.mp4` y su póster son la v3; la v1 y la v2 quedan en
`~/Vídeos/casos-exito-solved/_montaje/out/`, sin enlazar desde el repositorio. `.gate__dur` y el
JSON-LD `duration` suben a `PT4M52S`; la descripción del `VideoObject` y `.ds-hero__sub` se reescriben
para nombrar el ERP fallido y el consejo a indecisos, que antes no estaban. 4 cadenas nuevas
traducidas a mano en `i18n/traducciones/22-patatas-aguilar.json`. `check:seo` (819 HTML, ✔ sin fallos)
y `check:voz` (53 páginas, ✔) pasan.

**Pendiente, otra vez:** seguir sin poder escuchar el resultado. El balance de música (`loudnorm
I=-28`, `volume=-12dB` extra) es el mismo de la sesión anterior, sin cambios; si al oírlo hay que
tocarlo, es ese único número, por vídeo.

## Estado a 29 septiembre 2026 (18) — cada página, su propia máquina y su propio equipo: fin de la repetición de nombres

Petición del cliente: **«Todas las animaciones las hacemos sobre la máquina cinta transportadora y
siempre metemos los mismos nombres de personas y máquinas. Revisa toda la web y que no se repita
ningún nombre ni máquina.»** Confirmado en modo estricto: cada página comercial tiene desde hoy su
propia máquina insignia, su propia incidencia y su propio reparto de personas, sin compartir
ninguno con otra página — salvo una única excepción documentada abajo.

**Antes de tocar nada, un inventario.** UTD26_163_001 («Fuga de aceite en cinta transportadora
L3») aparecía en 8 páginas, 50 veces; Pablo en 6 páginas, 43 veces; Javier en 6 páginas, 16 veces;
el cuarteto Ana Ruiz/Marta Gil/Sergio Nieto/Pablo Ferrer (el desplegable `.app__asigna`, «Asigna
tareas a cualquier persona del equipo») estaba copiado literal en incidencias/, no-conformidades/ y
gestion-de-activos/.

**Reparto final, uno por página** (persona protagonista · máquina · incidencia insignia):

| Página | Persona | Máquina | Incidencia |
|---|---|---|---|
| gestion-de-activos/ | Pablo Ferrer (se queda, es su historia) · Mari Mar (registro) | TRA-003 · Cinta transportadora L3 | UTD26_163_001 |
| index.html (home) | Marcos | SEL-007 · Selladora térmica · Línea 7 | UTD26_177_001 |
| incidencias/ | Ana Ruiz, Marta Gil, Sergio Nieto (se quedan) + Rubén Castillo (sustituye a Pablo) · Teresa (usuaria conectada) | EMB-006 · Embotelladora · Línea 6 | UTD26_174_001 |
| no-conformidades/ | Laura Méndez, Diego Salas, Elena Rosales, Carlos Duarte | PAL-004 · Paletizadora · Línea 4 | UTD26_171_001 y variantes 180-185 |
| industria-alimentaria/ | Rocío Blanco | MEZ-001 · Mezcladora industrial · Línea 2 | UTD26_172_001 y variantes 205-208 |
| industria-general/ | Nuria Campos | HOR-002 · Horno de cocción · Línea 1 | UTD26_173_001 y variantes 198-204 |
| ia/ | — | COMP-001 · Compresor de aire | UTD26_175_001 |
| gestor-documental/ | — | ETQ-003 · Etiquetadora · Línea 3 | UTD26_176_001 |
| gestion-de-calidad/ | Sofía Marín (sustituye a Javier) | — | — |

**Cómo se hizo:** siete agentes en paralelo, cada uno con un reparto ya decidido (sin ambigüedad
que resolver, para no arriesgar colisiones entre ellos), editando un único fichero cada uno,
verificando con `grep` que el identificador viejo desaparecía del suyo y pasando `check:voz` antes
de terminar. Después, un barrido manual (`grep` cruzado de los 18 archivos comerciales por cada
nombre y cada código) encontró y corrigió lo que los agentes no podían ver al trabajar en paralelo
sin visión de conjunto:

- Cuatro «Javier» residuales que ningún agente tocó por no estar en su encargo explícito (el
  saludo «Buenos días, Javier» y un mensaje de chat en incidencias/ → Teresa; el firmante del
  registro en industria-alimentaria/ e industria-general/ → el protagonista ya asignado a cada
  página).
- Un «Pablo» que sobrevivía en filtros y filas secundarias de acción en index.html,
  industria-alimentaria/ e industria-general/ (el desplegable de filtro decía «Responsable ·
  Pablo» aunque la tabla ya no lo usaba) → renombrados al protagonista de cada página.
- Una decena de **códigos UTD26_… que coincidían por casualidad** entre páginas —números elegidos
  independientemente por agentes en paralelo sin verse entre sí (181-184 en no-conformidades/ e
  industria-alimentaria/; 154/160/162 compartidos entre index.html, gestion-de-activos/ e
  incidencias/; UTD26_164_EXQ, la reclamación del pedido 4471, repetida en tres páginas)—:
  renumerados a rangos libres (198-212), comprobado uno a uno contra el resto del sitio.

> ### ⚠️ EXCEPCIÓN ÚNICA Y DELIBERADA: TRA-003/UTD26_163_001 SIGUE COMPARTIDO ENTRE `index.html` Y `gestion-de-activos/`
> La home tenía este incidente como su hilo central desde hace meses, con un **vídeo grabado**
> (`assets/ia/ia-reel.mp4`) que lo muestra quemado en los fotogramas. Se preguntó al cliente cómo
> resolverlo y eligió **cambiar la home igualmente** (a SEL-007/Marcos), aceptando que el vídeo de
> la banda de IA queda temporalmente desincronizado con el texto de alrededor hasta que se
> regrabe en otra sesión (`npm run render:ia`, necesita Chrome + ffmpeg). Documentado en dos
> comentarios dentro de `index.html`, junto a las piezas que lo mencionan.

`check:seo` (819 HTML, ✔ sin fallos) y `check:voz` pasan en las nueve páginas tocadas
(index.html, gestion-de-activos/, incidencias/, no-conformidades/, industria-alimentaria/,
industria-general/, ia/, gestor-documental/, gestion-de-calidad/). Ningún cache-buster se ha
tocado: es un cambio de contenido, no de estructura.

**Pendiente:**
1. **Regrabar `assets/ia/ia-reel.mp4`** para que cuente la historia de SEL-007 en vez de la cinta
   L3 (`npm run render:ia`).
2. **Decenas de cadenas nuevas sin traducir** en los cinco idiomas —cada nombre, máquina y
   descripción de incidencia cambiada hoy es una cadena nueva en el catálogo—: entra en el próximo
   `i18n:extract` + `build:i18n`, y conviene revisar el género/tono de los nombres nuevos en cada
   idioma antes de publicar.
3. **HOR-002 y MEZ-001 siguen mencionados de pasada en la tabla de otros activos de
   `gestion-de-activos/`** (la ficha de TRA-003 lista otros activos de la empresa, y dos de ellos
   son justo las máquinas insignia de industria-general/ e industria-alimentaria/). Se dejó así a
   propósito: es una mención de catálogo, no una animación protagonista, y evita inventar más
   activos sólo para esa fila de tabla — si algún día se decide que también hay que separarlo, son
   dos celdas de una tabla.

## Estado a 29 septiembre 2026 (17) — pulido de `/industria-general/`, `/industria-alimentaria/` y `/software-gmao/`

Petición del cliente, justo detrás de la retirada de APPCC e ISO 22000 (ver el estado (16), debajo):
pulir las tres páginas que quedan en el mega-menú «Casos de uso» — industria general, industria
alimentaria y mantenimiento (`/software-gmao/`, el título literal de esa página es «Gestión de
mantenimiento y averías en planta»; no confundir con `/gestion-de-activos/`, que es la ficha del
equipo dentro del producto).

**`/industria-general/` — una cifra que se repetía a sí misma.** La sección «Alcance inicial de la
implantación» mostraba **«2-3 semanas de implantación media»** dos veces seguidas: una vez en la
banda `.ds-stats` y otra vez, idéntica, en el pie de la foto de debajo (`.photo-band__fig`). Comparado
con el mismo componente en `/gestion-de-calidad/`, que sí pone ahí una cifra distinta y complementaria
(`-80%` de tiempo de gestión), esto era un descuido, no una decisión. Se sustituye por
**«+70.000€ de ahorro anual en costes operativos por cliente»**, la misma cifra y el mismo texto que
ya usan la home y `/incidencias/` — no se inventa ninguna nueva.

**`/industria-alimentaria/` y `/gestion-de-calidad/` — las cuatro tarjetas de norma, ya sin enlace
roto.** Cubierto en el estado (16): las dos que enlazaban a APPCC e ISO 22000 pierden su
`reasons__link`, igual que ya les pasaba a las otras dos de la misma rejilla desde el 28 de
septiembre.

**`/software-gmao/` — la página más floja de las tres, con tres arreglos concretos.**

1. **CSS muerto, fuera.** La página cargaba `ds/tint.css` y `ds/scene.css` sin usar ni un solo
   `.scene` ni tinte de módulo en todo el marcado —es una página de la familia 2.0 (usa `.split`,
   `.feat-list`, `.pain-grid`), no de la 3.0—. Dos peticiones HTTP menos por visita, cero cambio
   visual.
2. **Sin ninguna cifra propia.** A diferencia de `/industria-general/`, `/industria-alimentaria/` y
   `/gestion-de-calidad/`, esta página no mostraba ni una sola cifra: cero prueba, cero `ds-stats`.
   Entra una sección nueva, «Se conecta con tu GMAO, no lo sustituye» (mismo patrón que ya usa
   `/integraciones/` en «Integrar no es el requisito, es la opción»: encabezado partido + `ds-stats`,
   sin banda de foto), con las mismas dos cifras de esa página, reutilizadas tal cual: **«Todos» /
   tus sistemas ERP, MES y GMAO conectados** y **«2-3» / semanas de implantación media**. Ninguna
   cifra nueva, las dos ya publicadas y verificadas en otro sitio del repositorio.
3. **Contenido duplicado con `/gestion-de-activos/`, ahora enlazado en vez de repetido a ciegas.** La
   sección «Cada equipo con su ficha, su QR y lo que le ha pasado» describe exactamente la misma
   capacidad que `/gestion-de-activos/` ya enseña con pantallas reales de producto —ficha por equipo,
   código QR, historial—, y las dos páginas llevan casi la misma respuesta de FAQ palabra por palabra
   («No, y conviene decirlo claro: Solved no lleva stock de repuestos, ni costes, ni horas de mano de
   obra…»). No se ha tocado el contenido de ninguna de las dos —cada una vive de una consulta de
   búsqueda distinta («GMAO»/«mantenimiento» aquí, «gestión de activos» allí— pero ahora se enlazan
   entre sí: un `<a class="reasons__link">Ver la ficha completa del equipo →</a>` al final de la lista
   de `/software-gmao/` hacia `/gestion-de-activos/`, y la respuesta de la FAQ de `/gestion-de-activos/`
   («¿Es un GMAO?») cierra con un enlace de vuelta a `/software-gmao/`. Antes ninguna de las dos se
   sabía de la existencia de la otra.

**Lo que se ha dejado tal cual, a propósito:** el hueco de foto pendiente (`.img-slot`, «Foto
pendiente») de la sección «Cada equipo con su ficha…» sigue sin foto — es el mismo patrón de espera
ya documentado en el sistema (`ds/sections.css`, variante `--hueco`), no un defecto nuevo, y
rellenarlo exige generar una foto real o maquetar una pantalla de producto contra la aplicación, que
es trabajo de otra sesión con acceso a la demo. Tampoco se ha traducido `/software-gmao/` a los cinco
idiomas —sigue sin `hreflang` a propósito, como ya decía su propio comentario— ni se ha tocado su
contenido de FAQ o su propuesta de valor, sólo su integración con el resto del sitio.

`check:seo` (819 HTML, ✔ sin fallos) y `check:voz` (53 páginas, ✔) pasan. Verificado en el navegador
con `npm run serve`: el mega-menú «Casos de uso» con los tres enlaces que quedan, la sección de cifras
nueva de `/software-gmao/`, el enlace cruzado en los dos sentidos, y las cuatro tarjetas de
`/industria-alimentaria/` sin hueco ni enlace roto.

## Estado a 29 septiembre 2026 (16) — se retiran `/software-appcc/` y `/software-iso-22000/`

Petición del cliente: quitar las dos páginas de norma («Software de APPCC» y «Software para ISO
22000») del sitio entero, en los seis idiomas.

**Borrado completo, no sólo desenlazado.** Las carpetas `software-appcc/` y `software-iso-22000/`
en español y sus diez traducciones (`en/haccp-software/`, `en/iso-22000-software/`,
`fr/logiciel-haccp/`, `fr/logiciel-iso-22000/`, `it/software-haccp/`, `it/software-iso-22000/`,
`de/haccp-software/`, `de/iso-22000-software/`, `pt/software-haccp/`, `pt/software-iso-22000/`) han
salido del repositorio. Con ellas, sus entradas en `scripts/config.mjs` (`STATIC_PAGES`, para el
sitemap) y en `i18n/config.mjs` (`RUTAS` y `PAGINAS_CATALOGO`).

**Los dos enlaces del mega-menú «Casos de uso»** (`chrome.js`, junto a Industria general, Industria
alimentaria y Mantenimiento) se han quitado; `npm run build:i18n` ha regenerado los `chrome.js` de
los cinco idiomas con la nav ya sin esos dos ítems.

**Las dos páginas que explicaban APPCC e ISO 22000 sin enlace propio.** `industria-alimentaria/`
(sección «Aplicaciones específicas») y `gestion-de-calidad/` (sección «Documenta la norma que audite
tu planta») llevaban cuatro tarjetas cada una; las de APPCC e ISO 22000 tenían un `reasons__link` a
la página propia, las otras dos (certificaciones y homologación de proveedores, retiradas el 28 de
septiembre) ya no lo tenían. Ahora las cuatro tarjetas de las dos páginas están sin enlace, mismo
patrón: la sección explica la capacidad, no repite el índice de páginas del sitio.

**El enlazado interno del blog y el glosario, remapeado, no roto.** `seo/enlazado.json` mandaba a
estas páginas cinco posts de APPCC, tres de ISO 22000 y seis fichas del glosario
(`productoPorPost` y `terminos`); los ocho CTA de producto y las seis fichas pasan a
`/industria-alimentaria/`, que es la página de sector que ya habla de APPCC e ISO 22000 sin
enlazarlas. Se han retirado también los bloques `cta` de las dos páginas borradas y las cuatro
entradas muertas de `MODULO_POR_PRODUCTO` en `scripts/build-enlaces.mjs` (las dos de hoy y las dos de
`/software-certificaciones/`/`/homologacion-de-proveedores/`, huérfanas desde el 28 de septiembre y
sin limpiar entonces). `npm run build:enlaces` ha vuelto a inyectar los banners y CTA de los 61 posts
y las 40 fichas con los enlaces nuevos, y `npm run build:i18n:contenido` los ha propagado a los cinco
idiomas — sin este segundo paso las páginas de blog/glosario traducidas se quedan con los enlaces
viejos, que es lo que dio los primeros fallos de `check:seo`.

**`llms.txt`** pierde sus dos líneas de la sección «Soluciones»; la mención descriptiva de ISO 22000
y APPCC en el párrafo de cabecera se queda, porque no enlaza a ninguna página y sigue siendo cierta
(Solved es compatible con esas normas mediante el mismo circuito de registros y auditorías).

`npm run build:sitemap` baja el sitemap a 476 URLs. `check:seo` (819 HTML, ✔ sin fallos) y `check:voz`
(53 páginas, ✔) pasan. Dos cadenas nuevas («APPCC:» e «ISO 22000:», las versiones cortas de los
rótulos que quedan sin enlace) traducidas a mano en `i18n/traducciones/08-industrias-appcc.json`.

**Lo que no se ha tocado:** las URLs de los posts de blog cuyo slug contiene «appcc» o «iso-22000»
(el contenido editorial sigue publicado, sólo dejó de tener una página de producto propia a la que
enlazar) y las entradas ya traducidas de estos términos en el catálogo (`i18n/traducciones/`), que se
quedan sin usar en el fichero, como manda la costumbre del repositorio con cualquier retirada.

## Estado a 29 septiembre 2026 (15) — revisión responsive de «La ficha del equipo»: el titular volvía a taparse en móvil

Petición del cliente: comprobar que la sección quedaba bien en móvil después de la tanda de hoy. La
extensión de Chrome de esta sesión no deja fijar un ancho de ventana real —`resize_window` no cambiaba
`window.innerWidth` por mucho que dijera que sí—, así que la comprobación se hizo como ya se hacía en
sesiones anteriores para el vídeo de IA: **Puppeteer a pelo, con el Chrome del sistema**, en un script
suelto (no comiteado) que carga la página a varios anchos de viewport reales —320, 375, 390, 430, 600,
768, 900, 1280, 1440— y mide posiciones del DOM, no capturas de la extensión.

**Y salió el sexto caso del mismo patrón de siempre: el aparato tapando el titular.** La escena
«Organiza tus activos…» (8 columnas, `data-crop="dev-br"`) llevaba `style="width:88%;top:14%"` puesto
a mano, de cuando esta escena se llamaba «La ficha del activo…» y `ds/scene.css` no tenía todavía la
regla general para `data-span="8"`. Esa regla general llegó después (**`.scene[data-span="8"]
.scene__media[data-crop="dev-br"]{left:11%;top:15%;width:88%}`**, prácticamente el mismo valor) y con
ella el reset de móvil que ya existe para esa misma regla desde el 15 de septiembre
(`@media max-width:900px`, la misma línea que arregló el iPad de Registros y la ventana de Informes de
la home). Pero un `style` inline gana siempre a una hoja de estilos —`!important` aparte—, así que ese
reset **nunca llegaba a aplicarse aquí**, y con el titular nuevo (dos líneas a partir de 375px, antes
solía caber en una) la ventana quedaba encima: **22px de solape a 320px, 14px a 375px**, medido con
`getBoundingClientRect()`, no a ojo. A partir de 390px no se notaba, que es justo el ancho al que
suele probarse a mano y por lo que llevaba así sin que nadie lo viera.

**Se quita el `style` inline.** La regla general de `ds/scene.css` da el mismo 88 % de ancho en
escritorio (1 punto de diferencia en `top`, imperceptible) y el reset de 900px vuelve a aplicar solo.
Comprobado con el mismo script a los nueve anchos: **de 320 a 1440px el solape es negativo en todos**
(la ventana empieza por debajo del titular con margen), y `document.documentElement.scrollWidth` no
supera el ancho del viewport en ningún caso de 320 a 430px —sin scroll horizontal—.

**El resto de la sección aguanta bien la comprobación:**

- **«Escanea cada máquina…»** (`.qrficha__screen`, 236×400px fijos): a 320px el media box mide
  ~225-230px de ancho —el crop `b` da el 78 % de una tarjeta de ~288-320px—, así que a partir de ahí
  el margen se estrecha; no llegó a desbordar en las capturas, pero es el componente más ajustado de
  los cuatro y el primero a revisar si algún día se ve mal en un móvil real y estrecho.
- **«Asigna tareas…»** (`.app__asigna`, compartido con `/incidencias/` y `/no-conformidades/`): sin
  cambios de layout hoy, sólo de contenido; sigue recortando el texto largo por el borde
  (`.app__campov{white-space:nowrap}`), que es el comportamiento de siempre en las tres páginas.
- **«Organiza tus activos…», acto A (la lista):** el filtro por tipo y el buscador ya se pensaron hoy
  para esto —`overflow-x:auto` en la fila de pestañas, el buscador con `flex:1 1 160px` en vez de un
  ancho fijo, la tabla con `min-width:0`—, así que a 320px se recortan dentro del propio recuadro
  (`overflow:hidden` del aparato) en vez de romper la página. No es ideal —«Equipos de medición» no se
  lee entero sin deslizar—, pero no revienta el layout.

**No se ha tocado, y no es de esta sesión:** `software-appcc/index.html` y `software-iso-22000/index.html`
aparecen borrados en `git status` (`D`, staged) y `check:seo` avisa de enlaces y URLs de sitemap que ya
no existen por eso —14 fallos, todos de esas dos páginas y sus traducciones—. Es trabajo de otra sesión
en marcha a la vez; `check:voz` sigue en verde (53 páginas). No se ha tocado nada de eso.

## Estado a 29 septiembre 2026 (14) — «Descargar»/«Imprimir» del código QR, en columna: no cabían en fila

Aviso del cliente, mismo día que el estado (13): al encajar la ficha, los dos botones del panel
«Código QR» (`.app__qrbtns`) se salían de la tarjeta —«Descargar» cabía y una esquina de «Imprimir»
asomaba por el borde de la ventana—. La columna del QR mide en esta ficha ~180px, y los dos botones en
fila (`.app__add`, con su propio padding y texto) necesitan más de 200px para no tocarse.

`.app__qrbtns` pasa de fila a columna (`flex-direction:column`); con `align-items` por defecto
(`stretch`) los dos botones quedan del mismo ancho, y se añade `justify-content:center` sólo a los
`.app__add` de dentro para que el icono y el texto se centren en ese ancho nuevo. `.app__qrbtns` y
`.app__add` sólo se usan en esta página, así que el cambio no toca nada más.

`ds/app.css` sube a `?v=20260929c` en las 48 páginas que lo carga. `check:seo` (831 HTML, ✔ sin
fallos) y `check:voz` (55 páginas, ✔) pasan. Verificado en el navegador: los dos botones apilados,
del mismo ancho, ninguno se sale de la tarjeta.

## Estado a 29 septiembre 2026 (13) — «La ficha del activo…», segunda vuelta: la lista con filtro real, y la ficha encaja

Dos peticiones del cliente sobre la escena del estado (12), el mismo día.

**La pantalla de Activos se ve más real.** Entra un filtro por tipo (`.app__acttabs`, el mismo
componente de pestañas que ya usa el historial de la ficha, reutilizado sin tocar CSS): «Todos ·
Maquinaria · Instalaciones · Equipos de medición» —los tres tipos reales, comprobados el 28 de
septiembre—, un contador **«100»** —la BD dinámica «Maquinaria» se regeneró con 100 activos ese mismo
día, mismo archivo, cifra real— y cabecera de columnas en la tabla (`<thead>`, el estilo ya vivía en
`ds/app.css` sin que ninguna página lo usara). El buscador se queda igual.

**La ficha deja de recortarse: encaja en la ventana.** `.app__act` lleva `min-width:760px` a
propósito desde el 3 de septiembre —«el recorte por la derecha es lo que dice que esto continúa»—,
pensado para cuando la ficha era lo único que había en la escena. Con la lista delante y la ficha como
destino de una navegación real, el cliente pidió verla entera. Se sobreescribe con
`style="--app-act-w:0"` sobre el propio `.app__act` de esta escena —la regla ya vivía detrás de una
variable con ese fallback, así que no hizo falta tocar `ds/app.css` para esto ni afecta a nada más— y
el grid interior (`.app__actcols`, `.app__kv`) ya usaba `minmax(0,…)`, así que se reparte solo en el
ancho real de la ventana (~560px) sin que se corte nada. También se revierte el `right:auto` que el
estado (12) le había puesto a `.app__actswap__act--b` para permitir justo ese desbordamiento —ya no
hace falta, ahora los dos actos miden lo mismo—.

> **Y al encajarla salió un bug de fondo que llevaba ahí desde el 3 de septiembre, invisible porque la
> ficha se recortaba antes de llegar al QR:** `.app__qrimg{width:56px}` (0-1-0) perdía contra
> `.app img{width:auto}` (0-1-1) —el SVG del QR no lleva `width`/`height` propios, sólo `viewBox`, así
> que «auto» lo pintaba a su tamaño por defecto (233px) en vez de 56—. Es la cuarta vez que este
> patrón de especificidad muerde en este repositorio. Se ancla con `.app .app__qrimg` (0-2-0), que
> gana. Comprobado con `javascript_tool`: a 760px de ancho el QR ya se pintaba a 233px, o sea que el
> bug es anterior a esta sesión y a `--app-act-w`, sólo que nadie lo había visto por el recorte.

`ds/scene.css` sube a `?v=20260929m` y `ds/app.css` a `?v=20260929b`, en las 80/48 páginas que los
cargan respectivamente. `check:seo` (831 HTML, ✔ sin fallos) y `check:voz` (55 páginas, ✔) pasan.
Verificado en el navegador con los dos actos forzados a opacidad 1 por turno: la lista con las cuatro
pestañas y el contador, y la ficha entera —QR a tamaño real, «ACCIONES ABIERTAS» completo— sin ningún
recorte.

## Estado a 29 septiembre 2026 (12) — «La ficha del activo…»: primero la lista, se marca una fila, se abre la ficha

Petición del cliente sobre la escena grande de «La ficha del equipo» (8 columnas, ventana de
navegador): el titular pasa a **«Organiza tus activos por áreas y etiquetas»**, y la escena deja de
abrir ya con la ficha puesta —se ve la pantalla de Activos, se marca una fila y se abre su ficha—.

**El titular se puso tal cual se pidió, marcado como no comprobado.** Antes de escribirlo se preguntó
al cliente: el árbol de carpetas por área y las etiquetas de activos se investigaron el 28 de
septiembre (más abajo en este archivo) y se comprobó que hoy no existen en la aplicación —los activos
sólo agrupan por tipo, y `tagIds` sólo se aplica a Documentos—, y por eso el rotador que las enseñaba
se retiró entero ese mismo día. El cliente pidió seguir adelante de todos modos, con el aviso
⚠️ puesto en el marcado, mismo criterio que la ficha simplificada de la composición de portada. **Esta
página vuelve a tener un pendiente de negocio**: o el árbol por área y las etiquetas existen de
verdad, o el titular se cambia por uno que hable de lo que la app agrupa hoy (tipo y ubicación).

**La animación sí es fiel a lo que agrupa la app hoy.** La lista que se enseña agrupa bajo
«MAQUINARIA» —el tipo real, no un área inventada—, con buscador y cuatro filas: **TRA-003** y
**ENV-002**, los dos activos que ya existen en el resto del sitio, más **HOR-002 · Horno de cocción**
y **MEZ-001 · Mezcladora industrial**, plausibles y no comprobados, mismo criterio que el resto de
datos «a petición expresa» de esta página. La fila de TRA-003 se marca —fondo azulado, como ya hace la
fila elegida en `.app__asigna`— y entonces se abre su ficha, que es el marcado que ya había: no se ha
tocado ni un campo de la ficha en sí.

**Componente nuevo `.app__actswap`** (`ds/scene.css`, junto a `.planalt` y `.qrficha`, que llevan el
mismo patrón): dos actos con el mismo cruce de opacidad de siempre (`planalt-a`/`planalt-b`,
reutilizadas tal cual, reloj de 8 s). A diferencia de `.planalt`/`.qrficha`, aquí no hizo falta un
`min-height` a mano: los dos actos viven dentro de `.app__main`, que ya mide lo que mide por ser
`flex:1` de un `.app` con alto fijo (lo da `.device__screen` con su `aspect-ratio`), así que el padre
ya estaba resuelto antes de tocar nada.

> **Trampa, y se pilló antes de publicar:** el acto B (la ficha) es `position:absolute; inset:0`, y
> `inset:0` fija también el borde derecho. La ficha real es más ancha que la ventana A PROPÓSITO
> (`.app__act{min-width:760px}`) y se recorta por la derecha contra `.device__screen{overflow:hidden}`
> —«el panel de acciones abiertas y la mitad del QR se salen de la ventana», ya documentado en
> `ds/app.css`—. Con `right:0` fijo, ese recorte intencional se habría estrechado antes de tiempo.
> Se corrige con `right:auto` en `.app__actswap__act--b`, comprobado en el navegador que el QR y las
> acciones abiertas se siguen cortando exactamente igual que antes.

`ds/scene.css` sube a `?v=20260929l` en las 80 páginas españolas que lo carga. `check:seo` (831 HTML,
✔ sin fallos) y `check:voz` (55 páginas, ✔) pasan. Verificado en el navegador forzando cada acto a
opacidad 1 por turno: la lista con la fila de TRA-003 marcada, y la ficha idéntica a la que ya había,
con el mismo recorte por la derecha.

## Estado a 29 septiembre 2026 (11) — «El preventivo…»: la notificación sale de la pantalla del registro, dos actos en vez de uno

Petición del cliente sobre la misma escena: la notificación vivía DENTRO de la pantalla del
registro —una banda pegada a su canto superior, tapándola—, así que los dos gestos se leían como
uno solo. Pidió diferenciarlos y ponerlos uno detrás de otro, no uno encima del otro.

**`.regpush` pasa de un solo aparato con la notificación incrustada a DOS ACTOS**, con el mismo
cruce de opacidad que ya usa `.planalt` (mismas `planalt-a`/`planalt-b`, mismo reloj de 8 s, sin
retocar):

- **Acto A — la notificación, sola.** Deja de ser una banda de punta a punta pegada al borde de una
  pantalla y pasa a ser una tarjeta flotante con su propio marco y su propia sombra, sin ningún
  aparato alrededor —ni tablet ni teléfono—. Sigue con su toque (`.regpush__tap`).
- **Acto B — el aparato y la plantilla.** El iPad sin bisel, con `.regchk` rellenándose, entra
  DESPUÉS de que el acto A se haya ido —no antes, no a la vez—. Sale `.regpush__screen` (el fundido
  interior que hacía esa misma transición a medias): ya no hace falta, el cruce de los dos actos es
  ahora la transición entera.

**Los retardos de `.regchk` y de la firma se corren** de arrancar a los 2,4-3,1 s a arrancar a los
4,1 s: el acto B no se ve hasta el 50 % del reloj (4 s), así que nada del relleno puede empezar
antes. La barra de progreso pasa de porcentajes fijos a `animation-delay` (4 s), mismo criterio que
las filas, para que sea fácil de retocar si el reparto de los dos actos vuelve a cambiar.

`ds/scene.css` sube a `?v=20260929k` en las 80 páginas españolas que lo carga. `check:seo` (831
HTML, ✔ sin fallos) y `check:voz` (esta página, ✔) pasan. Verificado en el navegador: la
notificación aparece sola, sin ningún aparato detrás, y sólo después entra el iPad con el registro
—capturas reales de los dos momentos, no sólo el estado final—.

## Estado a 29 septiembre 2026 (10) — la notificación de «El preventivo…»: más baja, ajustada al texto, y arriba del todo

Petición del cliente sobre la misma escena: la banda de la notificación (estado (8)) medía más de
lo que hacía falta, y quedaba centrada en medio de una tarjeta mucho más alta que el aparato.

- **Altura ajustada al texto.** `.regpush__notif` baja el `padding` (12px→6px arriba/abajo) y el
  icono (30px→20px, era él quien mandaba el alto); tipografía del título y el mensaje un punto más
  pequeña. La banda pasa de tapar buena parte de la pantalla a medir justo lo que ocupan el icono y
  las dos líneas de texto.
- **El aparato, arriba de la tarjeta.** `.regpush` cambia de `align-items:center` a `flex-start`: la
  caja de esta escena (`data-crop="b"`) deja casi 500px de alto y el aparato mide ~340, así que
  centrado quedaba colgado en medio de un hueco enorme. Arriba es además donde cae de verdad una
  notificación.

> ### ⚠️ Y AL MEDIR APARECIÓ UN BUG REAL, DE LA TANDA ANTERIOR: LA NOTIFICACIÓN OCUPABA LA PANTALLA ENTERA
> `ds/device.css` trae `.device__screen>*{ position:absolute; inset:0 }` —cualquier hijo directo de
> la pantalla llena el hueco entero, que es lo que necesitan `.app` y compañía—.
> `.regpush__notif` es hijo directo de `.device__screen` y su regla puntuaba IGUAL (0-1-0); como
> `ds/device.css` carga DESPUÉS de `ds/scene.css`, ganaba para `bottom` —que la notificación no
> declaraba— y la estiraba al alto entero del aparato (337px, comprobado con `getComputedStyle`: no
> era una banda arriba, era una capa blanca de pantalla completa con el texto flotando dentro,
> mismo patrón que ya mordió con `.bridge`, `.app__conv` y `.regpush__notif` mismo la vez pasada
> —van seis—). Estaba así desde que se creó la pieza; no se notaba en las capturas porque el fondo
> de detrás también es blanco. Se corrige subiendo la especificidad del selector
> (`.regpush .regpush__notif`, 0-2-0) y declarando `bottom:auto` explícito.

`ds/scene.css` sube a `?v=20260929j` en las 80 páginas españolas que lo carga. `check:seo` (831
HTML, ✔ sin fallos) y `check:voz` (esta página, ✔) pasan. Verificado con `javascript_tool`
(`getBoundingClientRect().height` de 337px a 36px) antes y después del arreglo, y con capturas
reales de la banda ya del tamaño correcto.

## Estado a 29 septiembre 2026 (9) — Patatas Aguilar: el cierre ya no se corta, y el consejo a quien está indeciso

Dos correcciones más del cliente sobre el vídeo del estado (7)/(5) de hoy.

**El cierre se cortaba en mitad de «nos ha cambiado la vida».** No era la palabra —el corte de audio
llegaba completa—, era la cartela final: el crossfade hacia el cierre (`XF_CARD`, 0,45 s) empezaba
0,45 s antes del final del cuerpo, y el final del cuerpo estaba puesto justo detrás de la última
palabra, así que la cartela se superponía visualmente sobre «cambiado la vida» mientras José la seguía
diciendo. El hueco real de silencio hasta la siguiente frase (que no entra en el vídeo) es de sólo
0,34 s, más corto que el fundido — no hay manera de eliminar el solape del todo sin alargar el corte
hacia la frase siguiente, que no se quería—. Se movió el límite del último corte de 401,75 a 401,90 s
(justo antes de que empiece «A», la primera palabra de la frase siguiente, para que no se cuele como
subtítulo suelto): el fundido ahora sólo roza la cola de «vida.», no el cuerpo de la frase.
Comprobado con fotogramas cada segundo entre el minuto 2:20 y 2:25: la cara se ve completa y sin
cartela hasta bien pasado el final de la frase.

**Se añade el consejo a quien todavía se lo está pensando**, de la parte final del webinar donde el
anfitrión le pregunta directamente «¿qué le dirías a un responsable que ahora mismo está indeciso
sobre dar el paso con Solved o no?»: «Ellos estuvieran en esa posición y sabiendo lo que es papel y
todo lo que conlleva de trabajo, diría: lo quiero» y, más adelante en la misma respuesta, «Si son
responsables de calidad, trabajan en los departamentos, saben lo que se exige y saben el tiempo que
se pierde registrando, archivando y guardando, creo que lo tiene muy claro» — la única vez en todo el
vídeo en que José habla directamente a quien todavía no se ha decidido, en vez de contar su propia
experiencia. Va justo antes del cierre emocional, después del argumento del precio. El vídeo sube de
2:11 a **2:29**, todavía dentro de la familia (el más largo de los cuatro sigue siendo Panificadora
Alcalá, 2:39). Misma comprobación de límites de palabra que las dos veces anteriores, limpia a la
primera.

`casos-de-exito/patatas-aguilar/index.html` (`.gate__dur`, JSON-LD `duration` → `PT2M29S`) y la
tarjeta del índice (`.vcase__dur`) actualizadas; `npm run build:i18n` propaga la duración. `check:seo`
(831 HTML, ✔ sin fallos) y `check:voz` (55 páginas, ✔) pasan.

## Estado a 29 septiembre 2026 (8) — «Asigna la reparación…»: nuevo titular, otro equipo en el desplegable y fuera Resultado/Cerrada

Petición del cliente sobre la escena de Acciones de `/gestion-de-activos/` (el panel `.app__asigna`,
seis columnas, junto a la de Registros). Tres cambios.

**El titular pasa de «Asigna la reparación a cualquiera del equipo, con su plazo y su cierre
documentado» a «Asigna tareas relacionadas con el equipo y haz seguimiento hasta el cierre».**

**El desplegable ya no repite la lista de `/incidencias/` y `/no-conformidades/».** Las tres páginas
usaban exactamente el mismo cuarteto, mismo orden, mismo elegido: Ana·Calidad, Pablo·Mantenimiento
(seleccionado), Marta·Producción, Sergio·Almacén. Aquí entra **Sergio primero, se elige al jefe de
turno** —el mismo avatar de la banda de IA de `/incidencias/`, `avatar-jefe-turno.webp`, con «Turno de
mañana» de subtítulo— **y Ana cierra la lista.** Ningún avatar ni nombre nuevo: son los cinco que ya
tiene el sitio, sólo repartidos distinto y con otra persona elegida. «Turno de mañana» es cadena nueva
—la que ya existe en el catálogo va en minúscula y pegada a otra palabra («Calidad · turno de
mañana»), aquí es su propio subtítulo—, traducida a mano.

**Fuera «Resultado» y el cruce de Estado a «Cerrada».** Los dos contaban un cierre que esta escena ya
no enseña —el titular nuevo promete el seguimiento hasta el cierre, no el cierre en sí, que es el
trabajo de la escena de al lado en `/incidencias/`—; y el campo Resultado, al no llevar ninguna
animación propia, era el único de todo el panel que se veía «prerrellenado» desde el fotograma 0, que
es justo lo que pidió el cliente que no hubiera. **Estado se queda fijo en «Abierto»**, sin cruce y sin
animación —mismo criterio que ya tiene este campo en `/no-conformidades/`—: no hacía falta inventar un
estado que cambia si la escena no cuenta ese cambio.

**El resto del reloj de 12 s no se ha tocado** (`ds/scene.css`/`ds/app.css`, compartido con
`/incidencias/` y `/no-conformidades/`): ya era secuencial, campo a campo —se teclea la descripción,
se abre el desplegable y se marca al elegido, se rellena la fecha y después la hora—, y era
exactamente lo que pedía «ve marcándolos en orden uno a uno». Lo único que rompía esa regla era Estado,
que nacía en «En curso» sin que nadie lo hubiera puesto; con Estado fuera del reloj y fijo en «Abierto»,
los tres campos que quedan (Descripción, Responsable, Fecha de cierre) son los únicos que se marcan, y
los tres se marcan en orden.

`check:seo` (831 HTML, ✔ sin fallos) y `check:voz` (55 páginas, ✔) pasan. **2 cadenas nuevas**
traducidas a mano en `i18n/traducciones/05-acciones-activos.json` (el titular y «Turno de mañana»);
«Jefe de turno» y «Abierto» ya estaban en el catálogo. Verificado en el navegador: el desplegable
abierto con los cuatro nombres en el orden nuevo y el jefe de turno marcado, Estado en «Abierto» fijo
sin animación, sin campo Resultado.

## Estado a 29 septiembre 2026 (8) — «El preventivo…», cuarta vuelta: sin bisel, notificación en banda ancha con su toque, y relleno con animación propia

Cuatro peticiones del cliente sobre la misma escena del estado (6): quitar el bisel de la tablet;
que la notificación pase de tarjeta flotante a **banda ancha y rectangular, como una notificación
push de móvil real**, con su toque y su transición a la plantilla; que el relleno de los controles
**no reutilice la animación que ya usa la home** («Realiza tus registros en digital…»); y cambiar el
responsable de Javier a **Mari Mar** en esta escena.

- **Sin bisel.** `.regpush .device[data-device="ipad"]{ --device-bezel:0; --device-shell:transparent }`
  apaga el marco negro de `ds/device.css` y con él el punto de cámara (`::after`); la sombra pasa a
  `.device__screen`, que es quien la necesita sin el bisel debajo. **Trampa de especificidad, van
  seis:** la primera versión iba contra `.regpush .device` a secas, y `ds/device.css` carga DESPUÉS
  de `ds/scene.css` — con la misma especificidad (0,2,0) gana el que va después, así que el bisel
  volvía. Se arregla igualando el selector a `.device[data-device="ipad"]` (0,3,0), que gana pase lo
  que pase.
- **La notificación, banda ancha de punta a punta.** `.regpush__notif` pasa de tarjeta flotante con
  margen y esquinas a `left:0; right:0; top:0`, sin radio, con un borde inferior — la banda de una
  notificación push real, no un recurso `.res-pill`. Lleva su toque, `.regpush__tap`: un círculo que
  nace donde caería el dedo y crece hasta cubrir la banda mientras se apaga. Y su transición:
  `.regpush__screen` (la plantilla) ya NO está puesta detrás desde el segundo cero — entra con un
  fundido y una pequeña subida justo cuando la notificación se ha ido, así que se lee como una
  pantalla que se ABRE, no como un elemento que ya estaba ahí tapado.
- **Animación propia para los controles, `.regchk`.** Nada de `app-elige`/`app-ok-in`/`app-firma-in`
  (los botones OK/KO de la home, sin tocar). Cada control es un punto —vacío, con su borde— que se
  llena de color con un rebote de escala y dibuja su marca dentro, check o cruz según `--c`; una barra
  de progreso (`.regprog`, steps, sube un escalón por control) acompaña. Tres piezas nuevas que no
  existían antes de hoy: `regchk-pop`, `regchk-icon`, `regprog-fill`.
- **Mari Mar.** Los dos sitios donde decía Javier en esta página —los únicos: no aparecía en ningún
  otro sitio de `/gestion-de-activos/`— pasan a Mari Mar: la fecha de cabecera y la firma.

> ### ⚠️ TRAMPA DE TOKENS, LA QUINTA VEZ: `.regpush__notif` VIVÍA FUERA DE `.app`
> A propósito —tiene que tapar la barra superior de la app al caer—, pero sin entrar en el selector
> que declara `--app-blue`, `--app-line`, etc. (`ds/app.css`), esas variables no existían ahí y
> `background:var(--app-blue)` era una declaración inválida: el icono de la notificación y el círculo
> del toque salían transparentes, y el texto se leía con el color heredado en vez del suyo. Comprobado
> con `javascript_tool` (`getComputedStyle(...).backgroundColor` daba `rgba(0,0,0,0)`), no sólo con la
> captura, que a esa densidad no lo delataba. Se arregla añadiendo `.regpush__notif` al selector de
> `ds/app.css` que ya lleva `.bridge`, `.app__conv` y compañía — **si una pieza de producto no cuelga
> de `.app`, entra ahí**, van cinco veces que este patrón muerde en este repositorio.

`ds/scene.css` sube a `?v=20260929h` y `ds/app.css` a `?v=20260929a`, en las 80 y 48 páginas españolas
que los cargan respectivamente. `check:seo` (831 HTML, ✔ sin fallos) y `check:voz` (esta página, ✔)
pasan. Verificado en el navegador: el estado inicial (sin bisel, sin responder), la notificación en
banda ancha, el relleno con `.regchk` control a control, y la firma final de Mari Mar, con capturas
reales de los cuatro momentos y medición de `scrollHeight`/`clientHeight` antes de dar el ajuste por
bueno.

**Pendiente:** ninguna cadena nueva de esta vuelta está traducida (Mari Mar, los rótulos de
`.regpush__notif`) — se suma al mismo hueco pendiente de las escenas anteriores de este historial.

## Estado a 29 septiembre 2026 (7) — la música de los cuatro vídeos, mucho más baja; Patatas Aguilar v2, con más contenido de José

Dos correcciones del cliente sobre el estado (5) de hoy, seguidas.

**La música sonaba demasiado alta.** El `loudnorm=I=-28` de la mezcla original se dejó con un
`volume=-12dB` extra encadenado detrás —mismo lecho, mismo fundido 1,6 s/3,2 s, misma mezcla
`amix=normalize=0` y el `alimiter` de seguridad al final—, en los cuatro vídeos. **Comprobado a
medias, y conviene saberlo:** el `volumedetect` de la intro (sin diálogo) apenas bajó 2 dB con el
recorte de -12 dB puesto, no los -12 dB que cabría esperar. La razón no es un fallo del filtro —en
aislado, `loudnorm` + `volume=-12dB` sobre la pista sola sí da exactamente -12 dB de diferencia—: es
que **los másteres de Carnavi, Panificadora Alcalá y Prilux no tienen la intro en silencio digital**,
tienen ya de por sí un `mean_volume` de -29,6 dB en esos tres segundos (comprobado contra el vídeo sin
música) — ruido de sala o de compresión que estaba ahí desde el primer render, en agosto. Con la
música tan baja, lo que se mide ahora es sobre todo ese ruido de fondo, no la pista: la música quedó,
si acaso, por debajo del suelo de ruido del propio vídeo. Es la lectura más prudente posible de «mucho
más baja» sin poder escucharlo, pero **si al oído sigue sobrando presencia, o si ahora no se nota nada
en absoluto, el número a tocar es el mismo de siempre: el `volume=-12dB` de la mezcla, sin rehacer
nada más**.

**A Patatas Aguilar v2 se le añaden dos ideas más de José, sin recortar la del cierre.** Petición
literal: dejar la frase de «nos ha cambiado la vida» entera —ya lo estaba, no se tocó— y meter algo
más si parecía interesante. Se añadieron dos, ambas del cuerpo del webinar, ninguna de la v1:

- **La facilidad de uso entre generaciones**: «Es muy usable, muy fácil, muy amigable… que ya tiene a
  lo mejor 50, 60 años, incluso ellos, de verdad que les resulta muy fácil trabajar con la
  aplicación.» Encaja justo después de la reacción de los auditores, reforzando la idea de adopción.
- **El modelo de precio, sin coste por cambio**: «Es tipo Netflix… tú pides añadir, quitar, modificar
  algo y no te cobran… No pagas, te cobran la cuota que pagas mensualmente, pero no hay un coste
  luego.» Es el único argumento de negocio del vídeo que no está en ningún otro caso publicado.

El vídeo sube de 1:44 a **2:11**, dentro de la familia de los otros tres (2:04–2:39).
`casos-de-exito/patatas-aguilar/index.html` (`.gate__dur`, JSON-LD `duration`, ahora `PT2M11S`) y la
tarjeta del índice (`.vcase__dur`) se actualizan; la descripción no cambia, porque ya contaba el vídeo
sin necesitar las dos cosas nuevas para ser cierta. `npm run build:i18n` propaga la duración a los
cinco idiomas. `check:seo` (831 HTML, ✔ sin fallos) y `check:voz` (55 páginas, ✔) pasan.

> **El mismo verificador de límites de palabra de la sesión anterior se pasó sobre los dos cortes
> nuevos antes de tocar nada**, y los dos salieron limpios a la primera —a diferencia de los cuatro
> de la v1 que se encontraron entonces—. Las cifras de los cuatro cortes nuevos (`467.96–474.30`,
> `486.55–493.91`, `808.35–817.98`, `857.92–862.38`) ya están medidas sobre huecos de silencio reales
> entre palabras, no hace falta volver a comprobarlas si no se tocan.

## Estado a 29 septiembre 2026 (6) — «El preventivo…», tercera vuelta: fuera la esquina, entra la notificación y la plantilla con sus controles

Petición del cliente sobre la misma escena del estado (4): el diálogo de planificación seguía **«muy
esquinado» en la esquina inferior derecha** (`data-crop="res-br"`, la familia de encuadre que ancla
ahí a propósito para los recursos flotantes tipo `.res`, pero que aquí no tocaba). Pidió centrarla,
poner una **notificación cayendo desde arriba, como la de cualquier app de mensajería**, y a
continuación **la plantilla de registros real, con sus datos y varios controles por rellenar**.

**Se retira `.planalt` de esta escena entera** (el diálogo «Planificar registro» con Activo,
Responsable, Fecha y Hora) y entra `.regpush`, componente nuevo en `ds/scene.css`:

- **Centrado de verdad.** `data-crop="b"` en vez de `res-br`: la caja pasa de fija-y-anclada-a-una-
  esquina a proporcional al contenedor, con el `.device` centrado dentro por flex. `--suelto` porque
  el `.device` trae su propio marco —un panel detrás habría sido la «pantalla de fondo sin forma» que
  la regla del 9 de septiembre prohíbe—.
- **La notificación cae con rebote, se lee, se toca y se va** —`.regpush__notif`, la misma física que
  ya usa `.docpush__push` en `/gestor-documental/` (cubic-bezier con overshoot, tres tiempos), reescrita
  aquí con clases propias para no cargar `ds/documentos.css` entera por una pieza—. Dice «Registros» /
  «Control de mantenimiento · Cinta transportadora L3», sobre un iPad —«la tablet de línea, la ronda
  de calidad firmada in situ», que es literalmente esta escena (`ds/device.css`)—.
- **Detrás, la plantilla real.** No una pantalla nueva: es `.app__rec`/`.app__items`/`.app__opt` de
  `ds/app.css`, el mismo componente ya verificado que usa la home en «Realiza tus registros en
  digital…». Cinco controles propios de un preventivo de cinta transportadora —Estado de la junta,
  Tensión de la cinta, Nivel de lubricante, Rodamientos sin ruido, Alineación de rodillos—, con **el
  primero en KO enganchado a `UTD26_163_001`**, la fuga de aceite que ya sale en el resto de esta
  página: es el mismo control el que la detecta, dato coherente con la ficha de arriba y con la
  escena del QR. El relleno se retima con `animation-delay` propio (2,4 s de más, el tiempo que tarda
  la notificación en irse) sobre los MISMOS fotogramas compartidos (`app-elige`, `app-ok-in`,
  `app-firma-in`), sin tocar ni un valor de los que ya usa la home.

> **Y el mismo bug de siempre, la tercera vez en esta página en dos días:** cinco controles reales no
> caben en la pantalla de un iPad al tamaño con el que arrancó la pieza —pedía 314px de alto y sólo
> había 262—, y luego 281 contra 220. `.device__screen` recorta con `overflow:hidden`: la mitad de
> abajo de la plantilla desaparecía sin un error en consola. Se resuelve por los dos lados a la vez
> —se ensancha el aparato (240px → 452px, que es casi todo el ancho de la tarjeta) y se aprieta la
> fila (`.regpush .app__rec/.app__item/.app__rechead`, scoped, sin tocar la plantilla de la home)—,
> comprobado con `javascript_tool` midiendo `scrollHeight` contra `clientHeight` antes de dar el
> tamaño por bueno, no sólo mirando la captura.

`ds/scene.css` sube a `?v=20260929d` en las 80 páginas españolas que lo carga. `check:seo` (831 HTML,
✔ sin fallos) y `check:voz` (esta página, ✔) pasan. Verificado en el navegador: el estado inicial sin
responder, la notificación cayendo, y el registro relleno y firmado, con capturas reales de los tres
momentos.

**Pendiente:** ninguna de las cinco cadenas nuevas de esta escena está traducida (título de la escena,
«Registros», «Control de mantenimiento · Cinta transportadora L3», los cinco controles, «Estado» del
`.app__sign`) — se suma al mismo hueco ya pendiente de las escenas (3) y (5) de este historial. El
diálogo «Planificar registro» con sus cuatro campos se retira de esta página, pero sigue en git.

## Estado a 29 septiembre 2026 (6) — el QR de «El aviso se abre…», tercera vuelta: sin bisel y con scroll

Petición del cliente sobre la misma escena del estado (3), más abajo: el mockup del móvil se cortaba,
no hacía falta el borde del aparato —lo importante es que se lea bien la pantalla—, y una vez se
enseña el móvil convenía un poco de scroll para ver cómo se ven los datos. También: el QR de leer
tenía que ser más grande, y toda la pieza tenía que llenar mejor el espacio.

**El corte tenía causa y estaba medida.** `.qrficha` fijaba su alto en 290px —lo que medía el acto A
(el QR)—, y el acto B (el `.device` de iPhone, 192px de ancho, 394px de alto con bisel e isla) se
centraba dentro de esa caja más corta: 52px de aparato quedaban por ENCIMA del borde superior de
`.scene__media`, que es quien recorta con `overflow:hidden`. Comprobado con `javascript_tool` contra
el DOM real (`getBoundingClientRect` de la caja y del aparato, no sólo la captura): el aparato perdía
su bisel de arriba, la isla dinámica y el principio de la barra «Activos».

**Se retira `.device` de esta escena** (sigue en `ds/device.css`, en uso en el resto del sitio) y
entra `.qrficha__screen`: una pantalla suelta sin bisel, que reutiliza `.app`/`.app--movil`/
`.app--ficha` tal cual, sin marcado nuevo para la app. Sin los ~50px de bisel e isla que pagaba el
`.device`, la pantalla crece: 236×400px, más grande que antes. **Nació con sombra propia** —mismo
criterio que las tarjetas `.res`—, y **se le quitó en la vuelta siguiente, el mismo 29 de
septiembre**, a petición del cliente: se apoya en el lienzo teñido en vez de despegarse de él.

**Y el titular pasó de contar el gesto a contar la capacidad**, también el mismo día: «El aviso se
abre delante de la máquina, escaneando su código con el móvil» → **«Escanea cada máquina y visualiza
todo el histórico de actividad»**. Ninguna otra pieza de la escena cambió.

**Los dos actos pasan a ir centrados en vertical sobre el mismo alto fijo** (`.qrficha`, 440px) — el
mismo arreglo que ya se le hizo a `.planalt` en el estado (4)—: ninguno de los dos deja hueco vacío ni
se sale del recorte. Comprobado: el acto B mide 400px dentro de una caja de 440, 20px de aire arriba y
abajo, sin clip.

**El scroll enseña dos incidencias más.** La ficha grande de arriba en esta misma fila ya dice
«Incidencias: 3» y aquí sólo había una escrita. `.qrficha__scrollin` —la cabecera y la lista dentro de
un visor de alto fijo con `overflow:hidden`— se desplaza 116px a media vida del acto B, medidos contra
el alto real del contenido (457px de contenido menos 341px de visor, comprobado con
`javascript_tool`, no puesto a ojo), y vuelve a subir antes de que el acto se apague. Las dos
incidencias nuevas —**UTD26_168_001 · Desalineación de la banda transportadora · Alta · 14/05/2026** y
**UTD26_171_001 · Ruido anómalo en el rodillo motriz · Media · 02/04/2026**— son plausibles, no
comprobadas, mismo criterio que el resto de datos «a petición expresa» de esta página; los códigos se
comprobaron contra todo el sitio para que no choquen con ninguno ya usado (UTD26_151_001, por
ejemplo, ya es de otra incidencia en `/no-conformidades/`).

**El QR crece de 76 a 132px** —y con él sus esquinas, su mira y el check de «leído»—, era el elemento
más pequeño de las cuatro escenas de la fila y se perdía dentro de la tarjeta.

`ds/scene.css` sube a `?v=20260929f` en las 80 páginas españolas que lo carga (dos bumps seguidos el
mismo día: `e` por el retoque de arriba, `f` por quitar la sombra). `check:seo` (831 HTML, ✔ sin
fallos) y `check:voz` (55 páginas, ✔) pasan. **3 cadenas nuevas** traducidas a mano en
`i18n/traducciones/05-acciones-activos.json` —las dos incidencias más el titular nuevo—; el catálogo
queda en 1.553 cadenas, con el mismo hueco previo de siempre sin traducir en los cinco idiomas.
Verificado en el navegador con `javascript_tool` forzando cada acto a opacidad 1 por turno, no sólo el
primer fotograma: el QR grande, la pantalla sin bisel ni sombra, el titular nuevo y el scroll
revelando las tres incidencias sin cortarse ni dejar hueco en blanco al final.

> **Y otra vez la misma trampa de sesiones en paralelo:** mientras se trabajaba esta escena, la del
> estado (4) —«El preventivo, programado y asociado a su activo»— se editó desde fuera y su titular y
> su animación cambiaron a «El preventivo avisa a tiempo y se rellena control a control». No se ha
> tocado ni revisado: es de otra sesión, y esta entrada sólo dice de qué escena se ocupó.

## Estado a 29 septiembre 2026 (5) — Patatas Aguilar v2, logo actual y música en los cuatro vídeos de caso

Petición del cliente sobre el caso de Patatas Aguilar del estado (2) de hoy: poner el logo actual del
cliente (el que ya tenía en el ordenador, no el de `assets/clients-color/`), poner música de fondo en
los **cuatro** vídeos de caso para que se sientan más dinámicos, y en el de Patatas Aguilar montar una
**versión 2** con un hilo conductor más claro —contexto primero, avance después—.

**El logo de Patatas Aguilar cambió de marca, no sólo de fichero.** El que se usó en la sesión de hoy
(`assets/clients-color/patatas-aguilar.webp`, el de la flor verde y «la vía natural») es el antiguo.
El actual, encontrado en `~/Descargas/Logo cliente (1)/Patatas Aguilar Logo.png` —y repetido, byte a
byte (mismo MD5), en otras tres copias del disco—, es un wordmark minimalista, «aguilar» en minúscula,
sin icono ni eslogan, servido en blanco para fondo oscuro. Se recortó a su caja de tinta, se recoloreó
a `#0B1B33` —el mismo tono que ya usan `.person`/`.cta-title` en `cards/card.css`, así no se inventa un
color nuevo— y se ajustó de ancho (no de alto: el wordmark es mucho más ancho y bajo que los logos con
icono de Carnavi/Panificadora/Prilux, así que iguala su ANCHO de tinta al de Prilux, el más parecido en
proporción, en vez de su alto, que lo habría disparado fuera del lienzo de la cartela). Se regeneraron
`cards/patatas_aguilar_intro.png` y `_outro.png` con `cards/gen_cards.py`, y se hizo lo mismo con
`assets/testimonios/logo-patatas-aguilar.webp` (357×112, antes 178×112) para que la tarjeta del índice
no desentone con el vídeo. **No se ha tocado `assets/clients-color/patatas-aguilar.webp`** ni la cinta
de logos de clientes de la home: llevan el logo antiguo y siguen así hasta que se decida actualizarlos
también, que es un cambio de más alcance y no lo pidió esta sesión.

**Música: la biblioteca de `assets/incidencias/musica/` ya tenía licencia comprobada y sirvió sin
descargar nada nuevo.** `technology-corporate.mp3` (Pixabay Content License, uso comercial libre, sin
atribución), la misma familia que ya usa el reel de incidencias. Con los cuatro vídeos siendo entrevista
casi de principio a fin —a diferencia del reel, que es producto sin diálogo—, el `sidechaincompress` que
parecía la solución obvia resultó inútil: con el umbral bajo suficiente para no perderse ninguna
palabra, el compresor está prácticamente todo el vídeo activado y la música desaparece del todo bajo
el diálogo (comprobado con `volumedetect`: la diferencia entre con y sin música durante el habla era de
0,1–0,3 dB, inaudible). Se sustituyó por un lecho de volumen **fijo**: `loudnorm=I=-28:TP=-3:LRA=4`,
fundido de entrada 1,6 s y de salida 3,2 s —mismas cifras que ya fijó la nota de `musica/FUENTES.md`
para el reel—, mezclado con `amix=normalize=0` (si no, `amix` divide el volumen de los dos canales a la
mitad y la voz pierde presencia) y un `alimiter` de seguridad al final. Con la música en bucle
(`-stream_loop -1`) porque la pista (2:17) es más corta que Panificadora Alcalá (2:39).

> **Con qué se comprobó, y con qué no.** No hay forma de escuchar el resultado en esta sesión: el
> balance se validó midiendo `mean_volume`/`max_volume` con `ffmpeg -af volumedetect` en la intro (sin
> voz, música sola: -27 dB) y en tramos de diálogo (con música puesta, la diferencia frente al original
> sin música es de apenas ~1 dB), no de oído. **Conviene que alguien lo escuche antes de darlo por
> bueno** — si la música se nota demasiado o demasiado poco bajo la voz, el número a tocar es el
> `I=-28` de `loudnorm`, un valor por vídeo, sin volver a montar nada de lo demás.

**Carnavi, Panificadora Alcalá y Prilux: la música se añadió sin volver a cortar ni a transcribir.**
Los tres ya estaban montados y publicados; en vez de rehacer el pipeline completo (que para Carnavi
habría exigido volver a transcribir el webinar entero: `carnavi_words.json` no sobrevivió a una
limpieza de `work/`), se tomó el máster 1080p de cada uno —`~/Vídeos/casos-exito-solved/*.mp4` para
Carnavi y Panificadora Alcalá, `_montaje/out/Caso-de-exito-Prilux-Solved.mp4` para Prilux, todos con
sus cortes, subtítulos y cartelas ya quemados— y se les mezcló el audio por encima, sin tocar el vídeo
(`-c:v copy`). Se regeneró el 720p de los tres con el mismo `scale=1280:720`, `crf 24`, `+faststart` de
siempre y se sustituyeron en `assets/casos/`. **Ni las cartelas ni los logos de estos tres se han
tocado**: el pedido del logo actual era de Patatas Aguilar, comprobado por MD5 contra el resto del
disco; para los otros tres no hay ninguna señal de que su logo haya cambiado.

> **Detalle que casi se cuela: cuatro cortes de la v1 de Patatas Aguilar empezaban a mitad de palabra.**
> Al montar la v2 se escribió un verificador (`s < a < e` contra `aguilar_words.json`, para cada
> límite de cada corte del EDL) que no existía cuando se hizo la v1 esta misma mañana, y encontró
> cuatro límites de corte que caían dentro del intervalo `[s,e]` de una palabra en vez de en el hueco
> de silencio entre dos —el corte 2 arrancaba a mitad de «fotos,», el 4 a mitad de «eso,», y dos más
> en la sección de precios—. El efecto es un audio que empieza con un fragmento de sílaba suelto,
> fácil de no notar sin escuchar con atención. **La v1 sigue teniendo estos cuatro cortes así** — no
> se ha tocado, sólo se sustituyó por la v2 en `assets/casos/`, así que el archivo con el fallo ya no
> está publicado, pero conviene saber que el verificador es nuevo y que si se retoca cualquier EDL de
> los otros tres vídeos, este script (queda sin guardar en ningún fichero, hay que rehacerlo) merece
> pasarse antes de renderizar.

**La v2 de Patatas Aguilar no es un recorte distinto al azar: usa el resumen que el propio José da a
mitad del webinar.** Sobre el minuto 16, el anfitrión le pide explícitamente «un resumen rápido del
camino: cómo trabajabais antes, por qué os decidisteis por Solved… y qué habéis conseguido desde
entonces» — y José responde en ese orden exacto. La v1 (estado (2) de hoy) tiraba de catorce momentos
sueltos de todo el webinar sin ese hilo; la v2 se apoya en ese resumen para la mitad de «avance» del
vídeo, cosido a la apertura de contexto que ya tenía la v1 (el checklist mensual en Excel, paseando la
planta) con un pivote explícito y literal — **«En nosotros, en 2024 empezamos con Solved»** — en vez de
dar el salto sin avisar. Estructura final, 1:44 (frente a los 2:05 de la v1):

| Bloque | Contenido | Fuente |
|---|---|---|
| Contexto | El checklist mensual, antes: Excel, fotos, pasear la planta | v1, sin cambios |
| Pivote | «En 2024 empezamos con Solved» | resumen, min. 16:15 |
| Avance | Implantación sencilla → papel fuera → tiempo para lo importante → de dos registros a todo centralizado | resumen, min. 16:15–18:45 |
| Prueba | Los auditores «alucinan» con lo rápido que se encuentra todo | resumen, min. 19:02 |
| Cierre | «Nos ha cambiado la vida» | v1, minuto 6 del webinar, reubicado al final |

Se recorta la mitad central del resumen —una lista repetitiva de «y que si la evidencia, y que si el
registro, y que si esto, y que si escanea»— que no aporta nada nuevo a lo ya dicho; el resto del
resumen se conserva casi íntegro. `cfg_patatas_aguilar_v2.json`, mismo `crop`, mismo `grade`, mismas
cartelas (ya con el logo actual). El vídeo publicado en `assets/casos/caso-patatas-aguilar.mp4` **es
la v2**: la v1 queda en `~/Vídeos/casos-exito-solved/_montaje/out/Caso-de-exito-Patatas-Aguilar-Solved.mp4`
para comparar, pero no está enlazada desde ningún sitio del repositorio.

`ds/gate.css` no cambia de versión otra vez —la subida a `?v=20260929a` de esta misma sesión ya cubre
el cambio de rejilla—. La duración del vídeo baja a **1:44** en `casos-de-exito/patatas-aguilar/index.html`
(`.gate__dur` y el JSON-LD `duration`, de `PT2M5S` a `PT1M44S`) y en la tarjeta del índice
(`.vcase__dur`); la descripción del `VideoObject` no cambió porque ya describía el contenido en el
orden de la v2 sin que hiciera falta tocar una palabra. `npm run build:i18n` propaga la duración nueva
a los cinco idiomas —no hace falta traducir nada, «1:44» no lleva letras y el extractor lo deja fuera
del catálogo, comprobado contra `i18n/es.json`—. `check:seo` (831 HTML, ✔ sin fallos) y `check:voz`
(55 páginas, ✔) pasan.

**Pendiente, y es lo único que falta para dar esto por cerrado del todo:** que alguien escuche los
cuatro vídeos con música puesta. El balance se afinó a base de medir niveles, no de oído, y es la
primera vez que este repositorio publica vídeo con audio de fondo — si conviene subirla o bajarla,
el único número que hay que tocar es el `I=-28` del `loudnorm` de cada mezcla, sin rehacer cortes ni
cartelas.

## Estado a 29 septiembre 2026 (4) — «El preventivo, programado…»: primero el aviso, después la plantilla

Petición del cliente sobre la escena de Registros de esta misma página: la animación no llenaba bien
la tarjeta y pidió que se viera primero **una notificación** de que el preventivo ya quedó agendado
—«Registro planificado para el activo X: máquina x, hoy a las 09:00am»— y sólo después la plantilla
con sus campos.

**El acto A deja de ser la biblioteca** («Selecciona una plantilla para planificar») y pasa a ser el
aviso, con la misma tarjeta `.res` de icono + título + subtítulo que ya usaba (sólo cambia el
contenido): «Registro planificado» / «TRA-003 · Cinta L3 · hoy · 09:00». El acto B sigue siendo el
diálogo real «Planificar registro» —comprobado en `demo.trysolved.com/checklist` el 28 de
septiembre— con sus cuatro campos (Activo, Responsable, Fecha, Hora); **Fecha pasa de la cifra
verificada 08/06/2026 a «Hoy» y Hora de 10:00 a 09:00**, para que el diálogo cuente la misma cita que
el aviso de arriba y no una distinta.

**Lo de «que rellene mejor la sección» era el hueco vacío del acto A.** `.planalt` fija su alto en
252px porque el acto B, más alto, es quien lo mide; el acto A, más corto y anclado arriba, dejaba un
tercio de la tarjeta en blanco mientras se enseñaba. Los dos actos pasan a ir **absolutos y
centrados en vertical** (`justify-content:center`) sobre ese mismo alto fijo: cada uno llena la caja
por igual, sin depender de cuál mide más. El acto A además centra en horizontal para que la tarjeta
del aviso no se estire a los 340px del recorte `res`; el acto B se queda con el `stretch` por
defecto, que es lo que ya hacía que su `.res` ocupara el ancho entero.

`ds/scene.css` sube a `?v=20260929c` en las 80 páginas españolas que lo carga. `check:seo` (831 HTML,
✔ sin fallos) y `check:voz` (55 páginas, ✔) pasan. Verificado en el navegador con capturas reales de
los dos actos.

**Pendiente:** «Registro planificado» y «TRA-003 · Cinta L3 · hoy · 09:00» son dos cadenas nuevas sin
traducir (catálogo: 1.550, 191 sin traducir en los cinco idiomas) — entran en el mismo hueco ya
pendiente del diálogo «Planificar registro» completo, sin traducir desde el 28 de septiembre.

## Estado a 29 septiembre 2026 (3) — el QR de «El aviso se abre…», segunda vuelta: el móvil con la ficha real

El cliente vio el visor de cámara de la entrada de más abajo («las tres escenas… corregidas») y pidió
otra cosa: **no quedaba bien.** Lo que pedía era más simple y a la vez enseña más: un QR marcado como
leído y, a continuación, **la ficha del activo en el móvil**, con su foto, su código y sus
incidencias relacionadas.

**Se retira `.qrscan-phone` entero** (el visor de cámara con disparador y linterna) y con él la idea
de enmarcar el QR en un aparato inventado. Se queda `.qrscan` —la mira que barre una vez por reloj de
8 s, sin tocar— y se le añade `.qrscan__ok`: un check verde que nace justo cuando la mira se apaga,
bajo el texto «Código leído · TRA-003».

**Y detrás, el `.device` REAL de `ds/device.css`: un iPhone**, que es literalmente para lo que existe
ese componente —«el operario reporta de pie, delante de la máquina»—, con la ficha dentro:
`.app--movil` (la barra superior, el hueco de la isla) + `.app--ficha` (la ficha simplificada de la
composición de portada de esta misma página: foto del activo, breadcrumb, título con el código). Debajo,
**«Incidencias relacionadas»** con una tarjeta —reutiliza `.app__mlist`/`.app__mcard`, el mismo listado
móvil de incidencias de la home— con `UTD26_163_001`, la fuga de aceite de siempre, su prioridad y su
fecha. Nada inventado que no estuviera ya en esta página: es la MISMA ficha simplificada y el MISMO
listado móvil, sólo que juntos, dentro de un aparato, después de leer el QR.

Nuevo componente `.qrficha` (`ds/scene.css`): el mismo cruce de opacidad de dos actos que `.planalt`
—mismo reloj de 8 s, mismos fotogramas `planalt-a`/`planalt-b`, reutilizados tal cual—, pero en su
propio espacio de nombres porque su caja mide distinto: el acto B aquí es un iPhone, bastante más
alto que el diálogo de `.planalt`, y compartir el mismo `min-height` habría dejado a uno de los dos
mal medido — es la lección de la entrada de más abajo, aplicada desde el principio esta vez.

> **Y aun así costó una vuelta:** el `.device` mide su alto por `aspect-ratio` a partir de su ANCHO —a
> 150px de ancho la pantalla del iPhone da 285px de alto, y la ficha entera (foto, breadcrumb, título,
> «Incidencias relacionadas» y la tarjeta) mide 376px. `.device__screen` recorta con
> `overflow:hidden`, así que la tarjeta de la incidencia desaparecía sin un error en consola —**otra
> vez el mismo patrón: una caja fija más pequeña que su contenido**—. Se resuelve por el lado que toca
> aquí: no se encoge el contenido, se ensancha el aparato (150px → 192px), que es lo que de paso le da
> más aire a la descripción para no partirse en demasiadas líneas en una columna tan estrecha.
> Comprobado con `javascript_tool` midiendo `scrollHeight` contra `clientHeight` del `.device__screen`
> antes de dar el ajuste por bueno, no sólo mirando la captura.

`ds/scene.css` sube a `?v=20260929b` en las 80 páginas españolas que lo carga. `check:seo` (831 HTML,
✔ sin fallos) y `check:voz` (esta página, ✔) pasan. Verificado en el navegador, los dos actos, con
capturas reales.

## Estado a 29 septiembre 2026 (2) — cuarto caso en vídeo: Patatas Aguilar

Petición del cliente: un caso en vídeo como Carnavi, Panificadora Alcalá y Prilux, esta vez a partir
del webinar «El reto de la digitalización en la industria agroalimentaria — El caso de éxito de
Patatas Aguilar», grabado hoy (Iñigo Robles, CEO de Solved, entrevistando a Jose Vicente Doria,
director de Calidad y Medioambiente de Patatas Aguilar). **A diferencia de los otros tres, la fuente
no era un highlight ya montado: era la grabación entera del webinar (35 min, Google Meet), como le
pasó a Prilux con su propio webinar.** El pipeline es el mismo de siempre
(`~/Vídeos/casos-exito-solved/_montaje/`): transcripción con `faster-whisper` (modelo medium, 35 min
en unos 27 con esta máquina, más rápido que los 0,4× de la nota de agosto), elección de cortes
(`cfg_patatas_aguilar.json`, 14 EDL sobre timestamps de palabra, `build.py --dry` para revisar el
subtitulado antes de renderizar), cartelas generadas con `cards/gen_cards.py`
(`cards/patatas_aguilar.json`) y render final con crossfades, gradado de color y subtítulos quemados.

- **La cámara no venía recortada de una vista de galería, como en Prilux: era ya un plano completo
  1920×1080 con la etiqueta de nombre de Google Meet quemada abajo a la izquierda.** El `crop` de
  `ds/scene.css` no aplica aquí —esto es el montaje de vídeo, no una escena—; se resolvió con un
  recorte 16:9 centrado al 85 % del ancho (`crop=1632:918:144:0`) que dejaba la etiqueta fuera del
  encuadre sin meter barras negras, y de paso acerca el plano un poco más que el original.
- **La cita que abre el titular no es un dato de producto, es literal: «una hora, o dos» que él mismo
  da como el tiempo de pasear la planta con un Excel para el checklist mensual.** Es el mismo patrón
  de cifra-en-el-titular que exige `check:voz` para las landings de caso (regla `esCaso`, `CIFRA` en
  `scripts/check-voz.mjs`), y aquí sale directo de la transcripción, no inventada.
- **El vídeo de 2:05 tira de catorce fragmentos del webinar completo**, no de un tramo continuo:
  el checklist mensual (antes, en Excel, paseando la planta), el giro a Solved con Power BI, el
  momento más citable del webinar —«estoy enamorado del programa porque nos ha cambiado, nos ha
  cambiado la vida»—, el tamaño real del equipo («en la oficina somos dos»), la facilidad de uso
  entre generaciones, la reacción de sus auditores de IFS («alucina, flipa cómo lo tenemos»), el
  modelo de precio sin coste por cambio («es tipo Netflix») y el cierre («soy un enamorado de
  Solved»). El `replace` de `cfg_patatas_aguilar.json` limpia media docena de tropiezos del habla
  real (una repetición «despacho, despacho» que el propio corte del EDL ya evitaba, un «excel on
  work» que era ruido de transcripción, «es es muy usable» duplicado, «de el trabajo» sin
  contracción) — **ninguna palabra se inventa, sólo se poda lo que sobra entre dos cortes**.
- **El póster es el fotograma del segundo 8 del 720p**, mismo criterio que los otros tres: ahí cae el
  rótulo con el nombre y el cargo, y el subtítulo que lo solapa es el mismo defecto de estilo que ya
  tiene el póster de Prilux — no se ha corregido porque no es un fallo de esta página, es el patrón
  del componente.
- **El 720p pesa más que los otros tres** (24,3 MB frente a los 10–21 MB de Carnavi/Panificadora/
  Prilux) al mismo `crf 24`: el fondo son dos cuadros abstractos con mucho detalle y grano de cámara,
  no una pared lisa, y eso cuesta más bits a igualdad de calidad. Dentro de la familia de tamaños del
  componente, se acepta sin recodificar más agresivo.
- **`.vcase-grid` pasa de tres columnas a dos filas de dos** (`ds/gate.css`, `?v=20260929a` en las
  30 páginas —5 páginas de caso × 6 idiomas— que lo cargan): con tres columnas el
  cuarto caso se quedaba solo en una segunda fila a un tercio de ancho, el mismo hueco que ya obligó
  a pasar de dos a tres columnas el 17 de agosto. El comentario que dejó escrito aquella sesión
  («si algún día hay cuatro, esto habrá que decidirlo otra vez») ya lo avisaba.
- **Las otras tres landings de caso ganan un tercer «Otro caso»** en su lista de enlaces, y el índice
  (`/casos-de-exito/`) sube de tres a cuatro implantaciones en titular, meta, JSON-LD `ItemList` y la
  cuarta tarjeta `.vcase`. **La sección «Lo que cambió en cada planta», más abajo en el índice, no se
  toca**: ya enseñaba sólo dos de los tres casos anteriores (Carnavi y Prilux, nunca Panificadora
  Alcalá) pese a decir «los tres casos» en su párrafo — es una cojera previa a esta sesión, y
  añadir un cuarto caso sin arreglar la cuenta habría sido peor, no mejor; se deja igual que estaba.
- **Sector del cliente:** «Manipulado de patata» en el eyebrow, no «Alimentación» a secas —el resto
  de eyebrows de caso son de sub-sector (Prilux «Iluminación», Carnavi «Industria cárnica»), no de
  categoría amplia—. El cargo real de Jose Vicente Doria, «director de Calidad y Medioambiente», sale
  de la propia landing del webinar en `web solved 2.0` (`blog/webinar-patatas-aguilar/`), que llevaba
  semanas publicada con el JSON-LD `Event` y los dos ponentes ya confirmados.
- **22 cadenas nuevas**, traducidas a mano en `i18n/traducciones/22-patatas-aguilar.json` —incluye,
  como en Prilux, las descripciones del `VideoObject` en JSON-LD, que el extractor sí recorre—.
  «Patatas Aguilar» entra en `00-invariables.json` como intraducible (`=`), igual que los otros tres
  nombres de cliente. El catálogo pasa de 1.337 a 1.359 cadenas traducidas de 1.547; **el hueco de
  188 que queda sin traducir es previo a esta sesión y no es de aquí** (comprobado con
  `i18n:extract`: el recuento no cambia antes/después de esta tanda salvo por las 22 propias).
- Alta en `STATIC_PAGES` (`scripts/config.mjs`) y en `RUTAS`/`PAGINAS_CATALOGO`
  (`i18n/config.mjs`, slug sin traducir en los cinco idiomas, como manda la regla de marca del
  glosario). `build:i18n` genera las cinco páginas traducidas —en español, salvo las 22 cadenas
  propias— y `build:sitemap` sube el sitemap a 488 URLs. `check:seo` (831 HTML, ✔ sin fallos) y
  `check:voz` (55 páginas, ✔) pasan. Comprobado en el navegador con `npm run serve`: el gate, el
  póster, la tarjeta del índice a 2×2 y las cinco versiones de idioma responden con 200.

**Material fuente:** `~/Descargas/Webinar_ El caso de éxito de Patatas Aguilar - 2026_09_29 10_36
CEST - Recording.mp4` (35 min, sin editar, Google Meet). Transcripción completa en
`~/Vídeos/casos-exito-solved/_montaje/work/aguilar/aguilar_full.json` (palabra a palabra) y
`.txt` (legible). Configuración del montaje en `cfg_patatas_aguilar.json` y `cards/patatas_aguilar.json`.

## Estado a 29 septiembre 2026 — las tres escenas de «La ficha del equipo», corregidas y con su gesto ampliado

Petición del cliente sobre las tres escenas del estado (5) de ayer: corregir las animaciones y
llevar el gesto un paso más allá en cada una.

- **Incidencia — se lee el QR CON LA CÁMARA DE UN MÓVIL.** El `.qrscan` de ayer (el QR con la mira
  animada) entra ahora dentro de `.qrscan-phone`, un visor de cámara genérico —disparador y
  linterna, ni una palabra, misma regla que el aparato fotografiado en la composición de portada de
  esta misma página—. No es un `.device` de `ds/device.css`: ese componente maqueta la app dentro
  del aparato, y aquí lo que se enseña es la cámara mirando un papel. Debajo sigue el mismo `.res`
  de siempre, rellenándose fila a fila (Activo, Detectada, Prioridad): el registro de esa máquina
  que pedía el cliente.
  > **Retirado el mismo día** (ver el estado (3), más arriba): «no quedaba bien». Entra `.qrficha` —
  > el QR con su check de leído y, detrás, el `.device` de iPhone de verdad con la ficha del activo
  > dentro—. Esta entrada se deja escrita por el resto del gesto ampliado (registro y acción), que
  > sigue en pie.
- **Registro — el preventivo, asociado a un activo y con sus campos.** El diálogo real «Planificar
  registro» sólo lleva fecha y hora (comprobado el 28 de septiembre); se añaden **Activo** y
  **Responsable** —a petición expresa, sin comprobar en la aplicación, mismo criterio que el campo
  Activo de la escena de acción— para que el registro se vea enganchado a la máquina y con los
  campos propios de un preventivo. Responsable es **Javier**, que es quien firma los registros en
  el resto del sitio.
- **Acción — se ve ASIGNAR, no sólo el resultado ya puesto.** Sustituye el `.res__rows--fill` de
  cuatro filas por el panel real `.app__asigna` (`ds/app.css`) que ya usa `/incidencias/` para
  «Asigna tareas a cualquier persona del equipo»: mismo desplegable con los cuatro departamentos
  (Ana·Calidad, Pablo·Mantenimiento, Marta·Producción, Sergio·Almacén) y los mismos avatares, así
  que ahora se ve CÓMO se asigna a cualquiera, no sólo a quién se asignó. Se añaden **Resultado**
  —campo real de `/actions/create`, aquí hace de nota de cierre, que es lo más parecido que tiene el
  formulario a un comentario— y **Estado**, que sigue con su cruce «En curso» → «Cerrada»
  (`.res__swap`, reutilizado sin tocar, sobre su propio reloj de 8 s dentro de un panel que corre a
  12 s — desajuste menor y consciente, para no tocar los fotogrames compartidos con
  `/incidencias/`). El código de la cabecera pasa de la incidencia al **activo** (TRA-003).

> ### ⚠️ BUG DE ESTA SESIÓN, ARREGLADO ANTES DE COMMITEAR: el diálogo de preventivo se recortaba
> entero. Añadir Activo y Responsable subió el acto B (el diálogo) de 96 a 248px, y **el acto B es
> `position:absolute; inset:0`: no hace crecer la caja**, que la sigue midiendo sólo el acto A (en
> flujo normal). Con `overflow:hidden` en `.scene__media`, todo lo que pasaba de 96px —fecha, hora,
> el botón, y en el primer intento hasta el título— desaparecía sin un solo error en consola.
> Comprobado con `javascript_tool` contra el DOM real (offsetHeight de cada act, no sólo la
> captura) y arreglado con `min-height:252px` en `.planalt`. **Si se vuelve a tocar el contenido de
> cualquiera de los dos actos, hay que volver a medir el otro**: es la quinta vez que este patrón
> —una caja que no crece con su contenido absoluto— muerde en este repositorio.

`ds/scene.css` sube a `?v=20260929a` en las 80 páginas españolas que lo cargan. `ds/app.css` no se
toca: `.app__asigna` ya existía completo. `check:seo` (825 HTML, ✔ sin fallos) y `check:voz` (esta
página, ✔) pasan. Verificado en el navegador con `javascript_tool` y capturas reales, no sólo el
primer fotograma.

**Pendiente:** ninguna de las cinco lenguas está traducida a esta tanda todavía —dos titulares de
escena cambiaron y hay cadenas nuevas en el diálogo del preventivo y en el panel de la acción—;
entra en el próximo `i18n:extract` + `build:i18n`.

## Estado a 28 septiembre 2026 (5) — las tres escenas de «La ficha del equipo», con su gesto real

Petición del cliente, tres mensajes seguidos sobre las tres escenas del estado (3) de hoy: no bastaba
con quitarles la foto, cada una tenía que enseñar el gesto que promete su titular. Las tres se
comprobaron contra `demo.trysolved.com` antes de tocar el marcado.

- **Incidencia — «el aviso se abre… escaneando su código».** Pedido explícito: que se vea leer el QR
  del activo. La mira (`.qrscan`, ya existía) pasa de un bucle continuo a **una sola barrida por
  reloj de 8 s**, y detrás las tres filas del parte (Activo, Detectada, Prioridad) se rellenan una
  detrás de otra con el nuevo componente reutilizable `.res__rows--fill`. La secuencia entera —lee,
  rellena— es la interfaz de la incidencia asociándose al activo, tal como se pidió.
- **Registro — «el preventivo, programado…».** El titular dice programado, no respondido: sale la
  ronda de OK/KO que había (era de la home, no de esta historia) y entra `.planalt`, un cruce de
  opacidad de dos actos sobre el mismo reloj de 8 s, calcado del flujo real de
  `demo.trysolved.com/checklist` **comprobado hoy**: el botón «Planificar para después», el banner
  «Selecciona una plantilla para planificar» con la tarjeta del modelo, y el diálogo real
  «Planificar registro» con sus dos campos, fecha y hora. **08/06/2026 es lunes de verdad** —
  comprobado, no puesto a ojo—.
- **Acción — «la reparación queda con dueño…».** Pedido explícito: que se vea crear la tarea, con el
  activo como campo, asignada a alguien y con fecha de cierre. Se reutiliza `.res__rows--fill` con
  una fila más (`.res__rows--fila`): Activo → Responsable → Fecha de cierre → Estado, y el Estado seguía
  llevando su cruce «En curso» → «Cerrada» del estado (3). **El rótulo pasa de «Vencimiento» a «Fecha
  de cierre»**, que es como se llama el campo en el formulario real `/actions/create` (comprobado hoy:
  Descripción, Fecha de creación, Creador, Responsable, Estado, **Fecha de cierre**, Resultado,
  Archivos).

> ### ⚠️ EL CAMPO «ACTIVO» DE LA ACCIÓN NO ESTÁ COMPROBADO
> El formulario real de creación de una acción en esta empresa de demo **no tiene un campo Activo** —
> comprobado el 28 de septiembre, con «Enlazar con incidencia» abierto: busca incidencias por palabra
> clave, no activos—. Lo que sí es real y está en el código fuente es el mecanismo que lo haría
> posible: `create-incident-from-asset` bloquea y rellena en una incidencia los campos cuyo
> `optionsDynamicId` coincide con el activo, y el propio botón «Crear incidencia» de la ficha de
> `PAL-001` dio el aviso literal **«Ninguna plantilla de incidencia tiene un campo para este tipo de
> activo»** — confirma que la función existe, sólo que ninguna plantilla de esta empresa la usa
> todavía. Se pinta el campo «Activo» en la acción **a petición expresa del cliente**, con el mismo
> criterio que la ficha simplificada de portada (3 de septiembre) y el rotador retirado hoy mismo: es
> plausible y está a un paso de ser real, pero no es una pantalla vista. Si algún día se decide que no
> vale, es una fila de `.res__rows--fill` que se quita.

**Nuevo en `ds/scene.css`:** `.res__rows--fill` (relleno escalonado, reutilizable, con el fallo de
`animation-delay` ya corregido a mano —opacidad puesta en la regla, no sólo en el fotograma 0%—) y
`.planalt` (cruce de dos actos sin `animation-delay`, cada uno con su propio fotograma complementario
del otro). Se retiran las tres reglas `.res .app__items/.app__item/.app__link` del estado (3): ya no
las usa nadie, el `.app__items` de la ronda OK/KO salió de esta página entera. `.qrscan-sweep` cambia
de bucle continuo a una barrida por reloj; `.res__swap` baja de 9 a 8 s para compartir reloj con las
filas que ahora la preceden.

`ds/scene.css` sube a `?v=20260928b` en las 80 páginas españolas que lo carga. `check:seo` (825 HTML,
✔ sin fallos) y `check:voz` (54 páginas, ✔) pasan. Verificado en el navegador con `javascript_tool`
contra el DOM real —no sólo la captura—, comprobando nombre de animación, delay y opacidad de cada
fila en las dos escenas.

## Estado a 28 septiembre 2026 (4) — una sola sección: se retira el rotador de capacidades

Petición del cliente: «no podemos tener tantas secciones y duplicar la info», eligiendo entre «La
ficha del equipo, y todo lo que cuelga de ella» y el rotador «Organiza el árbol de activos, etiqueta
lo que importa y mide qué máquina pide más mantenimiento» que se había montado justo antes (estado
(2), más abajo). Elegido por mí, con el criterio siguiente:

- **«La ficha del equipo» está terminada y no tiene nada pendiente de negocio.** Es la sección
  original de la página (3 de septiembre), reverificada el 28, sin ninguna pieza fantasma.
- **El rotador tenía dos paneles que bloqueaban publicar la página** —el árbol de carpetas y las
  etiquetas de activos, que hoy no existen en la aplicación— y sus otras dos capacidades reales
  (planificación del preventivo, KPI por activo) se solapaban en gran parte con lo que «La ficha del
  equipo» ya cuenta con sus propias escenas de registro y de acción.
- Retirarlo resuelve las dos quejas a la vez: menos secciones y menos duplicado, y de paso desbloquea
  la página (el pendiente sobre el árbol y las etiquetas sale también de la lista de bloqueos).

**Se retira entero:** la sección `<div class="rotador-bloque">` de `gestion-de-activos/index.html`
(el `<h2>Organiza el árbol de activos…</h2>` y sus cuatro paneles), el `<script src="/ds/rotador.js">`
que esta página cargaba solo para eso, y en `ds/app.css` los tres bloques de CSS que sólo servían a
esos paneles: `.app--arbol`, `.app--etq` y `.app__rank*` (el ranking de KPI por activo). No se toca
`ds/sections.css` ni `ds/rotador.js`: el patrón 12 lo sigue usando `/auditorias/`.

**Lo único que se pierde y no está en ningún otro sitio de la página es el panel de KPI por
activo** —el ranking de incidencias por máquina—, aunque el hecho que contaba ya está en la FAQ de
más abajo («¿Se ven indicadores por equipo? Sí…»). Si algún día se quiere sin reabrir el rotador
entero, el marcado y el CSS (`.app__rank`, `.app__rankrow`, `.app__rankbar`, `.app__rankfill`) están
en git, en el commit de esta sesión, listos para injertarse donde se decida.

`ds/app.css` baja de tamaño y sube a `?v=20260928c` en las 48 páginas españolas que lo cargan.
`check:seo` (825 HTML, ✔ sin fallos) pasa.

## Estado a 28 septiembre 2026 (3) — fuera las fotos de «La ficha del equipo»: las tres escenas, animadas

Petición del cliente: las tres escenas con foto de planta de «La ficha del equipo, y todo lo que
cuelga de ella» —incidencia, checklist y acción— pasan a lienzo teñido con una pieza de producto
animada, como el resto del sitio. Y de paso, a petición expresa: **la escena de la incidencia lee el
QR del propio activo**, no sólo cuenta que se lee.

- **Incidencia.** Nuevo componente `.qrscan` (`ds/scene.css`): el mismo SVG del código QR que ya
  usa la ficha de arriba (`/assets/activos/qr-activo.svg` — mismo activo, mismo código, no un dibujo
  nuevo), con una mira animada (`qrscan-sweep`, 1,8 s, `alternate`) en el color del módulo
  (`--res-acento`, que ya gobierna el icono del recurso). Debajo, el mismo `.res` de siempre, sin
  tocar.
- **Checklist.** Reutiliza `.app__items`/`.app__opt` y su animación real —`app-elige` y `app-ok-in`,
  la cascada de OK/KO de la escena de Registros de la home, comprobada en 8 de septiembre—, con dos
  controles propios de esta página: «Fuga o goteo visible» (KO, abre `UTD26_163_001`) y «Nivel de
  aceite» (OK). Cero animación nueva: la pieza ya existía y funciona.
- **Acción.** Único elemento animado nuevo, `.res__swap`: el valor de «Estado» pasa de «En curso» a
  «Cerrada» en un cruce de opacidad de 9 s. El resto de la tarjeta —responsable, vencimiento— no se
  toca: ya cuenta la historia, lo que faltaba era ver el cierre.

> **Trampa de tokens, la de siempre:** `.app__items`/`.app__item`/`.app__link` viven en `ds/app.css`
> declarados contra `.app` (`--app-line`, `--app-text`, `--app-blue`), y aquí cuelgan de `.res`, que
> no es `.app`. Se fija con tres reglas nuevas en `ds/scene.css` (`.res .app__items`, `.res
> .app__item`, `.res .app__link`) que usan los tokens propios de `.res` —`--color-hairline`,
> `--color-ink`, `--color-primary`—, sin tocar la regla compartida que sigue funcionando bien dentro
> de `.app`. Es la quinta vez que este patrón muerde en este repositorio; ver también el aviso del
> estado (2) de hoy sobre `.app__rankbar`/`.app__rankfill` sin `display:block`.

Con movimiento reducido: la mira del QR se queda quieta a mitad de camino, el checklist se queda en
su cascada resuelta (regla ya existente, sin tocar) y la acción se queda en «Cerrada» — el estado que
cuenta la historia entera, misma regla que el resto del sitio.

**Las tres fotos** (`assets/planta/hmi-panel-maquina.webp`, `scada-pantalla-operario.webp`,
`taller-portatil-datos.webp`) dejan de usarse en español; siguen en el repositorio y sólo quedan
referenciadas en los cinco idiomas hasta el próximo `build:i18n`, que las quita solas. Ninguna era
exclusiva de esta página en `assets/planta/FUENTES.md`; comprobar si alguna se queda huérfana del
todo antes de darlas de baja.

`ds/scene.css` sube a `?v=20260928a` en las 80 páginas españolas que lo cargan (bump manual, sin
script de versión). `check:seo` (825 HTML, 482 URLs, ✔ sin fallos) pasa; `check:voz` pasa para esta
página (el único fallo que dio la pasada de hoy es de `gestor-documental/index.html`, ajeno a este
cambio y ya en el árbol antes de esta sesión).

## Estado a 28 septiembre 2026 (2) — rotador de capacidades en `/gestion-de-activos/`: árbol, etiquetas, planificación y KPI por activo

> **Retirado el mismo día** (ver el estado (4) más arriba): el cliente pidió elegir entre esta
> sección y «La ficha del equipo», sin duplicar información ni acumular secciones. Se quedó «La
> ficha del equipo». Entrada dejada escrita porque el marcado y el CSS se recuperan del historial
> de git si algún día hace falta el rotador —o sólo el panel de KPI por activo, que era la única
> pieza real que no duplicaba nada de la otra sección—.

Petición del cliente, justo detrás de la entrada anterior: añadir cuatro capacidades más del módulo
Activos, con sus pantallas, en el mismo patrón que ya usan `/incidencias/` y `/auditorias/` —el
rotador (patrón 12 de `ds/sections.css` + `ds/rotador.js`)—, que esta página no cargaba todavía.
Va justo detrás de «La ficha del equipo, y todo lo que cuelga de ella», dentro de un
`.rotador-bloque` para no abrir hueco de sección.

**Dos capacidades son reales y están comprobadas contra la aplicación el 28 de septiembre:**

- **Planificación del preventivo por activo.** Reutiliza `.app__plan` y `.app__cal` —la misma pieza
  comprobada en `/auditorias/` el 9 de septiembre—, con los datos de mantenimiento ya establecidos en
  esta página (`26_158 · Control de mantenimiento`, cinta L3, Pablo). Cero CSS nuevo.
- **KPI por activo, cruzando incidencias y registros.** Es literalmente la respuesta de la FAQ «¿Se ven
  indicadores por equipo?» de más abajo en esta misma página, con una pantalla nueva —`.app__rank`,
  un ranking de barras—. **Importante: no es un dimensionador nuevo dentro del catálogo fijo de
  Gestión de KPIs** (comprobado en Ajustes: son toggles fijos sobre Incidencias/Acciones/Registros, sin
  «por activo»); es el resultado de cruzar incidencias y registros que llevan un activo enganchado,
  leído sobre OpenSearch/Paneles, que es donde ese cruce se monta hoy. TRA-003 encabeza el ranking con
  3 incidencias — la misma cifra que ya lleva su ficha más arriba en la página, dato coherente.

> **Trampa de CSS, y ya van cinco veces que este patrón muerde:** `.app__rankbar` y `.app__rankfill`
> son `<span>` y llevaban `height:8px`/`height:100%` sin `display:block`. Un elemento `inline` ignora
> `width`/`height` porcentuales — se renderizaba con `getBoundingClientRect()` en 0×0 aunque el CSS
> computado dijera «100%»—, así que las barras existían pero no se veían. Comprobado con
> `javascript_tool` contra el DOM real, no sólo mirando la captura. Las dos clases llevan `display:block`
> ahora. **Si se monta otra barra con un `<span>`, esto se vuelve a repetir.**

**Las otras dos son un adelanto, a petición expresa del cliente porque están en camino, y HOY NO
EXISTEN EN LA APLICACIÓN** — comprobado el 28 de septiembre, con el código fuente además de la demo:

- **El árbol de carpetas de activos.** Hoy los activos sólo agrupan por tipo (maquinaria,
  instalaciones, equipos de medición), en lista plana dentro de cada tipo — no hay subcarpetas por
  planta o línea. La pieza nueva (`.app--arbol`, `ds/app.css`) extiende ese agrupamiento real a un
  segundo nivel por ubicación, usando las mismas líneas (Línea 2, Línea 3, Envasado) que ya usa el
  resto de la página.
- **Las etiquetas de activos.** «Gestión de etiquetas» (Ajustes) es real y tiene catálogo con color,
  pero está comprobado en el código fuente que `tagIds` sólo se aplica a Documentos — ningún activo
  lleva etiqueta en la aplicación hoy. La pieza nueva (`.app--etq`, `ds/app.css`) extiende ese catálogo
  a Activos.

> ### ⚠️ ESTA SECCIÓN NO SE PUEDE PUBLICAR TODAVÍA
> Mismo caso que la ficha simplificada de la composición de portada (aviso del 3 de septiembre, más
> abajo): dos de las cuatro pantallas —el árbol y las etiquetas— enseñan algo que el producto no hace
> hoy, a petición expresa del cliente porque «están en camino». Antes de publicar esta página: o el
> árbol y las etiquetas de activos existen de verdad, o esos dos paneles del rotador se retiran (el
> `<article class="scene">` de cada uno, su `<div class="rotador__item">` y el bloque de CSS que
> anuncia el aviso en `ds/app.css`).

`ds/app.css` sube a `?v=20260928b` en las 48 páginas españolas que lo cargan (bump manual, sin script
de versión). `ds/rotador.js` se añade a esta página con la misma versión que usa `/auditorias/`
(`?v=20260909b`), sin tocar el fichero. `check:seo` (825 HTML, 482 URLs, ✔ sin fallos) y `check:voz`
(54 páginas, ✔) pasan — hubo que corregir un «a mano» en el primer intento del texto de planificación,
que `check:voz` cazó a la primera.

**Pendiente, y bloquea publicar:** ver el aviso ⚠️ de arriba. Nada de lo nuevo está traducido a los
cinco idiomas todavía — entra en el próximo `i18n:extract` + `build:i18n`, después de decidir el
punto anterior, porque si el árbol y las etiquetas se retiran no tiene sentido traducirlos primero.

## Estado a 28 septiembre 2026 — «La ficha del equipo, y todo lo que cuelga de ella»: revisión de vigencia

Petición del cliente: revisar la sección de `/gestion-de-activos/` que enseña la ficha del activo y
las tres escenas que cuelgan de ella (incidencia, registro, acción), y apoyarla en las reuniones de
HubSpot donde se habla de gestión de activos, ya que las 955 transcripciones de `~/samu-export` son
de un corpus distinto y no bastaba con pedirle a Pablo.

**Lo comprobado en `demo.trysolved.com/assets` el 28 de septiembre.** La estructura de la ficha real
sigue siendo exactamente la que maqueta `.app--activo`: DETALLES (criticidad, estado, fabricante,
modelo, tipo, ubicación), ACTIVIDAD con las cuatro pestañas, CÓDIGO QR con Descargar e Imprimir, y
ACCIONES ABIERTAS — nada más, ni foto de cabecera ni pestañas de Documentos/Imágenes/Mantenimientos
(eso sigue siendo sólo de la ficha simplificada de la composición de portada, y sigue sin poder
publicarse por el mismo motivo de siempre, ver el aviso del 3 de septiembre).

**Lo que SÍ cambió, y no se toca.** El activo `TRA-003` de Ultimate Demo 6 ya no es la cinta
transportadora L3: la BD dinámica «Maquinaria» se regeneró con 100 activos nuevos, la mayoría a cero
de actividad, y ningún tipo de incidencia de esta empresa lleva ya un campo que enganche con un
activo concreto. **No se ha renombrado nada en la página.** `UTD26_163_001`, `26_158` y Pablo son un
dato coherente que comparten esta página, la home, `/incidencias/` y la banda de IA; cambiarlo aquí
solo habría roto esa coherencia sin arreglar nada, y la regla del sistema es que un identificador que
se toca se toca en todos los sitios a la vez, no que se persiga la demo cada vez que se resiembra.

**La comprobación de fondo viene de HubSpot, no de la demo.** Se consultaron las reuniones donde
Pablo Santamaría (comercial) habla de activos —vía `query_crm_data` sobre el objeto `MEETING`— y el
mensaje de la sección se sostiene con conversaciones reales, no solo con la demo:

- **Cerámica Campo↔Solved (11 sep 2026):** Fara Calvo preguntó explícitamente por «la vinculación de
  tareas a activos» y por enganchar registros de ensayos — es la misma frase que ya usa el párrafo de
  la sección («es la clave por la que se enganchan las incidencias, los registros y las acciones»).
- **Piensos Procasa↔Solved: Formación (30 jun 2026):** la formación mostró «el historial y la
  asignación de tareas para cada maquinaria» y la búsqueda por código QR — exactamente lo que cuentan
  la ficha y el aviso de la escena de incidencia.
- **Piensos Procasa↔Solved (28 sep 2026, la reunión de hoy):** siguen ampliando el módulo — crear
  incidencias directamente desde el activo, código QR ya resuelto, y una reunión pendiente para
  revisar los registros de preventivos.
- Las reuniones «Embajadores↔Solved» (jul-sep 2026, Pablo con Vicent/Valeriano/Sara) son seguimiento
  interno de producto, no clientes: confirman que la visualización de incidencias en activos y la
  deduplicación se siguieron puliendo durante el verano, pero no dan cita aprovechable.

**No hay cita citable.** Los resúmenes de HubSpot son generados por IA, en tercera persona, y ninguno
trae una frase textual de un cliente con su nombre y su consentimiento para publicarla. La sección
sigue sin testimonio de mantenimiento, que sigue siendo la regla: «en cuanto haya un testimonio de
mantenimiento —el webinar o el caso de un cliente que use el módulo—, su hueco está aquí». Lo que
cambia es que ahora hay dos conversaciones reales y recientes (Cerámica Campo, Piensos Procasa) que
confirman que el ángulo de la sección —el activo como enganche de incidencias/registros/acciones, no
como fila de inventario— es exactamente lo que un cliente pregunta en el discovery, no solo lo que la
demo permite maquetar.

**Conclusión: sin cambios en el marcado.** La sección ya estaba construida con este mismo criterio el
3 de septiembre y sigue siendo fiel a la aplicación real; lo que aporta esta revisión es la
confirmación de que el mensaje sigue vigente, documentada aquí para no repetir la misma pregunta.

## Estado a 14 septiembre 2026 (6) — menos texto en las 22 páginas comerciales

Petición del cliente: reducir el texto en general y ser más conciso. Alcance acordado: las 22
páginas comerciales, no el blog ni el glosario.

Recortados el subtítulo de hero de once páginas (incidencias, auditorías, no conformidades,
activos, dashboard, integraciones, las dos de industria y las tres de certificaciones/APPCC/ISO
22000/homologación) y el párrafo de la sección de escenas de la home — cada uno a poco más de la
mitad, sin tocar ninguna cifra ni ninguna cita. `gestor-documental/` ya estaba corto y se deja
igual.

Traducciones nuevas en `i18n/traducciones/20-textos-mas-cortos.json`, a mano en los cinco idiomas.
`npm run i18n:extract` confirma que ninguna de las quince cadenas que faltaban por traducir es de
esta tanda —son un hueco previo, sin relación—. `check:seo` y `check:voz` pasan.

**Pendiente, si se quiere seguir recortando:** esto cubre el subtítulo de hero, que es el bloque de
texto más visible de cada página. Los párrafos de cuerpo más abajo (secciones, FAQ) no se han
tocado todavía.

## Estado a 15 septiembre 2026 (3) — «Ámbitos de aplicación»: cabe en pantalla, maqueta quieta y sin las industrias

Segunda vuelta del cliente sobre la entrada anterior, el mismo día, con cuatro peticiones:

1. **La sección tiene que verse entera en la pantalla del ordenador.** La sección lleva ahora
   `.section--ambitos-compacto` (el aire en `vh`, nacido en `/auditorias/`) y el conmutador
   `.switch--compacto`; la foto deja la proporción y **mide `clamp(280px, 42vh, 420px)`**, que es la
   pieza que decide si cabe. Y el reparto del panel pasa a **4fr/8fr sólo en esta sección**
   (`ds/sections.css`, `?v=20260915a`): el texto es un titular y una frase y puede ceder columna.
   Comprobado con la barra de navegación puesta: **608px en una ventana de 800 y 543 en una de 680**
   (los portátiles de 1440×900 y 1366×768).
2. **Fuera el bloque de las dos industrias** (`.reasons` con «Industria alimentaria: APPCC…» y
   «Automoción, químico, plástico e iluminación…» y sus dos enlaces). Las cadenas se quedan en
   `02-home-b.json` sin usar; las dos páginas siguen en la nav de Industrias.
3. **Las piezas no hace falta que se animen: fidelidad a la plataforma.** Sale la ficha animada de
   la entrada anterior y entra **una maqueta de la plataforma** —las pantallas de `ds/app.css` en su
   aparato de `ds/device.css`, **quietas** (`.ambito .app__opt--on{animation:none}`)— y **una
   notificación pequeña** (`.res-pill` a 12px). Calidad: la tablet con la ronda «Control Almacenes»
   cerrada y firmada («Informe generado»), que es literalmente el titular. Mantenimiento: el móvil con
   el listado de incidencias y la fuga de la cinta L3 arriba, con su foto de evidencia. Producción: la
   tablet con «Control de arranque · Línea 2» a medias y el KO del etiquetado, que abre
   UTD26_166_001. Mismo marcado y mismos datos que en las escenas: si se toca un identificador allí,
   aquí también. La tablet lleva `--app-rec-w:100%` (en la escena va al 84 % para recortarse por la
   derecha; aquí lo que se recorta es el pie, y al 84 % la firma se partía y caía fuera).
4. **Que se siga viendo lo que pasa en la foto.** La maqueta va al lado que no ocupan la persona y
   su dispositivo (`data-lado`), anclada arriba y recortada por abajo; la tablet mide 400px y el
   móvil 205 —a 150 el texto del listado se partía en cuatro líneas—. En teléfono la maqueta baja a la
   esquina de abajo y se sale por ese borde, y la notificación sube: la persona queda en la mitad de
   arriba, a la vista.

**6 cadenas nuevas** en `21-ambitos-home.json` (y «Firmado en línea · listo para auditoría» en
masculino, que ahora es el registro). `build:i18n` sigue avisando de **~30 cadenas sin traducir que no
son de aquí** —y ojo, parte son de la home: la banda de casos («Con la confianza de más de 100
empresas industriales», las cifras «2 horas», «+40 años»…) y las flechas «Anterior/Siguiente» del
carril—. Hueco previo; se hornea en español. `check:seo` y `check:voz` pasan.

## Estado a 15 septiembre 2026 (2) — «Ámbitos de aplicación» de la home: menos texto, la foto cuenta

Petición del cliente: la sección tenía demasiado texto —titular, párrafo y tres viñetas por
pestaña— y pidió quitar la mayoría y meter en las imágenes animaciones en HTML que enseñen lo que
se cuenta. Cada pestaña se queda con **el titular (sin tocar) y una frase**; las viñetas se van.

**Lo que decían las viñetas pasa a la foto** como pieza de producto, con hoja nueva `ds/ambitos.css`
(`.ambito`): la misma foto de antes a 4:3, un velo ligero, y encima **la ficha (`.res` de
`ds/scene.css`) que se rellena fila a fila y el aviso (`.res-pill`) que sale cuando la ficha está
completa**. Un reloj de 12 s con los tramos por fotograma clave —no por `animation-delay`, que
desincroniza el apagado—, y los paneles inactivos van `hidden`, así que cada pestaña arranca de
cero al abrirse.

| Pestaña | Ficha | Filas que entran | Aviso |
|---|---|---|---|
| Calidad | UTD26_157_REC · Lote dañado (la reclamación del resto de la home) | Causa · Responsable · Cierre | «Firmada en línea · lista para auditoría» |
| Mantenimiento | UTD26_163_001 · Fuga de aceite en cinta L3 (la misma avería de las escenas) | Activo · Evidencia (dos miniaturas) · Origen | «Asignada a Mantenimiento · 14:09» |
| Producción | Control de arranque · Línea 2 | tres controles: OK · OK · **KO** | «Incidencia UTD26_166_001 abierta» |

- **Sin tinte de módulo, a propósito:** Calidad, Mantenimiento y Producción son ámbitos, no módulos,
  y el patrón 7 dice que el único color de la sección es el azul. Los únicos otros colores son los
  de conformidad (OK verde, KO rojo), que codifican resultado.
- **`data-lado` pone la ficha en el lado que NO ocupan la persona y su dispositivo.** En
  Mantenimiento fue a la derecha porque a la izquierda tapaba la tablet del técnico, que es la mitad
  del argumento de la foto.
- **UTD26_166_001 es nuevo** (el KO del etiquetado abre una incidencia que no existía); `UTD26_165`
  está cogido por un reel de `guidelines/`. Los otros dos identificadores son los del resto del sitio.
- El `<dl>` trae 1em de margen inferior por defecto y `.res__rows` sólo fija el superior; aquí se
  anula (`.ambito .res__rows{margin-bottom:0}`), en `scene.css` sigue igual.
- En teléfono la ficha ocupa el ancho y la foto pasa a 4:5, para que quede foto por encima de la
  ficha.

Todo `aria-hidden`: el titular y la frase ya lo dicen. **20 cadenas nuevas** traducidas a mano en
`i18n/traducciones/21-ambitos-home.json`; las de las viñetas se quedan en `02-home-b.json` sin usar.
`build:i18n` avisa de **26-31 cadenas sin traducir que no son de aquí** (casos de éxito, acciones…):
es un hueco previo que ya se horneaba en español antes de esta tanda. `check:seo` y `check:voz` pasan.
Comprobado con Chrome sin cabeza a 1280 y 390, las tres pestañas, en el arranque y a los 8 s.

## Estado a 15 septiembre 2026 — las escenas de la home en móvil, tercera vuelta: Registros, Informes e Integración

El cliente volvió a verlo en el teléfono y seguían tres cosas mal. Las tres tenían causa distinta,
y ninguna era el carrusel:

1. **Registros e Informes se montaban sobre el título.** Son las dos escenas de 8 columnas de la
   fila mixta, y la regla `.scene[data-span="8"] .scene__media[data-crop="dev-br"]{top:15%}` pesa
   más que la general y **no estaba en el reset de 900px** (mismo fallo que el de `b` de la entrada
   anterior, en otro selector). Añadidas al reset, junto con la de la estrecha de 4 (`fila`), con el
   encuadre general del aparato apaisado (`left:13%; top:26%; width:104%`).
2. **El iPad de Registros no encajaba con su pantalla:** debajo de la pantalla asomaban 60px de
   carcasa negra. La causa está en `solved.css`, la hoja de la 2.0: tiene un
   `.device{min-height:280px}` de sus filas de producto (`.prow`), que ya no usa ninguna página pero
   sigue cargado y se aplica al `.device` del sistema. En escritorio no se nota —el aparato mide
   más— y en un teléfono, con 200px de alto natural, el mínimo lo estiraba. `ds/device.css` pone
   `min-height:0`. Ojo con el resto de nombres de clase que comparten las dos hojas.
3. **Integración no se entendía:** el puente (`.bridge`) se apila por debajo de 719px —ventana y
   después ficha del ERP—, y eso vale en el diálogo, que se desplaza, pero en la escena el
   fragmento se recorta por abajo, así que sólo asomaba la ventana de Solved y la ficha del ERP se
   quedaba fuera. Regla nueva en `ds/app.css`, sólo para `.scene .bridge`: los dos planos se
   mantienen, la ventana detrás (`left:24%`) y la ficha del SAP delante, abajo a la izquierda,
   tapando la barra lateral —lo prescindible— y dejando la cabecera y los códigos de las
   incidencias a la vista, que son los que la ficha repite como «Parte creado». El cable sigue
   fuera; con `max-width:260px` la ficha no se agiganta entre 600 y 719px.

Y una cuarta que no había pedido: en la escena de IA la pregunta se cortaba en «la cinta l» por el
`nowrap` del teclado (290px de texto en 207 de chat). Por debajo de 600px, y sólo en la escena, la
pregunta se deja envolver y entra con un fundido en el mismo tramo del reloj (0–18 %); se pierde
el gesto de teclear y se lee la pregunta entera. El cursor desaparece con él.

Comprobado con Chrome sin cabeza a 360, 390, 430 y 700px, escena por escena, y no sólo mirando el
primer fotograma: el iPad enseña la ronda rellenándose (el contador llega a 12 de 12; la firma queda
fuera del recorte en teléfono, y se ve en el diálogo). Suben `ds/scene.css`, `ds/device.css` y
`ds/app.css` a `?v=20260915a` en las 95 páginas que los cargan.

## Estado a 14 septiembre 2026 (5) — a la escena de IA de la home le faltaba el reset de "b"

El cliente vio la entrada anterior en su móvil y el solape seguía ahí, en la primera tarjeta
(«Consulta en lenguaje natural sobre los datos de planta»). La lista de recortes que se resetean
por debajo de 900px (`.scene[data-span="12"] .scene__media[...]`) traía `br`, `r` y `dev-br`, pero
**no `b`**, que es justo el que usa esa escena. Sin resetear, se quedaba con la regla de la ancha
—`top:14%`, pensada para un título en columna a la izquierda— mientras el título ya había vuelto
arriba: el chat quedaba literalmente encima del titular. Añadido a la lista, con los valores de la
`b` normal (sin sangrado por la derecha, que es lo que le pide la pregunta pegada a ese margen).
Comprobado a 375px, el ancho más estrecho habitual, y no sólo a 390. `ds/scene.css` sube a
`?v=20260914b`.

## Estado a 14 septiembre 2026 (4) — las escenas de producto, sin solaparse en móvil, y carrusel en la home

Petición del cliente: en el móvil algunas animaciones se cortaban y se solapaban con el texto, y
las tarjetas de escenas de producto de la home tenían que pasar a carrusel sin perder el titular.
Las dos cosas salían de la misma causa.

**La causa: por debajo de 600px `.scene` se relajaba a `aspect-ratio:4/3` sin mirar qué hay
dentro.** A una columna la tarjeta mide el ancho de la pantalla —358px en un iPhone de gama
media— y a 4:3 eso da 268px de alto. El título (`top:20px` fijo, dos líneas) llega hasta el 63; el
primer encuadre del fragmento (`top:25-26%` de la caja) empezaba a los 67-70px. Cuatro píxeles de
margen, y con un título de una palabra más —en otro idioma, o simplemente uno de los seis textos
que mide más— ninguno: el aparato quedaba encima del titular. Es el mismo componente en `casos de
uso`, `activos`, `industrias…`, así que el mismo fallo se repetía en todas las páginas que montan
`.scene-grid`, no sólo en la home.

**El arreglo, en `ds/scene.css`:** el cuadrado (`aspect-ratio:1/1`) en vez de 4:3 por debajo de
600px, para las cuatro proporciones que ahí se relajan (`4:3`, `1:1`, `21:9`, `fila`). Un tercio
más de alto separa el título del fragmento de verdad, y de paso el fragmento recortado se ve más
entero —la otra queja, «se corta»—. Se aplica a TODAS las páginas con `.scene-grid`: incidencias,
activos, no-conformidades, las de industria, gestión de calidad, casos de éxito.

**El carrusel, sólo en la home:** modificador nuevo `.scene-grid--carrusel`, añadido únicamente en
`index.html`. Por debajo de 600px la rejilla de seis escenas —que en columna hacía la página
kilométrica— se convierte en un carril horizontal con scroll-snap nativo, sin JS ni flechas: en
táctil se arrastra, que es la misma filosofía que ya tiene el carril recortado de
`ds/sections.js`. No se reutilizó `.rail` tal cual porque ese componente es carril también en
escritorio, y aquí la rejilla de la home tiene que seguir siendo rejilla de verdad por encima de
600px —comprobado con captura, no cambia nada—.

**Trampa que costó una vuelta:** `.scene-grid` de base ya declaraba `grid-template-columns:1fr` a
este ancho, para cuando NO es carrusel. Dejarla puesta en el modificador competía con las columnas
implícitas del carril: un `1fr` explícito reparte lo que QUEDE después de las pistas fijas, y
cinco columnas al 86% ya suman más ancho que el contenedor — a la primera tarjeta no le tocaba casi
nada (2px). Se corrige con `grid-template-columns:none` dentro de `.scene-grid--carrusel`, que deja
las seis columnas por igual, todas implícitas.

**Lo que NO se ha tocado:** el rotador de capacidades (`.rotador__vista > .scene`) ya usa
`aspect-ratio:1/1` en móvil desde el 9 de septiembre y su título va oculto para lectores de
pantalla (`.rotador__vista .scene__title` es `sr-only`), así que ahí no hay solape que corregir —
comprobado con captura en `/auditorias/`. Tampoco los composiciones con foto y ficha flotante
(`.scene__media--suelto` de `/gestion-de-activos/`), que llevan su propio contraste.

`ds/scene.css` sube a `?v=20260914a` en las 92 páginas españolas que lo cargan; `npm run
build:i18n` propaga el cambio a los cinco idiomas. `check:seo` y `check:voz` pasan.

## Estado a 14 septiembre 2026 (3) — la creatividad de la hero, fuera del móvil

El cliente vio el resultado de la entrada anterior —el shader engordado para tener presencia en
el teléfono— y pidió quitarlo directamente: seguía sin verse bien. En vez de seguir retocando
`ds/hero-wave.js` forma por forma, se oculta el canvas entero por debajo de 900px
(`.ds-hero__weave{display:none}` en `ds/hero.css`, dentro del media query que ya existía para el
texto a 100 % de ancho). Queda el fondo liso —papel o grafito, según `--ds-surface`— y el titular
solo, sin material detrás.

**No se desmonta el shader, se esconde.** `ds/hero-wave.js` sigue montándose y pintando en el
móvil exactamente igual que en escritorio; lo único que cambia es que su canvas no es visible. El
ajuste de grosor de la entrada anterior (`grosor`, `kd`, `mov`) se queda intacto en el código, sin
efecto mientras el canvas esté oculto: si algún día se decide recuperar la creatividad en móvil,
la vía ya está resuelta y sólo hace falta quitar esta regla.

En escritorio no cambia nada (comprobado con captura idéntica antes/después). `ds/hero.css` sube a
`?v=20260914f` en las 116 páginas españolas que lo cargan; `npm run build:i18n` propaga el cambio
a los cinco idiomas. `check:seo` y `check:voz` pasan.

## Estado a 14 septiembre 2026 (2) — el shader de la hero, engordado para el móvil

Petición del cliente: las creatividades de la hero (`ds/hero-wave.js`) no se veían bien en el
teléfono. No era el sitio de la pieza —ya se había resuelto ese día, ver la entrada anterior— sino
su presencia: `k`, la variable que encoge toda la geometría en un aspecto estrecho para que el
ritmo (separación entre filamentos, anillos, columnas…) no se apriete, encogía también el GROSOR,
así que en el teléfono las cinco formas que no habían recibido ya un ajuste propio quedaban
convertidas en una raya fina y pálida sobre una página en blanco, o en el caso de las barras,
pegadas al canto de abajo y prácticamente invisibles sin hacer scroll dentro de la propia hero.
Comprobado con capturas reales (Puppeteer a 390×844, no el simulador de la extensión) en las siete
páginas antes y después de tocar nada.

**El arreglo separa el RITMO del GROSOR**, con variables nuevas que en escritorio (`k=1`) no
cambian nada —comprobado con capturas idénticas antes/después en home, dashboard, incidencias y
auditorías—:

- **`grosor` (haz de marca/IA, trama de registros):** se acerca a 1 cuanto más estrecho el
  aspecto, en vez de encoger con `k`. La franja o la tela se ENSANCHA en el móvil en lugar de
  adelgazar, así que sigue leyéndose como material y no como un rasguño.
- **`kd` (anillos de incidencias):** el desvanecido de los anillos lejanos encogía con el mismo `k`
  que su radio, y en el móvil dos o tres de los trece ya nacían medio disueltos —la «raya suelta»
  que la nota del 9 de septiembre quería evitar, vuelta a aparecer—. `kd` separa el desvanecido del
  encogido para que los trece lleguen completos.
- **`mov` (barras de KPIs):** la línea de base se dejó pegada abajo a propósito para no pisar el
  título, pero en el móvil el título ocupa casi toda la hero y ese margen de abajo es mucho más
  estrecho de lo que parecía en escritorio. `mov` (0 en escritorio) sube la base y da algo más de
  altura; el lavado que ya deshacía la barra alta antes de tocar el texto sigue siendo el que
  impide que la columna más alta lo pise — no hizo falta tocarlo.

**Lo que NO se ha tocado:** el abanico de `/no-conformidades/` ya compensaba el aspecto por su
cuenta —su fórmula divide la distancia por `k` para el ancho y la amplitud, así que el propio `k`
se cancela y el trazo no se adelgazaba— y la pila de `/gestor-documental/`, que ya recibió su
propio ajuste de posición (`mov`) el mismo 14 de septiembre. Las dos se revisaron con captura y
seguían bien.

`ds/hero-wave.js` sube a `?v=20260914e` en las 110 páginas españolas que lo cargan;
`npm run build:i18n` propaga la versión a los cinco idiomas. `check:seo` (837 HTML, ✔ sin fallos) y
`check:voz` pasan.

## Estado a 9 septiembre 2026 (8) — sexto idioma: portugués (pt-PT)

Petición del cliente: **añadir portugués europeo al sitio**, siguiendo exactamente el patrón ya
usado para en/fr/it/de. El sitio pasa de cinco a **seis idiomas**: es, en, fr, it, de, pt.

**Dos bugs de fondo, y sin ellos pt no habría podido entrar sin tocar cada script uno a uno.**
`i18n/config.mjs` (`LANGS`, `TARGETS`, `RUTAS`) ya era la única fuente de verdad para
`build-i18n.mjs`, `build-i18n-contenido.mjs`, `i18n-extract.mjs`, `build-sitemap.mjs` y
`translate-contenido.mjs` — todos leen `TARGETS` y recorren el mapa de `LANGS`, así que añadir una
entrada ahí bastaba para que generaran el idioma nuevo. Lo que **no** era genérico:

- `scripts/lib/i18n-catalogo.mjs` resolvía el atajo `"="` (cadena idéntica en todas las lenguas)
  con `for (const lang of ['en','fr','it','de'])` **a pelo**, así que cualquier idioma nuevo se
  quedaba sin las ~140 marcas y nombres propios de `00-invariables.json`. Ahora importa `TARGETS`
  de `i18n/config.mjs` y recorre eso.
- `scripts/check-voz.mjs` tenía `en/fr/it/de` en el `Set` de carpetas excluidas (son artefactos, la
  ficha de voz está escrita para el castellano). Añadido `pt`.
- `scripts/translate-contenido-todo.sh` lanzaba `en fr it de` en paralelo. Añadido `pt`.

Con esos dos arreglos, todo lo demás fue **datos, no código**: rutas en `RUTAS`, entrada en
`LANGS` (`htmlLang: 'pt-PT'` —no `pt` a secas, es portugués europeo y no brasileño—,
`ogLocale: 'pt_PT'`, `prefijo: '/pt'`) y la columna nueva en `i18n/GLOSARIO.md`.

**Las URLs de sección se tradujeron, como en los otros cuatro idiomas** (`/incidencias/` →
`/gestao-de-incidentes/`, `/auditorias/` → `/checklists-digitais/`, `/gestor-documental/` →
`/gestao-documental/`, `/no-conformidades/` → `/acoes-corretivas/`, `/gestion-de-activos/` →
`/gestao-de-ativos/`, `/industria-general/` → `/industria-transformadora/`,
`/industria-alimentaria/` → `/industria-alimentar/`, `/software-certificaciones/` →
`/software-de-certificacoes/`, `/homologacion-de-proveedores/` → `/homologacao-de-fornecedores/`,
`/casos-de-exito/` → `/casos-de-sucesso/`, `/politica-de-privacidad/` →
`/politica-de-privacidade/`, `/glosario/` → `/glossario/`). El resto se queda igual que el español
(`/dashboard/`, `/ia/`, `/integraciones/` → `/integracoes/`, `/politica-de-cookies/`, `/blog/`).

**El catálogo de las 22 páginas comerciales se tradujo a mano, cadena por cadena**, con el mismo
método que en+fr+it+de: doce agentes en paralelo, cada uno con el glosario de marca y la ficha de
tono (formal, sin «tu»/«você», portugués de Portugal y no de Brasil, post-AO90), repartidos los 20
ficheros de `i18n/traducciones/`. Las ~1.875 entradas objeto quedaron todas con su clave `pt`
—comprobado con un barrido que no dejó ninguna sin traducir—, y los ~140 «=» de `00-invariables.json`
los cubre ahora el arreglo del catálogo. `npm run i18n:extract` confirma **1591/1593 en los cinco
idiomas por igual** (las 2 que faltan son un hueco preexistente que ya tenían en/fr/it/de, no algo
que pt haya introducido).

`npm run build:i18n` genera las 22 páginas de `/pt/` + su `chrome.js` con nav, pie y selector de
idioma en portugués; `npm run build:i18n:contenido` genera el esqueleto de blog y glosario en `/pt/`
(635/9720 cadenas por el catálogo compartido, el resto sale en español hasta que se traduzca, igual
que arrancaron los otros cuatro); `npm run build:sitemap` sube el sitemap a 493 URLs. `check:seo`
(836 HTML, ✔ sin fallos) y `check:voz` (55 páginas españolas, ✔) pasan.

**El contenido editorial (blog + glosario) se está traduciendo por máquina en segundo plano**, igual
que en+fr+it+de: `node scripts/translate-contenido.mjs --lang pt`, reanudable, caché en
`i18n/cache/pt.json`, log en `i18n/cache/logs/pt.log`. Son ~9.085 cadenas pendientes sobre 109
páginas; a 40 cadenas por tanda y una llamada al CLI de Claude por tanda, tarda horas. Si se corta,
se relanza igual que los otros cuatro con `bash scripts/translate-contenido-todo.sh` (ahora incluye
pt) o el comando suelto de arriba.

**Pendiente, y es lo mismo que ya estaba pendiente para en/fr/it/de:** que termine la traducción del
contenido y que alguien lea las cinco traducciones antes de publicar. `/gestion-de-calidad/` sigue
sin traducir a ningún idioma (pendiente de negocio anterior, ver más abajo), así que tampoco tiene
versión en portugués.

## Estado a 9 septiembre 2026 (7) — cada capacidad del rotador dura lo que dura su pantalla

El rotador pasaba de capacidad cada 7 s para todas, y el montaje de la plantilla **dura 21** —tres
actos de siete—: de los tres caminos que promete su rótulo se veía uno y medio. Ahora
**`.rotador__item` acepta `data-dur`** (ms) y la primera capacidad de `/auditorias/` lleva
`data-dur="21000"`; las otras tres se quedan en los 7 s de `data-intervalo`, que es lo que tardan sus
pantallas en contarse.

- **El riel de avance lee la duración del item activo**, no una del contenedor: el script escribe
  `--rot-dur` en el item al encenderlo. Con la del contenedor, la barra llegaba al final a los 7 s y
  la capacidad seguía ahí otros catorce, que es peor que no tener barra.
- **Alargar el intervalo de todas no valía**: dejaría las otras tres paradas y esperando con su
  pantalla ya resuelta.
- **Si se cambia `--ciclo` en `ds/plantilla.css`, hay que cambiar el `data-dur` de esa capacidad**: son
  el mismo número escrito en dos sitios, y separados el rotador vuelve a cortar la animación.

`ds/rotador.js` a `?v=20260909b` en las tres páginas que lo cargan (`/auditorias/`,
`/industria-alimentaria/`, `/industria-general/`); las otras dos no pasan `data-dur` y siguen igual.
Comprobado en el navegador: el montaje aguanta sus 21 s y el resto sigue a 7. `check:seo` y
`check:voz` pasan.

## Estado a 9 septiembre 2026 (6) — las carátulas de la biblioteca, con foto

Petición del cliente: **poner fotos a las carátulas de los registros del montaje, fotos que tengan que
ver con el registro y que no se hayan usado nunca.** Las ocho tarjetas iban con el tinte del módulo y
un icono; ahora llevan portada.

**Esto revoca una decisión escrita esta misma mañana**, y conviene entender por qué se cayó. El
argumento era que Mitti pone foto porque vende un catálogo de 9.000 plantillas ajenas y aquí la
biblioteca es la de la propia empresa. La parte de la cifra sigue en pie. La de la foto no: **en la
aplicación las tarjetas de los modelos tienen portada** —`/settings/checklist-templates-settings`, a
la vista— y es una foto del asunto del registro. Sin ella, la maqueta se parecía menos a la pantalla
que copia, que es el criterio que manda en este repositorio. Lo que se descartó entonces y se sigue
descartando es la foto de banco genérica repetida en las ocho.

**Ocho fotos nuevas, una por registro** (`assets/registros/`, con su `FUENTES.md`): cámara frigorífica,
línea con manguera, tanques de pasteurización, estanterías de almacén, lavamanos y ducha, máquina
abierta, bandejas bajo el cabezal de etiquetado y tubería de techo. Generadas para esto con nano
banana pro —**16 créditos de Higgsfield, autorizados por el cliente**— y **sin usar en ninguna otra
página**, que es la regla de siempre.

- **No sale nadie en ellas, y es la diferencia con `assets/planta/`.** Aquella carpeta pide persona +
  dispositivo porque son fotos de escena; éstas son portadas de 152 px dentro de una pantalla de
  producto, donde una persona no se lee y lo que tiene que verse es la cosa que se controla.
- **304×104 px**, el doble de la carátula, recortadas de la banda central del 16:9 original. Las ocho
  suman **43 KB**.
- **El tinte del módulo se queda debajo**, de fondo: es lo que se ve mientras la foto carga y lo que
  quedaría si una tarjeta se quedara sin portada, que en la aplicación pasa.
- **Los `alt` van vacíos** a propósito: la pieza entera es `aria-hidden`, así que son decorativas y no
  entran en el catálogo de traducción. El catálogo se queda en **1.556 cadenas al 100 %**.

`ds/plantilla.css` a `?v=20260909d`. `check:seo` y `check:voz` pasan. **Si se cambia el nombre de una
tarjeta, hay que cambiar su foto**: la portada es de ese registro, no un adorno.

## Estado a 9 septiembre 2026 (5) — «listo para descargar»: el menú del registro, en la animación

Petición del cliente sobre la cuarta capacidad de `/auditorias/`: **un botón de descargar, elegir
formato y listo**. El panel enseñaba el resultado —una lista y un botón de informe—; ahora enseña el
gesto, como ya lo enseñan el montaje y la planificación:

     0,0 s  el histórico
     1,3 s  se pulsan los tres puntos del registro cerrado y se abre su menú
     3,1 s  se elige «Descargar PDF» y el menú se cierra
     3,9 s  el acuse, con el nombre del fichero
     5,6 s  el panel de Informes Excel, que es la OTRA vía —el histórico entero, no un registro—

**Y aquí se resolvió de paso el aviso que bloqueaba publicar esta página.** Buscando qué se podía
elegir se abrió un registro cerrado en la demo: su menú `more_vert` tiene **cinco entradas
literales** —«Descargar PDF», «Descargar PDF comprimido», «Descargar solo resultados KO»,
«Seleccionar secciones...» y «Enviar resumen por correo»—. Así que el PDF del registro firmado
existe, la capacidad podía decir lo que decía, y el menú entero es lo que se pinta.

**No se inventa un selector de formato**, que es lo que la petición pedía al pie de la letra: el
producto no tiene uno. Lo que tiene es ese menú con cinco maneras de bajarlo, que dice más que un
desplegable de «PDF / Excel» y además existe. El informe en Excel sigue saliendo de `/reports`, que
es otro sitio y otra cosa —el histórico entero—, y por eso su panel entra **después** y no a la vez:
antes se plantaba encima justo cuando el menú estaba abierto y las dos vías se contaban juntas.

Dos medidas que las dio el recorte, no el gusto:

- **El menú se ancla al 52 % de la pantalla, no a la derecha de la fila.** La fila llega hasta el
  borde de la pantalla (695 px) pero de esa pantalla sólo se ven los 584 primeros: anclado a su
  derecha, el menú se quedaba medio fuera de la tarjeta. Las filas del histórico se limitan a 560 px
  y el menú acaba en el 79 %, dentro de lo que se ve.
- **El acuse va debajo de donde estaba el menú, no abajo a la izquierda** como lo pondría el
  navegador: del alto sólo se ven los 335 primeros de 435, así que pegado al pie caía fuera, y ahí
  abajo además se pisaba con el panel de Informes. Donde está se lee como lo que ha salido de ese
  menú.

El cursor es el mismo de la planificación —punta corregida y paradas medidas sobre `.app`— y **se va
en cuanto el fichero ha bajado**: lo que entra después no lo abre nadie con el ratón.

`ds/app.css` a `?v=20260909d` en `/auditorias/`. **7 cadenas nuevas** en
`i18n/traducciones/19-rellenar-y-programar.json` (el catálogo queda en **1.561 al 100 %**);
`check:seo` y `check:voz` pasan.

## Estado a 9 septiembre 2026 (4) — el rotador de `/auditorias/`, con el gesto dentro, y los ámbitos con foto

Cuatro peticiones del cliente sobre la misma página, y las cuatro van en la misma dirección: que las
pantallas enseñen **lo que alguien hace**, no el resultado ya hecho.

**1 · El cursor del montaje ya cae donde clica.** Las paradas de `montaje-cursor` (`ds/plantilla.css`)
estaban puestas a ojo y erraban hasta cuatro puntos: el asa del control quedaba a 26 px del cursor y
el campo de la IA, entero por encima de él. Ahora **cada parada es el centro de lo que se clica,
medido sobre la pieza con las animaciones pausadas en ese instante** —que no es lo mismo que medirlo
en reposo: la tarjeta entra desde abajo, el asa se desplaza al agarrarla y las dos pantallas del acto
3 suben un punto largo cuando aparece el fichero—. Y se corrige la causa de fondo: `left`/`top`
colocan la **esquina** del cuadro de 17 px, pero la punta de la flecha está dibujada en (5, 2.5) de un
viewBox de 24, así que todo señalaba 3,5 px a la derecha y 1,8 por debajo. Un
`transform:translate(-3.5px,-1.8px)` lo devuelve a su sitio. **Si se toca la maqueta de dentro, las
cifras se vuelven a medir.**

**2 · La capacidad de los controles enseña un registro rellenándose.** Sale la pantalla del editor con
la barra de diecisiete tipos y el constructor de fórmulas; entra **un control de cada tipo, rellenado
uno detrás de otro**: fórmula (3,4 °C → OK), OK/KO (se pulsa KO), texto (se teclea la observación que
explica ese KO), archivos (se adjunta la foto) y firma (se traza y queda el sello). El contador de la
sección llega a 5/5. La gramática es la de
`demo.trysolved.com/checklist/preview/<id>/section/<n>`, comprobada el 9 de septiembre: cabecera con
la sección, su «1 / 3» y los botones «todo OK» y «todo N/A», y cada control con su número, su valor,
el chip verde «Completado» y el avatar de quien lo rellenó.

- **No se etiqueta el tipo dentro de la pantalla.** En la aplicación el tipo se ve en el editor, no al
  rellenar; un chip «Fórmula» encima de cada control sería inventar interfaz. Lo que distingue a los
  cinco es su forma, que es como se distinguen delante de la máquina.
- **El ancho y el alto los da el recorte**: con `dev-br` se ven 584×335 px de una pantalla de 695×435,
  así que la lista se limita a 560 —si no, el chip y el avatar caen fuera— y las cinco tarjetas se
  aprietan hasta caber. El encuadre de esta escena **sube al 18 %** (el general es 25) porque con
  cuatro tarjetas la escena no dice lo que promete.
- La tarjeta de archivos tenía 95 px de alto contra los 55 de las demás: la zona de soltar y el
  fichero iban apilados y el fichero, invisible, reservaba su hueco. Comparten celda.

**3 · Programar un registro se ve programar.** El panel del calendario era el resultado; ahora son tres
actos con cursor, como el montaje: se pincha **«Planificación»** en la barra del modelo, se abre el
panel, se pone la **fecha de inicio** y el responsable, se guarda, y **entonces** aparece el
calendario con la semana planificada entrando en cascada. Las píldoras moradas se retimaron al 33 %
del ciclo: antes se llenaban detrás de la tarjeta y al descubrirla ya estaba todo puesto.

> **Qué está comprobado y qué no, que aquí importa.** Comprobado en la demo el 9 de septiembre: el
> botón «Planificación» con su reloj junto a «Publicar», «Crear copia V2» y «Guardar»; el rótulo
> literal del panel que abre —«Planificación - Programar generación automática de registros»—; los
> campos de fecha `dd/mm/aaaa` con su icono; el rótulo «Responsable»; y la vista de calendario. **No
> se llegó a ver el panel relleno** —el modelo con el que se abrió estaba vacío—, así que se pintan
> los dos campos que el producto tiene y que la capacidad nombra, y ni un rótulo más. Si alguien lo
> abre sobre un modelo planificado, esa pantalla se corrige con lo que salga.

**4 · Los cuatro ámbitos, con foto, como en la home.** La sección «Configura sobre tus procedimientos
los controles de calidad, mantenimiento, producción y seguridad» pasa a ser texto + imagen en el
reparto 5fr/7fr que el conmutador ya tenía —con la lista **dentro** de `.switch__txt`, que fuera se
trata como una tercera columna—. **Dos de las cuatro fotos no existen todavía**: la regla es una foto,
una página, así que entran las dos que `assets/planta/FUENTES.md` ya tenía asignadas a esta página y
sin usar (Calidad y Producción) y las de Mantenimiento y Seguridad se dejan como **hueco de imagen**
(`.img-slot`, primer uso del componente) con el prompt en inglés dentro y `data-i18n="skip"` para que
no entre en el catálogo. **Cuando lleguen las dos fotos, se sustituyen los dos huecos y se anotan en
FUENTES.md.**

Cache-busters: `ds/app.css` a `?v=20260909c` y `ds/plantilla.css` a `?v=20260909c` en `/auditorias/`.
**22 cadenas nuevas** traducidas a mano en `i18n/traducciones/19-rellenar-y-programar.json`; el
catálogo queda en **1.555 al 100 % en los cuatro idiomas**. `check:seo` (705 HTML, 411 URLs) y
`check:voz` pasan.

> **Quedó un borrador de más en la demo de QA.** Buscando el flujo de planificación se pulsó «Crear un
> registro» en `/settings/checklist-templates-settings`, que crea el modelo en el acto: `Nuevo
> Registro`, id `J2NDxcEBFIuhCCk5RQ61`, sin publicar. La biblioteca tiene una quincena de borradores
> iguales, así que no estorba; si se quiere limpio, se desactiva desde la aplicación.

## Estado a 9 septiembre 2026 (3) — la hero de `/gestor-documental/`: sale la pila de fichas, entra la pila de hojas

Encargo: **quitar la animación de documentos de la hero y darle a la página su versión del haz**, como
`/auditorias/`, `/dashboard/` y `/no-conformidades/`. Las dos cosas van juntas: la pieza que contaba
la página deja de ser un elemento montado encima y pasa a ser el material del fondo.

**Lo que se retira.** El bloque `.docstack` de la hero —los cuatro recursos en cascada del 8 de
septiembre— y con él `ds/hero-docs.css`, que ya no lo cargaba nadie. La página deja también de cargar
`ds/scene.css`: la traía sólo por el `.res` de esa pila. Si se quiere recuperar, está entera en el
commit que la trajo.

**Lo que entra.** La entrada `documentos` de `ds/hero-wave.js`, con forma propia `pila`, montada con
`mount(canvas, { tema: 'documentos' })`. Trece hojas planas, cortadas por los extremos, cada una un
escalón más arriba y más a la izquierda que la de debajo. Hereda la geometría de la pila que se va
—el escalón hacia arriba y a la izquierda, que es como se reconoce un archivador— y es la única de
las cinco formas cuyos filamentos **tienen principio y final**: un haz, unos anillos o una trama son
patrones y siguen fuera del cuadro; una pila se cuenta con sus cantos.

**Va con la rampa de marca, no con un color de módulo, y no es pereza.** El sistema no tiene tinte
para Documentos —los seis valores de `.scene[data-module]`— y pintarla con el color de otro módulo es
lo que prohíbe la regla del tinte; es el mismo motivo por el que el icono del recurso iba en tinta y
la escena de la página va con bocadillo. Lo que distingue a la página, entonces, es la forma. Si
algún día se decide un color propio para Documentos —sigue pendiente— se cambia `c` en esa entrada y
no hace falta tocar nada más.

**El color viaja por la pila, no a lo largo de cada hoja.** Abajo el azul de presión, arriba el
naranja del final de la rampa, cada hoja de un tono. En la home la rampa la recorre cada cinta —el haz
va de un sitio a otro—; aquí no hay recorrido que contar, hay orden, y trece hojas de un tono cada una
se leen como trece cosas archivadas.

**Dos medidas que no son libres:** el escalón horizontal va en unidades de ancho (`asp`) y no de `k`,
que es la corrección de escala que usan las otras cuatro formas —reparte trece hojas de lado a lado,
así que lo que tiene que caber es la pantalla, y con `k` en un teléfono las de abajo se salían por la
derecha—; y el vertical encoge sólo a medias (`0.62+0.38k`), porque en una pantalla alta sobra sitio
arriba y abajo y la pila entera encogida se quedaba en una franja fina en el medio.

El movimiento es la comba del papel y **el abanico de la baraja**: el escalón horizontal se abre y se
cierra con un seno de 0,13 rad/s. Ninguna hoja se desplaza: nada nace ni muere dentro del cuadro, que
es la misma regla que obligó a los anillos de `/incidencias/` a no crecer.

Las cinco lenguas están reconstruidas (`npm run build:i18n`), y `check:seo` y `check:voz` en verde.

## Estado a 9 septiembre 2026 (2) — `/gestor-documental/`, réplica de la página de documentos de Mitti

Encargo: **replicar `mitti.com/es/documentos` con la información de Solved y con animaciones propias**,
y —dicho expresamente— **incluir también lo que Mitti enseña y aquí no se pudo comprobar**, para
decidirlo al revisar. Sale `ds/documentos.css` (cuatro piezas, sin JS) y cinco secciones nuevas en la
página, que pasa de dos secciones de contenido a siete.

**El orden es el suyo**, que es lo que se pidió copiar: la carpeta → la movilidad → el control de
versiones → la IA → el enganche con el resto del producto → el catálogo de tipos de documento. El copy
no se copia: está reescrito con lo que hace el módulo.

| Sección nueva | Pieza | Qué enseña |
|---|---|---|
| El documento se busca donde se trabaja | `.docmovil` | el teléfono, el buscador filtrando y las dos píldoras |
| La versión nueva no es la vigente | `.docver` | v2 entra pendiente, se valida, y la actividad lo escribe |
| Se le pregunta en castellano | `.docia` | la pregunta tecleada y la respuesta **con su cita** |
| El procedimiento, dentro del trabajo | `.docengancha` | un documento y tres destinos, sin duplicarse |

**Lo que se comprobó en la aplicación el 9 de septiembre**, entrando en un documento de
`demo.trysolved.com/documents`: cabecera con tipo, **número de versión**, peso y estado; pestañas
**Información · Versiones · Actividad**; en Versiones, cada versión con su fichero, su tamaño, «Subido
el … por …» y los botones **«Validar versión»** y **«Rechazar versión»**; en Información,
**Responsable**, subido el, **fecha de expiración**, **fecha de revisión**, y los bloques **Alcance**,
**Asignados** y **Etiquetas (0/10)**, más comentarios; y en Actividad, la línea «javier.fernandez creó
este documento · 28/4/2026». Eso amplía bastante lo que la página decía desde el 3 de septiembre, y es
lo que sostiene la sección del control de versiones entera.

**Las tres cosas que van SIN COMPROBAR, marcadas con ⚠ en el marcado**, cada una en su bloque para que
quitarla sea borrar de comentario a comentario:

1. **El acceso sin conexión** desde el móvil (un `.docpunto` y la píldora «Disponible sin conexión»).
2. **Abrir el documento leyendo el código del equipo** (un `.docpunto` y la píldora «Código leído»).
   Solved sí lee códigos en registros y activos; lo que no se vio es que el código lleve a la
   documentación.
3. **Las respuestas de la IA sobre el contenido de los documentos** (la sección entera y una pregunta
   de la FAQ). La IA tiene «preguntar a tus datos», pero no se verificó que entre en el texto de los
   documentos ni que cite la fuente.

Y una cuarta a medias: que el documento enganchado a un registro, a un activo y a una incidencia sea
**el mismo** —una sola copia— y no tres adjuntos. La ficha de activo tiene pestaña de Documentos y la
barra del gestor tiene «documentos con enlaces», así que el enganche existe; la unicidad, no
verificada.

**Ninguna pieza lleva tinte de módulo, y es la misma razón de siempre: Documentos no tiene color.** Van
sobre papel, con hairline, y el único color es el de la propia aplicación y los dos estados que el
módulo sí tiene. La excepción es `.docia`, que va sobre grafito porque lo de IA va sobre grafito.

**Dos cosas que costaron y quedan escritas:**

- **`.device` no resuelve sus propias unidades de contenedor.** Sin envolverlo en `.device-box`
  —`container-type:inline-size`— el bisel y la muesca del iPhone se calculan contra la ventana y sale
  un aparato deforme del tamaño de la sección. Lo dice `ds/device.css` y aquí se comprobó saltándoselo.
- **El buscador de la pieza del móvil se traduce en bloque.** Lo que se teclea («envasadora») tiene que
  seguir estando dentro de los documentos que se quedan en la lista: en inglés es «packing» y los dos
  documentos que quedan son «…packing machine» y «Manual for packing machine L3». Si alguien traduce
  una cadena sin la otra, el filtro deja de tener sentido. Anotado en el catálogo.

**El catálogo sube a 1.632 cadenas y sigue al 100 % en los cuatro idiomas**: 78 nuevas, a mano, en
`i18n/traducciones/18-gestor-documental.json`. `check:seo` pasa (705 HTML) y `check:voz` también.

**Lo que rompe esta página, a conciencia:** la regla de las dos secciones de contenido por landing de
módulo. Tiene siete. Es lo que implica replicar una página de Mitti, y está pendiente de que el cliente
decida qué se queda al revisar.

> **Primera poda del cliente, el mismo día: fuera «La carpeta, con lo que hay y con lo que falta».**
> Era la escena con bocadillo —la foto de la tablet y la vista de tabla real dentro— y la sección más
> antigua de la página, del 3 de septiembre. Se va entera; está en git (`git show ebbe071:gestor-documental/index.html`,
> sección `Gestor documental · La carpeta`). Con ella se van tres cosas:
>
> - **`ds/app.css` deja de cargarse aquí.** Era la única pantalla de app de la página; las cuatro piezas
>   nuevas se pintan solas. Roboto se queda —lo piden ellas— y el comentario del `<link>` lo dice.
> - **La foto `procedimiento-carpeta-tablet.webp` no queda huérfana**: `/gestion-de-calidad/` la usa dos
>   veces. Lo que sí estaba mal desde entonces era su fila en `assets/planta/FUENTES.md`, que seguía
>   diciendo que su página era ésta; corregida. Es la segunda vez que esa tabla envejece: **dice dónde
>   se pensó usar cada foto, no dónde está**.
> - El catálogo baja de 1.632 a **1.618 cadenas**, al 100 % en los cuatro idiomas. Las traducciones de
>   las catorce cadenas que se van se quedan en su fichero, sin usar, como las de la banda que sustituyó
>   el vídeo de `/auditorias/`.
>
> **La página se queda en seis secciones de contenido**, y la regla de las dos sigue rota. La poda
> siguiente decide si eso se acepta para esta página o si hay que elegir.

> **Segunda poda, y la que ordena la página: las cinco secciones se condensan en el rotador de
> capacidades.** Petición del cliente con el modelo delante —«como la de *Monta la plantilla, programa
> el registro y descarga el histórico en el mismo módulo* · Cuatro capacidades del módulo, cada una
> sobre la pantalla que la resuelve»—, que es lo que `/auditorias/` estrenó ese mismo día. La página
> queda en **dos secciones de contenido —capacidades y «Lo que hace esta carpeta y no hace la del
> servidor»— y vuelve a cumplir la regla.**
>
> - **Las cuatro piezas no se tocan: pasan a ser los cuatro paneles.** Cada una con su
>   `--panel`, que le quita marco, radio y proporción —los pone la escena— y le baja el reloj a **12 s**
>   (`data-dur="12000"` en los cuatro items; si se cambia uno, se cambian los cinco).
> - **Los paneles son `.scene` SIN `data-module`, y es la decisión que faltaba por tomar en esta
>   página.** El rotador busca sus paneles así (`ds/rotador.js`), y Documentos no tiene color: una
>   escena sin módulo **no rompe la regla del tinte, la cumple** —deja el lienzo sin teñir, que es lo
>   que le toca a un módulo sin color—; teñirla con el violeta de otro sí la rompería. Lo único que hay
>   que reasignar es el halo del borde, que sin módulo cae en la primaria del sistema —azul, o sea
>   Incidencias— y aquí va en tinta.
> - **Los seis tipos de papel de una planta caben en una línea** dentro de la primera capacidad. Tenían
>   sección propia y no la necesitaban.
> - **Las tres marcas ⚠ siguen en pie**, ahora dentro de su capacidad, y quitar una es borrar su
>   `.rotador__item` y su `.scene`.
> - El catálogo baja a **1.593 cadenas**, al 100 % en los cuatro idiomas: entran los cuatro rótulos de
>   capacidad, sus cuerpos y los cuatro títulos de escena; salen los de las secciones que se van.
>
> La página carga ahora `ds/scene.css` y `ds/rotador.js`, y **depende de `.rotador-bloque`**, que es de
> la misma tanda del 9 de septiembre en `ds/sections.css`.

## Estado a 9 septiembre 2026 — el montaje de una plantilla, copiado de Mitti

Encargo directo: **copiar la animación de `mitti.com/es/inspecciones-e-informes`** —la de «Digitalice
cualquier auditoría y proceso en unos pocos clics»— **en versión Solved, para registros: el mismo
contenido con la estética de Solved**. Sale `ds/plantilla.css` (`.montaje`), sólo CSS, y su guía en
`/guidelines/plantilla.montaje.html`, donde va montada dentro de la sección entera —titular, tres
puntos y pieza— por si se decide llevarla a una página.

**De dónde sale la referencia.** El original no es un vídeo: es un GIF de 600×500, 144 fotogramas y
10,08 s (`Inspection_and_Reports_-_GIF_-1.gif`, servido desde Contentful), descargado y despiezado con
ffmpeg. Cuenta tres caminos: la biblioteca de plantillas con su clic y el editor de preguntas con sus
asas; el diálogo de convertir una imagen o un PDF; y el de describir un tema.

**Y de dónde sale lo que se enseña.** Los tres caminos existen en Solved y sus pantallas están
comprobadas en `demo.trysolved.com` el 9 de septiembre de 2026:

| Mitti | Aquí | Pantalla |
|---|---|---|
| «Find a template» + el editor | Modelos de registros, con sus contadores y sus chips, y el editor con la sección abierta | `/settings/checklist-templates-settings` y `/checklist/edit/<id>/section/0` |
| «Convert an image or PDF» | «Importar Checklist Automáticamente»: Excel, PDF o Word | `/checklist/auto-import` |
| «Describe a topic» | «Contexto para la IA», donde se le dice cómo leer el documento | la misma pantalla |

Los rótulos son literales de la app y el contenido de la plantilla es el del sitio —«Temperatura
cámara 3», «Estado de la junta»—. Los ocho modelos de la biblioteca son modelos que existen en la
empresa de demo, con su número real de secciones, escritos en caja de frase.

**Tres decisiones que conviene no deshacer:**

- ~~**Las tarjetas no llevan foto.**~~ **Revocado el 9 de septiembre de 2026** (ver el estado (6) de
  ese día): llevan portada, porque **la aplicación la lleva**. El razonamiento anterior —Mitti vende
  un catálogo de 9.000 plantillas ajenas y aquí la biblioteca es la de la propia empresa— sigue siendo
  cierto para la CIFRA, que no se sustituye por otra porque no hay ninguna que decir; lo que no
  aguantó es la conclusión sobre la foto: en
  `/settings/checklist-templates-settings` las tarjetas de los modelos tienen portada y es una foto
  del asunto del registro. Lo que se descartó es una **foto de banco genérica**, y eso se mantiene:
  cada portada es la cosa que ese registro controla.
- **Las dos pantallas ocupan la misma caja**, y lo que sangra por el borde es el contenido —la rejilla
  de tarjetas por la derecha, la lista de controles por abajo—, no el panel. Un rótulo de la app
  cortado no es un fragmento que continúa, es un defecto: la primera versión enseñaba «4 Contro…».
- **El lienzo es el violeta de Registros y no cambia entre actos, tampoco en el de la IA.** Lo que se
  enseña ahí es una pantalla del producto, que es blanca; la regla de que lo de IA va sobre grafito
  gobierna las piezas de la web —la banda, la insignia—, no una captura del producto.

**Dos trampas nuevas, anotadas en la hoja:**

- **Un porcentaje dentro de `translate()` se mide sobre el propio elemento.** El cursor —17 px— hacía
  todo el recorrido dentro de su propia esquina. Se mueve con `left`/`top`, que sí son porcentajes de
  la caja, y así la pieza escala con la columna sin que la flecha se despegue de lo que señala.
- **En escritorio `ds/site.css` reasigna `section[class]{display:block}`** (0-1-1, gana a una clase
  suelta) para matar las secciones de 100 vh de la 2.0. Cualquier rejilla montada sobre una `<section>`
  con clase se cae por ahí sin decir nada: la de la guía va en un `<div>` dentro de la sección.

**El reloj es uno solo**: 21 s, tres actos de siete, y todo colgado de él con retardos negativos —el
rótulo, las dos pantallas, el cursor, el fichero que cae, el tecleo y la barra de progreso—. El ancho
final del texto que se teclea está **medido** (282 px), no puesto a ojo: con `steps()` sobre un ancho
mayor que el texto, el caret se queda flotando a la derecha de la última letra y delata el truco.

**Montada en `/auditorias/`, dentro de la sección de IA** (petición del cliente el mismo día). Va
detrás del vídeo y delante del sub-encabezado, en el reparto de dos columnas —los tres puntos a la
izquierda, la pieza a la derecha— que es **el mismo 5fr/7fr de `.rotador`**: dos rejillas de texto y
pantalla con proporciones distintas en la misma página se leen como dos maquetaciones. No abre sección
propia, así que la regla de las dos secciones por landing sigue en pie.

**El vídeo NO se retira.** Cuenta tres cosas que la IA hace sobre los registros —importar, cambiar la
plantilla en lenguaje natural y contestar preguntas— y sólo la primera se solapa con la pieza. Si
algún día sobra uno de los dos, el que debería quedarse es la pieza: es HTML, así que se traduce con
el catálogo, mientras que el texto del vídeo va quemado en el MP4 y se sirve en español en los cinco
idiomas.

**El tecleo se hace con una cortina, y eso es lo que lo hace traducible.** La primera versión recortaba
la caja del texto de 0 al ancho de la frase, y ese ancho hay que escribirlo a mano: 282 px en español y
otra cosa en cada idioma, con el caret flotando a la derecha de la última letra en cuatro de los cinco.
Ahora lo que se mueve es una cortina del color del campo que se retira hacia la derecha, con el caret
en su borde izquierdo; como vive dentro del propio texto, su 100 % es el ancho del texto sea el que
sea. **Si se monta otro tecleo en el sitio, éste es el patrón.**

**Catálogo:** `i18n/traducciones/17-montaje-plantilla.json`, 39 cadenas nuevas a mano en los cuatro
idiomas —los tres puntos, los rótulos y el texto de las tres pantallas—. El catálogo queda en 1.523
cadenas; las 3 que faltan no son de aquí. `check:voz` cazó un «plataforma» en el tercer punto (la
palabra que el cliente no dice: dice herramienta, sistema, programa) y se cambió por «Solved», en el
español y en las cuatro traducciones.

## Estado a 9 septiembre 2026 (3) — `/incidencias/`: fuera el rotador, dentro la conversación

Dos peticiones del cliente sobre la misma página, y van juntas porque una deja el hueco que llena la
otra.

**Se retira la sección de capacidades.** Era el rotador —«Registra la incidencia, asígnala y demuestra
su cierre en el mismo circuito»— que había entrado el 7 de septiembre en el hueco de la rejilla de
seis cuadros. Con él se van los cuatro textos de capacidad y **las copias de las cuatro escenas**, así
que se acaba el aviso de que cada pantalla existía dos veces en este fichero: ahora cada una está una
sola vez, en «Detecta». Sale también `ds/rotador.js` de esta página. Está todo en git.

> **Lo que cuesta, y conviene tenerlo escrito:** los enlaces internos a `/auditorias/`, `/dashboard/`,
> `/integraciones/` y `/no-conformidades/` vivían **sólo ahí**. Fuera de la navegación y el pie, la
> página se queda con un único enlace de cuerpo, el de `/ia/` al pie de la banda. Que los cinco
> estuvieran en la página era uno de los motivos por los que la sección existía. Si se quieren de
> vuelta, el sitio natural es el pie de la banda o una línea en las respuestas de la FAQ.

**Y entra un cuarto cubo en «Detecta»: la conversación.** «Centraliza las conversaciones y recoge la
información cualitativa junto a la incidencia», con el **chat de la incidencia** abierto sobre la
ficha. Va entre el reparto del trabajo y el análisis, que es su sitio en el relato: entra el aviso, se
da de alta y se asigna, **se habla de ello**, y de ahí sale la causa. Lo que cuenta es que lo
cualitativo —lo que hoy se dice por WhatsApp, por teléfono o de pasillo— queda pegado al expediente:
quién vio qué, qué se descartó, qué lote se comprobó y la foto del montaje. Los tres mensajes son de
la avería del tour y de las tres personas que ya salen en la página.

El cajón está comprobado en `demo.trysolved.com` el 9 de septiembre: se abre desde el icono de la
cabecera de la incidencia —el mismo sitio del que salen el Ishikawa y los 5 Porqués—, lleva «Chat de
la incidencia» con el código debajo, una campana para seguir el hilo, un «Cargar más» y, al fondo, el
campo con marcador **«Mensaje»** y sus dos botones, adjuntar y enviar.

**El cubo mide cuatro columnas y hace pareja con la causa raíz** (corrección del cliente, mismo día).
La primera versión era una escena de doce con la ficha a la izquierda y el cajón a la derecha, y
dejaba **dos cuadros grandes seguidos** —éste y el de la causa raíz—, que es un ritmo que la sección
no tenía. Ahora la fila es **conversación 4 + causa raíz 8**, el reparto espejo de la de arriba
(alta 8 + asignar 4).

- **Con la caja estrecha, la ficha sobra y sale.** El cajón ya dice a qué incidencia pertenece, igual
  que el panel de la acción nueva dos cuadros más arriba. Queda el cajón solo, panel suelto con su
  propia sombra y `--suelto` en la escena, compartiendo medidas con `.app__asigna`. Se caen del
  catálogo «1 · Descripción», «Clasificación» y la descripción larga.
- **La causa raíz baja de doce columnas a ocho, y pierde menos de lo que parece:** a doce el titular va
  en COLUMNA y se lleva el 38 % del ancho; a ocho va encima y el dibujo se queda con la tarjeta
  entera. Las tres medidas que dependen del encuadre —el 88 % del alto de la espina, el 15 % del aviso
  y el anclaje de los rótulos al arranque de su raspa— **siguen valiendo**, porque `data-crop="b"`
  reparte igual en las dos: 26 % por arriba y −10 % por abajo.

**Y se ve como una conversación, no como un acta** (corrección del cliente, mismo día): **lo mío a la
derecha y lo del resto a la izquierda**, y **se ve escribir y enviar**. Los tres mensajes de fuera
llegan escalonados con su cara y su bocadillo gris; abajo se teclea la respuesta con el anillo de foco
puesto, se pulsa enviar —el botón se enciende cuando ya hay algo que enviar y se hunde al pulsarlo— y
el mensaje aparece arriba a la derecha, en el azul del producto, con el campo otra vez en su marcador.

- **El mensaje propio va sin foto**: la aplicación pinta la inicial del usuario y en una columna de
  cuatro no cabe una cara más.
- **El texto del mensaje enviado y el que se teclea son LA MISMA CADENA**, no dos parecidas. Con dos
  entradas de catálogo podrían separarse al traducir, y entonces se enviaría una cosa y aparecería
  otra.
- **Los tres relojes van pegados** —tecleo hasta el 46 %, envío en el 52 %, burbuja en el 53 %—: si se
  toca uno hay que mirar los otros dos, o el mensaje sale antes de mandarse. Y el saltito del botón va
  ANTES de que la burbuja aparezca, que es el orden en que ocurre.

> ### ⚠️ Y EL FALLO DE SIEMPRE, POR CUARTA VEZ: `.app__conv` SE QUEDÓ SIN TOKENS
> El cajón vive **fuera de `.app`** —es un panel suelto, sin marco de aparato—, así que no heredaba
> `--app-blue` y compañía. Consecuencia: `background:var(--app-blue)` era una declaración inválida y
> **la burbuja del mensaje propio salía transparente con la letra en blanco**, o sea invisible; y los
> bocadillos de los demás, sin su gris. Se arregla metiendo `.app__conv` en el selector que declara
> los tokens del producto, como se hizo con `.bridge` el 8 de septiembre y con `.app__asigna` y
> `.app__raiz` el 8. **Si una pieza de producto no cuelga de `.app`, entra en ese selector.**

> ### ⚠️ LA BURBUJA DE MENSAJE NO ESTÁ COMPROBADA
> La incidencia que se abrió tenía el chat **vacío**, así que el cromo del cajón sí está visto pero
> autor, hora, texto y adjunto van maquetados con el patrón del resto de la aplicación, no contra una
> captura. **Antes de publicar hay que abrir un chat con mensajes dentro y ajustarlo.** Es la regla de
> esta casa: las pantallas se maquetan, pero no se inventan.

9 cadenas nuevas netas en `16-cuadros-incidencias.json`; el catálogo queda en **1.553 al 100 % en los
cuatro idiomas** contando sólo lo de aquí. `check:seo` y `check:voz` pasan.

> **NO SE EJECUTÓ `build:i18n` al final, y es a propósito.** La otra sesión tiene `/gestor-documental/`
> a medio reescribir: `i18n:extract` da **78 cadenas suyas sin traducir**, y el build hornea en español
> lo que no está traducido, en los cuatro idiomas y sin decir de qué página. Así que las cuatro copias
> traducidas de `/incidencias/` se quedan **una revisión por detrás**: tienen el cubo del chat en su
> sitio y con las cuatro columnas, y les falta sólo **el mensaje propio a la derecha**. Su cadena ya
> está traducida, así que entra sola en el primer `build:i18n` que se lance cuando
> `/gestor-documental/` esté traducido.

> **Y van seis: `/auditorias/` se estuvo editando desde fuera mientras esto se hacía.** La otra sesión
> sustituyó el segundo panel del rotador —el del editor con la barra de tipos y el constructor de
> fórmulas— por otro suyo, «Un control de cada tipo, rellenándose», conservando el armazón y los `id`.
> No se ha deshecho nada: el rotador, sus cuatro capacidades y los otros tres paneles siguen. Lo que
> sí hubo que arreglar es el **cache-buster de `ds/app.css`**, que quedó a dos valores a la vez
> —`?v=20260909a` en 30 páginas y `?v=20260909d` en las cinco de registros—; se unifica en
> `?v=20260909d` en las 35. **Con dos sesiones sobre la misma hoja, la versión hay que mirarla al
> final, no al editar.**

## Estado a 9 septiembre 2026 (2) — `/auditorias/`: las cuatro capacidades, en rotador

Petición del cliente, y son tres cambios en la sección de Registros.

**Se va el encabezado de la sección.** Decía «Entra el control que ya usas. Sale la plantilla lista
para rellenar.» con su párrafo sobre la IA, y contaba lo mismo que el vídeo que tiene justo debajo.
La sección abre ahora con el vídeo —que trae su texto dentro y su cartela— y el h2 pasa a ser el del
rotador. **El enlace a `/ia/` no se pierde**: se muda al pie de la primera capacidad, que es la que
enseña la importación. Mismo criterio con el que el 7 de septiembre se mudó al pie de la banda.

**Los tres puntos del montaje y las seis celdas se funden en cuatro capacidades**, con el patrón 12
—el rotador de `/incidencias/`, que es el que el cliente puso de ejemplo—:

| # | Capacidad | Pantalla |
|---|---|---|
| 1 | Duplica un modelo, edítalo o importa el parte que ya tienes | **el montaje**, la animación de los tres caminos |
| 2 | Elige entre multitud de controles, con fórmulas y reglas | el editor: la barra de tipos, el constructor de fórmulas y la regla de visibilidad |
| 3 | Programa los registros para tu equipo | el **calendario** del módulo, con lo planificado y lo cerrado |
| 4 | Todo el histórico disponible, listo para descargar | el **historial** y, encima, el panel de **Informes Excel** |

**Sale la rejilla «Rellena, firma y cierra cada control desde donde se hace»**, sus seis celdas y con
ellas `ds/celdas.css` de esta página. Tres de las seis decían ya lo que dicen las capacidades 3 y 4
—frecuencia programada e histórico exportable— y una página que promete lo mismo dos veces se lee
como si no tuviera nada más que enseñar. Es exactamente lo que se hizo en `/incidencias/` el 7 de
septiembre. **Lo que se pierde** son las tres celdas que ninguna capacidad recoge: respuestas
acotadas, firma con hora y autor, y el KO que abre la incidencia. Las tres siguen contadas en la FAQ,
y el marcado está en git.

**Los textos de los tres puntos no se reescriben**: el de la biblioteca y el de la importación se
quedan en la capacidad 1, y el del editor —«diecisiete tipos de respuesta»— se va a la 2, que es de
lo que habla. Tres párrafos aprobados que no pasan por traducción otra vez.

**`/auditorias/` vuelve a cargar `ds/app.css`.** La retiró el 7 de septiembre, y por eso
`ds/plantilla.css` declara sus propios `--app-*`; con las dos montadas no hay conflicto —mismos
nombres, mismos valores, y plantilla.css va después—. Vuelve porque tres de los cuatro paneles son
pantallas de producto y ésa es su hoja. Estrena también `ds/rotador.js`.

**Las tres pantallas nuevas se comprobaron en `demo.trysolved.com` el 9 de septiembre**: el editor
(`/checklist/edit/<id>`), la vista Calendario de `/checklist` y la pestaña Historial con el panel de
`/reports`. De ahí salen la barra de tipos, los operadores del constructor —«Mayor o igual que»,
«Menor o igual que»—, el conector **Y** (que en el producto sólo aparece cuando la expresión previa
ya es una comparación completa, y por eso su fotograma va detrás), el panel **Ejemplo**, los tres
estados de un registro cerrado y el rótulo «Informes Excel · Genera y descarga informes en formato
Excel con los datos de tu organización».

Cinco decisiones que conviene no deshacer:

- **La fórmula NO va sobre «Temperatura cámara 3».** En el montaje ese control es de tipo **Número** y
  aquí el de la fórmula es **«Temperatura de la cámara 1»**, de tipo **Fórmula**. Son dos controles
  del mismo modelo configurados distinto —que es justo lo que promete la capacidad—; con el mismo
  nombre, la página diría que un control tiene dos tipos.
- **Se enseñan nueve tipos de diecisiete y el resto se cuenta (`+8`).** Una barra cortada por el borde
  diría que hay más de los que hay; una inventada, que existen tipos que no existen.
- **El calendario lleva dos semanas, no cinco.** En el panel del rotador un mes entero deja las
  píldoras a tres píxeles y el nombre del registro ilegible. Lo que cuenta la capacidad es el cambio
  de estado: la semana cerrada en verde y la planificada en morado —el color de Registros—.
- **El panel de Informes se ancla arriba y a la izquierda, no a la esquina de abajo a la derecha.** El
  encuadre `dev-br` mete la ventana por el 13 % y le da el 104 % de ancho: de los 624px del aparato se
  ven los 522 primeros y de su alto, los 338. Anclado a la esquina caía entero fuera de la tarjeta.
- **`.montaje--panel`** (nuevo, en `ds/plantilla.css`) le quita a la pieza su marco, su radio y su
  lienzo, que ahí los pone la escena —del mismo módulo, así que del mismo violeta—. Con los dos, dos
  bordes concéntricos y el tinte al 20 %.

**Y el rótulo de la capacidad 4 no es el que pidió el cliente.** Decía «Ten a mano todo el histórico»
y `check:voz` lo tumba: «a mano» está en la lista de coloquialismos de `guidelines/voz.md`. Queda
«Todo el histórico disponible, listo para descargar», que promete lo mismo.

> ### ✅ RESUELTO EL 9 DE SEPTIEMBRE DE 2026: EL PDF EXISTE, Y CON OPCIONES
> Se abrió un registro cerrado en `demo.trysolved.com/checklist/preview/<id>` y su menú `more_vert`
> tiene cinco entradas: **«Descargar PDF»**, **«Descargar PDF comprimido»**, **«Descargar solo
> resultados KO»**, **«Seleccionar secciones...»** y **«Enviar resumen por correo»**. La capacidad
> podía decir lo que decía, y ahora además lo enseña: ese menú es la secuencia del panel 4 (ver el
> estado del 9 de septiembre (5)). El informe **en Excel** sigue siendo lo de `/reports`, que es otra
> cosa —el histórico entero, no un registro—.

Componentes nuevos: `.rotador-bloque` (`ds/sections.css`), el aire y el hilo que separan el rotador
del vídeo cuando no abre sección propia; `.montaje--panel` (`ds/plantilla.css`); y las tres pantallas
en `ds/app.css`. Cache-busters: `ds/app.css` a `?v=20260909a` (31 páginas), `ds/sections.css` a
`?v=20260909a` (91) y `ds/plantilla.css` a `?v=20260909b` (5). **59 cadenas nuevas** traducidas a mano
en `i18n/traducciones/18-capacidades-registros.json`; el catálogo queda en **1.548 cadenas al 100 % en
los cuatro idiomas**. `check:seo` y `check:voz` pasan.

## Estado a 9 septiembre 2026 — `/incidencias/`: las tres pantallas, contra el producto

Petición del cliente sobre la sección «Detecta». Las tres escenas del 8 de septiembre se rehacen —dos
de ellas enteras— **después de navegar la aplicación**: `demo.trysolved.com`, Ultimate Demo 6, el 9
de septiembre de 2026. Todo lo que se pinta ahora existe allí.

| Cuadro | Antes | Ahora |
|---|---|---|
| Plantillas | La vista de **ajustes**: la lista de plantillas y sus campos, con tres tipos relevándose | **El alta en tres pasos**: Inicio → «Configura los datos iniciales» (centro + categoría) → el asistente guiado |
| Asignar | El selector de personas ya abierto, con iniciales | **La acción que se está creando** y el desplegable que **se abre al tocar el campo**, con el equipo en fotos |
| Causa raíz | Tres barras con el reparto de causas | **El panel de Ishikawa** rellenándose → **la espina de pescado** → el **aviso** del registro programado, solapado |

**Por qué el alta y no los ajustes.** La pantalla anterior enseñaba dónde se diseña una plantilla;
quien mira una landing no configura, da de alta. Y el alta es donde la plantilla se nota: elegir
**centro y categoría** es elegir plantilla sin decirlo —el `templatesMapping` de la empresa enruta por
departamento y por tipo de producto—, y con ella cambian los campos que el asistente pregunta. El
titular no se ha tocado: sigue prometiendo plantillas a medida y ahora se ve para qué sirven.

**El Ishikawa es función real, no un dibujo.** `enableIshikawa` en los ajustes de la empresa; se abre
desde el icono de la cabecera de una incidencia, al lado del análisis de los 5 Porqués, y es un panel
con las seis emes —Mano de obra · Máquina · Método · Material · Medición · Entorno—, cada una con sus
causas y un campo «Escribir causa». **No se dibuja la espina de pez**: la aplicación no la pinta, y
dibujarla habría sido inventar pantalla. Lo único que se refluye es el reparto —en la app las seis
emes van en columna dentro de un cajón lateral; aquí en dos filas de tres, porque la escena es 21:9 y
en columna sólo cabrían dos—. Si esa escena deja de ser de doce columnas, vuelve la columna.

**El equipo no se ve hasta que se toca el campo** (corrección del cliente, mismo día). Estaba puesto
desde el primer fotograma y eso convertía la pieza en una lista de personas que estaba ahí porque sí:
un desplegable ya abierto no se lee como un desplegable. Ahora la escena tiene cinco tiempos —se
escribe la descripción, se toca Responsable, se abre la lista, se elige y se cierra dejando el campo
relleno, y se pone la **fecha de cierre**— y el desplegable va **flotando sobre el formulario**, no
empujándolo: además de ser lo que hace un desplegable, empujando el panel crecía y encogía en cada
vuelta del bucle y la escena entera daba un salto. Debajo entraron **Estado** y **Fecha de cierre**,
que además de ser el orden del formulario de la aplicación (1 Descripción · 4 Responsable · 5 Estado ·
6 Fecha de cierre) son lo que la lista tapa al abrirse.

**La fecha de cierre también se elige** (petición del cliente, mismo día), y es el tiempo que cierra
la escena: una tarea sin plazo no es una tarea. Van las **dos casillas**, día y hora, con sus
marcadores `dd/mm/aaaa` y `--:--`, porque así es el campo en `/actions/create`, y el anillo de foco
pasa de una a la otra —encendidas las dos a la vez no se lee que se está recorriendo el campo—.
**No lleva atajos** (Hoy · Mañana · A finales de esta semana): ésos son del asistente de alta de
incidencias, no del formulario de acción. Con este campo **se retira el resumen del pie** —«Pablo
Ferrer · vence 28/06»—, que decía lo mismo que Responsable y Fecha de cierre y repetido debajo se leía
como otra tarjeta. El día y la hora no entran en el catálogo: el extractor deja fuera lo que no tiene
letras, y se escriben igual en las cinco lenguas.

**La espina de pescado, y la segunda licencia de la página.** El cliente pidió que el análisis se
convirtiera en un esquema de espina y que encima entrara solapado el aviso del registro programado.
**La espina no existe en la aplicación** —comprobado dos veces el 9 de septiembre: el panel de
Ishikawa es una lista de las seis emes y no hay vista de diagrama ni botón que la abra—, así que se
dibuja a petición expresa y va **encadenada al panel de verdad**: primero la pantalla que existe, y la
espina como su lectura. Las seis causas son las mismas palabra por palabra en los dos tiempos; si
cambiaran, no sería el mismo análisis. Con la espina se va el panel de «Registro programado» de la
derecha: lo que dice ahora es el aviso —«Revisión · Control de la junta · dentro de 10 días · 08:00»—,
y dice **«dentro de 10 días»** y no una fecha porque es lo que se lee en una notificación y no
envejece.

**Las caras del equipo son una licencia consciente y hay que saberlo:** la aplicación pinta la
**inicial**, no una foto. Van fotos porque lo pidió el cliente y porque «a cualquier persona del
equipo» se lee antes en cuatro caras distintas que en cuatro letras de colores. Es la misma licencia
que ya se tomó en el vídeo de la banda de IA. Tres avatares nuevos —`avatar-jefe-turno`,
`avatar-marta`, `avatar-sergio`—, recortes de fotos de planta que ya estaban, documentados en
`assets/planta/FUENTES.md`.

**Y el jefe de turno de la banda de IA deja de ser Pablo.** Las dos puntas de la banda llevaban el
mismo avatar —quien manda la nota de voz y quien recibe la acción—, así que la pieza contaba que
alguien se asigna trabajo a sí mismo.

Cinco decisiones que costaron y conviene no deshacer:

- **«Mañana» no entra como atajo de fecha.** Es uno de los cinco que ofrece la aplicación, pero esa
  cadena **ya existe en el catálogo con el sentido de turno de mañana** («Morning», «Matin»…), y la
  clave del catálogo es el español: puesta ahí, el atajo saldría traducido como un turno en los cuatro
  idiomas. Se usan los otros cuatro y el elegido es «A finales de esta semana», que además cuadra con
  el 28/06 que la acción de al lado tiene por plazo. **Antes de escribir una cadena corta en una
  pantalla, hay que mirar si ya existe con otro sentido.**
- **La ruta que trae el asistente —«Mantenimiento · Planta de Alzira»— no va con `.app__recprog`.**
  Esa clase es verde, y su verde es el de «firmado»; ahí no hay nada firmado todavía. Va en
  `.app__ruta`, tinta neutra.
- **Las seis causas del Ishikawa arrancan escondidas en el propio elemento (`opacity:0`), no sólo en
  el fotograma 0 %.** `animation-delay` no pinta el 0 % mientras espera —es el mismo fallo que tuvo
  la bolita del esquema de la home—, así que sin eso las seis estarían puestas desde el primer
  instante y el escalonado no se vería. El precio es que **en movimiento reducido hay que encenderlas
  a mano**, o la escena sale vacía.
- **El registro programado entra ahora en el 46 % del ciclo y no en el 24 %.** Con las tres barras el
  análisis acababa enseguida; con seis causas escalonadas, la última cae sobre el 31 %.
- **Los dos centros —Alzira y Riba-roja— son dato de la empresa de demo, no una función.** La demo del
  sitio es PopCorn Mediterránea y hasta ahora no tenía plantas escritas en ninguna pantalla. Si algún
  día se nombran plantas en otra, tienen que ser éstas.
- **La espina mide el 88 % de su caja, y el aviso se sienta al 15 % del borde de abajo.** El encuadre
  `b` mete la caja un 26 % por arriba y la saca un 10 % por abajo, así que la última banda de la
  escena cae FUERA de la tarjeta y la recorta su overflow: al 100 % lo que se perdía eran los tres
  rótulos de abajo, que es media espina. **Si esa escena cambia de encuadre, hay que rehacer las dos
  cuentas.**
- **Los rótulos de la espina se anclan al arranque de su raspa, no al canto de la caja.** Las raspas
  salen del 23,3 % y del 76,7 %; anclados al canto, los rótulos quedaban a 120px de su propia raspa y
  el dibujo dejaba de leerse como un dibujo.
- **La cabeza de la espina no puede llevar el `translate` de las raspas.** Su sitio lo fija un
  `translate:0 -50%` que la centra sobre la columna, y el fotograma de entrada lo pisaba: se le anima
  sólo la opacidad, y en movimiento reducido hay que devolverle el centrado a mano.
- **El relevo del campo de Responsable va seco, no cruzado.** Con el marcador de posición y el valor
  a media opacidad a la vez se leía «Pablo Ferrer» encima de «…onsable».
- **Y en una animación no va una pantalla de fondo sin forma** (regla del cliente, 9 sep 2026). Los
  dos cuadros que van sin aparato —el selector de responsable y el Ishikawa con su espina— pasan a
  `.scene__media--suelto`: el panel del contenedor les pintaba detrás un rectángulo blanco del tamaño
  del encuadre, más grande que la pieza y vacío por abajo, que se leía como una segunda pantalla que
  no existe. La excepción existía desde el 8 de septiembre por el puente de Integraciones; ahora es
  regla escrita en `ds/scene.css`: **si lo de dentro no llena el encuadre, fuera el panel.** El cuadro
  del alta NO la lleva: su marco de navegador mide exactamente lo que el encuadre, así que ahí la
  sombra sigue el aparato y tiene forma. `ds/scene.css` sube a `?v=20260909a` en las 76 páginas que lo
  cargan.

`ds/app.css` sube a **`?v=20260909a`** en las 30 páginas que lo cargan. **40 cadenas nuevas**
traducidas a mano en `16-cuadros-incidencias.json`; el catálogo queda en **1.523 cadenas, al 100 % en
los cuatro idiomas**. `check:seo` pasa (705 HTML, 411 URLs) y `check:voz` también.

> **Y van cinco: `/incidencias/` no fue lo único que se tocó esta tarde.** Mientras esta sesión
> trabajaba, otra montó «El montaje de una plantilla» en `/auditorias/` y **commiteó** (`11aa288`),
> arrastrando de paso el `i18n/es.json` que había regenerado esta sesión —así que el catálogo
> commiteado ya cuenta cadenas cuyas traducciones seguían sin commitear—. No se perdió nada: los
> cambios de aquí van por reemplazo de bloques sobre el fichero recién leído, no por reescritura
> entera. Pero la regla se confirma otra vez: **antes de cortar nada, copia del fichero**, y mirar
> `git log` además de `git status` antes de dar por buena una comprobación.

## Estado a 8 septiembre 2026 (3) — la pila de documentos, en la hero de `/gestor-documental/`

> **Retirada el 9 de septiembre de 2026**, sustituida por la forma `pila` del shader —ver la
> sección del 9 de septiembre (3)—. Se deja escrita porque las tres medidas de abajo son las que
> heredó el escalón de las hojas, y porque el bloque se puede recuperar del historial.

Petición del cliente: **rectángulos superpuestos en diagonal que se mueven para simular la
organización de documentos, con la estética de los recursos de la web**. Sale `ds/hero-docs.css`
—hoja nueva, sólo la carga esa página— y un bloque `.docstack` dentro de la hero, entre el shader y
el texto.

**La hero no cambia.** Sigue siendo la del resto del sitio —mismo shader, misma columna de texto al
76 %, misma tira MCP—. Lo que se añade es la pieza propia de esta página, igual que
`integrations-weave.js` lo es de la de Integraciones.

**No son rectángulos, son recursos.** El «recurso» (`.res`, de `ds/scene.css`) es la pieza con la que
el sistema comunica que algo ha pasado —el parte recién creado, el registro firmado—, y un documento
validado es exactamente eso. Se reutiliza tal cual: mismo blanco, mismo radio de ficha, mismo cuadro
de icono, mismas filas de etiqueta y valor. Lo único que se le añade es marco, sombra y colocación,
que es lo que un recurso no lleva cuando vive dentro de una escena. **Esta página no montaba ninguna
escena y por eso no cargaba `ds/scene.css`; ahora sí la carga**, sólo por el recurso.

**El icono va en tinta, no en color de módulo**, y no es estética: el sistema **no tiene tinte para
Documentos** —los seis valores de `.scene[data-module]`— y pintarlo con el color de otro módulo es lo
que prohíbe la regla del tinte. Mismo motivo por el que la escena de esta página va con bocadillo.

**Los cuatro documentos son los de la vista de tabla de `demo.trysolved.com/documents`** comprobada el
3 de septiembre, la misma que se monta en el bocadillo de más abajo: PR-07, el certificado IFS, la
ficha técnica de las palomitas y PR-12, con sus responsables y sus fechas. Ni un dato inventado, y las
cadenas ya estaban en `04-registros.json`, así que el catálogo sigue cubierto.

### Tres medidas que no son libres

- **El escalón vertical son 74 px** porque eso es lo que mide la cabecera del recurso: icono, nombre y
  quién lo validó. Con menos, los nombres de detrás se cortan; con eso, se leen los cuatro a la vez.
- **El horizontal son 14 px, y no 30.** El cuadro del icono empieza a 16 px del canto y mide 30, así
  que **cualquier escalón entre 4 y 46 parte el icono por la mitad** y deja un medio cuadrado negro
  que se lee como un recorte mal hecho. Por debajo de 16, el canto de la tarjeta de delante cae dentro
  del margen y lo que asoma es una pestaña limpia de papel.
- **La pila recede hacia arriba y a la IZQUIERDA.** Con el escalón a la derecha lo que asomaba de cada
  ficha era su canto derecho —el final de la fecha, «…26»—, que no dice nada; y la pila crecía contra
  el borde de la ventana y se cortaba. Hacia la izquierda asoma el principio de cada documento, que es
  como se reconoce un archivador, y crece hacia el hueco de la hero.

### El movimiento es a saltos, no un carrusel

Cada tarjeta está quieta el 19 % de su tramo y se mueve el 6 %: 2,7 s parada y 0,8 s de recorrido. Con
desplazamiento continuo la pieza dice «flujo»; con la parada dice **orden**, que es lo que promete el
titular. Las cuatro comparten una sola animación de 14 s y se reparten el ciclo con retardos negativos
de un cuarto, así que en cada instante hay una en cada tramo. El `z-index` viaja dentro de los
fotogramas —es entero y salta, que es justo lo que hace falta—. Con `prefers-reduced-motion` no hay
ciclo: las cuatro se quedan en su tramo, que es la cascada entera, quieta.

### Dos decisiones de encaje

- **Va por encima del encuadre (`z-index:3`), no por debajo.** La pila cruza el raíl derecho del
  `.frame`, que es un borde del propio encuadre: por debajo, esa línea de un píxel se pintaba **encima
  de las tarjetas blancas** y se leía como un arañazo. Cruzar el raíl sí es del sistema —lo hacen las
  escenas al sangrar—; que el raíl atraviese el papel, no. Puede ir por encima porque nunca solapa el
  texto: la columna acaba como mucho en el 76 % del encuadre. **Si algún día se ensancha
  `.ds-hero__txt`, hay que rehacer esa cuenta.**
- **Por debajo de 1240px no se enseña.** Ahí la columna de texto deja menos de 50px de aire hasta la
  pila. No se encoge más: se quita. El encogido que sí lleva —`scale:.9` en el contenedor— va en la
  caja y no en cada pieza, para que el recurso conserve exactamente sus proporciones y sólo cambie de
  tamaño; reescribir sus medidas una a una habría sido otra tarjeta que se le parece.

## Estado a 8 septiembre 2026 — la autoridad de la home, debajo de las utilidades

Petición del cliente. El bloque **«Un sistema que se adapta a tus procedimientos, no al revés»**
—las cuatro cifras y la foto de ambiente— iba detrás de la franja de clientes, abriendo la página, y
pasa a **detrás de la sección de utilidades** («Captura todos los datos de la planta y guía a tus
equipos al siguiente nivel»).

El orden de la home queda: **hero → utilidades → autoridad → para quién es → …**

Por qué importa el sitio y no es sólo mover un bloque: delante, «se adapta a tus procedimientos» era
una promesa que la página aún no había demostrado; detrás de las cuatro filas de escenas es la
explicación de lo que se acaba de ver, y las cifras (+100 empresas, 64 sistemas conectados, 2-3
semanas, +70.000 €) caen sobre un lector que ya sabe qué hace el producto.

No hay cadenas nuevas —el bloque se mueve entero, con su comentario y sus pendientes de cliente—,
así que el catálogo no se mueve: 1.470 al 100 % en los cuatro idiomas. Las 22 páginas de cada idioma
se regeneran igualmente, porque el orden del marcado es el del español.

## Estado a 8 septiembre 2026 — las dos páginas de industria estrenan el rotador

Petición del cliente: **«haz esta sección como la de *Registra la incidencia, asígnala y demuestra
su cierre en el mismo circuito*»**, que es el rotador de capacidades de `/incidencias/` (patrón 12
de `ds/sections.css`). Las dos secciones que lo reciben son gemelas y venían de la 2.0:

| Página | Sección | Antes |
|---|---|---|
| `/industria-general/` | «Un único sistema para coordinar la planta y estandarizar cada proceso» | `.split`: cinco puntos numerados + foto |
| `/industria-alimentaria/` | «Registra, controla y mejora sin salir de la línea» | `.split`: cinco `.feat` con tic + foto |

**Cinco puntos, cuatro capacidades.** Un punto que no se puede enseñar no es una capacidad: la
capacitación integrada entra en el cuerpo del registro (que es donde vive la pauta) y la generación
de documentos entra con la auditoría. Es el mismo criterio con el que `/incidencias/` repartió sus
seis textos en cuatro el 7 de septiembre.

**Las cuatro pantallas están copiadas, no mudadas** — el registro en la tablet, la ventana de
Informes y el móvil de incidencias vienen de `index.html`; la tabla de acciones viene del rotador de
`/incidencias/`. **Cada una existe ahora en tres ficheros**: un identificador o una cifra que se
toque en una hay que tocarla en todas. Al copiarlas se les quita el `data-span`, el `data-ratio` y
el `scene__expand` —dentro del rotador manda el rotador, y aquí no hay diálogo que abrir— y el
`<button>` pasa a `<article role="tabpanel">`.

> **La tabla de acciones se copió primero de la home y hubo que cambiarla.** Allí es una escena de
> cuatro columnas con dos filas, y en el panel 4:3 del rotador dejaba media tarjeta en blanco. La
> del rotador de `/incidencias/` trae cinco filas y el gesto de filtrar, y ya estaba calibrada para
> esta caja. **Al copiar una escena a un rotador, la fuente es otro rotador si existe.**

**Lo que estas páginas no cargaban y ahora sí:** `ds/device.css`, `ds/app.css`, `ds/rotador.js` y la
familia **Roboto**, que es la tipografía de las pantallas de producto. Sin eso el marcado se pinta,
pero no es la app.

**Se pierden las dos fotos** (`general-movil-taller.webp`, `alimentaria-operaria-tablet.webp`) y con
ellas los estilos en línea de la 2.0 que traía cada sección —pesos, `--blue`, tamaños escritos a
mano—. La fotografía de planta sigue en «En planta», que es donde el sistema la quiere.

**19 cadenas nuevas**, traducidas a mano en `i18n/traducciones/08-industrias-appcc.json`; catálogo de
1.470 al 100 % en los cuatro idiomas. `check:seo` y `check:voz` pasan.

## Estado a 8 septiembre 2026 — la banda de `/incidencias/`: cuatro canales nuevos y la calle de la IA

Petición del cliente. La banda que abre la página decía **«Entran sin estructura. / Salen
normalizadas.»** y ahora dice **«Reporta incidencias en cualquier formato / y desde cualquier
lugar.»**: el argumento pasa de *lo que entra está roto* a *da igual por dónde entre*.

- **Los cuatro canales cambian**: WhatsApp → **Teams**, la llamada → **nota de voz**, el parte a
  mano → **plantilla de Solved** (con su control en KO, que es de donde nace la incidencia). El
  correo se queda. Con la plantilla dentro, una de las cuatro entradas ya llega con estructura, y
  por eso el titular no puede seguir hablando de formato roto.
- **La generación pasa por fuera de las tarjetas, no por encima.** Los hilos eran un SVG a
  `inset:0` sobre toda la convergencia —el trazado nacía debajo de las tarjetas— y el pulso del
  núcleo llegaba a tocarlas al escalar. Ahora hilos y núcleo viven dentro de **`.canales__paso`**,
  que es la columna del medio de la rejilla: la calle. Ancho **128 px en la caja** y 150 en la
  variante ancha, y no es libre —el anillo escala ×1,5 sobre un núcleo de 48, así que por debajo de
  ~90 px vuelve a tocar las tarjetas—.
- **La tarjeta que se va ya no viaja al núcleo, se apaga en su sitio.** Salía con
  `translate3d(46px)` y esos 46 px la metían en la calle justo cuando entran los hilos. El viaje lo
  cuenta el hilo; para eso está. Y hay un **quinto trazado**, el de salida, que va del núcleo a la
  ficha con la ficha, no con las entradas.
- La ficha de salida no se toca: sigue siendo `UTD26_163_001`, la fuga de la cinta L3, la misma que
  sale en la home y en las escenas de esta página.
- `ds/aiband.css` sube a **`?v=20260908b`** en las 16 páginas que la cargan. Catálogo al 100 % en
  los cuatro idiomas; `check:seo` y `check:voz` pasan.

> **`.aiband--docs` (la variante de documentos de `/auditorias/`, sin uso desde el 7 de septiembre)
> no tiene la calle.** Si algún día se resucita, su marcado necesita el `.canales__paso` alrededor
> de los hilos y el núcleo, o el núcleo se le queda pegado al borde izquierdo de su columna.

## Estado a 8 septiembre 2026 — la sección de escenas de la home, rehecha

Todo lo de este bloque toca **una sola sección de `index.html`**: la que iba detrás del bloque de
autoridad y enseñaba las seis escenas de producto. Venía siendo una rejilla de seis tarjetas
idénticas —seis de doce columnas, todas cuadradas— y sale como cuatro filas desiguales con la IA
abriendo. Peticiones del cliente del 8 de septiembre, en el orden en que llegaron.

### El encabezado: de la implantación modular al dato

El encabezado corrido (`.section-head--flow`) decía **«Empieza por un módulo y amplía cuando lo
necesites, sin cambiar de sistema»** y ahora dice **«Captura todos los datos de la planta y guía a
tus equipos al siguiente nivel»**, con el párrafo de apoyo reescrito. El anterior vendía la forma de
implantar; el nuevo vende para qué.

> **Se lleva por delante las únicas menciones de la home a «acciones correctivas» y «plantillas».**
> Aquel párrafo las enumeraba a propósito: al pasar esta sección de «módulos» a «utilidades» (14 ago)
> las tarjetas dejaron de nombrarlas y éste era el único sitio donde quedaban escritas. Si hacen
> falta por SEO, el sitio es el pie de las tarjetas, no el encabezado, que se pinta a tamaño display
> y no admite un bloque de texto.

El hueco entre titular y párrafo es de **4 px** y no es un fallo: `--flow` los pinta en línea y el
espacio en blanco del marcado, con el `letter-spacing` negativo del display, mide eso. Estaba igual
antes del cambio —comprobado contra `HEAD`—, así que no se toca sin decidir tocarlo.

### El reparto nuevo: cuatro filas, ninguna igual

| Fila | Escena | `data-span` · `data-ratio` |
|---|---|---|
| 1 | **IA** | 12 · 21:9 |
| 2 | Incidencias · **Registros** | 4 `fila` · 8 · 4:3 |
| 3 | **KPIs** · Acciones | 8 · 4:3 · 4 `fila` |
| 4 | **Integraciones** | 12 · 21:9 |

Las filas mixtas ya estaban previstas en `ds/scene.css` (`data-ratio="fila"`: la estrecha renuncia a
su proporción y toma el alto de la fila). Lo que hubo que añadir son **dos reglas de encuadre** que
no existían, y las dos por lo mismo: un aparato apaisado dentro de una caja que no es la que el
recorte suponía.

- `.scene[data-span="8"] .scene__media[data-crop="dev-br"]` — la tablet de registros entera de ancho
  y sangrando sólo por abajo. Con el 104 % de la regla general se salía por abajo y **se llevaba la
  firma y el informe**, que es justo lo que la tarjeta promete.
- `.scene[data-span="4"][data-ratio="fila"] … [data-crop="dev-br"]` — al revés: en la caja alta y
  estrecha el aparato se quedaba a media altura con medio lienzo vacío debajo. Crece y baja.
- `.scene[data-span="12"] .scene__media[data-crop="b"]` — como `br` pero **sin sangrado por la
  derecha**. Es para la escena de IA: la pregunta del usuario va pegada al margen derecho, así que
  con sangrado lo que se corta es exactamente la pregunta.

### Los cuatro fragmentos, uno por uno

**Registros — el registro se responde delante de quien mira.** Antes era una ronda ya firmada, con
UNA píldora por control que traía la respuesta puesta. Ahora cada control tiene **sus dos botones, OK
y KO, como en la app**, y lo que se anima es el que se pulsa: de vacío —fondo blanco, borde y letra
del color— a lleno —color de fondo, letra blanca—. Los dos botones están desde el primer fotograma:
la plantilla ya existe, lo que ocurre delante es que alguien la responde. Uno cada medio segundo
sobre el reloj de 8 s, el contador de cabecera sube (6 → 9 → 12 de 12) y **al cerrar aparece la firma
con el informe ya generado**, que es el segundo verbo del titular nuevo.

Cuatro detalles que no son gratis: el color vive en `--c` y no repetido en cada regla, porque el
fotograma tiene que interpolar entre los dos estados y necesita el mismo valor a los dos lados; el
**saltito del 6 %** es el acuse del toque y va ANTES de que cambie el color, que es el orden en que
ocurre de verdad —primero el dedo, después el estado—; el código de la incidencia entra **medio
segundo después** de que se pulse el KO, porque primero se marca mal el control y entonces nace la
incidencia; y los valores del contador son **texto en el HTML, no `content` de CSS**, porque el
catálogo de traducción sólo ve el marcado.

La píldora `.app__opt` **sólo existe en esta pantalla** —comprobado en las 704 páginas—, así que
rehacerla no arrastró nada. Si algún día se reutiliza en otro sitio, ojo: ya no es «un resultado», es
«una opción elegible».

**KPIs — el mismo tablero con el menú contraído** (`.app__side--min`). Es un estado real de la app y
gana 88 px para el tablero. **Los rótulos no se borran, se tapan:** borrarlos los caería del catálogo
y volverían sin traducir el día que alguien despliegue el menú.

**IA — la conversación entera, no su resultado.** Enseñaba una respuesta ya escrita, que la puede
fingir cualquiera. Ahora se ve el gesto: se escribe la pregunta (la burbuja crece con ella), la IA
piensa, y contesta **con palabras y con un gráfico** —la función que lo justifica es la de generar
informes con gráficos—. Cuatro tiempos a un solo reloj de 12 s: 0–18 % teclear, 18–30 % pensar,
30–40 % el texto, 42–54 % las barras. **Si se toca un número hay que tocar los cuatro**, o la IA
contesta a media pregunta. El tecleo no lleva `steps()`: a ese cuerpo de letra los saltos de carácter
se leen como un tartamudeo, y lo que vende el gesto es el cursor de la punta.

**Integraciones — el puente en la carátula.** Había una rejilla de ocho logotipos —un catálogo, no
una demostración— y el puente sólo se veía al abrir la tarjeta. Ahora la carátula enseña lo mismo que
hay dentro. Es una **copia** del puente del diálogo, no el mismo nodo: un `<dialog>` no presta su
contenido a la página. **Si se toca uno hay que tocar el otro**, y la copia lleva sus propios
identificadores de SVG (`…-cara`): dos `<defs>` con el mismo id resuelven los dos al primero.

### Tres cosas que llevaban rotas un tiempo y se veían como si funcionaran

**1 · La bolita del esquema de incidencias, parada en su burbuja.** Dos fallos encadenados. El
primero: `animation-delay` no pinta el fotograma 0 % mientras espera, así que durante los 4 y 8
segundos de espera el cable se pintaba con el valor propio del elemento —que no había—, y el
`stroke-dashoffset:0` por defecto es la bolita puesta en el origen. El segundo, más tonto: el valor
con el que la animación la «apartaba» el resto del ciclo, -420, **no la apartaba**, porque el patrón
medía 14+400=414 y a -420 el guión volvía a entrar por el principio. Los dos se arreglan con
`pathLength="100"` en los tres trazados y un hueco de 1000: los cables miden lo mismo para el CSS y
un solo juego de fotogramas sirve para los tres. **De paso se arregló la sincronía**: el -300 era
tres veces el cable, así que la bolita llegaba al teléfono en 0,45 s y la incidencia nacía en 1,32 s.

**2 · El cable del puente de integraciones, invisible desde siempre.** Se revelaba con una máscara
SVG cuyo trazado interior se animaba. **Chrome no vuelve a pintar una máscara cuando lo que se anima
está dentro de ella**, así que la máscara se quedaba en su primer fotograma —nada revelado— para
siempre. El cable no se veía ni en la carátula ni en el diálogo. Ahora se queda puesto y quieto —es
un cable, existe— y la animación la lleva la bolita que lo recorre, que además es la que dice lo que
hay que decir. La máscara sigue en el marcado, abierta del todo. Si algún día se quiere el efecto de
dibujado, **la salida no es reanimarla**: es un `clip-path` sobre el propio elemento, que sí invalida.

**3 · Los rótulos del esquema, montados unos sobre otros.** Al pasar de una palabra —«Máquina»,
«ERP»— a nombrar el canal entero —«Correo de proveedor/cliente»—, tres etiquetas `nowrap` a 31/50/69 %
se pisaban hasta ser ilegibles. Ahora parten en varias líneas con el ancho de la calle entre burbujas,
las burbujas se abren a 16/50/84 % y el cuerpo escala con la tarjeta acotado por los dos lados.

### Y el esquema de incidencias, con los orígenes de verdad

Los tres orígenes eran «Sensor IoT · ERP · Máquina» —dos de ellos vías por las que el dato entra
solo— y pasan a ser **«Correo de proveedor/cliente · ERP/MES/GMAO · Plantillas Solved»**. Con la
etiqueta cambia el icono (`.bico` con los iconos del brandbook: `mail.svg` y `lista.svg`; el de en
medio se queda con el logotipo de SAP) y **las tres fichas del teléfono ROTAN**: cada texto se va con
la burbuja a la que pertenece. Una reclamación llega por correo, una parada la canta el MES o el
GMAO, una temperatura fuera de rango sale de un control de la plantilla. Cambiar el rótulo dejando el
texto habría puesto «Temperatura fuera de rango» a nombre del correo de un cliente.

Al pasar la tarjeta a cuatro columnas el hub bajó de 616 a 272 px y con él todo lo que mide en `cqw`:
el teléfono se quedó en 92 px y las fichas, ilegibles. Hay una consulta de contenedor
(`@container (max-width:400px)`) que hace lo contrario de encoger: el teléfono y las burbujas ocupan
**más** proporción de la caja, porque lo que hay que leer tiene un tamaño mínimo por debajo del cual
la escena no demuestra nada.

`ds/app.css` sube a `?v=20260908a` y `ds/scene.css` con él, en las 75 páginas que los cargan.

### Ginés pasa a llamarse Javier, en todo el sitio

El operario que firma los registros y aparece como usuario de las pantallas de producto se llama
**Javier** desde el 8 de septiembre de 2026. Son 42 apariciones y no todas están donde uno miraría:

- Los **HTML españoles** (`index.html`, `/incidencias/`, `/auditorias/`, `/gestion-de-calidad/`). Los
  de `en/`, `fr/`, `it/` y `de/` son artefactos: salen solos del build.
- El **catálogo de traducción**. En `00-invariables.json` el nombre está marcado `"="` —intraducible—,
  así que la entrada hay que renombrarla; y las cadenas que lo llevan dentro («26/06/2026 · 08:42 ·
  Javier», «Firmado por Javier…») son CLAVES del catálogo, así que cambia la clave y con ella las
  cuatro traducciones.
- **La inicial del avatar**, que era una G. Un avatar «G» junto a «Javier» se lee como otra persona.
- **Los reels de `guidelines/`, y con ellos los vídeos.** `ia.registros.reel.html` e
  `ia.banda.reel.html` escriben el nombre en pantalla, así que hubo que **regrabar los dos MP4** con
  `npm run render:registros` y `npm run render:ia`. El de `incidencias.reel.html` también lleva el
  nombre, pero su vídeo no lo usa ninguna página publicada: se cambió la fuente y no se regrabó.

> **Al regrabar se cayó el servidor local** (`npm run serve` murió con SIGTERM mientras Puppeteer y
> ffmpeg trabajaban). No es un fallo del sitio; si pasa, se vuelve a levantar y ya.

### Los tres cuadros de `/incidencias/`, que ya no repiten la home

La sección «Detecta» llevaba la banda de IA y **cuatro escenas que eran las mismas que las de la
home**: el listado en el móvil, la tabla de tareas, el tablero y la rejilla de logotipos. Quien
llegaba desde la portada veía dos veces lo mismo y esta página no añadía nada. Salen las cuatro y
entran tres que la home no cuenta (petición del cliente, 8 sep 2026). La banda de IA se queda: es el
primer paso del relato —por dónde entra el aviso— y no está en ningún otro sitio.

| Cuadro | Reparto | Qué enseña |
|---|---|---|
| Plantillas por tipo de incidencia | 8 · 4:3 | Los tres tipos se relevan en el filtro y **cambia la lista de campos entera** |
| Asignar a cualquiera del equipo | 4 · `fila` | El selector abierto, con los departamentos a la vista |
| Causa raíz → registro programado | 12 · 21:9 | El reparto de causas y el registro que sale de la que más se repite |

**Las cuatro escenas retiradas siguen vivas** más abajo, dentro del rotador de capacidades, que es
donde tienen su sitio: allí el usuario las pide una a una. Copia de seguridad del marcado retirado en
el scratchpad de la sesión, y en git.

Decisiones que costaron y conviene no deshacer:

- **Las tres plantillas se apilan en la misma celda de rejilla**, no van en secuencia. Tienen cinco y
  seis campos, y en secuencia la caja pegaba un salto de alto cada vez que cambiaba el tipo. Con
  `align-items:start` además, o la lista corta deja una franja vacía dentro de su propio recuadro.
- **La barra del reparto de causas NO es `.app__fill`.** Esa es la del tablero, y el tablero la anima
  con `.app__break:nth-child(1) .app__fill{ animation-name:… }` —dos clases, más específico que
  cualquier `.app__fill--loquesea`—, con fotogramas que animan el ANCHO con los valores del turno.
  Reusándola, las tres barras se quedaban en el ancho del tablero, que resultó ser cero: el reparto
  salía vacío **sin dar ningún error**. Va con clase propia, `.app__rfill`.
- **`.app__asigna` y `.app__raiz` viven fuera de `.app`**, así que hay que meterlos en el selector que
  declara los tokens del producto (`.app, .bridge, …`). Una variable que no existe deja la
  declaración inválida y lo que se hereda no se parece a nada.
- El titular de doce columnas pasa a **cuatro líneas**: «Analiza la causa raíz y programa registros
  para asegurarte de que no se repite» son 76 caracteres y a tres se cortaba con puntos suspensivos
  justo antes de la promesa.

Catálogo: 48 cadenas nuevas en `16-cuadros-incidencias.json` y los cuatro nombres del equipo en
`00-invariables`. Sube a **1.457 cadenas**, al 100 % en los cuatro idiomas. `ds/app.css` y
`ds/scene.css` van a `?v=20260908b`.

### Aviso: `/incidencias/` se editó desde fuera mientras esto se hacía

El 8 de septiembre, con esta sesión abierta, alguien montó en `/incidencias/` los **cuatro canales**
del encabezado —Teams, correo, nota de voz y plantilla de Solved—. Llegaron **siete cadenas nuevas
sin traducir**, que se habrían horneado en español en los cuatro idiomas al siguiente `build:i18n`.
Se tradujeron a mano en `03-incidencias-a.json` (y «Teams» entra en `00-invariables`). El catálogo
vuelve a estar al 100 %: 1.405 cadenas.

Volvió a pasar dos veces más la misma tarde: en **`ds/app.css`** —alguien metió `.bridge` en el
selector de tokens del producto y una capa `.bridge__halo`, mientras aquí se arreglaba el cable del
mismo componente— y en **`/gestor-documental/`**, editado a las 17:17 justo entre un `i18n:extract`
que dio 100 % y el `build:i18n` de dos minutos después, que se encontró **seis cadenas nuevas sin
traducir** y las horneó en español en los cuatro idiomas. Se tradujeron a mano en `04-registros.json`
y se volvió a construir; si esa página sigue cambiando, **hay que repetir extract y build**.

Van cuatro veces en dos días. La regla sigue siendo la misma: **antes de cortar nada, copia del
fichero**; y `i18n:extract` y `build:i18n` **se ejecutan seguidos**, mirando `git status` en medio —si
alguien tocó una página entre los dos, el build hornea español en los cuatro idiomas sin avisar de
qué página fue.


## Estado a 8 septiembre 2026 (2) — el puente de Integraciones: el cable se enchufa, no atraviesa

Cuatro arreglos sobre la misma pieza —`.bridge`, en la carátula de la home y dentro del diálogo
`u-integra`—, y tres de ellos son bugs que llevaban meses puestos.

**1. El cable se anima.** Los puntos desfilan hacia la ventana (`bridge-flow`, 2,4 s, un
desplazamiento de −3,2 que es exactamente punto + hueco, así que el ciclo cierra sin salto). Se anima
sobre el trazado visible y no dentro del `<mask>`, que es lo que Chrome no repinta y lo que dejó el
efecto anterior muerto.

**2. El cable ya no atraviesa la pantalla.** Moría DENTRO de la ventana, cruzando por encima de la
interfaz. Un cable no atraviesa una pantalla: se enchufa a su canto. El ancho del SVG se ajusta para
que su extremo caiga sobre el borde izquierdo del aparato —`12,6 %` en la carátula y `11,4 %` en el
diálogo, que son dos cajas de proporciones distintas— y baja un poco (`top` 19 % y 21 %) para que el
remate no caiga sobre la banda azul de la cabecera.

**3. Hay conector.** Un punto en el extremo del trazado, con filo blanco para que se lea sobre azul,
sobre gris y sobre blanco, y un halo que **no late todo el rato**: se enciende en el 46 % del ciclo de
9 s, que es el fotograma en el que la bolita llega a la ventana, y se apaga cuando emprende la vuelta.

**4. Los tokens del producto llegaban sólo a la ventana.** `--app-blue`, `--app-ok`, `--app-line`… se
declaraban en `.app`, y la ficha del ERP y el cable son **hermanos** de `.app`, no descendientes. Todo
lo que vive fuera de la ventana se quedaba sin color: el punto de «Conectado» y los «Parte creado» en
gris en vez de verde, las separaciones del registro invisibles, los códigos sin tinta y —lo que más
costaba— **la bolita del cable con `stroke:none`**, porque una variable que no existe deja la
declaración inválida y el valor heredado es el `fill="none"` del `<svg>`. Es decir: la animación que
la ficha de este componente decía que era la que contaba la historia no se veía. Los tokens pasan a
`.app, .bridge`; la caja de la pantalla —fondo, `display`, tipografía— se queda sólo en `.app`, porque
compartirla le daba a `.bridge` el lienzo `--app-canvas` a toda la escena.

**Y la carátula pierde el panel de fondo.** `.scene__media--suelto` (nuevo, en `ds/scene.css`) quita
la sombra del contenedor, y con ella el rectángulo redondeado que la dibujaba: en el encuadre de esta
escena la parte que queda a la izquierda de la ventana está vacía, y con panel se leía como una
segunda pantalla blanca detrás de la composición. No es la norma —la sombra de `.scene__media` es la
única del componente y en una escena con captura sigue haciendo falta—: es la excepción para las
composiciones que ya traen su propia elevación.

Con movimiento reducido no desfilan los puntos ni late el halo, y el conector se queda encendido: ahí
lo que cuenta es el estado, no el movimiento.

**Los dos puentes se han tocado a la vez**, que es lo que pedía la nota del marcado: son copias, no el
mismo nodo, porque un `<dialog>` no puede prestar su contenido a la página.

## Estado a 8 septiembre 2026 — `/gestion-de-calidad/`, réplica de la página de solución de Mitti

Encargo directo: **replicar `mitti.com/es/gestion-de-la-calidad` con los datos de Solved**. Sale una
página nueva, `/gestion-de-calidad/`, que **no es una landing de módulo**: es una página de
**solución**, del mismo rango que las dos de sector, y agrupa los siete módulos bajo el ámbito de uso
que más consultas trae. Por eso no le aplica la regla del día anterior —dos secciones de contenido por
landing—: no vende un módulo, los ordena.

**Qué se copia de Mitti y qué no.** Se copia el **orden de la página**, que es lo que se pidió: hero,
cinta de clientes, el problema, cuatro bloques de plataforma con sus capacidades de apoyo, las
plantillas de arranque, el catálogo de funciones, el reparto por ámbito, la prueba con cifras y cita,
la biblioteca de recursos, las soluciones relacionadas, la FAQ y el contacto. **No se copia una sola
frase suya**, ni su paleta ni su interfaz. El copy sale de `guidelines/voz.md` y los datos, de lo que
ya existe en este sitio.

| Sección de Mitti | Cómo queda aquí |
|---|---|
| Hero con iPad | La hero del sistema, con el shader y la tira MCP |
| «Con la confianza de empresas de todo el mundo» | La cinta de 29 logos de la home |
| «¿Están sus equipos preparados…?» | **Enunciado, no pregunta**: `voz.md` reserva las preguntas para la FAQ. Rejilla de dolor de cinco celdas |
| Cuatro bloques de plataforma | `.reasons--cuadro` de cuatro celdas, cada una con su enlace al módulo —que es su «capacidad de apoyo»— y una escena de planta a lo ancho debajo |
| «Empiece con las plantillas» | **No se inventa una biblioteca de plantillas**: se cuenta lo que Solved hace de verdad, importar el documento que la planta ya tiene y estructurarlo como plantilla, que es el vídeo de IA de `/auditorias/` |
| «Vea cómo funciona en diferentes industrias» | Reparto **por norma** (APPCC, ISO 22000, certificaciones, homologación) y no por sector: el sector ya tiene sus dos páginas y repetirlo sería competir con ellas por la misma consulta |
| «Explore las funciones» | Carril recortado con los siete módulos |
| Carrusel de tres testimonios con su cifra | La banda `.ds-stats` con cuatro cifras reales + **una** cita, que es la regla del sistema. Lácteos Romar, porque quien habla es responsable de sistemas de gestión |
| Biblioteca de plantillas en cuatro columnas | **Patrón 13 nuevo, `.reslib`**: veinte enlaces a posts del blog y fichas del glosario que ya existen. Enlazar a un recurso que no existe cuesta más confianza de la que gana |
| «Explorar soluciones relacionadas» | `.case-list` con los dos sectores, integraciones y casos de éxito |

**Lo único que se añadió al sistema es `.reslib`** (patrón 13 de `ds/sections.css`, 45 líneas): cuatro
columnas de enlaces bajo un rótulo separado por una línea. No es una `.reasons` con más hijos —aquélla
es una frase a dos tintas con un enlace al final, ésta es un rótulo con una lista— y por eso se separa.
Los enlaces van en gris y sólo pasan a tinta al pasar por encima: veinte líneas en azul seguidas se
leen como un error de maquetación. Al tocar la hoja se sube su cache-buster a `?v=20260908a` en las 90
páginas que la cargan.

**Ninguna cifra ni ninguna cita son nuevas.** Las cuatro de la banda salen de la de `/auditorias/`
—indicadores registrados por clientes durante su primer año— y la cita, del webinar de Lácteos Romar.
Las cifras de Mitti son de sus clientes y no se traen.

**Está registrada en `STATIC_PAGES`** (`scripts/config.mjs`) y en el sitemap, que pasa de 410 a 411
URLs. `check:seo` pasa (704 HTML, ✔ sin fallos) y `check:voz` también (0 fallos, 0 avisos).

**Lo que le falta, y es lo primero de la lista de pendientes:** no está traducida ni enlazada desde la
navegación. No lleva `hreflang` a propósito —las alternates apuntarían a cuatro páginas que no
existen— y no se ha tocado `chrome.js`, porque un enlace en la nav o el pie aparecería también en los
cuatro idiomas apuntando a una URL española. Entra en `i18n/config.mjs` (`RUTAS` +
`PAGINAS_CATALOGO`) el día que se traduzca.

## Estado a 7 septiembre 2026 — las landings de producto, más cortas

**Decisión de negocio:** una landing de módulo enseña la propuesta de valor y las características
principales, y **deja sin responder «¿cómo se hace esto?» y «¿esto encaja con lo que ya tengo?»**.
Ese hueco es el que tiene que llevar al formulario. Las siete páginas de módulo pasan de tres a seis
secciones de explicación a **dos de contenido** más la prueba (cifras y cita), la FAQ y el contacto.

| Página | Prosa antes → ahora | Secciones retiradas |
|---|---|---|
| `/incidencias/` | 1.126 → 648 | Causa raíz · **Demo guiada** |
| `/gestion-de-activos/` | 1.367 → 937 | Cómo funciona · Qué engancha · Para quién |
| `/gestor-documental/` | 1.198 → 1.001 | Ciclo de vida · Para quién |
| `/no-conformidades/` | 986 → 767 | Casos de uso |
| `/ia/` | 933 → 777 | Preguntas · Cómo está hecha |
| `/auditorias/` | 838 → 644 | Planifica · En planta |
| `/dashboard/` | 683 → 662 | En planta |

- **La demo guiada de `/incidencias/` se retira entera** —304 líneas, su hoja
  `assets/tour/incidencias-tour.css`, su script y el CTA secundario de la hero, que ahora dice
  «Plantear un piloto» y va al formulario—. Era el mayor «cómo se hace» del sitio y por eso sale.
  **El marcado no se pierde: está en git.** Se recupera con
  `git show HEAD~1:incidencias/index.html` (sección `id="demo-guiada"`), y los assets del recorrido
  (`assets/tour/`) siguen en el repositorio porque las escenas de la página los usan.
- **Las FAQ se quedan.** Responden justo lo que la página deja abierto, así que son la excepción
  consciente: llevan el JSON-LD `FAQPage` de las siete páginas, que es señal de SEO y lo que más se
  cita en respuestas de IA. Perderlo salía más caro que el hueco que tapan. Son también, por eso,
  las que ahora hacen larga a `/gestor-documental/` (320 palabras de FAQ) y a
  `/gestion-de-activos/` (353).
- **«El límite» se queda en activos y en gestor documental** —«si ya tienes un GMAO, Solved no viene
  a sustituirlo»—, aunque responde a la pregunta del encaje. Es la diferenciación que el análisis de
  las 955 reuniones señalaba como ausente en la web y que el competidor directo sí publica; retirarla
  para ganar 150 palabras no compensa. Si se decide que también sobra, salen las dos juntas.
- **Nota de contacto** (`.form-card__nota`, `ds/site.css`): encima del formulario, una línea por
  página que **enuncia** las consultas que la landing ya no resuelve —integración, configuración
  sobre procedimientos propios, alcance del piloto— sin resolverlas. Va en afirmativo: la ficha de
  voz sólo admite interrogaciones en las FAQ. Traducciones a mano en
  `i18n/traducciones/12-contacto.json`. `ds/site.css` sube a `?v=20260907a` en las 655 páginas.
- El catálogo baja de **1.589 a 1.412 cadenas** y sigue al 100 % en los cuatro idiomas.
  `check:seo` pasa (702 HTML, 410 URLs, 975 bloques JSON-LD) y `check:voz` también.

### Dos secciones por landing de módulo, y ninguna más

Regla del cliente (7 sep 2026): **una página de módulo tiene como máximo dos secciones de
contenido**, más la prueba (cifras y cita), la FAQ y el contacto.

| Página | Las dos que quedan |
|---|---|
| `/incidencias/` | Detecta · Capacidades |
| `/auditorias/` | IA + «Qué hace» **fundidas en una** · Ámbitos |
| `/no-conformidades/` | Circuito · Producto |
| `/gestion-de-activos/` | Composición · Producto |
| `/gestor-documental/` | La carpeta · Qué trae |
| `/dashboard/` | El mes · Qué responde |
| `/ia/` | Vídeo · Funciones |

Retiradas en esta pasada: «Dolor» y «El límite» de activos y documental, «En planta» de `/ia/`, y
«Lo que sale» de registros. **Con «El límite» se va la diferenciación** —«si ya tienes un GMAO,
Solved no viene a sustituirlo»—, que el análisis de las 955 reuniones señalaba como ausente en la web
y que el competidor directo sí publica. Está en git y se recupera de `HEAD`.

**La fusión de `/auditorias/`** mete la banda de IA y las seis celdas del módulo en una sola sección.
La sección **ya no tiene encabezado propio**: tenía uno —«Convierte los partes que ya tienes…»— y el
cliente lo quitó porque decía lo mismo que el titular de la banda. Así que **el titular de la banda
es el de la sección**, y por eso `.cab__t` pasó de h3 a h2: sin encabezado arriba, un h3 haría saltar
la página de h1 a h3. Debajo va el **sub-encabezado** (`.section-head--sub`, `ds/site.css`) con el h3
de lo que era «Qué hace» y sus rótulos de celda bajados a h4.

El sub-encabezado mide **30px, y la medida no es libre**: el titular de la sección es el de la banda
(32px), así que el capítulo tiene que quedar por debajo. A 38 —lo que midió primero— pesaba más que
la sección que lo contiene y volvía a leerse como dos secciones. Lo que los separa es aire, 72px, sin
regla horizontal entre banda y rótulo.

> **Trampa que costó una captura entera:** al mover el bloque dentro de la sección, el `</div>` que
> cierra `.aiband` se quedó DEBAJO, así que la banda se tragaba el sub-encabezado y las seis celdas
> —texto oscuro sobre grafito, ilegible— y el DOM quedaba mal anidado. **`check:seo` no valida
> anidamiento y pasó igual.** Si se mueve marcado dentro de una sección con banda, hay que mirar
> dónde cierra la banda, no sólo dónde acaba la sección.

**Ojo con las ediciones en paralelo:** el 7 de septiembre `/auditorias/` se estuvo editando desde
fuera de esta sesión (secciones «Ámbitos» y «Lo que sale», y el renombrado de las etiquetas
`Auditorías ·` → `Registros ·`) mientras aquí se trabajaba. Trabajo **sin commitear no se recupera de
git**: antes de cortar nada, copia del fichero. Las 28 cadenas que llegaron con esas secciones se
tradujeron a mano en `i18n/traducciones/15-ambitos-registros.json`.

### El bloque de contacto: vídeo en vez de foto de banco

La foto que acompañaba al formulario en las **75 páginas** era de banco y se notaba —una técnica con
tablet en lo que no era una planta—. Ahora hay **cinco segundos de una operaria cumplimentando un
registro junto a la línea**, en bucle, mudos y sin controles: `assets/registro-tablet-planta.mp4`
(346 KB), que llevaba en el repositorio sin usar, con su póster
`assets/contacto-registro-planta.webp` sacado del propio clip.

- **No se descarga hasta que se ve.** El `src` vive en `data-lazy` y lo pone `chrome.js` al asomar;
  el bloque está al final de la página y son 75 páginas. Se pausa al salir de pantalla y con
  `prefers-reduced-motion` no se pone nunca: se queda el póster, que es un fotograma del vídeo y
  cuenta lo mismo. Misma regla que el vídeo de la banda de IA.
- **`height:auto` en `.contact__v` no sobra.** Los atributos `width`/`height` del marcado entran como
  hint de presentación y fijan 720px de alto; con un alto explícito la proporción no se aplica y el
  vídeo salía a 519×720 en vez de 519×389. Costó una pasada.
- **El encuadre es del componente:** el clip es 16:9 y aquí se recorta a 4:3 con
  `object-position:28% 50%`, porque la persona está a la izquierda y con el recorte centrado se le
  cortaban el brazo y la tablet.

**Y dos cosas que parecían rotas y sólo una lo estaba:**

- **Sí lo estaba:** el alto del iframe de HubSpot se medía sobre `body.scrollHeight`, que trae el aire
  del propio HubSpot, y dejaba un palmo en blanco debajo del botón. Ahora se mide el `<form>` —o el
  mensaje de gracias, si ya se ha mandado—.
- **No lo estaba:** el formulario mide 389px dentro de una tarjeta de 519. No es un fallo, es el
  padding de `.form-card` (64px por lado en escritorio). Comprobado antes de tocar nada.

### El formulario de HubSpot, vestido con la estética del sitio

El formulario se veía como HubSpot —DM Sans, etiquetas en negrita, campos grises de 40px y esquinas
de 15— porque **HubSpot lo pinta dentro de un iframe** y ninguna hoja de la página lo alcanza.

**Lo que lo hace posible:** ese iframe es `about:blank` —el embed v2 escribe dentro en vez de cargar
una URL—, así que es **del mismo origen** y se le puede meter una hoja. `chrome.js` lo hace en
`onFormReady`: inyecta la tipografía Geist y `ds/hsform.css`. Las rutas van absolutas (`ROOT`):
dentro de `about:blank` una relativa no resuelve contra nada.

- **Los tokens se copian, no se heredan.** Las variables viven en el `:root` de la página y el iframe
  tiene su propio documento: `hsform.css` declara los ocho valores que necesita. Si `ds/tokens.css`
  cambia uno, hay que cambiarlo ahí también.
- **Por qué tanto `!important`, y no es pereza:** el tema del formulario se sirve con reglas del tipo
  `.hs-form-<formId>_<instanceId> .hs-form-field label:not(.hs-error-msg)` —cuatro clases— y **el
  `instanceId` cambia en cada render**, así que no hay selector estable al que subirle la
  especificidad. Con la hoja detrás no basta: pierde por peso.
- **El alto lo sincroniza un `ResizeObserver`.** HubSpot mide su contenido y fija el alto del iframe
  ANTES de que lleguen nuestras reglas; sin esto, el botón se queda cortado por abajo.
- **Todo va en `try/catch` y no rompe nada si falla.** Si algún día HubSpot sirve el iframe desde su
  dominio, el navegador bloquea el acceso y el formulario se queda **sin vestir pero funcionando**,
  que es exactamente lo que había antes. La salida entonces no es pelear con el iframe: es montar el
  formulario en HTML propio contra la API de submissions de HubSpot.
- Cubre los dos formularios —el de contacto y el corto del gate de vídeo— y los cinco idiomas, porque
  `chrome.js` se copia a los cuatro. Comprobado también el **estado de error**: «Rellena este campo
  obligatorio» sale en el rojo de estado del sistema, a 12,5px, debajo del campo y sin caja.

`chrome.js` sube a `?v=20260907e` y con él `ASSET_VERSION`.

### El vídeo de IA de `/auditorias/`, con los tres casos de registros

La banda que se movía en la página se sustituye por **un vídeo grabado**, como el de `/ia/`, con tres
casos en vez de uno (7 sep 2026):

1. **el parte que ya existe se convierte en plantilla** —«Convierte este parte de control en una
   plantilla de registro»—, con sus secciones, controles y tipos;
2. **un cambio estructural pedido en lenguaje natural** —«Añade una sección de limpieza con tres
   controles y la firma del responsable»—, con la versión anterior guardada;
3. **una pregunta sobre el contenido de los registros que acaba en informe** —«¿Qué lotes se
   envasaron con la cámara 3 fuera de rango en junio?»— con su informe de trazabilidad.

- **El turno 1 abre con la zona de soltar**, no con una tarjeta: el recuadro de puntos con **los tres
  logotipos —Excel, PDF y Word— puestos desde el primer fotograma** (eran dos hasta el 8 sep 2026), «Suelta aquí el parte de control», el
  fichero cayendo dentro y la barra llenándose del 0 al 100 % entre el envío y la respuesta. Es el
  gesto que todo el mundo reconoce, y es lo que explica de dónde sale la plantilla sin una palabra
  más. La pieza (`.suelta`) vive en el `<style>` del propio reel y **no en `ds/aiband.css`**: es
  atrezo del vídeo, no un componente del sitio, y esa hoja la cargan once páginas de producción.
- **Tres ganchos nuevos en el reloj del reel, y sólo en éste:** `data-fase="pronto"` (la pieza entra
  con el turno y no con la respuesta, que es lo que permite que la zona esté puesta ANTES de mandar
  la pregunta), `[data-progreso]`/`[data-pct]` (la barra y el porcentaje, atados a la ventana entre
  el envío y la respuesta) y `[data-cae]` (el fichero, que entra por arriba al soltarlo).
- **Fuente: `guidelines/ia.registros.reel.html`**, hermana de `ia.banda.reel.html`: comparte el
  reloj, la barra que no se va nunca y la cartela. **El vídeo no se edita: se edita el reel y se
  vuelve a grabar** con `npm run render:registros` (23,8 s, 1,3 MB, `assets/ia/registros-reel.mp4`
  y su póster).
- **Un solo script de render para los dos reels.** `render-ia-reel.mjs` toma la página y el nombre de
  `REEL` y `NOMBRE`, así que no hay dos scripts que se separen con el tiempo.
- **El titular y el párrafo pasan a la página**: el vídeo no lleva texto de página —el suyo va
  dentro— y sin ellos la sección se quedaba muda. El h2 es el que ya venía de la banda, ahora a dos
  tintas con `.ds-dim`.
- **`.iavideo--grid` se muda de `ds/ia-dark.css` a `ds/aiband.css`.** Estaba en la hoja del tema
  oscuro de `/ia/` por accidente: es una variante del componente, y `/auditorias/` —que es una página
  de papel— no carga aquella hoja. `/auditorias/` estrena también `ds/aiband.js`, que es quien pone
  el `src` al entrar en pantalla y quien respeta `prefers-reduced-motion` dejando el póster.
- **La banda no se borra del sistema:** `.aiband--docs` y `.doc` siguen en `ds/aiband.css`,
  documentadas y sin usar, como `.compo--hueco` o `.stage--hueco`.

> **El vídeo está en español y se sirve igual en los cinco idiomas**, como el de `/ia/`: el texto va
> quemado en el MP4. Traducirlo es volver a grabar el reel con el catálogo puesto, cuatro veces, y
> mantener cinco ficheros. Antes de publicar los idiomas hay que decidir si eso se hace o si se
> asume.

### La banda de IA de `/auditorias/`: el documento que entra y la plantilla que sale (sustituida por el vídeo)



La misma pieza que abre `/incidencias/`, y **abre también esta página**: va justo detrás de la franja
de clientes, delante de «Qué hace». La función que le toca a registros es la **importación automática
de plantillas**: entra un Excel, un PDF o un Word —los partes que la planta ya tiene escritos— y sale la
plantilla de registro con sus controles y sus tipos (Número, Seleccionable, Archivos, Firma),
pendiente de frecuencia y planta.

> ✅ **RESUELTO EL 8 DE SEPTIEMBRE DE 2026: ENTRAN LOS TRES —EXCEL, PDF Y WORD—.** Durante un día las
> dos páginas dijeron cosas distintas —`/auditorias/` enseñaba Excel y PDF, `/ia/` decía Excel o
> Word— y el cliente cerró la contradicción hacia arriba: los tres formatos. Lo que se tocó:
>
> - **El reel** (`guidelines/ia.registros.reel.html`), que es donde vive el texto: tercer logotipo
>   —una W blanca sobre el azul de Word, `#185ABD`, dibujada en la página como los otros dos, que
>   tampoco son artes oficiales— y el rótulo pasa a «Excel, PDF o Word». **El vídeo se regrabó** con
>   `npm run render:registros`; el MP4 sube de 1,4 MB a 1,4 MB y con él su póster. El fichero que
>   cae sigue siendo el `.xlsx`: los tres formatos se anuncian en la zona de soltar, y en el gesto
>   sólo cae uno.
> - **`/ia/`**, las cuatro apariciones de «Excel o Word» —la ficha de la función, la FAQ visible y
>   sus dos copias en el JSON-LD— pasan a «Excel, PDF o Word».
> - **El catálogo**, en `06-activos-kpis.json` y `07-ia-integraciones.json`: las cadenas son las
>   claves, así que cambiar el español obliga a cambiar la clave y las cuatro traducciones a la vez.
>   Sigue en 1.400 cadenas al 100 %.
>
> **La URL del vídeo no lleva versión** (`/assets/ia/registros-reel.mp4`, sin `?v=`), así que a quien
> ya lo tenga en caché le seguirá saliendo el de dos logotipos. No importa mientras no se publique;
> el día que se publique, o se le pone versión o se le cambia el nombre.

- **Variante nueva `.aiband--docs`**, sobre `.aiband--canales`. Cambia una sola cosa, y es de fondo:
  **los documentos no desfilan, se quedan.** En `/incidencias/` las entradas entran y salen en bucle
  porque son avisos que van llegando por canales distintos; aquí son dos ficheros que alguien sube
  una vez, y verlos aparecer y desaparecer contaba algo que no pasa. Con dos tarjetas en vez de
  cuatro, además, el bucle se veía roto: la mitad del tiempo había una sola en pantalla y parecía un
  fallo de carga. Lo que se mueve es el haz y la plantilla que sale de él.
- **Las entradas tienen forma de documento** (`.doc`): hoja de papel claro, esquina recortada con su
  pliegue, el logotipo del formato y una vista previa —retícula para la hoja de cálculo, renglones
  para el PDF—. Papel sobre grafito a propósito: lo que entra viene de fuera de Solved, y esa
  distinción es la que cuenta la pieza. La regla de que «todo lo de IA va sobre grafito» sigue en
  pie; el documento no es la IA, es lo que la IA se come.
- **Los logos son SVG dibujado en la página**, no artes oficiales: no hay ninguna en el repositorio y
  no se hotlinkean. La retícula verde con la X y el rótulo rojo PDF, que es como se reconocen. Son
  marcas de sus titulares, el mismo criterio con el que `/integraciones/` enseña las suyas — si
  alguna vez hay que retirarlas, es sustituir dos `<svg>`.
- **El pliegue va dentro de la hoja.** La esquina se recorta con `clip-path` sobre `.doc`, así que un
  triángulo pegado en la mitad de fuera se lo come el propio recorte —pasó, y parecía un defecto de
  pintado—. El triángulo del reverso va en la mitad de dentro.
- `.aiband__tag--tipo`, etiqueta en tinta neutra: **el tipo de un control no es un estado**, y
  pintarlo del color de OK o KO diría algo que no dice.
- El contenido de la plantilla es el de la propia página —«Temperatura cámara 3», «Estado de la
  junta», Javier—, que es lo que enseñan las celdas de arriba. No se inventa una pantalla nueva.
- `/auditorias/` no cargaba `ds/aiband.css`; ahora sí. No hace falta `aiband.js`: esta variante es
  CSS puro. Traducciones en `i18n/traducciones/14-ia-registros.json`; el catálogo sube a 1.426
  cadenas, al 100 % en los cuatro idiomas.

**Trampa de método, para la próxima:** una captura de elemento con Puppeteer
(`elemento.screenshot()`) **reinicia las animaciones CSS del elemento**, así que la banda salía vacía
en las capturas y parecía rota estando bien. Para comprobar una animación hay que capturar la
ventana (`page.screenshot()`) con la pieza dentro, no el elemento.

### El código de barras, dentro de lo que ya había

Solved lee códigos de barras, y la capacidad **no abre sección propia en ninguna de las dos páginas**:
la regla de las dos secciones de contenido por landing no se rompe por una función.

- **`/incidencias/` · Capacidades.** Entra en el cuadro «Registro en el punto de detección» del
  rotador, que es donde se cuenta la apertura en planta: el activo o el lote se identifican leyendo su
  código de barras con el móvil, sin teclear la referencia. **La pantalla no se toca** —el texto de las
  pantallas de producto no se reescribe, y añadirle un escáner inventado sería peor que no enseñarlo—.
- **`/auditorias/` · celda «Tus plantillas, campo por campo».** El lote y el activo se rellenan leyendo
  su código de barras, y la demo de la celda gana una cuarta fila —`Lote · L-24471`— con las piezas que
  ya hay: fila de campo y `.cel-codigo`. **No se añade pieza de demo**: `ds/celdas.css` avisa de que son
  cinco y ninguna más, y dibujar un código de barras habría sido la sexta. Lo que sí hace falta es su
  escalón, `.cel-fila--tarde:nth-of-type(4)`: sin él la cuarta fila hereda retardo cero y entra a la vez
  que la primera. `ds/celdas.css` sube a `?v=20260907a` —lo cargan `/auditorias/` y sus cuatro idiomas,
  cinco páginas en total—.
- Al glosario de traducción entran **lote** (batch · lot · lotto · Charge) y **código de barras**
  (barcode · code-barres · codice a barre · Barcode), que ya salen dos veces cada uno. Las cadenas
  nuevas se traducen a mano en `13-capacidades.json` y `03-incidencias-a.json`.

### La aparición de secciones, en las 702 páginas

Las piezas entran al asomar por el borde inferior: **opacidad y catorce píxeles de subida, medio
segundo**, escalonadas 70 ms dentro de su propia fila y cortadas a las seis —en una rejilla de doce
tarjetas, la última entraría casi un segundo después que la primera y eso deja de leerse como una
entrada—. Es lo único que se mueve a nivel de página: todo lo demás que se anima en el sitio —la onda
del hero, la banda de IA, las pantallas de producto, el rotador— se anima solo y por dentro.

**Vive en `chrome.js`, no en `ds/`,** y es una decisión, no un descuido: es el único script que
cargan las 702 páginas, incluidas las del blog y el glosario, que se regeneran solas. Un `<script>`
nuevo habría que meterlo en cada HTML y en la plantilla del blog, y el de las páginas anidadas va por
ruta relativa. Ahí llega a todo, sobrevive a los rebuilds y viaja a los cuatro idiomas, porque
`build:i18n` copia el fichero.

**Sólo se esconde lo que ya está fuera de pantalla.** Lo que se ve al cargar no se toca: ni parpadea,
ni retrasa el LCP, ni depende de que el script llegue. El estado oculto lo pone el JS, así que **si el
JS falla la página se ve entera** — nunca una hoja de estilos, que es como se acaba con contenido
invisible en producción. Fuera del efecto, a propósito: el hero (tiene su onda y es el LCP), la
composición de planta (su panel lleva `backdrop-filter` y un ancestro transformado lo rompe mientras
dura la animación), las pantallas de producto por dentro y los paneles del rotador, que tienen la
suya. Con `prefers-reduced-motion` no hace nada en absoluto: ni observa, ni esconde.

Dos cosas que costaron y quedan escritas:

- **`threshold: 0`, no 0,06.** Con umbral por encima de cero, una tarjeta cuya imagen aún no ha
  cargado mide cero de alto, no llega al umbral y se queda **escondida a la vista de todos**. Pasó en
  el índice del blog. Además hay una red de seguridad en `load`: lo que siga oculto dentro de la
  ventana cuando ha cargado todo se enseña sin esperar a que nadie baje.
- **`build:i18n` corta `chrome.js` por la cabecera del selector de idioma y reescribe de ahí para
  abajo.** Lo que se añada después de esa cabecera **desaparece en el siguiente build** —le pasó a
  este bloque—. Y con la cabecera pasa lo mismo dentro de un comentario: escribirla entera partió el
  fichero por la mitad en el build. Se nombra, no se copia.

`chrome.js` sube a `?v=20260907a` en las 655 páginas, y con él `ASSET_VERSION` de
`scripts/config.mjs`, que es de donde lo toma la plantilla del blog.

### El rotador de capacidades, en `/incidencias/`

La rejilla de seis cuadros «Lo que vas a poder hacer el primer día» se sustituye por el **patrón 12,
rotador de capacidades**: lista a la izquierda que se pasa sola cada 7 s y la pantalla de la derecha
cambiando con ella. Referencia pedida por el cliente: la sección «Una única plataforma para
gestionar, realizar el servicio y el seguimiento de sus activos» de
`mitti.com/es/gestion-de-activos` —cuatro seleccionables en columna—. Se copia la estructura, no la
paleta ni la interfaz, igual que con la composición de planta.

- **El panel es una `.scene`, no un componente nuevo.** El lienzo teñido, el recorte del fragmento
  (`data-crop`) y el marco de dispositivo ya estaban resueltos ahí. Dentro del rotador la escena
  pierde su reparto de doce columnas y su rótulo —lo pone la lista— y toma proporción 4:3.
- **Las cuatro pantallas se MUDAN desde «Detecta», no se copian.** Con copias, la página enseñaría
  las mismas cuatro escenas dos veces. «Detecta» se queda con lo que es suyo: la banda de IA, que
  cuenta por dónde entra una incidencia antes de Solved.
- **Los seis textos siguen enteros en cuatro capacidades**, cada una la que demuestra su pantalla:
  asignación y cierre comparten la de acciones —son el mismo circuito— y «evidencia auditable» entra
  en la del registro, que es donde se adjunta la prueba. **Los cinco enlaces internos siguen en la
  página**: el de `/ia/` se muda al pie de la banda (`.cab__link`, `ds/aiband.css`), que es la pieza
  que enseña la IA. Que no se pierda ninguno era medio motivo de que esa sección existiera.
- `rotador.js` **pliega lo que el marcado ya trae entero**: sin script se ven las cuatro capacidades
  abiertas y los cuatro paneles apilados. Se para al pasar el ratón, al entrar el foco y cuando la
  sección sale de pantalla, y con `prefers-reduced-motion` no avanza solo —los botones siguen ahí—.
  El riel de avance lo pinta el CSS con `--rot-dur`; el script sólo reinicia la animación.
- Sube `ds/sections.css` (patrón 12) y `ds/aiband.css` a `?v=20260907a`. Traducciones nuevas en
  `i18n/traducciones/13-capacidades.json`; el catálogo queda en 1.409 cadenas, al 100 % en los
  cuatro idiomas.

**La cuarta cifra de la home** deja de ser «6 módulos en un único sistema» y pasa a ser
**«+70.000 € de ahorro anual en costes operativos por cliente»**, que es la cifra que ya sostiene la
franja de resultados de `/incidencias/`. Decía alcance de producto, no resultado, y la sección de
módulos de la home ya cuenta lo modular con más detalle. Si esa cifra se revisa, hay que tocarla en
los dos sitios.

## Estado a 4 septiembre 2026 — el sitio en cinco idiomas

El sitio se sirve en **español, inglés, francés, italiano y alemán**: 22 páginas comerciales + 109 de
contenido (blog y glosario) por idioma, 702 HTML y 410 URLs en el sitemap.

**El español es el original y lo demás son artefactos.** No se edita un HTML de `/en/`, `/fr/`,
`/it/` ni `/de/`: se pierde en el siguiente build. Para cambiar estructura se toca el HTML español;
para cambiar una palabra, su traducción.

| Pieza | Qué es |
|---|---|
| `i18n/config.mjs` | Los cinco idiomas y el **mapa de rutas**: `/incidencias/` → `/en/incident-management/`. |
| `i18n/GLOSARIO.md` | Los términos de marca en los cinco idiomas. Manda sobre cualquier traducción. |
| `i18n/es.json` | El contrato: las 1.589 cadenas españolas únicas. Lo escribe `npm run i18n:extract`. |
| `i18n/traducciones/*.json` | El copy de venta, **a mano**, con las cuatro lenguas juntas por cadena. `"="` = se escribe igual en las cinco. |
| `i18n/cache/<lang>.json` | El blog y el glosario, traducidos por máquina (`translate-contenido.mjs`, CLI de Claude). El catálogo a mano siempre gana. |
| `scripts/lib/i18n-dom.mjs` | El recorrido de cadenas. Uno solo para extraer y para inyectar, a propósito. |
| `scripts/lib/i18n-rutas.mjs` | Rutas, enlaces y hreflang. Compartido por los dos builds. |
| `scripts/lib/i18n-chrome.mjs` | La nav y el pie, que viven en `chrome.js` y no en ningún HTML. |

**Las URLs de sección van traducidas; los slugs de artículo, no.** `/glosario/` es `/en/glossary/`,
pero el término sigue siendo `/en/glossary/alergenos/`. No es un olvido: los HTML del blog los
regenera `build-blog.mjs` desde WordPress, donde el slug es el de la publicación española.
Traducirlos obligaría a inventar y mantener un mapa de cien URLs, y una URL que cambia sola hace más
daño que una URL en español. Si algún día se decide lo contrario, el sitio donde se cambia es
`rutaContenido()`.

**Orden de los builds, y no es intercambiable:** `build:blog` → `build:i18n` → `build:i18n:contenido`
→ `build:sitemap`. El del contenido inyecta los `hreflang` **también en las páginas españolas** —sin
reciprocidad Google descarta el grupo entero— y el del blog las reescribe desde WordPress, así que va
después. Es la misma razón por la que `build:enlaces` y `build:redirects` van al final.

### Seis cosas que estaban rotas y no se veían

1. **La nav traducida apuntaba a URLs españolas.** `generarChrome` buscaba `ROOT + 'incidencias/'`
   con la comilla de cierre, y en el fichero el literal sigue: `ROOT + 'incidencias/"><b>…`. No
   casaba nunca, así que **ninguna** ruta se traducía: el menú inglés llevaba a `/en/incidencias/`,
   que no existe. Ahora se busca por prefijo, sin la comilla. No lo cazaba `check:seo` porque los
   enlaces de la nav están dentro de un `.js`, no de un `href`.
2. **La mitad de la nav salía en castellano**, porque el catálogo se extrae del HTML y la nav, el pie
   y el aviso de cookies los escribe `chrome.js`. Es el texto que más se repite del sitio —sale en
   las 700 páginas— y era el único que nadie miraba. `i18n-extract` lo saca ahora del propio JS
   (`lib/i18n-chrome.mjs`, 47 cadenas) y las traducciones están en `11-navegacion.json`.
3. **El francés y el italiano rompían `chrome.js`**: «dates d'expiration» cierra el literal de
   comilla simple y el fichero deja de ser JavaScript. Todas las sustituciones se escapan.
4. **El selector de idioma no se veía en ningún idioma.** Se montaba al cargar el script, y la nav se
   pinta en `DOMContentLoaded`: no encontraba `.nav__links` y salía sin hacer nada. Y cuando ya se
   montaba, heredaba los 400 px anclados a la izquierda del menú de Productos y se salía por el borde
   derecho. Lleva su regla en `ds/site.css` (`?v=20260904f`) y **enlaza por ruta, no por URL
   absoluta**, para que en local y en github.io no te eche del sitio.
5. **22 cadenas fantasma sin traducir**, una por página: el `<title>` se visitaba dos veces —el paso
   1 lo traduce, y el recorrido de nodos de texto volvía a verlo, ya en inglés— y tapaba las que
   faltaran de verdad. `title` es ahora etiqueta opaca para el recorrido de texto.
6. **La paginación del blog** (`/blog/page/2/`…`/7/`) se quedaba fuera: el recorrido bajaba un solo
   nivel, así que el índice traducido enlazaba a siete páginas que no existían. El recorrido baja
   hasta el fondo y vive compartido, para que no se traduzcan unas páginas y se construyan otras.

### Cuatro correcciones en el español, que salieron al traducir

- **`VOLSTONE` → `VOLTSTONE`** en el pie legal de las 700 páginas. La razón social correcta lleva T y
  ya se corrigió en la 2.0; en `chrome.js` había sobrevivido.
- **«Quick Links» → «Enlaces útiles»**: un encabezado en inglés en el pie de un sitio en español.
- **«consolidar a mano» → «consolidar manualmente»** en `/dashboard/`, que era el único fallo que
  daba `check:voz`.
- **«IA» estaba marcada como invariable** y en inglés es AI y en alemán KI —los slugs `/en/ai/` y
  `/de/ki/` ya lo decían—. Ahora tiene valor por idioma.

### Dónde está cada idioma

Las **22 páginas comerciales están al 100 % en los cuatro idiomas**: es copy escrito a mano y
revisable en un diff. El **contenido va por la mitad** y sube solo: `translate-contenido.mjs` es
reanudable y guarda en la caché página a página, así que se relanza con
`bash scripts/translate-contenido-todo.sh` y sigue por donde iba. Lo que aún no está traducido **sale
en español**, no en blanco: la página funciona entera desde el primer día.

La primera pasada falló en ~100 de las tandas de cada idioma y sólo entró entre el 12 % y el 26 % del
texto. Dos motivos, los dos arreglados: las tandas eran de 120 párrafos y el prompt se iba a decenas
de miles de caracteres, y el error que se registraba era la orden entera —con el prompt dentro— en
vez de lo que decía el CLI. Ahora son 40 cadenas por tanda, cuatro intentos con espera creciente y el
`stderr` en el log.

`npm run check:seo` pasa (`✔ Sin fallos`): 410 URLs de sitemap, 702 HTML, 7.808 enlaces internos,
11.278 assets, 975 bloques JSON-LD. `npm run check:voz` pasa (`✔ El registro se sostiene`): sólo mira
las páginas españolas, que es donde está escrita la ficha —pasada sobre las traducciones daba 146
fallos que no se arreglan en la página, sino en `i18n/traducciones/`.

**Lo que queda, y es de negocio:** (1) **nadie ha leído las traducciones**; el copy de venta está
escrito a mano y el contenido lo ha traducido una máquina con el glosario delante, pero antes de
publicar en cuatro mercados conviene que lo lea alguien en cada lengua, empezando por los titulares y
las metas. (2) **Decidir si se publican los cuatro idiomas o sólo uno**: cuatro versiones de 130
páginas son 520 URLs nuevas que mantener y una decisión de mercado, no de código. (3) La **dirección
postal y el aviso de subvención EMPYME se quedan en español** a propósito —es el texto literal de una
publicidad de ayuda pública valenciana—; confirmar que es lo que se quiere.

## Estado a 3 septiembre 2026 (3) — la composición de planta

**Componente nuevo `.compo`** (`ds/sections.css`, patrón 11) y montado en `/gestion-de-activos/`,
pegado al hero y antes del dolor. Es «la creatividad principal» de una página de módulo: foto de
faena a sangre, la ficha del activo entrando por la izquierda y la píldora del sistema flotando
encima.

- **De dónde sale:** la portada de `mitti.com/es/gestion-de-activos`, leída de tres capturas que
  aportó el cliente (`~/Imágenes/Capturas de pantalla/`, 3-sep-2026 18:45). Se copia la estructura,
  no la paleta ni la interfaz — el mismo criterio con el que se trajeron los patrones de Stripe.
- **Va en HTML, no como imagen, y esa es la decisión de fondo.** La regla del repositorio lleva
  escrita desde el principio: una foto con interfaz pegada encima no es la interfaz de Solved.
  Montada así, la pantalla es texto de verdad, se corrige un dato sin volver a renderizar nada y no
  envejece con la próxima release. Si algún día se quiere el JPEG plano para LinkedIn, se graba de la
  página, como se hizo con la banda de IA.
- **El fundido se hace con máscara, no con opacidad.** Bajarle la opacidad a una pantalla es lo que
  la convierte en un adorno y deja el texto del producto ilegible; la máscara la recorta por el lado
  que se acerca a la persona y el producto conserva sus colores de módulo.
- **El encuadre de la foto es parte del componente:** la persona en el tercio derecho, la mitad
  izquierda despejada. Con el sujeto centrado la capa de producto lo tapa y no hay CSS que lo salve.
- **El recorte es distinto al de la escena de abajo, a propósito**: aquí entran la cabecera del
  activo, los cuatro contadores y el historial; la escena de la rejilla enseña la ficha entera dentro
  de la ventana. Misma pantalla, dos encuadres. **El precio es una copia más del marcado en la misma
  página**: si se toca un identificador hay que tocarlo en los dos sitios.
- **La foto ya está, y va por la segunda versión**: `assets/tecnico-escanea-maquina.webp`
  (1920×1080, 62 KB). La primera metía media figura del técnico —cabeza, casco y hombro— y pesaba
  tanto que se comía el lado derecho. La segunda replica el reparto de la referencia medido sobre su
  captura: **máquina arriba a la izquierda y desenfocada, manos y antebrazos entrando por la esquina
  inferior derecha sin cabeza ni torso, y la mitad inferior izquierda vacía**, que es donde se sienta
  el panel. Con ese reparto la mano y la tablet cruzan por delante del panel, que es lo que más
  define la creatividad de la referencia.
- **Lo que hizo que el modelo obedeciera el encuadre fue moverlo al PRINCIPIO del prompt y en lista.**
  Enterrado entre descripciones lo ignoraba, dos veces. La fórmula completa está en
  `assets/planta/FUENTES.md`.
  - **El prompt hubo que reescribirlo dos veces, y las dos correcciones son de manual.** La primera
    versión pedía «penumbra» en la mitad izquierda para que se leyera la pantalla encima: devolvía
    imágenes oscuras y sucias, y además duplicaba el trabajo del velo, que es quien pone el contraste.
    **La foto se pide luminosa.** La segunda corrección es que **los prompts van en inglés**, que es
    lo que rinde con nano banana, con lenguaje de cámara para el realismo y las negaciones al final.
  - **La tablet sale encendida enseñando el visor de la cámara con la máquina dentro**, como en la
    referencia. No contradice la regla de `.stage`: lo que no se fotografía nunca es **la interfaz de
    Solved**, y la cámara del aparato no lo es. Por eso el prompt pide visor y disparador y prohíbe
    menús, botones con palabras y texto en la pantalla.
  - **Fuera los corchetes de encuadre en esta instancia.** En la referencia señalan la máquina; aquí
    la máquina cae debajo de la capa de producto, así que quedaban sobre suelo vacío señalando nada.
    El grafismo sigue en el componente para quien lo necesite.
  - **El fundido pasa a ser regulable (`--compo-ui-fade`, 78 % por defecto).** Al 64 % se comía la
    última columna de la tabla y el cuarto contador: el fundido tiene que empezar donde la pantalla
    ya no dice nada, y eso se mira contra la foto que toque.
  - La variante `compo--hueco` se queda documentada y sin usar, que es la que sostiene el flujo
    «hueco con prompt → foto».
- `ds/sections.css` sube a `?v=20260903h` en las 18 páginas que lo cargan.

**Segunda pasada de la composición, con las tres correcciones del cliente:**

- **El activo tiene que verse.** La capa de producto pasa a estar **anclada abajo** y más estrecha
  (46cqw), sentada en el suelo del plano, en vez de centrada tapando la máquina. Ahora la cinta se ve
  entera por encima y a la derecha del panel, que es lo que la página vende.
- **La pantalla va ENTRE el activo y la persona, no delante de la persona.** Se resolvió primero con
  una máscara recta sobre una segunda copia de la foto y **el cliente lo rechazó con razón**: un corte
  vertical no sigue el contorno, así que el panel desaparecía en una línea en vez de pasar por detrás
  del brazo. Ahora `.compo__frente` es **la persona recortada con su silueta**, en un WebP con alfa
  (`assets/tecnico-escanea-maquina-frente.webp`, 48 KB): foto entera debajo, panel en medio, recorte
  encima. La mano y la tablet muerden el panel como en la referencia.
- **El recorte lo aporta el cliente.** Lo entregó ya hecho (`persona tablet sin fondo.png`), sobre el
  lienzo original de 2752×1536, y se lleva al encuadre del fondo **con exactamente la misma llamada de
  `resize`** con la que se generó la foto. Comprobado que casa: sobre 385.000 píxeles opacos, la
  diferencia media con el fondo es de **2,88 sobre 255** y el peor píxel 32 —bordes y compresión—; un
  desplazamiento de un par de píxeles habría disparado eso a decenas. La comprobación merece hacerse
  siempre: dos capas de la misma foto mal alineadas dan un fantasma doble que no se ve hasta que se
  mira de cerca.
- **Queda un plan B, `scripts/recorte-persona.mjs`**, por si algún día hay foto y no hay recorte: saca
  el alfa por color —manga de alta visibilidad y tablet oscura contra una nave blanca—, cierra la
  silueta con radio 22, abre con radio 8 para soltar los trozos de fondo pegados, rellena los huecos
  por inundación desde el borde (es lo que recupera la pantalla clara de la tablet) y se queda con la
  mancha grande. Da un recorte utilizable, peor que uno de verdad: los bordes del guante salen más
  duros. **Trampa anotada dentro:** `sharp.blur()` sobre un raw de 1 canal lo promociona a 3, así que
  leer el alfa de uno en uno lo deja desalineado y el recorte sale invertido.
- **Estilo hielo** (`.compo--hielo`): panel de vidrio esmerilado con `backdrop-filter`. Es **la única
  pieza del sitio donde la pantalla del producto se retoca**, y va declarada como excepción para que
  nadie la copie a una escena. La regla que se conserva: **se destiñe el papel, nunca la tinta** — las
  superficies se vuelven translúcidas, el texto y los colores de módulo no se tocan.
- **Ficha simplificada** (`.app--ficha`, `ds/app.css`), rehecha contra la referencia tras una segunda
  ronda de correcciones del cliente. Cinco cambios, y cada uno tiene su motivo:
  1. **Sin la barra azul de la aplicación.** En la composición no hay ventana ni dispositivo
     alrededor: es la ficha sola, como en la referencia. La barra pertenece a las pantallas que van
     dentro de un marco, no a ésta.
  2. **En vertical.** El aparato que sale en la foto es una tablet en vertical; una tarjeta apaisada
     flotando a su lado se lee como otra cosa. Lo que se enseña es lo que ese aparato tiene en la mano.
  3. **La foto del activo, en grande y de encabezado**, no un icono al lado del título: es lo que
     distingue una ficha de una fila de listado. Sale del **visor de la tablet**, donde la máquina
     está nítida, no del fondo, donde va desenfocada.
  4. **Más translúcida** (42 % y desenfoque de 26), y los contadores en dos filas de dos: en vertical,
     cuatro en línea dejan la cifra a tamaño de nota al pie.
  5. **Vuelven los corchetes de encuadre sobre la máquina.** Se habían quitado porque la tarjeta la
     tapaba; con la tarjeta en el centro ya tienen a qué apuntar, y son los que dicen que **ése** es
     el activo que se está mirando. **Su sitio no se pone a ojo**: la caja de la máquina se mide
     sobre la propia foto por densidad de bordes —es lo único con detalle en el tercio izquierdo, la
     pared y el suelo son planos— y de ahí salen los tres valores. A ojo se quedó 45px corto.
  6. **La tarjeta se ancla por arriba, a media altura, y la corta el borde de abajo.** Dos motivos:
     el activo es lo que la página vende y la tarjeta no puede subir por encima de la mitad y
     taparlo; y anclada abajo era su propio alto —que cambia con el contenido— el que decidía dónde
     empezaba, así que cualquier fila de más la hacía trepar. Con `top` fijo, lo que cambia con el
     contenido es cuánto se recorta, que es justo el gesto de la referencia.
  7. **Sin velo sobre la foto.** La foto se pidió luminosa y oscurecerla la estropea. El velo existe
     para que un texto blanco suelto se lea sobre la imagen, y aquí no hay ninguno: la tarjeta lleva
     su vidrio y la píldora su fondo. La regla —nunca texto directo sobre la foto— se sigue
     cumpliendo, que es lo que el velo venía a garantizar.
- **El activo de la composición cambia: la máquina de la foto no es una cinta, es una envasadora
  vertical.** Pasa a ser `ENV-002 · Envasadora vertical`, y su historial usa identificadores que ya
  existían en el sitio —`UTD26_160_001`, «Líquido extraño en máquina de envasado» y su acción «Purgar
  y sellar el circuito de envasado»—, que es la avería de envasado del conjunto de demo. **Se inventa
  un solo dato**: el registro `26_161`, porque `26_158` ya está atado a la cinta y un registro no
  puede ser de dos activos. La escena de la rejilla de abajo sigue con la cinta `TRA-003` y su
  historial: son dos activos distintos, los dos coherentes con el resto del sitio.
- **Trampa de especificidad, y es la tercera vez que aparece en este repo:** `.app img{width:auto}`
  puntúa 0-1-1 y le ganaba a `.fic__foto` (0-1-0), así que la miniatura salía a 200px. Se ancla con
  `.app .fic__foto`, que empata a 0-2-0 y gana por ir después.
- **Fuera el pie de la composición**: con el panel abajo caía encima de las últimas filas y quedaba en
  blanco sobre el vidrio. Y sobraba: lo que decía ya lo cuentan el visor, la píldora y el encabezado.

> ### ⚠️ ESTA PÁGINA NO SE PUEDE PUBLICAR TODAVÍA
> La ficha simplificada enseña **cuatro cosas que la aplicación no hace hoy** (comprobado en
> `demo.trysolved.com/assets` el 3 de septiembre de 2026): la **foto del activo** y las pestañas de
> **Documentos**, **Imágenes** y **Mantenimientos**. La ficha real lleva icono genérico, los cuatro
> contadores, DETALLES, ACTIVIDAD, CÓDIGO QR y ACCIONES ABIERTAS, y nada más.
>
> Se pintan **a petición expresa del cliente** —«puedes inventártelo porque dentro de muy poco
> estarán»—, así que la decisión está tomada y tomada a sabiendas. Pero es **la única pantalla del
> sitio que enseña algo que el producto no hace**, y todo el argumento de este repositorio es que las
> pantallas no se inventan. Antes de publicar: o esas cuatro están en la aplicación, o se quitan de la
> ficha (son cuatro líneas de marcado y la miniatura).

`npm run check:seo` pasa (`✔ Sin fallos`): 82 URLs, 178 HTML, 1604 enlaces internos, 2310 assets,
195 bloques JSON-LD.

## Estado a 3 septiembre 2026 (2) — el gestor documental

**Página nueva `/gestor-documental/`.** El sitio pasa a **20 páginas estáticas** (sitemap: 82 URLs) y
el módulo que el equipo vende por su nombre en las llamadas —«el gestor documental»— deja de estar
sólo de refilón en `/homologacion-de-proveedores/`.

- **El alcance salió de la aplicación**, navegando `demo.trysolved.com/documents` el 3 de septiembre
  de 2026. Lo que hay: árbol de carpetas y subcarpetas con contador y papelera, subida de documentos,
  **listas de «documentos requeridos» por carpeta** con su frase literal —«Lleva el control de qué
  documentos deben existir en esta carpeta»— y su aviso «A 1 lista le faltan documentos»; tres vistas
  (tarjetas, tabla y **calendario**, éste con selector de *fecha de expiración* o *fecha de
  modificación* y modos mes/semana/día/agenda); número de **versión** por documento en la vista de
  tarjetas; y en la vista de tabla las columnas **NOMBRE · SUBIDO EL · FECHA DE REVISIÓN · FECHA DE
  EXPIRACIÓN · ESTADO**, con los dos únicos estados que existen: **«Pendiente de validación»** y
  **«Validado»**. La barra trae buscar, historial de la sesión, «documentos con enlaces»,
  «pendientes de revisión», ordenar, filtrar, favoritos y almacenamiento.
- **Lo que NO se afirma en la página, porque no se pudo comprobar:** permisos por carpeta o por rol,
  acuse de lectura, aviso automático de nueva versión a los lectores, firma, OCR y adjuntar un
  documento a una incidencia o a un registro. Todo eso lo piden los clientes en las llamadas, pero
  pedirlo no es tenerlo. El paso 4 de la escalera dice lo que se ve —el documento aparece en el
  calendario de expiraciones y en el listado de pendientes—, **no** que llegue un correo.
- **Pantalla nueva en `ds/app.css`: la carpeta de documentos** (`.app--docs`, `.app__req`,
  `.app__doc…`, `.app__est…`). Es la vista de tabla, con la franja de documentos requeridos encima.
  Datos coherentes con el resto del sitio: PopCorn Mediterránea, junio de 2026, y Ana, Marta y Pablo,
  que son las personas del listado de acciones.
  - **Dos correcciones de fidelidad, y las dos importan.** Las fechas iban en azul porque `.app__num`
    nació para los vencimientos de incidencias, donde el azul es el módulo; la aplicación las pinta en
    gris, y así están (`.app--docs .app__num`). Y se quitó el rojo de una expiración próxima: **la
    ficha real no tiene ese estado** —sólo «Validado» y «Pendiente de validación»— y colorear la
    fecha habría sido inventar una señal. En móvil caen las dos columnas de fecha intermedias, nunca
    la de estado, que es lo que la tarjeta demuestra.
- **La página no monta ninguna escena de producto, y no es pereza: el sistema no tiene tinte para
  Documentos.** Los seis valores de `.scene[data-module]` son incidencias, acciones, checklists,
  activos, kpis e ia; teñir el lienzo con el color de otro módulo es justo lo que prohíbe la regla del
  tinte, y añadir un séptimo color es una decisión de marca que no está tomada. Se resuelve con la
  **escena con bocadillo** (`.stage`, patrón 10 de `ds/sections.css`), que no pide módulo: foto de
  ambiente y la pantalla real flotando encima. El bocadillo se ensancha a 640px —la base son 460—
  porque a 460 la columna de estado caía fuera. Anotado también en `ds/README.md` y en
  `ds/scene.prompt.md`. **Es la decisión de negocio principal que deja abierta esta página.**
- **La foto de la escena es propia y se hizo para esto.** Se montó primero reutilizando
  `assets/encargado-produccion-linea.webp`, que ya sale en el trío de la home, y **se revirtió**:
  ninguna imagen del sitio se reutiliza entre páginas. En su lugar se dejó el **hueco de imagen**
  (`.img-slot`) con el prompt dentro, el cliente la generó con nano banana y ya está montada como
  `assets/procedimiento-carpeta-tablet.webp` (1920×1080, 108 KB, WebP q74 desde el JPEG de 2752×1536).
  - **El encuadre es parte del componente, no una preferencia**: la persona y la carpeta de anillas
    caen en la mitad izquierda porque el bocadillo ocupa el 58 % derecho. Si algún día se sustituye
    la foto hay que mantener ese reparto o la escena se tapa a sí misma. Y la tablet sale con la
    pantalla apagada, que es lo que pide el patrón: la interfaz de verdad es la del bocadillo.
  - **Fuera el `.stage__pie`**: la frase quedaba en blanco sobre la bata blanca —el velo de la escena
    es horizontal y no cubre la esquina inferior izquierda— y además repetía casi literalmente el
    párrafo del encabezado de la sección. El párrafo va una vez, que es la regla del componente.
  - Queda en `ds/sections.css` la variante **`.stage--hueco`**, sin usar hoy, que es la que sostiene
    el flujo «hueco con prompt → foto»: quita el velo y reserva la mitad derecha para que el prompt
    se lea por debajo del bocadillo. La próxima foto que falte se monta igual.
- **La regla queda escrita: una foto, una página** (`assets/planta/FUENTES.md`). Al comprobarlo salió
  que **la columna «Página» de esa tabla estaba desactualizada** —decía dónde se pensó usar cada foto,
  no dónde está— y se corrigió contra el marcado: las cinco de `/gestion-de-activos/` y
  `/gestor-documental/` son únicas. Las dos únicas imágenes que se repiten a propósito son la del
  bloque de contacto, que es el mismo bloque en las quince páginas, y las miniaturas de
  `assets/tour/`, que son elementos de interfaz dentro de las pantallas de la app, no fotografías.
- **El rival de esta página no es otro gestor documental: es el SharePoint que la empresa ya paga.**
  De ahí la sección «Si ya tenéis SharePoint o Drive, esto es lo que no os dan», que responde de
  frente la objeción que aparece tal cual en las llamadas («cuando trabajas con los documentos en la
  nube también hay historial de cambios, eso está más cubierto»). Lo que se dice de una carpeta
  compartida es lo que una carpeta compartida no hace, no un defecto inventado.
- **El dolor sale del corpus.** Frecuencia sobre las 955 reuniones de `~/samu-export`, **lado
  cliente**: documentos 38,8 %, el auditor 27,5 %, papel 24,1 %, PDF 13,5 %, versiones 12,1 %,
  carpetas 11,9 %, firma 11,8 %, procedimientos 9,3 %, archivo 9,3 %, «gestor documental» 9,0 %,
  certificados 8,6 %, caducidad 7,0 %, servidor o carpeta compartida 6,0 %, SharePoint/Drive/Dropbox
  4,7 %, ficha técnica 4,3 %, obsoleto 3,5 %. Las cifras se quedan en el comentario del HTML.
- **Vocabulario:** la URL usa «gestor documental» —es como lo llama el equipo y como ya lo nombran
  `/homologacion-de-proveedores/` y `llms.txt`—, el `<title>` lidera con «gestión documental» (el
  término de búsqueda) y el titular no lidera con la categoría sino con el documento concreto.
- **Sin cita**, por lo mismo que en `/ia/` y en `/gestion-de-activos/`. La de Samuel Pardo es la que
  más se acerca, pero ya está en `/auditorias/` y reutilizada en `/software-certificaciones/`.
- Enganches: entrada en Productos —**tercera, detrás de Registros y auditorías**, porque incidencias,
  registros y gestor documental son los tres módulos que se venden— y en el pie (`chrome.js` →
  `?v=20260903b` en las **131 páginas**), alta en `STATIC_PAGES`, línea en `llms.txt`, y el post
  `gestion-documental-calidad-alimentaria-guia-practica-2026` remapeado en `seo/enlazado.json` con su
  CTA propio. Sin stub de raíz. `ds/app.css` sube a `?v=20260903f` en las seis páginas que lo cargan.

`npm run check:seo` pasa (`✔ Sin fallos`): 82 URLs, 178 HTML, 1600 enlaces internos, 2312 assets,
195 bloques JSON-LD.

**Pendiente de negocio en esta página:** (1) **decidir si Documentos tiene color de módulo**, que es
lo que desbloquea montar escenas aquí y en cualquier página futura del gestor; (2) confirmar qué hay
de permisos por carpeta, avisos de caducidad por correo y acuse de lectura de una versión nueva —los
tres los piden los clientes y la página hoy calla—; (3) el testimonio del gestor documental.

## Estado a 3 septiembre 2026

**Página nueva `/gestion-de-activos/`, y el módulo Activos deja de ser un tinte sin página.** El
sitio pasa de 18 a **19 páginas estáticas** (sitemap: 81 URLs — las 40 del glosario ya no van, que es
la consolidación SEO en marcha, no una pérdida: son `noindex, follow`).

- **Referencia de arquitectura: `mitti.com/es/gestion-de-activos`**, igual que en su día
  `/integraciones/` y las cuatro páginas del 16 de agosto. De su gramática se coge el orden
  —problema → capacidades → plantillas/pasos → sectores → cierre → FAQ— y **nada más**: ellos abren
  con telemática, flotas y GPS, que Solved no tiene. Tampoco se ha traído su biblioteca de plantillas
  de mantenimiento, por el mismo motivo de agosto: exige el catálogo real y aquí habría que
  inventarlo.
- **El alcance salió de la propia plataforma, no de la referencia.** Se navegó el módulo en
  `demo.trysolved.com/assets` (Ultimate Demo 6, base «Maquinaria», 100 activos) y lo que la ficha
  tiene es: tipos de activo con sus atributos (criticidad, estado, fabricante, modelo, tipo,
  ubicación), cuatro contadores (actividad total, incidencias, checklists, acciones), **código QR por
  activo con Descargar e Imprimir**, historial filtrable por módulo y panel de acciones abiertas. El
  módulo va tras el flag `settings.features.assets`. **Lo que la ficha NO tiene —y por eso la página
  lo niega en voz alta— es stock de repuestos, costes, horas de mano de obra y contadores de
  máquina.** De ahí la sección «Si ya tienes un GMAO, Solved no viene a sustituirlo», que además es
  la diferenciación que el análisis del 1 de septiembre marcaba como ausente en toda la web.
- **Pantalla nueva en `ds/app.css`: la ficha de activo** (`.app--activo`, `.app__act…`), la primera
  que no es copia de la home. Maquetada contra la pantalla real, con los datos que ya cruzan el sitio:
  el activo es **la cinta transportadora L3**, que es la máquina de `UTD26_163_001` —la fuga de
  aceite— en la home, en `/incidencias/` y en la banda de IA; su acción es «Sustituir la junta de la
  cinta L3» (Pablo, 27/06) y el registro que la detectó, el `26_158 · Control de mantenimiento` con su
  KO. Tocar uno de esos identificadores obliga a tocar esta página también.
  - **Dos decisiones de encuadre que costaron tres pasadas.** (1) La ficha real pone DETALLES y QR en
    dos columnas y el historial debajo del primero; montado así **el historial caía entero fuera del
    recorte**, y es justo lo que la tarjeta demuestra. Se pasó a dos columnas de verdad —detalles +
    historial a la izquierda, QR + acciones abiertas a la derecha—, así lo que se recorta por el
    borde es el QR. (2) El ancho del encuadre `dev-br` se declara en el HTML (`width:88%;top:14%`) en
    vez del 104 % por defecto: la ventana es 16:10, así que **más ancha es más alta**, y a 104 % su
    propio alto se comía el historial. La cabecera del activo va **sin tarjeta**, como en la ficha
    real, que además es lo que dejó sitio a la primera fila del historial.
  - **El QR es de verdad, no un dibujo con pinta de QR.** Se leyó de la pantalla del entorno de
    demostración —41×41 módulos, muestreados del PNG que genera la aplicación— y se pasó a SVG módulo
    a módulo (`assets/activos/qr-activo.svg`, 6 KB, 450 tramos). **Lleva dentro la URL de la ficha de
    un activo de la demo de QA**: para publicar conviene regenerarlo desde la ficha que el cliente
    quiera enseñar. El script del volcado es de un solo uso y vive en el scratchpad de la sesión.
- **Las otras tres escenas van con lienzo de foto y recurso**, no copiando por tercera vez las
  pantallas de la home: la regla de datos coherentes obliga a replicar cada cambio en todas las
  copias y ya había dos. Repartos 8+4 (la ancha declara `4:3`, la estrecha `fila`) y 6+6 a `1:1`.
  Pasa `scene-dev.js` sin un aviso.
- **No hay cita en esta página**, y es la misma decisión que en `/ia/`: una cita por página y cada
  página la suya, y de las siete que hay ninguna habla de mantenimiento ni de equipos. El hueco está
  marcado en el marcado para cuando haya un testimonio de mantenimiento.
- **El dolor no se eligió a ojo.** Los cinco cuadros salen de contar, en las 955 transcripciones de
  `~/samu-export` y **sólo del lado cliente**, qué dice quien compra cuando sale el mantenimiento:
  mantenimiento y averías **43,0 %**, máquinas y equipos 42,9 %, preventivo 12,0 %, QR y escaneo
  6,2 %, paradas 4,8 %, GMAO 4,3 %, órdenes de trabajo 4,2 %, inventario 2,7 %, repuestos 2,5 %.
  Cuadra con el 43,7 % que ya tenía anotado `/incidencias/`. **Las cifras se quedan en el comentario
  del HTML, no en la página**: el corpus es de reuniones privadas.
- **Vocabulario, y aquí hay una tensión resuelta a propósito:** el módulo se llama Activos y la
  búsqueda dice «gestión de activos» —de ahí el título, la URL y el eyebrow—, pero el cliente dice
  **equipo** (590 reuniones) y **máquina** (344), y «activos» sólo en 72. El titular y el cuerpo
  hablan de máquinas y equipos; «activo» se reserva para nombrar la ficha del producto.
- Enganches: entrada en el desplegable de Productos y en el pie (`chrome.js` → `?v=20260903a` en las
  **130 páginas**), alta en `STATIC_PAGES`, línea en `llms.txt`, y dos posts remapeados en
  `seo/enlazado.json` (el de avisos de avería por WhatsApp y el de integrar con ERP/MES/GMAO) con su
  CTA propio. **Sin stub de raíz**: `/gestion-de-activos/` no existió nunca como `.html`, así que no
  hay señal que trasladar —igual que `/software-appcc/` y las otras tres de agosto—.
- `ds/app.css` sube a `?v=20260903e` en las cinco páginas que lo cargan.

`npm run check:seo` pasa (`✔ Sin fallos`): 81 URLs, 177 HTML, 1597 enlaces internos, 2265 assets,
192 bloques JSON-LD.

**Pendiente de negocio en esta página:** (1) confirmar que el módulo Activos se puede vender ya y en
qué condiciones —va tras un flag y la página no dice nada de precio, que es la línea del resto del
sitio—; (2) regenerar el QR de la escena desde una ficha que el cliente quiera enseñar; (3) el
testimonio de mantenimiento, que desbloquearía la sección de cita.

## Estado a 1 septiembre 2026

**Página nueva `/ia/`, y la capa de IA por fin tiene sitio propio.** Hasta ahora la IA era una escena
de la home y su diálogo, y nada más. Ahora hay página (`ia/index.html` + stub `ia.html` + entrada en
la nav de Productos y en el pie + `STATIC_PAGES`), y el sitemap pasa de 115 a **116 URLs**.

- **El contenido sale de la propia plataforma.** Las seis funciones son las seis que hay hoy en
  `app.trysolved.com/ai` («Funciones de IA»), con su descripción tal y como la da el producto: crear
  incidencia desde texto, importación automática de checklists, generación de informes, generador de
  visualizaciones, informes semanales por planta y «pregunta a tus datos». Y las preguntas de ejemplo
  de la sección `.iaq` están **copiadas del chat**, no escritas para la web: son las que la propia
  herramienta sugiere al abrirlo, agrupadas por módulo (incidencias, registros, acciones, documentos).
- **Los créditos por función NO se publican.** Cada función tiene su coste dentro del producto (los
  vi al navegarlo), pero publicar precios es una decisión de negocio que no está tomada. La página
  sólo dice lo que ya decía el diálogo de la home: que el consumo se mide y se ve.
- **La página va entera sobre grafito** (`ds/ia-dark.css`, `[data-tema="ia"]`). Es la única del sitio,
  y es la regla «lo de IA va sobre grafito» llevada al final. Está hecha **reasignando alias**, no
  duplicando componentes: `site.css`, `sections.css` y `hero.css` no se han tocado.
- **El hero es el mismo elemento con otra paleta.** `hero-wave.js` acepta ahora
  `mount(canvas, { tema: 'ia' })`: misma geometría —13 filamentos, mismo ángulo, mismo lavado— y la
  rampa del azul de Solved al morado, el rosa y el cian de la capa de IA, con el lavado saliendo de
  grafito en vez de papel. **La paleta `marca` conserva los números exactos del prototipo**, así que
  las otras siete heros no cambian ni un píxel — comprobado en la home.
- **El vídeo va bajo la hero y dentro del encuadre** (`.iavideo--grid`), no a sangre: con la página
  entera en grafito, a sangre no se distinguiría del fondo. Así ocupa la misma columna que el titular
  de arriba y la rejilla de abajo. **Y se ve al llegar**: la hero de esta página baja su altura
  mínima y aprieta el aire —no el cuerpo— porque el `64vh` de la base dejaba el vídeo fuera de la
  primera pantalla. En una ventana de 850px empieza a 494px y se ven 358 de sus 463.
- **La hero de esta página no es la del resto del sitio:** va **centrada**, **sin subtítulo**, con la
  etiqueta `AI POWERED` de la home en vez de eyebrow y con el botón principal en los colores de la IA
  (`.ds-btn--ia`). Al centrarse, el texto se mete en el haz, así que lleva un **velo radial** entre el
  canvas y el texto — el mismo recurso que la banda de foto. Y la rampa del botón **no llega al cian
  por detrás del rótulo**: blanco sobre `#1FD6F5` da 1,9:1; se queda en morado→magenta (4,9:1) y el
  cian va en el halo.
- **La franja de clientes va sobre el mismo grafito, en color, y con 13 de los 29 logos.** Tres
  intentos hasta dar con ello: silueta blanca (convierte a COVAP y a Delaviuda en la misma mancha),
  banda clara con degradado de turquesa y lila (se veían, pero metía un rectángulo luminoso en una
  página oscura) y, al final, negro y basta. **Sobre negro sobreviven otros logos, no los mismos**:
  ahí manda el color claro y saturado. Fuera los de tinta negra (Fritoper, Pampling, La Chinata,
  Exquisitarium, Prilux, Cotecnica…), los que llevan blanco en el propio dibujo (Jealsa y su filete
  alrededor de las letras) y los de tinta apagada que a 38px no llegan (Panificadora de Alcalá en rojo
  oscuro, Tuflesa en gris). En las páginas blancas siguen los 29: el problema es el fondo, no el logo.
  La animación baja de 84 a 38 s, porque su duración va atada al largo de la cinta.
- **Dos logotipos estaban mal cortados desde siempre y se arreglaron: COVAP y Patatas Hijolusa.** Los
  contadores de las letras —los huecos de la O, la A, la P— estaban rellenos de **blanco opaco** en
  vez de transparentes. Sobre papel no se ve, blanco sobre blanco; sobre grafito son manchas dentro de
  las letras. **Se corrigió el asset, no se duplicó**: un hueco transparente sobre blanco se sigue
  viendo blanco, así que el resto del sitio queda igual (comprobado en la home). En Hijolusa el
  barrido se limitó al 78 % derecho de la imagen para no borrar la planta blanca del cuadro verde.
- **No hay cita en esta página.** La regla es una por página y cada página la suya, y de las siete que
  hay ninguna habla de IA. Inventarla no es una opción, así que la sección no está.

**Componente nuevo: la banda de IA** (`ds/aiband.css` + `ds/aiband.js`), en dos formatos y con una
sola fuente. Guía en `/guidelines/ia.banda.html`.

- **Web (`.aiband`)**: una barra de prompt sobre grafito, la pregunta que se teclea sola y las piezas
  de la respuesta —una incidencia, un control KO, una acción con su dueño, un informe con gráfico—
  entrando alrededor. Cinco turnos en bucle. Sin JS y con `prefers-reduced-motion` se queda el primer
  turno resuelto y quieto, que es el estado seguro.
- **Vídeo (`.iavideo`)**: `assets/ia/ia-reel.mp4`, 1920×740, 36,6 s, 2,0 MB, sin audio, en la página
  `/ia/`. **Se graba de la web, no se dibuja aparte**: `npm run render:ia` fotografía
  `guidelines/ia.banda.reel.html` fotograma a fotograma con Chrome y lo encadena con ffmpeg. Esa
  página no tiene ni una animación de CSS —todo lo pinta `pintar(t)` a partir del milisegundo que se
  le pase—, que es lo que hace que el render sea idéntico en cualquier máquina. Dependencia nueva:
  `puppeteer-core` (devDependency; no descarga navegador, usa el Chrome del sistema).
- El vídeo lleva **logotipo en versión clara** (`assets/logotipo-solved-claro.webp`, generado
  repintando la tinta negra del logotipo del repo y dejando el azul) y **cartela de cierre** con
  `Solved | AI` y «La plataforma que potencia tus operaciones industriales con IA».
- **La cartela no se va al final, a propósito.** Se probó al revés —que se fuera para que el último
  fotograma fuese igual que el primero y el bucle cerrase por fotograma— y el vídeo acababa en una
  barra de chat vacía, que es el fotograma que queda a la vista al pararse. El precio es que la vuelta
  del bucle es un corte, y por eso el arranque lleva 320 ms de fundido.
- **Dos cosas pendientes de confirmar con el cliente, y las dos son de producto, no de código:**
  1. **El quinto turno afirma algo que la web no dice**: que Solved proponga generar las tareas de un
     trabajo que ya se hizo («¿quieres generar las tareas que hiciste la última vez?») no está en
     ninguna página. Entró a petición del cliente. Si no existe, se cae el turno entero.
  2. **Los avatares son caras de banco** (`assets/ia/avatar-pablo.webp`, `avatar-ana.webp`, recortes
     de las fotos de planta que ya estaban en `assets/`). La aplicación real pinta la inicial, así que
     es una licencia consciente del vídeo, donde una letra sola no se lee como «persona».
- Ojo con el vocabulario: la cartela dice «plataforma», que es justo la palabra que el análisis de
  mensajes del 1 de septiembre marca como problema —el cliente dice herramienta, sistema, programa o
  software, y la web lidera con «plataforma»—. Es una línea de un fichero y se vuelve a renderizar.

`npm run check:seo` pasa (`✔ Sin fallos`): 116 URLs, 171 HTML, 1584 enlaces internos, 2009 assets,
181 bloques JSON-LD.

## Estado a 17 agosto 2026

Lo que quedaba suelto de las sesiones del 15, el 16 y el 17 —testimonios, las páginas nuevas, el
esquema `hub`, el puente, la banda de foto y el bump de caché— se partió el 17 de agosto en siete
commits, uno por asunto y en orden de dependencia: primero `ds/`, luego las páginas que lo montan y
al final el bump. Dos cosas quedaron dentro de un solo commit aunque sean de días distintos, porque
comparten fichero y partirlas por trozos habría dejado estados intermedios inventados: todo lo de
`ds/app.css` (el esquema de conexión, el puente, los filtros y el dashboard) y todo lo de
`index.html`. **Encima de esos commits están el gate de vídeo, el borrado de `/plataforma/`, la
sección «Más allá» de `/incidencias/` y el tercer caso (Prilux), sin commitear todavía.**

`npm run check:seo` pasa (`✔ Sin fallos`): 115 URLs, 167 HTML, 1572 enlaces internos, 1922 assets,
178 bloques JSON-LD.

Hecho el 17 de agosto:

- **Tercer caso en vídeo: Prilux** (`/casos-de-exito/prilux/`), montado con la misma plantilla que
  los otros dos —hero con el gate, póster, duración real y la lista de enlaces debajo—. Álvaro
  Sobrino, director de calidad de producto; 2:06.
  - Vídeo en `assets/casos/caso-prilux.mp4`: el 720p de `~/Vídeos/casos-exito-solved/` remuxado con
    `-movflags +faststart` (`-c copy`, sin recodificar), 10,4 MB. **El repo va ya por 42 MB de
    vídeo.** El póster es el **fotograma del segundo 8**, donde el montaje pone el rótulo con el
    nombre y el cargo, igual que los otros dos.
  - **Las cifras salen del vídeo, no de fuera**: más de mil inspecciones de material de entrada al
    año, cuatro unidades de negocio, las tres fases (papel → Excel → Solved en 2024) y móvil y
    tablet de planta a dirección. La llave de localStorage es `solved:casos-video:prilux`, así que
    quien vio otro caso vuelve a ver el formulario aquí, que es lo que manda el componente.
  - **`.vcase-grid` pasa a tres columnas** en `ds/gate.css` (`?v=20260817c` en las cuatro páginas
    que lo cargan): con dos, el tercer caso se quedaba solo en una segunda fila a media anchura.
  - Los otros dos casos estrenan el enlace cruzado y su «El otro caso» pasa a «Otro caso», que ya
    son dos.
  - **`/industria-general/` estrena por fin su sección de caso**, que era el hueco que dejó marcado el
    comentario del 16 de agosto: Prilux es iluminación, así que aquí encaja y en
    `/industria-alimentaria/` no se toca nada. Misma gramática que la sección de casos de
    alimentaria: encabezado partido, franja de cifras y enlace a la landing.
  - Sitemap 114 → 115 URLs (alta en `STATIC_PAGES` y `npm run build:sitemap`).
  - **Sigue pendiente lo mismo que en los otros dos**: el formulario corto de vídeo de HubSpot
    (pendiente 0), que aquí también sirve de momento el de contacto con teléfono obligatorio.

- **Borrada `/plataforma/`**, con sus cinco enganches: la página, el stub de raíz, la entrada del
  desplegable «Productos» y la del pie en `chrome.js`, y su línea de `STATIC_PAGES`. Sitemap 115 →
  114. No hizo falta redirección: nunca llegó a publicarse (404 en producción), así que no había
  señal que trasladar. **La nav de Productos se queda otra vez sin landing**, que es el hueco que
  esa página venía a tapar.

- **«Detecta, registra y soluciona incidencias en segundos», rehecha con escenas de producto.** Era
  el último resto de la 2.0 en esa página: dos `.split` en zigzag con cinco features de icono y
  párrafo y **dos fotos de banco con interfaz inventada pegada encima** —un instalador de placas y
  un obrero delante de una excavadora, con chips de «Añadir incidencia», «Responsable: Julia», «En
  Revisión» y un gráfico de barras falso—. Ni eran plantas ni era Solved.
  - Cuatro escenas, **6+6 / 6+6, todas 1:1**, en orden de verbos: móvil de incidencias
    (`incidencias`), tabla de acciones con sus filtros (`acciones`), dashboard en ventana (`kpis`) y
    rejilla de integraciones (`activos`). Pasa el validador `scene-dev.js` sin un aviso.
  - **Por qué escenas y no otra rejilla de texto.** Al unificar «Más allá» salió a la luz que las dos
    secciones decían **las mismas cinco cosas** —la de integraciones compartía la frase entera con
    ella—. Ahora «Más allá» argumenta con palabras y «Detecta» lo enseña con el producto, que es el
    reparto del sistema; por eso las tarjetas van sin párrafo, como manda el componente. Lo que las
    tarjetas ya no dicen —móvil/tablet/PC, las fotos, el seguimiento hasta el cierre— se recogió en
    el párrafo del encabezado, que antes no tenía.
  - El encabezado se queda **centrado** y no partido: la afirmación es corta y «Resultados», justo
    encima, ya lleva el asimétrico.
  - La escena del móvil va **sin el esquema `hub`** de la home: aquí el argumento es que una persona
    registra desde planta, no que el dato entra solo. Se usa la pantalla quieta, que es lo que el
    propio README pide cuando la tarjeta se puede contar sin movimiento, y arriba del todo va la
    incidencia con foto y responsable (`UTD26_163_001`, la fuga de la cinta L3).
  - **Las cuatro pantallas son copias literales de las de la home**, a propósito: la coherencia de
    datos entre tarjetas es una regla del componente y `UTD26_163_001` tiene que ser la misma avería
    en las dos páginas. **El precio es que no hay plantillas en este repo**: tocar una pantalla en
    `index.html` obliga a tocarla también en `incidencias/index.html`. Anotado en `ds/README.md`.
  - La página estrena `tint.css`, `scene.css`, `device.css`, `app.css` y `scene.js` —el script sólo
    por el halo; aquí ninguna escena expande—. Las versiones se pusieron **iguales a las de la
    home**, no inventadas.
  - Barrido detrás: fuera `incidencia-card-1.webp` y `-2.webp` (siguen en `assets/`, sin usar), fuera
    la clase `section--detecta`, que se quedaba sin una sola regla, y fuera sus tres selectores en
    `solved.css` —iban compartidos con `.section--planifica`, que sí sigue usándolos, así que se
    quitó sólo la mitad muerta; el comentario de al lado decía «solo afecta a Detecta» y habría
    quedado mintiendo—. Eso obliga a bumpear `solved.css`, que pasa de `?v=20260803a` a
    `?v=20260817a` en las 123 páginas.

- **La sección «Más allá del control de incidencias» de `/incidencias/`, rehecha con el sistema.**
  Era el último `.split` de la 2.0 que quedaba en esa página: acordeón `.benefits-toggle` a la
  izquierda y foto a la derecha. Los cinco argumentos son los mismos y dicen lo mismo.
  - **Componente nuevo `.reasons`** (`ds/sections.css`): la celda del trío con el número de celdas
    abierto. Comparte celda con `.trio` —icono, frase a dos tintas, enlace— y los selectores van
    agrupados para que no puedan separarse; lo que cambia es el reparto, declarado por celda con el
    **mismo `data-span` que las escenas**. Cinco argumentos = 4+4+4 y 6+6, dos repartos ya válidos
    apilados, sin hueco.
  - **Trampa de especificidad, y costó una pasada:** `[data-span="4"]` puntúa 0-2-0 y **una media
    query no suma especificidad**, así que las reglas responsive escritas como `.reasons > *`
    (0-1-0) no anulaban nada: en tablet y móvil el reparto de escritorio se quedaba puesto. Se anula
    con `.reasons > [data-span]`, que empata a 0-2-0 y gana por ir después.
  - El titular pasa de `.ds-dim` dentro del `h2` a `.section-head--flow`, que es el componente de
    eso mismo. Las palabras no cambian: el corte sigue en los dos puntos. De paso se evita que dos
    secciones seguidas lleven encabezado asimétrico, porque la de «Resultados» ya lo lleva.
  - Cada `<b>` con su párrafo debajo se ha cosido en **una sola frase con dos puntos**, que es lo
    que pide el patrón: partirla en dos bloques lo deshace. Contenido intacto, sólo la costura.
  - **Los tres primeros argumentos estrenan enlace** a `/auditorias/`, `/dashboard/` e
    `/integraciones/` —las páginas de las que hablan—. Los otros dos no llevan: una flecha sin
    destino cuesta más de lo que gana.
  - **Fuera `incidencia-acordion.webp`**, y es lo único que no es traducción: era una foto de banco
    con un chip de «Añadir imagen» y otro de «Datos sincronizados» pegados encima, interfaz que el
    producto no tiene. El sistema prohíbe justo eso, y en esta página sobra porque el producto real
    se ve más abajo en la demo guiada. El fichero sigue en `assets/`, ya sin usar.

- **Los casos pasan a ser landings de vídeo de una sola pantalla, una por caso** (ese día eran dos;
  el tercero, Prilux, entró después y está arriba). Dentro de la hero va todo —eyebrow, titular, descripción, la foto del vídeo con su candado y el formulario— y
  debajo sólo una lista de enlaces a otras páginas. Nada más: cada sección intermedia es una salida
  más entre el visitante y el formulario.
  - **El caso escrito se ha ido.** Las dos páginas tenían ~200 líneas cada una con el punto de
    partida, qué cambió, la cita y la ficha de empresa, todo sacado de los webinars. **Sigue en el
    historial, en `c67c47e`**, y se recupera con `git show c67c47e:casos-de-exito/carnavi/index.html`.
    Con ello se van también el `Article` del JSON-LD (describía una página que ya no existe), la
    banda de foto, la franja de cifras y la cita de esas dos páginas. **Lo que costará es SEO**: eran
    las dos únicas URLs con texto largo sobre casos reales, y ahora son dos landings de captación.
    Decisión de negocio, tomada a sabiendas el 17 de agosto.
  - Componente en `ds/gate.css` + `ds/gate.js`. **Un gate por página, y esto no es pereza**: el
    embebido de HubSpot avisa del envío con un `postMessage` que **no dice de qué formulario viene**,
    así que con dos gates en la misma página el envío de uno abriría los dos vídeos. Fue el motivo de
    partir la primera versión —una sola landing con los dos vídeos y un formulario— en dos.
  - El vídeo **no se descarga hasta que se abre**: el `src` vive en `data-src`. Con los dos puestos
    de entrada, un navegador con preload agresivo se traía 32 MB para enseñar dos pósteres.
  - **No es un muro de pago y no se puede vender como tal.** Sitio estático: la URL del `.mp4` es
    pública y está hasta en el JSON-LD (a propósito, con `isAccessibleForFree:false`, para que el
    vídeo pueda salir en resultados enriquecidos). Filtra al visitante normal, no al que quiere
    saltárselo.
  - **Abierto una vez, abierto siempre**, con una llave de localStorage **por caso**
    (`solved:casos-video:<caso>`): quien vio el de Carnavi no ha pedido el de Panificadora.
  - El índice `/casos-de-exito/` se queda en dos tarjetas `.vcase` que llevan a cada landing, sin
    formulario, con el copy que pidió el cliente: «Descubre la experiencia de nuestros clientes ·
    Casos de éxito reales en empresas industriales como la tuya». **El candado también sale en las
    tarjetas**: prometer «ver el vídeo» y aterrizar en un formulario sorpresa es lo que hace que la
    siguiente página no se lea.
  - **La curiosidad se hace con datos de verdad.** La descripción dice la cifra —dos horas al día, de
    dos plantas a cinco— y lo que reserva es el relato. Los pósteres son el fotograma del segundo 8,
    donde el montaje pone el rótulo con el nombre y el cargo (por eso las fichas no repiten el nombre
    encima de la foto).
  - Vídeos en `assets/casos/`, los 720p de `~/Vídeos/casos-exito-solved/` pasados por
    `-movflags +faststart` para que empiecen a verse sin descargar el fichero entero. **32 MB al
    repo**, que es el precio de no depender de YouTube.
  - **Dos trampas del montaje.** (1) HubSpot pinta su formulario **dentro de un `<iframe>` de
    hsforms.net**, así que desde la página no se puede enfocar el campo del correo: se enfoca el
    iframe y el primer tabulador ya cae dentro. Esa misma cuenta de hijos es la que distingue
    «formulario cargado» de «lo ha parado un bloqueador» para encender el aviso de rescate. (2) El
    candado de `.vcase` sin `position` se colaba como ítem de rejilla, abría una fila implícita
    debajo del póster y acababa en una banda gris al pie del marco.
  - Abierto, el vídeo se centra a **860px como mucho**: a 1200 de ancho un 16:9 mide 675 de alto y se
    come la pantalla entera, y esto es una cabeza hablando.

- **Fallo tonto y caro: la nav nueva no se veía.** El 16 se metieron «La plataforma» y «Casos de
  éxito» en `chrome.js` pero **no se subió su `?v=`**, así que las 124 páginas seguían pidiendo
  `chrome.js?v=20260803a` y el navegador servía el menú viejo. Las páginas estaban publicadas y sin
  forma de llegar a ellas navegando. Ahora `?v=20260817a`.
  **Regla:** `chrome.js` monta nav y pie de TODO el sitio; tocarlo sin subir la versión equivale a no
  tocarlo. Lo mismo vale para `solved.css` y los `ds/*.css`.
- **Componente nuevo `.photo-band`** (`ds/sections.css`): foto de planta a sangre con la cifra del
  caso encima. Montado en los dos casos y en `/industria-general/`. Dos reglas que lleva escritas:
  el texto **nunca** va directo sobre la foto —va sobre un velo en degradado, mismo criterio que el
  lavado del shader de la hero— y la foto es **ambiente, no documento**: el `alt` describe la escena
  y no nombra a nadie, porque dar a entender que una foto de stock es la planta del cliente es
  justo lo que no se hace. Los datos de la empresa viven fuera, en su franja de cifras.
  - Fotos: `caso-operarios-tablet.webp` y `caso-tanques-control.webp`, sacadas de `Operarios.png` y
    `Tanques.png`, que llevaban en `assets/` sin usar. **Pexels y Unsplash no sirven sin clave de
    API** (403 y 307 respectivamente), así que si se quieren fotos de stock nuevas hace falta una.
  - **Dos trampas de rejilla, las dos costaron un rato.** (1) `align-items:end` en el contenedor
    impide que foto y velo se estiren: la fila se dimensionaba por el contenido, la foto se iba a
    857px, el velo colapsaba a 0 y el texto caía fuera del recorte. El anclaje abajo va en
    `.photo-band__in`, no en el contenedor. (2) `grid-template-rows:1fr` **no basta**: una pista
    `1fr` tiene mínimo automático igual al contenido, así que la foto volvía a estirar la fila. Hace
    falta `minmax(0,1fr)`.
  - `object-position` va en `--photo-band-pos` (por defecto `50% 28%`): la banda es 2,8:1 y las
    fotos 4:3, así que `cover` recorta mucho y con el centro por defecto cortaba las cabezas.
- **Ojo al verificar en la pestaña automatizada:** ahí **ninguna** imagen `loading="lazy"` llega a
  cargar, aunque esté en pantalla —le pasa igual a las que llevan meses funcionando en producción—.
  Si una foto sale en blanco al revisar, comprobarlo antes con una página de prueba con
  `loading="eager"` en vez de dar por roto el componente.

Hecho el 16 de agosto:

- **Cuatro páginas nuevas, traídas de la arquitectura de `mitti.com/es`** (que ya era la referencia de
  `/integraciones/`). Se revisó su sitemap entero —61 páginas en español— y se extrajo la gramática de
  sus tres plantillas: la de plataforma, la de solución y la de sector.
  - **`/casos-de-exito/` + `/casos-de-exito/carnavi/` + `/casos-de-exito/panificadora-alcala/`.** Era
    el hueco que la auditoría de la 2.0 lleva marcando desde junio («no hay casos de éxito con
    cifras»). **Todo el contenido sale de las dos transcripciones de webinar**, incluidas las cifras:
    Carnavi (2 h/día en registrar a mano, planta de +40 años, 13 años de Ana en la casa) y
    Panificadora Alcalá (de 2 a 5 plantas, de 200 a +500 personas, 3 herramientas unificadas en una).
    Ni un dato inventado ni redondeado. Estructura por caso, calcada de Mitti: hero, banda de cifras,
    **punto de partida** (el dolor antes que la solución, que es como abren ellos), qué cambió, cita,
    resultados y ficha de empresa.
  - **`/plataforma/`**, que es la página que Mitti tiene y aquí faltaba: la nav de Productos no tenía
    landing. Sigue su orden —problema → tres capacidades → IA → integraciones → prueba → FAQ— y **el
    copy no se ha reescrito**: sale de los ledes de los seis diálogos de las escenas de la home, que
    ya estaban escritos y revisados.
  - Las tres llevan hero con shader, JSON-LD (BreadcrumbList + Article/FAQPage/ItemList), stub de raíz,
    alta en `STATIC_PAGES`, y entrada en la nav y en el pie. Sitemap: 111 → 115 URLs.
- **La banda de caso, por fin montada** (pendiente 6). Estaba parada por dos motivos y los dos han
  caído: ya hay página de caso a la que llevar su enlace —que es su único destino— y los tres datos
  del pie ya no son deducción, salen del webinar. Va en la home y en `/casos-de-exito/`.
- **Las dos páginas de sector, repasadas con la gramática de sector de Mitti** (que cierra siempre con
  los clientes de ESE sector y con enlaces a las soluciones, antes de la FAQ).
  - `/industria-alimentaria/` se queda los **dos casos enteros**, porque los dos son de alimentación
    —una cárnica y una panificadora—, con su banda de cifras.
  - `/industria-general/` lleva el bloque equivalente pero **sin casos**: los dos publicados son de
    alimentación y colocarlos aquí sería vender como propio del sector algo que no lo es. En su sitio
    van las cuatro soluciones. Cuando haya un caso de industria general, su hueco está marcado en el
    comentario.
- **Lo que NO se ha traído de Mitti, y por qué.** `/precios/` (no hay ni un dato de precio o modelo en
  todo el repo), `/seguridad/` —ojo: `SECURITY.md` es una auditoría de **la web**, no de seguridad de
  producto; una página así necesita hosting, RGPD, ISO, copias y roles— y `/acerca-de/` (no hay equipo,
  y sigue sin resolverse la discrepancia de domicilio del JSON-LD). También queda fuera su activo SEO
  más grande, la **biblioteca de plantillas/checklists**: es el patrón más rentable de los suyos, pero
  montarlo exige el catálogo real de plantillas de Solved y aquí habría que inventarlo.

- **El puente, en la tarjeta ampliada de Integraciones** (`ds/app.css`, componente `.bridge`; el
  diálogo `u-integra` no tenía ningún recurso visual, sólo texto). Es la réplica del recurso de la
  tarjeta **«Integra pagos en tu plataforma»** de la home de Stripe, medido en su DOM en vivo el 16 de
  agosto: dos planos —la ventana de la plataforma detrás y, delante y elevada, la ficha del sistema
  con el que habla— y **un cable explícito entre las dos**, que es lo que convierte dos pantallas
  sueltas en «una habla con la otra».
  - Del original se conservan las **proporciones** (sobre un lienzo de 1000×457: ventana 72,8 % a
    21,6 %/5,7 %; tarjeta 29,6 % a 7 %/24,1 %; cable 13,1 % a 10,2 %/19,3 %), el **trazado del codo**
    (`M1 95 L1 9.45 C1 4.78 4.78 1 9.45 1 L131 1`, esquina de radio 8,45), la **sombra** de la ficha
    (`0 16px 32px rgba(50,50,93,.12)`) y las tres decisiones que hacen que el cable funcione:
    **punteado fino** con punto y hueco iguales —no la raya 5-5 de `.hub__wire`, que es otra cosa: allí
    es una manguera de datos, aquí un enlace—, **trazo en degradado que se apaga** en el extremo
    lejano para que no compita con las pantallas, y **dibujado progresivo**.
  - El dibujado va con una **máscara SVG** (un segundo trazado sin puntear cuyo `stroke-dashoffset` se
    anima), no con el offset del propio trazo: animar el offset de una línea de puntos hace
    **desfilar** los puntos en vez de dibujarlos. Es como lo resuelve Stripe.
  - **Lo que no se copia es el sentido.** El cable de Stripe va sólo hacia la plataforma; aquí el
    pulso hace ida y vuelta, porque la integración de Solved es en los dos sentidos y es literalmente
    lo que dice el primer detalle de ese mismo diálogo.
  - Contenido: ventana con la pantalla de Incidencias (barra, menú y las cinco abiertas) y ficha con
    el logo de SAP y el registro de salida al ERP. **Los identificadores son los mismos a los dos
    lados y los mismos que en el resto de la home** —`UTD26_163_001` es la fuga de aceite de la cinta
    L3—, que es justo lo que el pie de la figura afirma. No se ha maquetado ninguna pantalla de SAP:
    la ficha es el acuse de Solved, no la UI de un tercero.
  - Estrena `.ds-dialog__shots` / `.ds-dialog__shot`, que estaban en `ds/dialog.css` sin usar, con un
    modificador `--wide` para el escenario apaisado. **Ojo**: `.ds-dialog__shot .app` lleva
    `position:absolute; inset:0` y eso es lo que hace que la pantalla llene el marco del dispositivo;
    anularlo deja la app suelta y el marco medio vacío (pasó al montarlo).

- **La escena del dashboard de la home, repasada.** Se llamaba «Mira cómo va la planta sin pedir un
  informe» y ahora es **«Configura tus tableros para ver los datos en tiempo real»** (cambiado también
  en el `<dialog>`, que repetía el titular).
  - **Más naranja y morado, pero por la regla, no al gusto.** El panel de barras era monocolor —azul,
    con los meses pasados en un azul más claro— y ahora cada barra se parte en los tres módulos que
    la alimentan: incidencias abajo, acciones en medio, registros arriba. Por eso el panel pasa a
    llamarse **«Actividad por mes»**: etiquetar como «Incidencias por mes» un gráfico que suma tres
    módulos sería mentir sobre el dato. Los tramos van con `flex-grow`, así que **la altura total de
    cada barra es la misma que antes** (88/69/100/75/56/75) y la silueta del gráfico no cambia.
  - El mes en curso ya no destaca con otro azul —eso obligaría a tener versión clara de los tres
    colores— sino bajando la intensidad de los anteriores (`.app__bar--prev .app__barv{opacity:.72}`).
  - Las cuatro cifras llevan ya su color de módulo: azul las dos de incidencias, naranja acciones,
    morado registros. El morado deja de estar escrito a pelo y pasa a `--app-registro`.
  - **Ojo con `.app__seg`**: ese nombre ya existía en `ds/app.css` para el control segmentado
    (Tabla/Calendario/Kanban) y al reutilizarlo para los tramos de barra salían pastillas blancas con
    borde en vez de barras. Los tramos son **`.app__bseg`**.
- **Las cifras del dashboard cuentan hacia arriba**, en el mismo ciclo de 7 s que las barras. El
  número no está escrito como texto: lo pinta `counter()` desde `--app-n`, que es lo que anima el
  keyframe —un entero no se interpola de otra forma en CSS—, con `@property` para registrarlo (primer
  uso de `@property` en el proyecto; verificado que interpola). La de días necesita dos contadores,
  porque `counter()` no da decimales. **Cada tarjeta lleva su valor final en un `style` inline**: es
  lo que se ve si el navegador no registra `@property`, y así la cifra correcta está en el marcado y
  no sólo en la hoja. Obedece a `--play` como el resto, y con `prefers-reduced-motion` se queda
  quieta en su valor.

- **Las dos citas que faltaban**, con lo que las cuatro páginas de producto tienen ya testimonio.
  **Ana (Carnavi) en `/no-conformidades/`** —reclamar al proveedor desde la plataforma, con el campo
  del análisis de causas y un plazo— y **Samuel (Panificadora Alcalá) en `/dashboard/`** —usar Solved
  como cuadro de mando—. Salen de las mismas transcripciones de agosto, condensadas de fragmentos
  contiguos (minutajes anotados en el comentario de cada página).
  - Ana y Samuel repiten página, que es lo que decía el pendiente 5: **lo que no se repite es la
    cita**, y cada una argumenta lo que su página vende. Sigue siendo una por página.
  - Las dos páginas tampoco cargaban `ds/sections.css`, igual que pasó con `/incidencias/` y
    `/auditorias/`. Añadido el `<link>`.
  - **Trampa nueva, anotada en el marcado de `/no-conformidades/`:** esa página reutiliza la clase
    `.flow` como layout de sección en su `<style>` local, pero `.flow` es OTRO componente en
    `solved.css` —una fila de píldoras— y arrastra `.flow span{background:var(--blue-50);
    border-radius:pill}` (0-1-1). Eso convertía la firma de la cita (`.pull-quote__by`, un `span`,
    0-1-0) en una pastilla azul. La sección va con **`.stack-card`**, que en esa página da el mismo
    layout y no tiene esa regla. Su FAQ sigue con `.flow` y se libra sólo porque no tiene ningún
    `span` suelto: cualquier componente nuevo que se monte ahí dentro se va a comer lo mismo.
- **El párrafo de la sección de utilidades vuelve a nombrar los cuatro módulos** (pendiente 7). Al
  pasar de «módulos» a «utilidades» las tarjetas dejaron de decir cómo se llaman las cosas y la home
  se quedó con «acciones correctivas» a cero, «plantillas» a uno y «no conformidades» a uno. El sitio
  es el del encabezado, como decía el pendiente, pero **no cabe un bloque de texto**: `.section-head
  --flow` pinta el párrafo a `--type-display-lg`, corrido con el titular. Así que no se ha añadido
  párrafo, se han cambiado las palabras genéricas por las concretas dentro del que ya había — 205 →
  239 caracteres, de cinco líneas a seis. Si crece más, deja de leerse de un golpe.

Hecho el 15 de agosto:

- **Dos testimonios nuevos, de los webinars.** Lo que bloqueaba el punto 5 de pendientes era que los
  webinars eran vídeo sin transcripción; se transcribieron con Whisper y de ahí salen las citas.
  **Carnavi (Ana Domínguez) en `/incidencias/`** —su cita va de registrar una incidencia desde el
  móvil sin formación previa, que es justo el argumento de esa página— y **Panificadora Alcalá
  (Samuel) en `/auditorias/`**, cuya cita va de pasar los registros de papel a digital y de la
  calidad del dato que sale. Se mantiene la regla de una cita por página y cada página la suya.
  - Los logos del testimonio salen de `assets/clients-color/`, que ya los tenía: recortados por el
    alfa y llevados a 112px de alto sobre blanco, que es el formato del resto de `assets/testimonios/`.
    Se conserva el claim del logo de Panificadora porque el de Fritoper también lo lleva.
  - Los avatares son **fotogramas del propio webinar** recortados a 168×168, no hay foto de estudio.
  - `/incidencias/` y `/auditorias/` **no cargaban `ds/sections.css`**, porque hasta ahora no montaban
    ninguna sección de ese fichero: la cita salía sin estilar. Añadido el `<link>` en las dos.
  - Material de origen y las frases alternativas, en `~/Vídeos/casos-exito-solved/`.
- **Los patrones de Stripe salen de la guía y entran en las páginas.** Hasta ahora vivían sólo en
  `guidelines/secciones.stripe.html`, que es un banco de patrones, no una página del sitio.
  - **Trío de apoyo** en la home, en «El mejor aliado»: sustituye a las tres `.vcard` de la 2.0 con
    las mismas tres ideas, pero con el párrafo a dos tintas. El de integraciones ya no manda al PDF,
    manda a `/integraciones/`.
  - **Carril recortado** en la home, sección nueva «Míralo por dentro, caso a caso», con los seis
    casos de uso. Son seis enlaces internos que la home no tenía fuera de la nav.
  - **Cita centrada, una por página, y cada página la suya**: la rejilla de tres testimonios estaba
    repetida igual en la home, `/industria-alimentaria/` y `/industria-general/` —los mismos tres
    clientes tres veces—. Ahora Fritoper en la home, Lácteos Romar en alimentaria (es láctea y su
    cita va de comunicación) y Prilux en general (es iluminación y su cita va de adopción).
- **`ds/sections.js`**: lo único que le faltaba al carril. Mueve una tarjeta por clic midiendo el
  paso del DOM —`grid-auto-columns` cambia en cada escalón responsive—, apaga la flecha del extremo
  y esconde los controles si no hay nada que desplazar. Los controles van con `hidden` en el marcado
  y los enciende el script: misma regla que `.scene__expand`, la afordancia sólo se pinta si hace
  algo. Sin JS el carril se arrastra igual.
- Un fallo del carril que sólo salía montado en una página de verdad: el `margin-right` negativo vale
  `--frame-pad-inline` (32px), pero por debajo de 768px `ds/site.css` estrecha el padding del
  encuadre a 16. El carril se salía 16px y aparecía **scroll horizontal en toda la página**.
  Arreglado en `ds/sections.css` con la pareja `-16px / 16px` para ese tramo.

Hecho el 14 de agosto:

- **La sección de módulos pasa a ser de utilidades**, con seis escenas (8+4 / 4+8 / 6+6) que dicen lo
  que la planta hace, no cómo se llama el módulo. Cada una abre un `<dialog>` con el detalle
  (`ds/dialog.css`, `ds/scene.js`). Incluye la **capa de IA sobre grafito** y una de **integraciones**.
- **Lo que se anima es el contenido de la pantalla, nunca la tarjeta** — barras que crecen, el parte
  que entra, los OK en cascada. Es la distinción de Stripe: sus tarjetas no animan, sus mockups sí.
- El dashboard deja de ser monocolor: **naranja para Acciones y morado para Registros**, porque el
  color es el del módulo del que sale el dato.

- **Página nueva `/integraciones/`** (+ stub `integraciones.html`, entrada en la nav y en el pie de
  `chrome.js`, y alta en `STATIC_PAGES` de `scripts/config.mjs`). El contenido no se inventó: sale de
  `assets/docs/solved-integraciones-erp-mes-gmao.pdf` —**64 sistemas: 27 ERP, 19 MES, 17 GMAO y Power
  BI**— y del post `blog/como-integrar-la-gestion-de-incidencias-erp-mes-gmao/`. Los **logos son los
  del propio PDF**, extraídos con su alfa a `assets/integraciones/` (62 ficheros: Infor comparte
  wordmark en sus tres entradas). Componente en `ds/integrations.css` + `ds/integrations.js`.
  El armazón de la página está calcado de `mitti.com/es/integraciones` —hero de API, bloque de
  beneficios, cierre "¿no encuentras el tuyo?", FAQ de siete— pero ellos no enseñan catálogo y aquí
  el catálogo **es** la página, porque el material de Solved son 64 logos con nombre.
- **El argumento de la página es que integrar es opcional**, no un catálogo de compatibilidades:
  Solved funciona autónomo y la integración se añade cuando aporta. Sale del post, y es lo que lo
  diferencia de la competencia, que vende la integración como requisito.
- **`ds/sections.css`: la segunda tanda de Stripe**, medida del DOM en vivo de `stripe.com/es` el 14
  de agosto. Cinco patrones nuevos —banda de caso, lista de casos, carril recortado, trío de apoyo y
  cita centrada— más el **fragmento compuesto**, que va en `ds/scene.css` porque es el componente
  Escena. Guideline con contenido real de Solved en `guidelines/secciones.stripe.html`.
- La medición confirma tres cosas del sistema: el contenedor de **1266px** de `--container` es
  literalmente el suyo, el ritmo de **96px** también, y **en toda su home no hay un solo peso 700** —
  la regla de "nada de negrita" no era una manía. Su escala de titulares es la de `tokens.css` hasta
  el tracking. Lo único que no compartimos es la tinta: la suya es azul muy oscuro, la nuestra el
  negro del logo.

- **`ds/app.css`: las pantallas de la app, en HTML.** Sustituyen a las maquetas de tabla que había
  provisionales en la home. Cuatro: listado de incidencias en el iPhone, listado de acciones sin
  marco, registro cumplimentado en el iPad y dashboard en la ventana de navegador. Estética y datos
  del tour de `/incidencias/` (Roboto, azul `#1E6BFF`, empresa PopCorn Mediterránea, junio de 2026),
  así que los identificadores cruzan entre tarjetas: el KO de las luminarias del registro es la
  incidencia `UTD26_162_001`, que sale como acción en la tarjeta de al lado.
- El fragmento se recorta **por el borde, nunca encogiendo**: ancho natural mayor que la caja y lo
  corta el `overflow`. Antes el registro se encogía y enseñaba dos puntos y medio de la ronda.
- `dev-movil` pasa de 27 % a 30 % y gana tres escalones responsive (34 / 44 / 56 %): su ancho es un
  porcentaje de la tarjeta, y en un teléfono el aparato acababa midiendo cien píxeles.

Hecho antes del 14 de agosto:

- Componente **Escena de producto** completo (tokens, CSS, validador, guideline, documentación),
  aplicado a la sección de módulos de la home.
- Marcos de dispositivo: **iPhone, iPad y ventana de navegador**. En escritorio se enseña la ventana,
  no el ordenador — el portátil no argumenta nada. Se quitó el MacBook.
- Cuatro patrones traídos de Stripe: titular a dos tintas, banda de cifras entre hairlines,
  encabezado de sección asimétrico y escena ancha con el título en columna.
- Las **seis páginas interiores** llevan ya la hero de la home (con su shader) conservando su propio
  copy, y la misma franja de clientes.
- Barrido de pesos: cero negrita en todo el sitio.
- Titular nuevo de la home, a dos tintas y sin subtítulo.

## Pendiente, por orden de bloqueo

0. **Traducir `/gestion-de-calidad/` y decidir dónde la enlaza la navegación.** Hoy es una página
   huérfana: está en el sitemap pero no cuelga de la nav ni del pie, porque `chrome.js` es compartido
   y el enlace saldría igual en los cuatro idiomas apuntando a una URL española. Mitti la cuelga de un
   menú «Soluciones» que aquí no existe —la nav tiene Productos, Industrias, Integraciones y
   Recursos—, así que hay que decidir si se abre esa entrada o si la página vive sólo del buscador y
   de los enlaces internos. Con la traducción entran también sus `hreflang`, hoy ausentes a propósito.
   **Bloquea publicarla.**

0. **Terminar la traducción del contenido y que alguien la lea.** El blog y el glosario van por la
   mitad: se relanza con `bash scripts/translate-contenido-todo.sh`, que es reanudable, y luego
   `npm run build:i18n:contenido`. **Bloquea publicar los idiomas**, y con ello va la decisión de
   negocio de si se publican los cuatro o sólo uno. Detalle en el estado del 4 de septiembre.
0. **Que existan las cuatro piezas que la ficha de `/gestion-de-activos/` ya enseña** —foto del
   activo, y pestañas de Documentos, Imágenes y Mantenimientos— o quitarlas del marcado. **Bloquea
   publicar esa página.** Detalle en el estado del 3 de septiembre.
0. **Que el campo «Activo» de la escena de acciones de `/gestion-de-activos/` sea real** —que alguna
   plantilla de incidencia o de acción lo exponga de verdad— o quitar esa fila de `.res__rows--fill`.
   **Bloquea publicar esa página.** Detalle en el estado (5) del 28 de septiembre.
0. **Crear en HubSpot el formulario corto de vídeo y pegar su id en `chrome.js` (`formIdVideo`).**
   Es lo único que le falta al gate para estar terminado, y bloquea publicarlo. Mientras esté vacío,
   `chrome.js` sirve el formulario de contacto —el gate abre igual, así que la página funciona
   entera—, pero **la promesa y el formulario no coinciden**: la landing dice «déjanos tu correo» y
   HubSpot pide nombre, apellidos, correo de empresa y **teléfono obligatorio** para ver dos minutos
   de vídeo. Eso es exactamente lo que hace que no lo vea nadie, y además el lead entra etiquetado
   como petición de contacto, que no es lo que ha pedido el visitante. El formulario nuevo debería
   ser un solo campo más el consentimiento.
1. ~~Las pantallas de la app en HTML.~~ **Hechas** (14 ago 2026): `ds/app.css` y las cuatro escenas
   de la home —listado de incidencias en móvil, listado de acciones, registro cumplimentado en
   tablet, dashboard en ventana—, con la estética y los datos del tour de `/incidencias/`. Fuera el
   `<style>` provisional.
2. **Confirmar el formato de identificador.** Se usa `UTD26_163_001` en el tour y ahora también en la
   home, pero en `assets/producto-incidencias.webp` se ve `UD025_691_PRO`. Si el bueno es el segundo,
   hay que cambiarlo en todos lados a la vez.
3. **Confirmar la URL de la barra del navegador.** Puesta a ojo como `app.trysolved.com/dashboard`; no
   aparece en el repo. Se cambia con `--device-url`. Y con ella, **si el dashboard vive bajo
   "Informes"** en el menú lateral: es el único ítem del menú real donde encaja, pero está elegido
   por descarte.
4. **Faltan 19 logos de cliente** a color, con transparencia, horizontales y sin recuadro. Se
   retiraron 8 porque venían de favicons o de `og:image` y se veían mal. La cinta está en 29.
5. ~~**Testimonios**: faltan páginas por cubrir.~~ **Cubiertas todas** (16 ago 2026): siete citas y
   ninguna página de producto sin la suya —Fritoper en la home, Lácteos Romar en alimentaria, Prilux
   en general, Carnavi en `/incidencias/` y en `/no-conformidades/`, Panificadora Alcalá en
   `/auditorias/` y en `/dashboard/`—. Las 955 transcripciones de `~/samu-export` siguen sin servir:
   son reuniones de trabajo y son privadas.
   **Lo que queda es de negocio, no de código, y bloquea publicar**: (a) las **cuatro citas de los
   webinars son condensadas** —fragmentos contiguos sin muletillas— y conviene que **Ana y Samuel las
   validen**, que es lo normal en un testimonio con nombre; (b) ~~**falta el apellido de Samuel**~~
   **resuelto** (17 ago 2026): es **Samuel Pardo**, dato aportado por el cliente —la grabación sólo
   lo identifica como «Dpto. Técnico Panalca» y en el audio nadie lo dice—. Puesto en las dos fichas
   de cita (`/auditorias/`, `/dashboard/`), en la landing y la tarjeta del caso, y **en el montaje
   del vídeo**: cartela de entrada, rótulo inferior y marco de las verticales de LinkedIn salen de
   `~/Vídeos/casos-exito-solved/_montaje/cards/panalca.json`, así que cambiar el nombre obliga a
   regenerar cartelas y **volver a renderizar** el caso y las tres píldoras, y a rehacer el póster,
   que es el fotograma del segundo 8 y lleva el rótulo dentro.
6. ~~Del listado de Stripe quedan: fragmentos compuestos, carrusel recortado y banda de caso.~~
   **Los tres hechos** (14 ago 2026), y con ellos dos que no estaban en la lista: lista de casos y
   trío de apoyo. Están en `ds/sections.css` y montados con contenido real en
   `guidelines/secciones.stripe.html`. ~~**Falta aplicarlos a las páginas.**~~ **Aplicados** (15 ago
   2026): trío y carril en la home, y cita centrada en la home y en las dos páginas de sector.
   **Queda sin montar la banda de caso**, por dos motivos: no hay página de caso a la que llevar su
   enlace —y el enlace es el único destino de la banda—, y faltan los dos datos de su pie sobre
   Fritoper (cuántos centros productivos y qué módulos usa), marcados en rojo en la guía. La lista de
   casos tampoco se monta: con una cita por página ya no quedan tres clientes sueltos que colocar.
   Si algún día se escriben páginas de caso, las dos entran juntas.
7. ~~Los cuatro párrafos descriptivos que salieron de la sección de módulos siguen fuera.~~ **Hecho**
   (16 ago 2026), y no como párrafo aparte: el encabezado corrido pinta a tamaño display, así que lo
   que se recuperó fueron las **palabras** —incidencias, controles y auditorías, plantillas, acciones
   correctivas, no conformidades, KPIs— dentro del párrafo que ya había. Detalle arriba.
8. **Confirmar el catálogo de `/integraciones/` con el cliente.** La lista es la del PDF de julio de
   2026 y se dio por buena entera; si alguna integración ya no se mantiene, o hay alguna nueva, hay
   que tocar tres sitios a la vez: el logo en `assets/integraciones/`, la tarjeta en la rejilla y los
   contadores de los chips (`64 / 27 / 19 / 17 / 1`), que van escritos a mano en el HTML. Pendiente
   también decidir si se enseñan los **logos ajenos** —ahora se enseñan, con su aviso de marcas al
   pie, igual que en el PDF que el cliente ya publica— o sólo los nombres.

## Cosas que ya se probaron y se descartaron

- **La cinta del hero delante del texto, sin difuminar.** Se probó y se revirtió: el lavado del shader
  no es decoración, es lo que sostiene la legibilidad. Con la cinta encima se perdían el subtítulo en
  gris y los botones en las siete páginas. Si se reintenta, hace falta `mix-blend-mode:multiply` o
  sacar el texto del paso de la cinta.
- **El azul de KPIs igual al de Incidencias.** Eran indistinguibles llevados a lienzo. Se probaron
  cinco variantes (registro en `guidelines/tintes.prueba.html`) y se creó `--module-kpis:#3FAFD6`.
