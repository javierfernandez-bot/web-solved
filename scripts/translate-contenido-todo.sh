#!/usr/bin/env bash
# Lanza los cuatro idiomas del contenido editorial en paralelo.
# Cada uno escribe su propia caché (i18n/cache/<lang>.json) y es reanudable:
# si se corta, se vuelve a lanzar y sigue por donde iba.
set -u
cd "$(dirname "$0")/.."
mkdir -p i18n/cache/logs
for lang in en fr it de pt; do
  node scripts/translate-contenido.mjs --lang "$lang" > "i18n/cache/logs/$lang.log" 2>&1 &
done
wait
echo "terminado: $(date -Is)"
