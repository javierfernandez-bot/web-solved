# Fotos de Pexels — procedencia y dónde se usan

Las fotos de `assets/planta/` son de **Pexels**, con su licencia: uso comercial permitido y sin
atribución obligatoria. Aquí quedan la procedencia, el identificador y la página donde vive cada una,
por si hay que sustituir alguna, buscar el original a más resolución o comprobar la licencia.

**El criterio con el que se eligieron, y que hay que mantener si se añade otra: una persona usando
móvil, tablet, portátil o el panel de una máquina, en planta o en almacén.** No vale una nave vacía,
ni alguien sin dispositivo, ni una oficina.

Dos medidas, según la escena que las usa (`ds/scene.css`, `.scene[data-canvas="foto"]`):

- **1100×1100** para las escenas cuadradas (`data-span="6" data-ratio="1:1"`).
- **1600×686** —sufijo `-ancha`— para las escenas de banda (`data-span="12" data-ratio="21:9"`).
  Para éstas hay que partir de un original **apaisado**: recortar una banda 21:9 de una foto vertical
  deja una franja sin la persona dentro, que es justo lo que la foto tiene que enseñar.

Si hace falta otra proporción, se recorta del original de Pexels, no de estos WebP.

**Una foto, una página. No se reutiliza ninguna imagen entre páginas** (3 sep 2026). La columna
«Página» de estas tablas es la lista real de dónde está cada fichero, no dónde se pensó usarlo:
estaba desactualizada y se corrigió comprobándola contra el marcado. Si una página necesita una foto
que no existe, **no se coge la de otra página**: se deja el hueco de imagen (`.img-slot`,
`ds/sections.css`) con el prompt dentro y se sustituye cuando llegue. Las dos únicas imágenes que sí
se repiten a propósito son la del bloque de contacto —que es el mismo bloque en todas las páginas— y
las miniaturas de `assets/tour/`, que son elementos de interfaz dentro de las pantallas de la app, no
fotografías.

