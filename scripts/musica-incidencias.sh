#!/usr/bin/env bash
# =========================================================
# MÚSICA DE FONDO DEL VÍDEO DE INCIDENCIAS
#
#   bash scripts/musica-incidencias.sh [pista.mp3]
#
# Toma el MP4 que deja `npm run render:incidencias` (sin audio, porque el reel
# es una página web) y le pega la pista, normalizada y con sus fundidos.
#
# POR QUÉ NORMALIZAR Y NO SUBIR EL VOLUMEN A OJO
# Las pistas de stock vienen a niveles muy distintos. `loudnorm` las lleva a
# -22 LUFS, que es donde una música de fondo se oye sin tapar nada; si algún
# día se le pone locución, hay sitio para ella sin volver a tocar la mezcla.
#
# Para cambiar de pista: `bash scripts/musica-incidencias.sh assets/incidencias/audio/alt-132.mp3`
# =========================================================
set -euo pipefail
cd "$(dirname "$0")/.."
PISTA="${1:-assets/incidencias/audio/pista.mp3}"
VIDEO="assets/incidencias/incidencias.mp4"
SALIDA="assets/incidencias/incidencias-con-musica.mp4"

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO")
FIN=$(python3 -c "print(max(0, $DUR - 3.2))")

ffmpeg -v error -y -i "$VIDEO" -i "$PISTA" \
  -filter_complex "[1:a]atrim=0:${DUR},asetpts=N/SR/TB,\
afade=t=in:st=0:d=1.6,afade=t=out:st=${FIN}:d=3.2,\
loudnorm=I=-22:TP=-1.5:LRA=11[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 160k -shortest -movflags +faststart "$SALIDA"

echo "✔ $SALIDA"
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_type -of default=nw=1 "$SALIDA"
