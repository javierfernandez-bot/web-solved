# Solved DS — la estética de la 3.0

Los fundamentos que gobiernan el aspecto del sitio. Conviven con `solved.css` (la hoja de la 2.0):
los tokens usan otros nombres, así que no se pisan.

| Fichero | Qué es |
|---|---|
| `tokens.css` | Paleta, tipografía, forma, elevación, movimiento y encuadre. Se importa el primero. |
| `site.css` | Las piezas de página construidas sobre esos tokens. |
| `hero.css` · `hero-wave.js` · `weave.js` | El hero y el material de gradiente. `hero-wave.js` tiene siete entradas: `marca` (por defecto) e `ia`, y una por página de módulo —`incidencias`, `registros`, `acciones`, `kpis` y `documentos`—, cada una con su color y su forma. |
| `integrations-weave.js` | Variante «Convergencia» del haz, sólo para la hero de Integraciones. |
| `tint.css` | Los seis tintes de lienzo de las escenas de producto. |
| `scene.css` · `scene-dev.js` · `scene.prompt.md` | El componente Escena de producto y su validador de desarrollo. |
| `scene.css` → `[data-canvas="foto"]` · `assets/planta/` | Variante de la escena con **lienzo de foto**: la superficie teñida se sustituye por una fotografía de alguien usando un dispositivo en planta, y encima siguen flotando el fragmento de producto o un **recurso** (`.res`, `.res-pill`, `.res-ia`). Procedencia de las fotos en `assets/planta/FUENTES.md`. |
| `device.css` | Marcos de iPhone, iPad y ventana de navegador. |
| `app.css` | Las pantallas de la app, construidas en HTML, que van dentro de una escena o de un bocadillo. Seis: incidencias en el móvil, acciones, registro en la tablet, dashboard en la ventana, **ficha de activo** en la ventana y **carpeta de documentos** en un bocadillo. |
| `plantilla.css` | **El montaje de una plantilla**: los tres caminos para tener un registro —duplicar un modelo de la biblioteca, montarlo en el editor, o subir el parte y dejar que la IA lo convierta— en un bucle de 21 s. Réplica en versión Solved de la animación de Mitti. Sólo CSS. Guía en `/guidelines/plantilla.montaje.html`. |
| `documentos.css` | **Las cuatro piezas del gestor documental**: la carpeta en el móvil, la versión que se valida, la respuesta de la IA con su cita y el documento enganchado a tres sitios. Sin JS. Ninguna lleva tinte de módulo —Documentos no tiene color— y la de IA va sobre grafito. Sólo la carga `/gestor-documental/`. |
| `ambitos.css` | **Los tres ámbitos de la home** (Calidad · Mantenimiento · Producción): la foto de planta, con altura en `vh` para que la sección quepa en una pantalla de ordenador, y encima **una maqueta de la plataforma** (las pantallas de `app.css` en su aparato, quietas) y **una notificación** (`.res-pill`). Sin tinte de módulo —son ámbitos, no módulos— y sin JS. Requiere `scene.css`, `device.css` y `app.css` antes. Sólo la carga la home. |
| `sections.css` · `sections.js` | Las secciones de contenido: banda de caso, lista de casos, carril, trío y cita. El script es sólo para las flechas del carril. |
| `rotador.js` | El rotador de capacidades (patrón 12 de `sections.css`): la lista se pasa sola y arrastra la pantalla de la derecha. |
| `hsform.css` | El formulario de HubSpot con la estética del sitio. **No la carga ninguna página**: la mete `chrome.js` dentro del iframe de HubSpot. |
| `integrations.css` · `integrations.js` | El catálogo de integraciones de `/integraciones/`: rejilla de logos, buscador y filtro por tipo. |
| `dialog.css` · `scene.js` | El diálogo que abre una escena, y el halo del borde que sigue al cursor. |
| `vcase.css` | `.vcase`, la tarjeta de vídeo de `/casos-de-exito/`: cada caso se reproduce ahí mismo, con los controles nativos del `<video>`. En pestañas (patrón 7, abajo), una a la vez. Sin landing propia, sin formulario. |
| `aiband.css` · `aiband.js` | La banda de IA: barra de prompt sobre grafito, la pregunta que se teclea sola y las piezas de la respuesta alrededor. Cuatro turnos en bucle. |
| `ia-dark.css` | El tema oscuro de `/ia/`: reasigna los alias del DS dentro de `[data-tema="ia"]`. Única página del sitio sobre grafito. |

> `_ds/solved-design-system-…/` es otra cosa: el paquete exportado de Claude Design, con su propio
> juego de tokens (`--blue`, `--ink-…`) y su `_ds_manifest.json` autogenerado. No es el índice de esta
> carpeta y no se edita a mano.

---

## Escenas de producto

Una tarjeta que enseña **un fragmento real de la aplicación flotando sobre un lienzo teñido**, con el
título fuera del contenido y el fragmento cortado por el borde. Sustituye a cualquier rejilla de
"features" con icono y párrafo. Su fuerza no está en el degradado: está en que el producto se ve
funcionando y se ve que **continúa más allá del marco**.

Marcado y API completos en [`scene.prompt.md`](scene.prompt.md). Guideline viva en
`/guidelines/escenas.card.html`.

### Anatomía, de fuera a dentro

1. **Marco** — radio 16px, borde `--color-hairline` de 1px, `overflow:hidden`. **Sin sombra.**
2. **Lienzo teñido** — el tinte del módulo que la tarjeta representa, sobre blanco (o sobre grafito
   `#111214` en la capa de IA).