| Fichero | Medida | Página | Pexels | Original |
|---|---|---|---|---|
| `alimentaria-portatil-linea-ancha.webp` | 1600×686 | /industria-alimentaria/ | 12741849 | https://www.pexels.com/photo/12741849/ |
| `alimentaria-lacteos-tanque.webp` | 1400×1050 | /industria-alimentaria/ · Registra, capacidad Incidencias | — | Generada en Google Flow (Nano Banana Pro), 1 oct 2026 |
| `alimentaria-carnica-tablet.webp` | 1400×1050 | /industria-alimentaria/ · Registra, capacidad Acciones | — | Generada en Google Flow (Nano Banana Pro), 1 oct 2026 |
| `alimentaria-panificacion-horno.webp` | 1400×1050 | /industria-alimentaria/ · Registra, capacidad Registros | — | Generada en Google Flow (Nano Banana Pro), 1 oct 2026 |
| `alimentaria-embotellado-supervisor.webp` | 1400×1050 | /industria-alimentaria/ · Registra, capacidad Informes | — | Generada en Google Flow (Nano Banana Pro), 1 oct 2026 |
| `gmao-tecnico-bomba.webp` | 1400×1050 | /software-gmao/ · Capacidades, capacidad Incidencias | — | Generada en Google Flow (Nano Banana Pro), 5 oct 2026 |
| `gmao-tecnico-cinta.webp` | 1400×1050 | /software-gmao/ · Capacidades, capacidad Preventivo | — | Generada en Google Flow (Nano Banana Pro), 5 oct 2026 |
| `gmao-tecnico-panel.webp` | 1400×1050 | /software-gmao/ · Capacidades, capacidad Acciones | — | Generada en Google Flow (Nano Banana Pro), 5 oct 2026 |
| `gmao-supervisor-taller.webp` | 1400×1050 | /software-gmao/ · Capacidades, capacidad KPIs | — | Generada en Google Flow (Nano Banana Pro), 5 oct 2026 |
| `general-tecnico-ferroviario.webp` | 1400×1050 | /industria-general/ · Conecta a tu equipo, capacidad Registros | — | Generada en Google Flow (Nano Banana Pro), 5 oct 2026 |
| `general-operario-cartonajes.webp` | 1400×1050 | /industria-general/ · Conecta a tu equipo, capacidad Incidencias | — | Generada en Google Flow (Nano Banana Pro), 5 oct 2026 |
| `general-tecnico-iluminacion.webp` | 1400×1050 | /industria-general/ · Conecta a tu equipo, capacidad Acciones | — | Generada en Google Flow (Nano Banana Pro), 5 oct 2026 |
| `general-supervisor-ceramica.webp` | 1400×1050 | /industria-general/ · Conecta a tu equipo, capacidad Informes | — | Generada en Google Flow (Nano Banana Pro), 5 oct 2026 |
| `almacen-movil-operaria.webp` | 1100×1100 | / | 7018656 | https://www.pexels.com/photo/7018656/ |
| `almacen-tablet-chaleco.webp` | 1100×1100 | /casos-de-exito/ | 4484077 | https://www.pexels.com/photo/4484077/ |
| `almacen-tablet-conteo.webp` | 1100×1100 | / | 4484155 | https://www.pexels.com/photo/4484155/ |
| `almacen-tablet-escaner.webp` | 1100×1100 | /incidencias/ | 4483941 | https://www.pexels.com/photo/4483941/ |
| `almacen-tablet-estanteria.webp` | 1100×1100 | /gestor-documental/ | 4484149 | https://www.pexels.com/photo/4484149/ |
| `almacen-tablet-pasillo.webp` | 1100×1100 | sin usar (era /auditorias/ · Producción, quitada 9 sep 2026) | 4484075 | https://www.pexels.com/photo/4484075/ |
| `almacen-tablet-responsable.webp` | 1100×1100 | /incidencias/ | 38136632 | https://www.pexels.com/photo/38136632/ |
| `almacen-tablet-revision.webp` | 1100×1100 | sin usar (era /auditorias/ · Calidad, quitada 9 sep 2026) | 4487359 | https://www.pexels.com/photo/4487359/ |
| `cnc-control-operario-ancha.webp` | 1600×686 | /dashboard/ | 32845701 | https://www.pexels.com/photo/32845701/ |
| `cuadro-tablet-tecnico.webp` | 1100×1100 | sin usar (era /auditorias/ · Mantenimiento, quitada 11 sep 2026) | — | Generada (nano banana pro), 9 sep 2026 |
| `panel-tecnico-frontal.webp` | 1600×900 | /auditorias/ · Mantenimiento | — | Generada en Google Flow (Nano Banana Pro), 22 sep 2026 |
| `estacion-seguridad-movil.webp` | 1100×1100 | sin usar (era /auditorias/ · Seguridad y medio ambiente, quitada 11 sep 2026) | — | Generada (nano banana pro), 9 sep 2026 |
| `estacion-seguridad-lavaojos.webp` | 1600×900 | /auditorias/ · Seguridad y medio ambiente | — | Generada en Google Flow (Nano Banana Pro), 22 sep 2026 |
| `mesa-calidad-movil.webp` | 1100×1100 | sin usar (era /auditorias/ · Calidad, quitada 11 sep 2026) | — | Generada (nano banana pro), 9 sep 2026 |
| `mesa-calidad-muestra-movil.webp` | 1600×900 | /auditorias/ · Calidad | — | Aportada por el cliente (`Worker_checking_smartphone_at_table_2K_20260922174111.jpeg`), 22 sep 2026 |
| `linea-tablet-supervisora.webp` | 1100×1100 | sin usar (era /auditorias/ · Producción, quitada 11 sep 2026) | — | Generada (nano banana pro), 9 sep 2026 |
| `linea-supervisor-cajas.webp` | 1600×900 | /auditorias/ · Producción | — | Generada en Google Flow (Nano Banana Pro), 22 sep 2026 |
| `equipo-tablet-cascos.webp` | 1100×1100 | /casos-de-exito/ | 32845690 | https://www.pexels.com/photo/32845690/ |
| `hmi-panel-maquina.webp` | 1100×1100 | /gestion-de-activos/ | 32972129 | https://www.pexels.com/photo/32972129/ |
| `maquina-panel-operaria-ancha.webp` | 1600×686 | /industria-general/ | 31047169 | https://www.pexels.com/photo/31047169/ |
| `nave-tablet-casco.webp` | 1100×1100 | /ia/ | 32845692 | https://www.pexels.com/photo/32845692/ |
| `nave-tablet-jefe.webp` | 1100×1100 | /ia/ | 3856118 | https://www.pexels.com/photo/3856118/ |
| `nave-tablet-operario.webp` | 1100×1100 | / | 32845694 | https://www.pexels.com/photo/32845694/ |
| `obra-tablet-tecnica-ancha.webp` | 1600×686 | /no-conformidades/ | 8960944 | https://www.pexels.com/photo/8960944/ |
| `panel-control-tecnico.webp` | 1100×1100 | /gestion-de-activos/ | 35072820 | https://www.pexels.com/photo/35072820/ |
| `scada-pantalla-operario.webp` | 1100×1100 | /gestion-de-activos/ | 37769419 | https://www.pexels.com/photo/37769419/ |
| `taller-portatil-datos.webp` | 1100×1100 | /gestion-de-activos/ | 3862605 | https://www.pexels.com/photo/3862605/ |


