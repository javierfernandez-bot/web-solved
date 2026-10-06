# Escena de producto — `ds/scene.css`

Ficha de uso para quien genere marcado a partir del design system, humano o agente.

## Qué es

Una tarjeta que enseña **un fragmento real de la aplicación flotando sobre un lienzo teñido**, con el
fragmento cortado por el borde del marco. Sustituye a cualquier rejilla de "features" con icono y
párrafo. Su fuerza no está en el degradado: está en que el producto se ve funcionando y se ve que
continúa más allá del marco.

## La regla que no se negocia

**El tinte lo dicta el módulo y no admite color libre.**

No existe ninguna vía para darle color a una escena: ni una prop, ni una variable `--scene-tint`, ni
una clase de fondo, ni un `style` previsto para ello. El único selector que pinta lienzo es
`.scene[data-module="…"]`, con una lista cerrada de seis valores. Un `data-module` que no esté en la
lista deja la tarjeta sin tinte y el validador de desarrollo lo canta.

Es a propósito. En Solved el color codifica módulo, conformidad y prioridad: si los lienzos se tiñen
al gusto, la página enseña naranja y morado sin significado justo al lado de una tabla donde el
naranja significa Acciones. Si una escena "pide" otro color, lo que hay que cambiar es el módulo que
enseña, no el tinte.

| `data-module` | Enseña | Tinte |
|---|---|---|
| `incidencias` | Registro y seguimiento de incidencias | `--tint-incidencias` · azul 10 % |
| `acciones` | Acciones correctivas y preventivas | `--tint-acciones` · naranja 10 % |
| `checklists` | Checklists, registros, auditorías | `--tint-checklists` · violeta 10 % |
| `activos` | Activos y GMAO | `--tint-activos` · grafito 8 % |
| `kpis` | KPIs y dashboards | `--tint-kpis` · azul frío 12 % |
| `ia` | Capa de IA | `--tint-ia` · morado 16 % **sobre grafito, nunca sobre blanco** |

`data-module="ia"` trae el fondo grafito consigo: el tinte y el oscuro se activan con el mismo
atributo, así que no se pueden separar por descuido.

**Documentos no está en la lista, y es un módulo del producto.** No tiene color asignado, así que una
página sobre el gestor documental no puede montar escenas: se resuelve con la escena con bocadillo
(`.stage`, `ds/sections.css`), que no pide módulo. Detalle en `ds/README.md`.

## Marcado

```html
<div class="scene-grid">

  <article class="scene" data-module="incidencias" data-span="8" data-ratio="4:3">
    <h3 class="scene__title">Toda la planta reporta desde el móvil</h3>
    <div class="scene__media" data-crop="dev-movil">
      <div class="device" data-device="iphone">
        <div class="device__screen">
          <!-- El fragmento es decorativo para lectores de pantalla: el nombre
               accesible lo da el título de la escena. -->
          <div class="app app--movil" aria-hidden="true"> …ds/app.css… </div>
        </div>
      </div>
    </div>
  </article>

  <article class="scene" data-module="acciones" data-span="4" data-ratio="1:1">
    <h3 class="scene__title">Cada incidencia acaba en una acción con dueño</h3>
    <div class="scene__media" data-crop="b">…</div>
  </article>

</div>
```

**Atributos.** `data-module` (obligatorio, dicta el tinte) · `data-span` `4·6·8·12` ·
`data-ratio` `4:3·1:1·21:9·fila` (obligatorio: la altura la fija la proporción, no el contenido) ·
`data-crop` en el media, `br·bl·b·r`, el borde por el que se sale.

**Proporción por ancho:** `4:3` para 8, `4:3` o `1:1` para 6, `1:1` para 4, `21:9` para 12. El `1:1` a
6 columnas es para fragmentos verticales (un móvil); con uno apaisado manda el `4:3`.

## Rejilla

Repartos permitidos, y nada más: **`6+6`, `4+4+4`, `8+4`, `4+8`, `12`**. Un `12` no puede ir dos
veces seguidas. Entre **cuatro y seis** escenas por sección: con tres se incumple la regla de
amplitud, con más de seis nadie las mira. La primera fila lleva la tarjeta ancha, y el orden lo dan
los verbos —registrar → resolver → demostrar → integrar—, no la importancia comercial.

**Dentro de una fila, una sola proporción declarada.** En `6+6` y `4+4+4` las dos o tres escenas
llevan la misma y ya está. En una **fila mixta** (`8+4`, `4+8`) no hay proporción común posible —a
doce columnas, un 8 en `4:3` mide 571 de alto y un 4 en `1:1` mide 371—, así que **la ancha declara
la suya y la estrecha lleva `data-ratio="fila"`**, que toma el alto de la fila. Sin eso la corta no
se estira: se queda con su cuadrado y deja un agujero debajo.

Una fila mixta no es decoración: se usa cuando los dos fragmentos piden formatos distintos —un móvil
en vertical al lado de una tabla apaisada—. Si los dos son apaisados, `6+6` y no se le da más vueltas.

## El fragmento

**Se construye en HTML con `ds/app.css`, no con capturas** —decisión del cliente: ajusta el contenido
sobre lo que ve—. Maquetarlo no es permiso para inventarlo: mismo azul, Roboto (la fuente de la app),
misma densidad, y ninguna columna, panel o gráfico que el producto no tenga. La referencia contra la
que se comprueba es el tour de `/incidencias/` (`assets/tour/`), que se hizo sobre capturas. Nada de
wireframes ni ilustraciones.