3. **Fragmento de producto** — una captura real, recortada por al menos un borde del marco.
4. **Etiqueta** — título arriba a la izquierda, 15px, sobre el lienzo limpio, nunca sobre el fragmento.

### El lienzo puede ser una foto

`data-canvas="foto"` cambia el suelo de la escena: en vez de superficie teñida, una fotografía de
alguien usando móvil, tablet, portátil o el panel de una máquina en planta o en almacén. Encima
siguen flotando las mismas piezas de producto de siempre.

Existe porque el lienzo plano dice «esto es software» y la foto dice **quién lo usa y dónde**, que es
media discusión en un sitio donde el rival no es otro software sino el Excel, el papel y el grupo de
WhatsApp. La referencia es la gramática de `mitti.com/es/ia`: foto de primera línea con las tarjetas
de la aplicación encima, comunicando lo que acaba de pasar.

Lo que no cambia: el tinte lo sigue dictando `data-module`, con los mismos seis colores. Lo único que
sube es el cuerpo —`--tint-foto-*`, al 22%— porque un tinte al 10% sobre una fotografía no es una
señal, es suciedad. Lo que sí cambia: el título pasa a blanco sobre un **velo neutro**, porque ninguna
foto garantiza contraste para tinta oscura, y el velo no puede llevar color o se sumaría al tinte.

Cuando la sección no enseña una pantalla entera, dentro del `.scene__media` va un **recurso**: la
tarjeta que comunica la acción —el parte recién creado, la acción con su plazo, el registro firmado,
la respuesta de la IA citando el parte del que sale—. Ahí se rompe a conciencia la regla de «el
fragmento se sale por un borde»: una captura cortada dice que continúa, pero un dato cortado dice que
está roto (`Conforme` cortado se lee `C`). El recurso va entero y lo que continúa es la foto.

Montado en veinticuatro escenas repartidas por el sitio: seis en la home, cuatro en `/incidencias/` y
cuatro en `/gestion-de-activos/`, dos en `/auditorias/`, `/ia/` y `/casos-de-exito/`, y una en
`/no-conformidades/`, `/dashboard/`, `/industria-alimentaria/` e `/industria-general/`.

**El tinte `activos` estrena página** (3 de septiembre de 2026). Hasta entonces sólo se usaba en la
escena de integraciones de `/incidencias/`, que es lo que había: el grafito estaba reservado a un
módulo que la web no contaba. Ahora `/gestion-de-activos/` lo usa para lo que es, la ficha del equipo,
y esa escena es además **la única pantalla nueva de `ds/app.css` que no es copia de la home**.

### El tinte lo dicta el módulo

En Solved el color codifica módulo, conformidad y prioridad. Si los lienzos se tiñen al gusto, la
página enseña naranja y morado sin significado justo al lado de una tabla donde el naranja significa
Acciones. Por eso el tinte **no es decoración: es la misma señal que el icono del módulo, ampliada a
superficie**, y el componente no ofrece ninguna vía para pasarlo a mano.

| Módulo | Token | Intensidad |
|---|---|---|
| Incidencias | `--tint-incidencias` | azul `#0F68F4` al 10 % |
| Acciones | `--tint-acciones` | naranja `#F97316` al 10 % |
| Checklists / Registros | `--tint-checklists` | violeta `#7C3AED` al 10 % |
| Activos (GMAO) | `--tint-activos` | grafito `#3B434C` al **8 %** — un neutro oscuro pesa más que un cromático |
| KPIs / Dashboards | `--tint-kpis` | azul frío `#3FAFD6` al 12 % |
| Capa de IA | `--tint-ia` | morado `#A855F7` al 16 % — **sólo sobre grafito, nunca sobre blanco** |

> **Lo de IA va sobre grafito. Todo, no sólo el lienzo de las escenas**: etiquetas, paneles, tarjetas
> y cualquier pieza nueva. Sobre blanco el morado ni contrasta a tamaño pequeño (3,5:1 a 11px, contra
> los 4,5 que pide AA) ni se lee como la capa de IA, que en el producto es oscura. Ver `.ds-badge--ia`
> en `site.css`.

> **Falta un módulo en esta tabla: Documentos.** Es un módulo de primera clase del producto —tiene su
> entrada en el menú y su propio flag— y no tiene color. Por eso `/gestor-documental/` **no monta
> ninguna escena**: teñir su lienzo con el color de otro módulo es exactamente lo que esta regla
> prohíbe, y darle un color nuevo es una decisión de marca que no está tomada. Mientras no lo esté,
> esa página enseña el producto con la **escena con bocadillo** (`.stage`, patrón 10 de
> `sections.css`), que no pide módulo. Si algún día se le da color hay que tocar `tokens.css`,
> `tint.css`, `scene.css`, `dialog.css` y la lista de `scene-dev.js`, los cinco a la vez.

Dos paradas, sin más: color en la esquina de origen, 0 % en la diagonal opuesta. **El ángulo es una
sola variable** (`--tint-angle`) compartida por los seis: si cada tinte cayera hacia un lado, la
rejilla se descompone. **Techo de intensidad: 12 %.** Por encima, el lienzo compite con el fragmento,
que es lo único que tiene que leerse.

### Tinte de escena ≠ material de gradiente

Es la distinción que hay que dejar escrita, porque es lo primero que se degrada:

