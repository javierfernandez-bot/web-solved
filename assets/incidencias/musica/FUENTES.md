# Música del reel — procedencia y licencia

Hay pistas de **dos** procedencias, con licencias distintas. Conviene no
mezclarlas sin mirar cuál aplica.

## La que suena hoy

`breakbeat-mixkit-1103.mp3` — breakbeat de Mixkit, 1:33, 256 kbps.

- Pista: https://assets.mixkit.co/music/1103/1103.mp3
- Etiqueta de origen: https://mixkit.co/free-stock-music/tag/breakbeat/

Se eligió midiendo, no de oído: de las doce pistas de la etiqueta *breakbeat*
es la que más recorrido dinámico tiene (**7 dB**; las demás se quedan entre 3 y
5) y su arco cae donde toca. Entra suave bajo la notificación de apertura,
levanta a los 15 s —justo cuando aparece «Una nueva manera de gestionar tus
operaciones», en el segundo 14,4— se sostiene por las escenas de amplitud y
hace pico a los 60 s, que es donde arranca el cierre. Después baja.

Mixkit pinta los títulos con JavaScript, así que aquí queda el identificador
numérico, que es lo que sí es verificable.

## Licencia · Mixkit Stock Music Free License

Verificada leyendo el texto en `https://mixkit.co/license/modal/musicFree/`
(en la página de licencias el texto lo carga un modal de JavaScript, por eso no
se ve en el HTML servido).

> "Items under the Mixkit Stock Music Free License can be used in your
> commercial and non-commercial projects for free. You're permitted to
> download, copy, modify, distribute and publicly perform the Music Items on
> any web or social media platform, including internet-based video on demand
> services, podcasts and advertisements."

**Permitido**: web, redes, anuncios en línea, podcasts, educativo, YouTube.
Gratis, para uso comercial, sin atribución obligatoria.

**Prohibido**: CDs y DVDs, **emisiones de TV y radio**, videojuegos. Tampoco
remezclarla, incorporarla a una pista solo de música, reclamarla como propia ni
registrarla en una gestora de derechos.

> **La restricción que puede mordernos.** La web y las redes están cubiertas,
> que es el uso de hoy. Pero si el vídeo va alguna vez a una emisión de TV o
> radio —o a una feria que se retransmita— esta música no vale y hay que
> cambiarla. Usarla de fondo bajo el vídeo no cuenta como remezclar.

## Licencia · Pixabay Content License

Cubre `technology-corporate.mp3` (The_Mountain) y `upbeat-happy-corporate.mp3`
(kornevmusic), las dos de https://pixabay.com/music/. Uso comercial, sin
atribución y sin pago. No permite vender ni redistribuir la pista *como pista*
—por ejemplo dentro de una plantilla que se venda— ni usarla de modo que
sugiera que el músico respalda a Solved.

## Otras candidatas

`candidatas/` guarda las diez pistas de la etiqueta *breakbeat* que aguantan
los 67 s, **ya recortadas a la duración del vídeo, con sus fundidos y
normalizadas a -22 LUFS**: suenan tal como quedarían en la mezcla, así que se
pueden comparar de oído sin montarlas. El número del nombre es el
identificador de Mixkit.

| Fichero | Recorrido | Punto alto |
|---|---|---|
| `mixkit-626.mp3` | 30,9 dB | 62,5 s |
| `mixkit-889.mp3` | 8,5 dB | 30,0 s |
| `mixkit-1150.mp3` | 8,2 dB | 17,5 s |
| `mixkit-1103.mp3` | 7,6 dB | 62,5 s |
| `mixkit-1008.mp3` | 6,6 dB | 15,0 s |
| `mixkit-1079.mp3` | 6,1 dB | 35,0 s |
| `mixkit-706.mp3` | 6,0 dB | 55,0 s |
| `mixkit-174.mp3` | 4,4 dB | 50,0 s |
| `mixkit-154.mp3` | 2,8 dB | 15,0 s |
| `mixkit-1090.mp3` | 2,8 dB | 55,0 s |

El recorrido es la diferencia entre el momento más flojo y el más fuerte dentro
de los 67 s: cuanto mayor, más relieve tiene la pista. El punto alto interesa
que caiga cerca del segundo 60,2, donde arranca el cierre.

`assets/incidencias/audio/` guarda cuatro pistas más de Mixkit (`alt-132`,
`alt-371`, `alt-724`, `alt-1167`) y `pista.mp3`. Les aplica la misma licencia.

## Cómo se cambia

La pista por defecto está en la constante `MUSICA` de
`scripts/render-incidencias.mjs`. Para probar otra sin editar nada:

```
MUSICA=assets/incidencias/musica/technology-corporate.mp3 npm run render:incidencias
```

Con `MUSICA=` vacío el vídeo sale mudo. Para cambiar la música **sin volver a
renderizar** los 67 s, que tarda:

```
bash scripts/musica-incidencias.sh assets/incidencias/musica/breakbeat-mixkit-1103.mp3
```

Eso deja `incidencias-con-musica.mp4`, reemplazando el audio y copiando el
vídeo tal cual (`-c:v copy`), así que es cuestión de segundos.

## Cómo se monta

- **`loudnorm` a -22 LUFS.** Las pistas de stock vienen a niveles muy
  distintos; normalizar evita ajustar el volumen a ojo y deja sitio por si
  algún día se le pone locución.
- **Fundido de entrada de 1,6 s y de salida de 3,2 s.** Un corte seco en el
  primer fotograma se oye como un fallo de reproducción, no como una decisión.
- **`-shortest`** para que el audio no alargue el vídeo.

## Si el vídeo se publica con sonido

**`autoplay` sólo con `muted`**, que es lo único que los navegadores reproducen
solo. La música es para cuando alguien le da al play, no para que suene al
entrar en la página.