## Fuera de `assets/planta/`

Estas seis no son escenas: son las fotos sueltas que sustituyeron a las **composiciones antiguas**
—aquellas imágenes de banco con chips de interfaz pegados encima («Añadir incidencia», «Datos
sincronizados», «Prioridad alta») que no eran la interfaz de Solved—. Se borraron el 2 de septiembre
de 2026 junto con catorce más que ya no usaba nadie. Mismo criterio que las de planta: persona +
dispositivo + entorno industrial.

| Fichero | Medida | Dónde | Pexels | Original |
|---|---|---|---|---|
| `contacto-tecnica-tablet.webp` | 1024×910 | La franja de contacto de las nueve páginas | 8961008 | https://www.pexels.com/photo/8961008/ |
| `procedimiento-carpeta-tablet.webp` | 1920×1080 | `/gestion-de-calidad/` (la escena con bocadillo de `/gestor-documental/` se retiró el 9 sep 2026) | — | Generada (nano banana), 3 sep 2026 |
| `tecnico-escanea-maquina.webp` | 1920×1080 | `/gestion-de-activos/`, composición de planta | — | Generada (nano banana), 3 sep 2026 |
| `activos/activo-envasadora.webp` | 640×428 | `/gestion-de-activos/`, foto del activo en la ficha | — | Recorte de la pantalla de la tablet de la anterior |
| `activos/activo-cinta-l3.webp` | 200×200 | sólo `/en/asset-management/` | — | Recorte antiguo; la página inglesa aún no está sincronizada |
| `tecnico-escanea-maquina-frente.webp` | 1920×1080 | `/gestion-de-activos/`, capa del frente | — | Recorte con alfa de la anterior, aportado por el cliente |
| `alimentaria-operaria-tablet.webp` | 1200×900 | `/industria-alimentaria/`, bloque de beneficios | 31321050 | https://www.pexels.com/photo/31321050/ |
| `general-movil-taller.webp` | 1200×900 | `/industria-general/`, bloque de beneficios | 8985721 | https://www.pexels.com/photo/8985721/ |
| `uso-kpis.webp` | 800×600 | Home, carril de casos de uso | 3862605 | https://www.pexels.com/photo/3862605/ |
| `uso-industria-alimentaria.webp` | 800×600 | Home, carril de casos de uso | 12741849 | https://www.pexels.com/photo/12741849/ |
| `uso-industria-general.webp` | 800×600 | Home, carril de casos de uso | 31047169 | https://www.pexels.com/photo/31047169/ |
| `trio-control.webp` | 840×560 | Home, «Diseñado para el entorno de planta» · Acceso multidispositivo | — | Generada (Nano Banana Pro, Higgsfield), 11 sep 2026 |
| `trio-conectado.webp` | 840×560 | Home, «Diseñado para el entorno de planta» · Interoperabilidad | — | Generada (Nano Banana Pro, Higgsfield), 11 sep 2026 |
| `trio-enmarcha.webp` | 840×560 | Home, «Diseñado para el entorno de planta» · Puesta en marcha | — | Generada (Nano Banana Pro, Higgsfield), 11 sep 2026 |
| `sala-despiece-cerdo.webp` | 1600×900 | Home, carril «Con la confianza…» · tarjeta Carnavi | — | Aportada por el cliente (`Workers_processing_meat_in_facility_2K_20260911101138.jpeg`), 11 sep 2026 |
| `panaderia-industrial-hornos.webp` | 1600×900 | Home, carril «Con la confianza…» · tarjeta Panificadora Alcalá | — | Aportada por el cliente (`Hands_kneading_dough_2K_20260911101720.jpeg`), 11 sep 2026 |
| `fabrica-iluminacion-led.webp` | 1600×900 | Home, carril «Con la confianza…» · tarjeta Prilux | — | Generada (gpt_image_2, Higgsfield), 11 sep 2026 |