- **Tinte de escena.** Plano o de dos paradas, 10 %, sin filamentos, sin luz. Repetible en las seis
  tarjetas de una rejilla. **No consume el presupuesto de gradiente.**
- **Material de gradiente.** Seda trenzada: filamentos, luz, saturación alta — la onda del hero, el
  panel oscuro de IA, las teselas. **Dos apariciones grandes por página como máximo.**

Meter el material dentro de una tarjeta de escena está mal: el fragmento de producto deja de leerse y
la rejilla se convierte en un muestrario de fondos.

### El fragmento de producto

Aquí se gana o se pierde la credibilidad, más que en el color.

- **La pantalla se construye en HTML** (`ds/app.css`), no con capturas. Es decisión del cliente: así
  ajusta el contenido —un dato, un estado, un nombre— sobre lo que ve, y la pantalla no envejece con
  cada release. Maquetarla **no** es permiso para inventarla: mismo azul, misma tipografía (Roboto,
  la de la app), misma densidad y columnas que existan de verdad. La referencia es el tour de
  `/incidencias/` (`assets/tour/`), que se hizo contra capturas. Nada de wireframes ni de
  ilustraciones: una pantalla inventada cuesta más credibilidad que ninguna.
- **Recortada por al menos un borde del marco.** Es el gesto que dice "esto continúa". Un fragmento
  centrado y entero parece un icono grande. Se recorta **por el borde, nunca encogiendo**: el
  contenido lleva ancho natural mayor que la caja y lo corta el `overflow` de `.scene__media` o de
  `.device__screen`.
- **Texto interior no menor de 10px reales.** Si a esa escala no cabe, se recorta más y se enseña
  menos; nunca se reduce hasta que sea ruido gris.
- **Sin cromo de navegador** — ni pestañas, ni marcadores, ni extensiones, ni botones de navegación,
  ni semáforo de macOS, ni sombra de ventana. Dos excepciones: **marco de dispositivo** (iPhone,
  iPad) cuando lo que se enseña *es* la app en el aparato, y **ventana de navegador desnuda** —tres
  puntos y la dirección, nada más— en las escenas de escritorio. En escritorio no se enseña el
  ordenador: el portátil no argumenta nada y obliga a encoger la captura para que quepa la carcasa;
  la ventana sí dice algo, que la app es web y se entra sin instalar.
- **Datos de demo coherentes entre todas las tarjetas de la rejilla:** misma empresa, mismas fechas,
  mismo formato de identificador (`UTD26_163_001`). Un identificador que aparece en Incidencias, en
  Acciones y en Registros tiene que ser la misma avería. Los datos salen del tour, no se inventan por
  tarjeta: en la home, el KO de las luminarias del registro abre `UTD26_162_001`, que es la acción
  que aparece en la tarjeta de al lado.
- **Elevación:** sombra `rgba(12,32,64,.10) 0 8px 24px`. Es la única sombra del componente.

### Rejilla

Doce columnas, gutter 20px, dentro del encuadre. **Repartos permitidos: `6+6`, `4+4+4`, `8+4`, `4+8`,
`12`**, y un `12` no puede ir dos veces seguidas. Proporciones: `4:3` para 8 columnas, `4:3` o `1:1`
para 6, `1:1` para las de 4, `21:9` para la de 12 — la altura la fija la proporción, no el contenido.

> El `1:1` a 6 columnas se abrió el 16 de agosto de 2026 para la escena de Incidencias: su fragmento
> es **vertical** —un móvil con tres orígenes encima— y en 4:3 obligaba a estirar la composición a lo
> ancho hasta dejar el teléfono en un rincón. Cuando el fragmento manda en vertical, la tarjeta se
> cuadra. Con un fragmento apaisado —una tabla, un dashboard— sigue mandando el 4:3.

**Entre cuatro y seis por sección.** Con tres se incumple la regla de amplitud del sistema; con más de
seis, nadie las mira. El orden lo dan los verbos —registrar → resolver → demostrar → integrar—, no la
importancia comercial.

**Dentro de una fila, todas las tarjetas con la misma proporción.** Es la regla que evita el hueco:
dos tarjetas de distinto ancho y distinta proporción dan distinta altura, y la más baja deja un
agujero debajo. Un `4+8` con `1:1` y `4:3` dejaba 227px de vacío bajo la de 4. O comparten
proporción, o comparten ancho y proporción — que es lo que hace la sección de la home, seis tarjetas
a `6` y `1:1`.

### Anti-patrones

Lienzos elegidos por estética en lugar de por módulo · tintes por encima del 12 % · ángulos distintos
en la misma rejilla · material de gradiente dentro de una tarjeta · pantallas inventadas o con datos
incoherentes entre tarjetas · fragmentos centrados y completos · fragmentos encogidos para que quepan
en vez de recortados · iconos de expandir decorativos · sombras en el marco · tres tarjetas.

### Dónde están montadas, y el aviso de las copias

La home (seis, cada una con su diálogo) y, desde el 17 de agosto de 2026, `/incidencias/` (cuatro,
sin diálogo, en «Detecta, registra y soluciona incidencias en segundos»).

**Las cuatro de `/incidencias/` son el mismo marcado que las de la home**, y eso es deliberado: la
regla de datos coherentes obliga a que `UTD26_163_001` sea la misma avería en las dos páginas. Pero
aquí no hay plantillas ni build, así que **son dos copias literales**: tocar una pantalla en
`index.html` y no tocarla en `incidencias/index.html` las deja contando cosas distintas. Si algún día
se monta una tercera página con escenas, esto deja de ser un aviso y pasa a ser un problema que hay
que resolver de otra forma.

