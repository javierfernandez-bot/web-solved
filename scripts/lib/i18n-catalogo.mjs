/* Solved · carga del catálogo de traducciones.
   Las traducciones viven troceadas en i18n/traducciones/*.json con las cuatro
   lenguas juntas por cadena —{ "texto español": { en, fr, it, de } }— porque
   así se revisan de una pasada y el diff de un cambio de copy sale entero en
   un sitio. Aquí se funden en un diccionario por idioma. */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { TARGETS } from '../../i18n/config.mjs';

export function cargarCatalogo(raiz) {
  const dir = path.join(raiz, 'i18n/traducciones');
  const porIdioma = {};      // lang -> { es: traduccion }
  const origen = new Map();  // cadena -> fichero (para avisar de duplicados)
  if (!existsSync(dir)) return { porIdioma, ficheros: [] };

  const ficheros = readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
  for (const f of ficheros) {
    const datos = JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
    for (const [es, trads] of Object.entries(datos)) {
      if (es.startsWith('_')) continue;   // notas del propio fichero
      if (origen.has(es) && origen.get(es) !== f) {
        console.warn(`  ! duplicada en ${f} y ${origen.get(es)}: ${es.slice(0, 60)}`);
      }
      origen.set(es, f);
      // "=" es el atajo para lo que se escribe igual en los cinco idiomas:
      // marcas, nombres propios y siglas de norma. Evita repetir la cadena
      // cuatro veces sólo para decir que no se traduce.
      if (trads === '=') {
        for (const lang of TARGETS) (porIdioma[lang] ||= {})[es] = es;
        continue;
      }
      for (const [lang, valor] of Object.entries(trads)) {
        if (!valor) continue;
        (porIdioma[lang] ||= {})[es] = valor;
      }
    }
  }
  return { porIdioma, ficheros };
}