Recortado por **al menos un borde**, y recortado **por el borde, no encogido**: el contenido lleva
ancho natural mayor que la caja y lo corta el `overflow`. Texto interior no menor de **10px reales**:
si a esa escala no cabe, se recorta más y se enseña menos, nunca se reduce hasta que sea ruido gris.
Lo que cae fuera del corte tiene que ser lo prescindible — cortar la columna de OK/KO de un registro
es cortar justo lo que la tarjeta demuestra. **Sin cromo de navegador**: ni pestañas, ni marcadores, ni extensiones, ni botones de
navegación, ni semáforo de macOS, ni sombra de ventana. Dos excepciones, ambas en
`ds/device.css`: **marco de dispositivo** cuando lo que se enseña *es* la app en el móvil o
en la tablet de planta, y **ventana de navegador desnuda** —tres puntos y la dirección— en
las escenas de escritorio, porque ahí el ordenador no argumenta nada y la ventana sí: dice
que Solved es web y que se entra sin instalar.
**Datos de demo coherentes entre todas las tarjetas de la rejilla**: misma empresa, mismas fechas,
mismo formato de identificador (`UTD26_163_001`), y el mismo identificador en dos tarjetas es la
misma avería. Salen del tour, no se inventan por tarjeta.

## Fragmento compuesto

Dos capas en la misma escena: la ventana de escritorio detrás y el móvil delante. Para lo que un
fragmento solo no puede decir — que la misma cosa se hace desde el puesto y desde la planta.

```html
<div class="scene__media" data-crop="comp-back">  …ventana de navegador… </div>
<div class="scene__media" data-crop="comp-front"> …iPhone…               </div>
```

Sigue siendo **una** escena: un tinte, un título, un recorte. **Dos capas, nunca tres** — con tres no
se lee ninguna. La de delante lleva más sombra; sin esa diferencia las dos se leen como una sola
imagen pegada. En teléfono la de detrás desaparece: enseñar menos antes que enseñar ruido.

## Expandir

`.scene__expand` sólo se pinta si lleva `data-expand-target`. Sin destino no se renderiza y el
validador avisa: una afordancia que no hace nada cuesta más confianza de la que gana.

## Lo que no lleva

Sin descripción dentro de la tarjeta —el párrafo va una vez, en el encabezado de la sección—. Sin
sombra en el marco. Sin material de gradiente dentro (la onda del hero, las teselas): el lienzo es
tinte plano, y con filamentos dentro el fragmento deja de leerse. En hover cambia el borde y nada
más: ni elevación, ni escala, ni movimiento del fragmento.

## Desarrollo

Enlaza `ds/scene-dev.js` mientras montas la sección. Avisa por consola de repartos inválidos,
rejillas de tres, módulos inventados y afordancias falsas. Fuera de localhost se calla solo, y nunca
bloquea el render.

## Lienzo de foto — `data-canvas="foto"`

Variante de lienzo, no un componente aparte. La escena sigue siendo el mismo marco, el mismo título y
el mismo `data-module`; lo que cambia es el suelo.

```html
<article class="scene" data-module="checklists" data-span="6" data-ratio="1:1" data-canvas="foto">
  <img class="scene__foto" src="/assets/planta/almacen-tablet-pasillo.webp" alt=""
       width="1100" height="1100" loading="lazy" decoding="async">
  <span class="scene__velo" aria-hidden="true"></span>
  <h3 class="scene__title">El control del turno, firmado y sin hojas sueltas</h3>
  <span class="scene__glow" aria-hidden="true"></span>
  <span class="res-pill" style="left:6%; top:16%" aria-hidden="true">…</span>
  <div class="scene__media" data-crop="res-br">
    <div class="res"> …tarjeta del recurso… </div>
  </div>
</article>
```

Reglas:

- **La foto es decorativa** (`alt=""`): el nombre accesible lo da el título de la escena, igual que
  con el fragmento de producto.
- **Siempre `width` y `height`** en el `<img>`, para que no salte el layout.
- **`.scene__velo` es obligatorio.** Sin él el título blanco depende de que la foto sea oscura.
- **El tinte sigue saliendo de `data-module`.** No hay forma de pasarle un color, tampoco aquí.
- **Las fotos viven en `assets/planta/`.** Criterio: una persona usando móvil, tablet, portátil o el
  panel de una máquina, en planta o almacén. Procedencia en `assets/planta/FUENTES.md`.
- **Escena de banda (`data-span="12" data-ratio="21:9"`): la foto tiene que venir de un original
  apaisado** y usar el recorte `-ancha` (1600×686). De un original vertical, la banda sale sin la
  persona dentro.
- **Título corto en la escena ancha.** Ahí vive en el tercio izquierdo con `line-clamp:3`; un título
  de página entera se corta.

### Encuadres del recurso

| `data-crop` | Dónde |
|---|---|
| `res-br` | Abajo a la derecha (el de uso corriente). |
| `res-bl` | Abajo a la izquierda, para alternar en una fila de dos. |
| `res-b`  | Abajo, centrado. |

En la escena de 12 columnas los tres se resuelven igual: a la derecha y centrado en vertical, porque
el título ocupa el tercio izquierdo.

### Piezas del recurso

| Clase | Qué es |
|---|---|
| `.res` | La tarjeta: cabecera con icono de módulo, título, subtítulo y una `<dl>` de pares. |
| `.res-pill` | Píldora flotante de una línea, hija directa de `.scene`, colocada con `style`. |
| `.res-ia` | La respuesta de la IA, sobre grafito y **siempre** con `.res-ia__ref`, el código del parte del que sale. |

El color del icono no se elige: `--res-acento` cae por herencia desde `.scene[data-module]`.