### En desarrollo

`scene-dev.js` avisa por consola de repartos inválidos, rejillas de tres, módulos inventados y
afordancias falsas. Se calla fuera de localhost y nunca bloquea el render: es una ayuda, no un
control de admisión.

---

## Secciones de contenido

Los patrones de sección larga, en `sections.css`. Guideline viva en
[`/guidelines/secciones.stripe.html`](../guidelines/secciones.stripe.html).

Dónde están montados a 15 de agosto de 2026: el **trío** en la home y en `/integraciones/`; el
**carril** en la home con los seis casos de uso; la **cita** en la home (Fritoper),
`/industria-alimentaria/` (Lácteos Romar), `/industria-general/` (Prilux) e `/integraciones/`
(Fritoper). La **banda de caso** y la **lista de casos** siguen sólo en la guía. La **rejilla de
argumentos**, desde el 17 de agosto, en `/incidencias/` («Más allá del control de incidencias»).

**Rotador de capacidades (patrón 12).** Lista de capacidades a la izquierda, `.scene` a la derecha,
y la activa se pasa sola cada 7 s. El panel **es una escena**, no un componente nuevo: el lienzo
teñido, el recorte y el marco de dispositivo ya estaban resueltos allí y duplicarlos habría dado dos
sistemas de pantalla que envejecen por separado; lo único que se le quita dentro del rotador es el
reparto de doce columnas y el rótulo, que lo pone la lista. `rotador.js` sólo pliega lo que el
marcado ya trae entero, se para al pasar el ratón o al entrar el foco, se para fuera de pantalla y
no avanza solo con `prefers-reduced-motion`. Montado en `/incidencias/`, con las cuatro escenas que
antes estaban sueltas en «Detecta».

**Trío o rejilla de argumentos.** Comparten celda —el cuadro del icono, la frase que cambia de tinta
a mitad y el enlace—, y los selectores van agrupados en el CSS para que no se separen. Lo que las
distingue es el reparto: el trío son tres columnas iguales y es la sección de cierre; la rejilla
declara el ancho por celda con el **mismo `data-span` que las escenas** (4 · 6 · 8 · 12), así que
cinco argumentos caben como dos repartos permitidos apilados —4+4+4 y 6+6— sin dejar hueco. Con tres
celdas, trío. Cuidado al tocar sus tramos responsive: `[data-span="4"]` puntúa 0-2-0 y una media
query no suma especificidad, así que hay que anularlo con `[data-span]`, no con `> *`.

### La composición de planta

Es «la creatividad principal» de una página de módulo, montada en HTML. Sale de la portada de
`mitti.com/es/gestion-de-activos`, leída de sus capturas el 3 de septiembre de 2026: se copia la
estructura —foto a sangre, la ficha del activo a gran escala fundida con el plano, la persona con su
dispositivo a un lado y una tarjeta pequeña flotando—, nunca su paleta ni su interfaz.

Tres cosas la sostienen, y las tres se rompen solas si alguien las toca sin mirar:

- **La pantalla no se retoca para que pegue con la foto.** El fundido se hace con una máscara que la
  recorta por el lado que se acerca a la persona, no bajándole la opacidad ni tiñéndola. Una pantalla
  destenida deja de ser el producto y pasa a ser un adorno.
- **Entra cortada por el borde**, que es la regla del fragmento de `scene.css`: el corte es lo que
  dice «esto continúa».
- **El encuadre de la foto es parte del componente.** La persona va en el tercio contrario al que
  ocupa la pantalla y esa mitad queda despejada. Con el sujeto centrado, la capa de producto lo tapa,
  y no hay ajuste de CSS que lo arregle.

**Los tres planos.** Lo que la hace funcionar no es el panel: es que la **persona va recortada con su
silueta** en una capa de encima (`.compo__frente`, un WebP con alfa). Debajo, la fotografía entera;
en medio, el panel; arriba, el recorte. Así la mano y la tablet muerden el panel siguiendo su
contorno, que es lo que da la profundidad.

Se probó antes con una máscara recta —la misma foto repetida y cortada por una vertical— y **se
descartó**: el corte no sigue el contorno, así que el panel desaparecía de golpe en una línea en vez
de pasar por detrás del brazo.

**El recorte lo aporta quien hace la foto**, en PNG con alfa y sobre el mismo lienzo. Se lleva al
encuadre del fondo con **la misma llamada de `resize`** que se usó para la foto, y **hay que comprobar
que casa**: sobre los píxeles opacos del recorte, el color tiene que coincidir con el fondo. Si la
diferencia media pasa de unas pocas unidades sobre 255, está desplazado, y dos capas de la misma foto
mal alineadas dan un fantasma doble que no se ve hasta que se mira de cerca.

Si no hay recorte, `scripts/recorte-persona.mjs` saca uno aproximado del propio fichero por color
—manga de alta visibilidad y tablet oscura contra una nave blanca—, cerrando la silueta, abriendo
para soltar los trozos de fondo pegados y rellenando los huecos por inundación. Sirve, pero los
bordes salen más duros que en un recorte de verdad.

**El estilo hielo** (`--hielo`) es la **única pieza del sitio donde la pantalla del producto se
retoca**, y va declarada como excepción para que nadie la lleve a una escena. La regla que se
conserva es la que importa: **se destiñe el papel, nunca la tinta**. Las superficies se vuelven
vidrio esmerilado; el texto y los colores de módulo no se tocan. Una pantalla con el texto al 60 %
deja de ser producto y pasa a ser un adorno.