**`tecnico-escanea-maquina.webp` tiene tres condiciones**, y son el encuadre de la creatividad de
referencia medido sobre su captura. (1) **Máquina arriba a la izquierda** y desenfocada; **manos y
antebrazos entrando por la esquina inferior derecha, sin cabeza ni torso**; **mitad inferior
izquierda vacía**, que es donde se sienta el panel. La primera versión metía media figura del técnico
y pesaba tanto que se comía el lado derecho. (2) La tablet sale **encendida y enseñando el visor de
la cámara** con la máquina dentro —es lo que cuenta el gesto—, pero en esa pantalla no puede haber
menús, botones con palabras ni texto: en cuanto ahí aparece algo con pinta de aplicación, la foto
está inventando producto, y la interfaz de Solved sólo va montada en HTML. (3) **Luminosa**: el
contraste lo pone el velo del componente.

**La miniatura del activo sale de la pantalla de la tablet, no del fondo.** En el plano la máquina va
desenfocada a propósito y a 44px se quedaba en una mancha gris; en el visor está nítida y encuadrada.
Y conceptualmente es lo que toca: la ficha enseña la foto que el técnico acaba de hacer.

**`procedimiento-carpeta-tablet.webp` tiene una condición de encuadre**, y hay que respetarla si algún
día se sustituye: la persona y la carpeta de anillas van en la **mitad izquierda**, porque el
bocadillo con la pantalla ocupa el 58 % derecho de la escena. Y la tablet sale con la pantalla
apagada, que es lo que pide el componente: la interfaz de verdad es la del bocadillo, montada en HTML.

**La fórmula del prompt, que costó tres intentos.** En inglés. **La distribución va la primera**, en
lista y antes que cualquier descripción: enterrada entre adjetivos, el modelo la ignora —es lo que
pasó con la composición de `/gestion-de-activos/`—. Detrás: el gesto, la luz («bright and airy,
high-key, natural daylight, skylights, no harsh shadows»; **nunca** pedir penumbra para que se lea
una interfaz encima, de eso se encarga el velo del componente), la cámara y la óptica («full-frame,
50 mm, f/1.8, very shallow depth of field, fine grain») y, al final, las negaciones («no text, no
signage, no brand logos, nobody looking at the camera, a real photograph, not a 3D render»).