Su variante `--hueco` es la de siempre: hueco de imagen con el prompt dentro, pero con el rótulo y el
prompt subidos por encima de la pantalla, porque si no la capa de producto los tapa y el hueco deja de
avisar de lo único que tiene que avisar.

**Ninguna imagen se reutiliza entre páginas.** Si una sección necesita una foto que no existe, no se
coge la de otra página: va el **hueco de imagen** (`.img-slot`) con el prompt dentro, que es
deliberadamente feo para que no se publique por descuido. La escena con bocadillo tiene su variante
para eso, `.stage--hueco`. Procedencia y reparto de las fotos, en `assets/planta/FUENTES.md`.

| Patrón | Clase | Cuándo |
|---|---|---|
| Banda de caso de cliente | `.case-band` | Un cliente que da para una franja entera. **Una por página.** |
| Lista de casos | `.case-list` | Varios clientes y ninguno da para una banda. |
| Carril recortado | `.rail` + `.rail-card` | Una lista que sigue más allá del riel derecho. |
| Trío de apoyo | `.trio` | La sección de cierre: implantación, integraciones, soporte. |
| Rejilla de argumentos | `.reasons` | La celda del trío cuando no son tres. Reparte con `data-span` sobre las doce columnas. |
| Cita centrada | `.pull-quote` | Un testimonio. Sólo uno, y sólo uno por página. |
| Composición de planta | `.compo` | La pieza grande de una página de módulo: foto de faena a sangre con la pantalla del producto entrando por un lado. **Una por página.** |
| Encabezado corrido | `.section-head--flow` | Titular y párrafo en el mismo flujo, a dos tintas. |
| Fragmento compuesto | `.scene__media[data-crop="comp-…"]` | Dos capas en una escena. Vive en `scene.css`. |

### De dónde salen

De la home de Stripe, leída del DOM en vivo el 14 de agosto de 2026. Se copia la **estructura** —el
reparto, el ritmo, dónde cae el hairline, qué se recorta—, nunca su paleta, su tipografía, su
material de gradiente ni su copy.

Lo medido, que además confirma tres reglas de esta casa:

- **Contenedor 1266px** con padding 16px y riel de 1px. Es exactamente `--container`.
- **Ritmo vertical 96px**, con variantes de 80 y 48. Es `--frame-pad-block`.
- **Todo a peso 300, el énfasis a 400, ni un solo 700 en toda su home.** La regla de "nada de
  negrita" no era una manía.
- Su escala de titulares es la de `tokens.css` hasta el tracking: 56/1.03/−1.4 · 44/1.15/−0.88 ·
  32/1.1/−0.64 · 26/1.12/−0.26.

Lo único que no se comparte es la tinta: la suya es un azul muy oscuro (#061B31) y la nuestra el
negro del logo (#111214). No se toca.

### Dos cosas que se degradan solas

**El carril tiene que cortarse.** Si entran todas las tarjetas no es un carril, es una rejilla. Nada
de `padding-right` para que la última quepa entera. Las flechas son un extra de `sections.js`: van con
`hidden` en el marcado y el script las enciende sólo si hay algo que desplazar. Sin JS quedan el
arrastre, la rueda y el teclado, que es lo que sostiene el componente.

**La cita va en gris, no en tinta.** A tamaño de titular y en negro compite con el titular de la
sección. En gris se lee como lo que es, la voz de otro.

### La escena que se abre

Una escena puede abrir un diálogo con el detalle. Cuando lo hace:

- deja de ser `<a>` y pasa a ser **`<button>`** — un enlace que no lleva a ninguna URL rompe el clic
  con rueda, el "abrir en pestaña nueva" y lo que anuncia el lector de pantalla. El destino del
  módulo no se pierde: vive dentro del diálogo, como CTA;
- el destino se declara en `.scene__expand[data-expand-target]`, que es el contrato que el
  componente ya tenía: la afordancia sólo se pinta si expande de verdad;
- el diálogo es un **`<dialog>` nativo**, no un div flotante. Trae gratis el foco atrapado, el
  Escape, el `aria-modal` y la capa superior del navegador.

**El halo del borde es el único movimiento**, y responde al cursor: no se mueve solo. En la home de
Stripe, de donde viene el patrón, no hay una sola animación en bucle dentro de estas tarjetas — 76
elementos con transición y cero `@keyframes`. El color sale del módulo, como el tinte.

> Aviso para quien capture pantalla: un `<dialog>` modal vive en la capa superior del navegador y
> **las herramientas de captura suelen componerla mal** — el panel sale translúcido y el `::backdrop`
> no aparece. En pantalla se ve opaco. Antes de "arreglar" un fondo que ya es blanco, compruébalo con
> `elementsFromPoint`.

### El encabezado corrido

Titular y párrafo **en el mismo flujo de texto**, al mismo tamaño y con distinto color: un párrafo
grande a dos tintas donde la primera frase brilla y el resto se apaga. Es la firma tipográfica de la
home de Stripe y es todo o nada — **si se apilan como bloques, el efecto desaparece**, aunque se les
deje el mismo tamaño. Los dos elementos van a `display:inline`.

No lleva eyebrow, ni kicker, ni botón, y no pasa de **8 de las 12 columnas**: la medida de línea corta
es parte del patrón.

Cuándo este y cuándo `.section-head--split`: aquí el párrafo **continúa la frase** del titular; en el
otro aporta un detalle aparte. Si al leerlos seguidos no forman una sola idea, no es este.

---

## Variantes del haz

`hero-wave.js` es el haz del sitio y lo usan las ocho páginas con hero. **No se toca**: cualquier
variante se hace en un fichero hermano que registre su propio `window.Solved…Weave`, y se engancha
sólo en la página que la use.

Hoy hay una: **`integrations-weave.js` («Convergencia»)**, en `/integraciones/`. Mismo shader de 13
filamentos, misma rampa de marca, misma iluminación y el mismo lavado que abre el papel bajo el
texto; lo único que cambia es el relato del haz — los filamentos entran separados y en gris, se
estrechan en un talle y salen como una sola cinta con el color completo. Muchos sistemas entran, una
capa sale.

Tres controles gobiernan ese relato dentro del shader: `xw` (dónde cae el talle), `spread` (la
apertura del abanico: 1.28 → 0.05 → 0.22) y `sat` (dónde se enciende la rampa, justo después del
talle). El factor `k` los reescala con la relación de aspecto para que la composición aguante en
móvil.

Una variante nueva mantiene, sin excepción: el ángulo de 0,44 rad, la rampa, el lambert, la máscara
y el lavado. Si se toca el lavado, el titular se queda sin papel y la hero deja de ser legible.

---

## Movimiento dentro de las pantallas

Lo que se anima es **el contenido de la app, nunca la tarjeta**. Es la distinción que sostiene el
componente: la escena responde al cursor (el halo, el crecimiento) y la pantalla de dentro cuenta lo
que hace el producto. Un dashboard con las barras quietas parece una captura; con las barras
creciendo parece la aplicación.

| Pantalla | Qué se mueve |
|---|---|
| Incidencias (móvil) | El parte que acaba de entrar aparece, y su punto de aviso late |
| Acciones (tabla) | Dos filtros fijos que **arrancan vacíos** y se van eligiendo: entra «Mantenimiento» en el de departamento y «Pablo» en el de responsable. El listado se acorta con ellos, 9 → 3 → 2 |
| Registros (tablet) | Los OK de la ronda se marcan en cascada |
| KPIs (ventana) | Las barras del mes crecen y los trazos del desglose se llenan |
| Capa de IA | Las líneas de la respuesta aparecen y el cursor parpadea |
| Integraciones | Los sistemas se van conectando y la casilla de Solved late al recibirlos |
| Ficha de activo (ventana) | **Nada.** Va quieta a propósito: la ficha se cuenta con una pantalla parada —el historial ya se lee— y el componente pide la pantalla quieta en cuanto la tarjeta no necesita movimiento |
| Carpeta de documentos (bocadillo) | **Nada**, por lo mismo: la franja de «documentos requeridos» y la columna de estado se leen quietas |

### El esquema de conexión

`.hub` es **la única pieza del fragmento que no es sólo una pantalla**, y va documentada como
excepción para que nadie la copie sin pensarlo. Cuenta un ciclo entero, no una foto: de tres orígenes
—un sensor de planta, el ERP y una máquina— baja un dato por su cable y, **al llegar al móvil, nace la
incidencia que ese dato ha creado**. La mitad de abajo sigue siendo la pantalla de siempre
(`.app--movil`); lo que se añade arriba es de dónde viene.

Por eso se justifica: una captura del listado no dice «esto ha entrado solo, desde el sensor». Aquí el
movimiento **es** el argumento, no un adorno. En cuanto una tarjeta pueda contarse con una pantalla
quieta, se usa la pantalla.

Tres cosas que lo sostienen y que se rompen solas si alguien las toca sin mirar:

- **La luz viaja hacia el móvil**, nunca al revés. `stroke-dashoffset` a negativo sobre un path
  trazado del origen al teléfono; en positivo el patrón retrocede y el dato saldría.
- **Todo comparte un ciclo de 12 s** y se desfasa con `animation-delay` (0 s, 4 s, 8 s). Si se cambia
  la duración hay que cambiarla en los cinco sitios, o la bolita llegará cuando la incidencia ya esté
  puesta —lo único que mata el efecto—.
- **Las incidencias colapsan del todo**: alto, relleno y borde. Sólo con la opacidad, o sólo con el
  alto, cada tarjeta cerrada se deja 18px de relleno y borde y la lista arranca con un palmo de hueco.
  Con `max-height`, `padding-block:0`, `border-width:0` y un margen negativo que se come el gap, el
  listado **crece** al llegar el dato.
- **La más nueva va arriba**, y eso se consigue con el orden del marcado invertido —C, B, A— y no con
  JS: las que aún no han llegado miden cero, así que la primera visible es siempre la última en nacer.

Y el contenido de cada parte se corresponde con su burbuja: el sensor abre la de temperatura, el ERP
la reclamación, la máquina la parada. Si el texto no cuadra con el origen, el esquema miente.

El esquema **no lleva marco**: `.scene__media:has(> .hub)` le quita la sombra, el radio y el fondo que
sí llevan los fragmentos. Con ellos parecía una ventana de navegador flotando dentro de la tarjeta —
justo lo que el componente prohíbe—. Y las tres burbujas van **alineadas y centradas sobre el móvil**:
en abanico competían con la lista por el peso visual.

> Las fotos de las burbujas (`assets/hub/`) son **imágenes generadas y recortadas**, no material del
> cliente. Están para que la pieza no dependa de iconos, pero son lo primero que hay que cambiar en
> cuanto haya foto real de un sensor y de una máquina de sus plantas.

---

## Banda de IA

La capa de IA contada a escala de página, en HTML: una barra de prompt sobre grafito, la pregunta que
se teclea sola, la línea de búsqueda y la respuesta con sus referencias, y alrededor las piezas de las
que sale —una incidencia, un control KO, una acción con su responsable, un informe—. Cuatro turnos en
bucle, uno por cada cosa que la IA sabe hacer.

Guideline viva en [`/guidelines/ia.banda.html`](../guidelines/ia.banda.html).

### Dos formatos, una sola fuente

La banda existe en **web** (`.aiband`, la de arriba) y en **vídeo** (`.iavideo`, un MP4). No son dos
piezas: la web es la que se puede editar, y el vídeo **se graba de ella** con `npm run render:ia`. Al
revés no se puede — de un MP4 no sale ni texto seleccionable, ni nitidez a cualquier tamaño, ni un
dato que el cliente cambie sin volver a renderizar.

| | Web (`.aiband`) | Vídeo (`.iavideo`) |
|---|---|---|
| Peso | 0 KB de media | ~2 MB de MP4 (37 s) |
| Texto | Texto de verdad, nítido a cualquier tamaño | Píxeles: se lee mal por debajo de 900px de ancho |
| Cambiar una cifra | Se edita el HTML | Hay que volver a renderizar |
| Dónde encaja | Una sección de página que ya monta el DS | Una landing, un correo enlazado, LinkedIn |
| Marca | La lleva la página (nav y pie) | El logotipo va dentro —esquina y cartela final—, en versión clara: el vídeo viaja solo |

El vídeo termina con una **cartela**: logotipo, la marca `Solved | AI` —el mismo lockup que la barra
superior de la app en la capa de IA— y la frase «La plataforma que potencia tus operaciones
industriales con IA». No existe en la versión web, donde la marca y el titular ya los pone la página.

**La cartela cierra el vídeo y no se va.** Se probó al revés —que se fuera al final para que el último
fotograma fuese igual que el primero y el bucle cerrase por fotograma— y el vídeo acababa en una
**barra de chat vacía**, que es justo el fotograma que queda a la vista cuando el vídeo se para. Ahora
entra 320 ms **antes** de que acabe el último turno, solapada con su salida —si esperase, entre la
última respuesta y la cartela habría otro medio segundo de barra vacía—, y se queda hasta el final. El
precio es que la vuelta del bucle es un corte, y por eso el arranque lleva 320 ms de fundido: convierte
el corte en una entrada.

El render vive en `scripts/render-ia-reel.mjs` y su fuente es
[`/guidelines/ia.banda.reel.html`](../guidelines/ia.banda.reel.html): la misma hoja y los mismos
datos, **sin encabezado y sin leyenda**, en un lienzo de 1400×540. Esa página no tiene ni una
animación de CSS —todo lo pinta `pintar(t)` a partir del milisegundo que se le pase—, que es lo que
permite fotografiarla fotograma a fotograma y que el resultado sea idéntico en cualquier máquina. Y
**la barra no se va nunca**, para que el último fotograma enlace con el primero y el bucle no dé un
salto.

### Lo que no se negocia

| Regla | Por qué |
|---|---|
| Va sobre grafito `#111214` | Sobre blanco el morado ni contrasta ni se lee como la capa de IA. Es la regla del tinte, ampliada a una banda entera. |
| Gasta una de las dos apariciones de **material** de la página | El resplandor es material de gradiente. Con la onda del hero delante, ya no cabe una tercera. |
| Los datos son los del tour | `UTD26_163_001` es la fuga de aceite de la cinta L3 aquí, en la home y en `/incidencias/`. |
| Un turno = una capacidad | Los cuatro primeros salen de los cuatro `checks` del diálogo de IA de la home. **El quinto —proponer las tareas de un trabajo repetido— no está en ninguna página**: entró a petición del cliente y hay que confirmarlo con el producto antes de publicar. |
| Los avatares son fotos de banco | Recortes de las fotos de planta de `assets/`, dentro de una demo `aria-hidden`. La aplicación pinta la inicial; la cara es una licencia del vídeo, donde una letra sola no se lee como «persona». |
| Sin JS, primer turno resuelto y quieto | El marcado lleva los cuatro turnos; `.is-live` lo pone el script. Es también el estado de `prefers-reduced-motion`. |
| La banda no trae titular | Lo pone la página que la monta, para que sirva igual en la home que en una landing de IA. |

### API

Un turno es un `.aiband__turn` con su `.aiband__bar`, su `.aiband__reply` y sus `.aiband__art`. Cada
pieza se coloca con `--x`, `--y`, `--r` y `--d` en el `style`, porque su sitio depende de lo que diga
la barra en ese turno y eso no lo puede saber la hoja. **La pieza más lejana llega a 585px del
centro**: por debajo de 1200px de ventana las piezas se van —recortarlas o encogerlas las volvería
ilegibles— y la barra cuenta la historia sola.

El compás —tecleo, envío, búsqueda y lectura— son cinco constantes al principio de `aiband.js`. El
bucle se para fuera de pantalla y con la pestaña en segundo plano.

---

## La página de IA, en oscuro

`/ia/` es la única página del sitio que va entera sobre grafito, y no es una licencia: es la regla
«lo de IA va sobre grafito» llevada hasta el final. Si la capa de IA es oscura en el producto y oscura
en cada pieza suelta, su página no puede ser blanca.

**Está hecha reasignando tokens, no reescribiendo componentes.** `ds/ia-dark.css` le da otros valores
a los alias semánticos dentro de `[data-tema="ia"]` —`--ds-text`, `--ds-surface`, `--color-hairline`,
`--frame`— y con eso la hero, los titulares, el trío, la rejilla de argumentos y el encuadre se
vuelven oscuros sin tocar una regla de `site.css`, `sections.css` ni `hero.css`. Debajo de los tokens
sólo quedan los sitios donde algo estaba escrito a pelo: la FAQ (que viene de `solved.css`), la
tarjeta del formulario y los logotipos.

Lo que **no** se vuelve oscuro, y por qué:

| Pieza | Qué se hace | Por qué |
|---|---|---|
| Formulario de contacto | Se queda como isla clara | Lo pinta HubSpot dentro de un `<iframe>` y no se puede estilar desde fuera |
| Logos de cliente | Sobre el mismo grafito, **en color**, y sólo **13 de los 29** | Sobre blanco manda la tinta oscura; sobre negro, el color claro y saturado. Se eligieron mirándolos uno a uno sobre `#111214` **al tamaño real de la cinta**. Fuera los de tinta negra (Fritoper, Pampling, La Chinata…), los que llevan blanco en el propio dibujo (Jealsa y su filete) y los de tinta apagada que a 38px no llegan (Panificadora de Alcalá, Tuflesa). En las páginas blancas siguen los 29 |
| Logotipo de nav y pie | Se sustituye con `content:url()` | Lo pinta `chrome.js`, que es genérico; un filtro aplanaría también el isotipo azul |

> **Dos logotipos estaban mal cortados y se arreglaron:** COVAP y Patatas Hijolusa tenían los
> contadores de las letras —los huecos de la O, la A, la P— rellenos de **blanco opaco** en vez de
> transparentes. Sobre papel no se ve (blanco sobre blanco) y por eso llevaba ahí desde siempre; sobre
> grafito son manchas dentro de las letras. Se corrigió el asset y **no se duplicó**: un hueco
> transparente sobre blanco se sigue viendo blanco, así que el resto del sitio no cambia —comprobado
> en la home—. Si aparece otro logotipo con manchas sobre oscuro, es esto y se arregla igual.

> Se probaron antes dos fondos para esa franja y los dos se descartaron: **silueta blanca** (convierte
> a COVAP y a Delaviuda en la misma mancha) y **banda clara con degradado de turquesa y lila** (se veían
> en color, pero metía un rectángulo luminoso en una página oscura). La decisión final es la más simple:
> mismo negro que el resto, y se queda sólo lo que se lee.

### La hero de `/ia/`: centrada, sin subtítulo y con el botón de IA

Cuatro diferencias con la del resto del sitio, y las cuatro por el mismo motivo —debajo va el vídeo,
y es el vídeo el que explica—:

1. **Sin subtítulo.** Un párrafo de tres líneas repitiendo lo que el vídeo enseña a continuación.
2. **Centrada.** El eje del titular y el del vídeo son el mismo, y la página baja recta. Como el texto
   se mete en el haz —en el resto del sitio va a la izquierda, donde el shader lava—, la hero lleva un
   **velo radial** (`.ds-hero::after`) entre el canvas y el texto: es el mismo recurso que la banda de
   foto, donde el texto nunca va directo sobre el material.
3. **Etiqueta en vez de eyebrow.** El mismo `.ds-badge--ia` de la home, con su estrella de gradiente.
4. **Botón con los colores de la IA** (`.ds-btn--ia`). La rampa **no llega al cian por detrás del
   texto**: blanco sobre `#1FD6F5` da 1,9:1 y el rótulo desaparecería. Se queda en morado→magenta
   (4,9:1 con blanco) y el cian entra en el halo, donde no estorba.

### La hero, más baja

En `/ia/` la hero baja su altura mínima y aprieta el aire —no el cuerpo del texto—, para que **el
vídeo entre en la primera pantalla**. La base está calculada en `64vh` pensando en páginas donde lo
siguiente es texto; con un vídeo de 2,6:1 detrás, esa altura lo dejaba fuera. En una ventana de 850px
el vídeo empieza a 494px y se ven 358 de sus 463.

### El hero, siete entradas y un solo elemento

`hero-wave.js` acepta `mount(canvas, { tema: '…' })`. Además de `marca` (por defecto) e `ia`, cada
página de módulo tiene la suya: `incidencias` (azul, anillos), `registros` (violeta, trama),
`acciones` (naranja, abanico), `kpis` (las seis tintas, barras) y `documentos` (rampa de marca, pila
de hojas). En las cuatro primeras el color es el del módulo y la forma es su figura; **`documentos`
es la excepción y va con la rampa de marca**, porque el sistema no tiene tinte para Documentos y
teñirla con el color de otro módulo es lo que prohíbe la regla del tinte.

Con `ia`, la **geometría no cambia** —los mismos 13 filamentos, el mismo ángulo, las mismas
amplitudes, el mismo lavado—; lo único distinto es el color:
la rampa va del azul de Solved al morado, el rosa y el cian de la capa de IA, y el lavado sale de
grafito en vez de papel. Es a propósito que sea el mismo elemento: la página de IA tiene que
reconocerse como el mismo sitio, no como otra web.

La paleta `marca` conserva **exactamente** los números del prototipo. Si se tocan, se tocan ahí.