**La regla que dejaron escrita al morir:** una foto de banco con interfaz pegada encima no es la
interfaz de Solved, y en una web que vende software de planta eso se nota. Si hace falta enseñar
producto sobre una foto, va en HTML —`.scene[data-canvas="foto"]` con su recurso—, no horneado en el
píxel: así se puede corregir un dato, traducirlo y leerlo con un lector de pantalla.

## Los cinco avatares de `assets/ia/`

No son fotografías del sitio: son **elementos de interfaz dentro de una pantalla de producto**, como
las miniaturas de `assets/tour/`. Por eso son la excepción a «una foto, una página» —lo mismo que
aquéllas— y por eso salen de fotos de planta que ya están en el repositorio, recortadas a 160×160 y
sin marca de la escena original.

| Fichero | Quién es | Recorte de | Dónde sale |
|---|---|---|---|
| `avatar-pablo.webp` | Pablo Ferrer, mantenimiento | foto de planta | banda de IA · selector de responsable de `/incidencias/` |
| `avatar-ana.webp` | Ana Ruiz, calidad | foto de planta | selector de responsable de `/incidencias/` |
| `avatar-jefe-turno.webp` | el jefe de turno que manda la nota de voz | `planta/nave-tablet-jefe.webp` | banda de IA de `/incidencias/` |
| `avatar-marta.webp` | Marta Gil, producción | `planta/obra-tablet-tecnica-ancha.webp` | selector de responsable de `/incidencias/` |
| `avatar-sergio.webp` | Sergio Nieto, almacén | `planta/almacen-tablet-responsable.webp` | selector de responsable de `/incidencias/` |
| `avatar-hugo.webp` | Hugo Beltrán, mantenimiento | Generado directamente en Google Flow (Nano Banana Pro), 5 oct 2026 — no hay foto de planta con un plano de cara aprovechable | notificación iPhone y selector de responsable de `/software-gmao/` |
| `avatar-luis.webp` | Luis, mantenimiento | Generado directamente en Google Flow (Nano Banana Pro), 5 oct 2026 — misma excepción que `avatar-hugo.webp`: las cuatro fotos de `/industria-general/` llevan a la persona de perfil o mirando la tablet, ninguna sirve para una cara en redondo | notificación iPhone y ficha de asignación de `/industria-general/` |

**`avatar-hugo.webp` es la excepción a «recorte de una foto de planta que ya existe».** Las cuatro
fotos de esta página (`gmao-tecnico-*`, `gmao-supervisor-taller`) llevan a la persona de perfil o de
espaldas —el gesto que pedía el prompt—, así que ninguna sirve para una cara en redondo de 320×320.
Se generó un retrato aparte, mismo criterio de luz y vestuario (bata gris de taller, nave industrial
de fondo) para que no desentone si algún día se recorta de una escena real.

En ese selector las cuatro caras **no se ven hasta que se toca el campo de Responsable**: la lista es
un desplegable y se abre delante de quien mira. Son, por tanto, cuatro imágenes que la escena tarda
tres segundos en pedir — van con `loading="lazy"`, que es lo que les toca.

**Los tres últimos entraron el 9 de septiembre de 2026 y cada uno tiene su motivo.** El del jefe de
turno, porque las dos puntas de la banda de IA llevaban la misma cara —quien manda la nota de voz y
quien recibe la acción— y así la pieza contaba que alguien se asigna trabajo a sí mismo. Los de Marta
y Sergio, porque el selector del equipo pasó de iniciales a fotos: lo que esa pantalla promete es
«cualquier persona del equipo», y cuatro caras distintas lo dicen antes que cuatro letras.

**Y la advertencia que ya estaba escrita para los dos primeros sigue en pie: la aplicación pinta la
inicial, no la foto.** Es una licencia del sitio, tomada a sabiendas y a petición del cliente. Si
algún día se decide que las pantallas sólo enseñan lo que la aplicación enseña, aquí vuelven las
iniciales de colores —están en git— y estos cinco ficheros se caen con ellas.
