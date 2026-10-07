/* Solved · configuración de idiomas
   ------------------------------------------------------------------
   El español es el ORIGEN: se escribe una sola vez en la raíz del sitio y
   de ahí salen /en/, /fr/, /it/, /de/ y /pt/. Nunca se edita un HTML traducido a
   mano — se edita el español, se traduce la cadena nueva en i18n/<lang>.json
   y se vuelve a construir. Ver scripts/build-i18n.mjs.

   Los slugs van traducidos a propósito (decisión de sep-2026): la URL es
   señal de posicionamiento en cada mercado. La marca no se traduce, así que
   los casos de éxito conservan el nombre del cliente. */

export const SOURCE = 'es';

export const LANGS = {
  es: { code: 'es', htmlLang: 'es',    ogLocale: 'es_ES', nombre: 'Español',   prefijo: ''     },
  en: { code: 'en', htmlLang: 'en',    ogLocale: 'en_US', nombre: 'English',   prefijo: '/en'  },
  fr: { code: 'fr', htmlLang: 'fr',    ogLocale: 'fr_FR', nombre: 'Français',  prefijo: '/fr'  },
  it: { code: 'it', htmlLang: 'it',    ogLocale: 'it_IT', nombre: 'Italiano',  prefijo: '/it'  },
  de: { code: 'de', htmlLang: 'de',    ogLocale: 'de_DE', nombre: 'Deutsch',   prefijo: '/de'  },
  pt: { code: 'pt', htmlLang: 'pt-PT', ogLocale: 'pt_PT', nombre: 'Português', prefijo: '/pt'  },
};

export const TARGETS = ['en', 'fr', 'it', 'de', 'pt'];

/* Mapa de rutas. La clave es la ruta española (canónica, con barras) y el
   valor es el slug de cada idioma SIN el prefijo de idioma. */
export const RUTAS = {
  '/':                                   { en: '/',                     fr: '/',                            it: '/',                          de: '/',                         pt: '/' },
  '/incidencias/':                       { en: '/incident-management/', fr: '/gestion-des-incidents/',      it: '/gestione-delle-anomalie/',  de: '/stoerungsmanagement/',     pt: '/gestao-de-incidentes/' },
  '/auditorias/':                        { en: '/digital-checklists/',  fr: '/registres-et-controles/',     it: '/registri-e-checklist/',     de: '/digitale-checklisten/',    pt: '/checklists-digitais/' },
  '/gestor-documental/':                 { en: '/document-management/', fr: '/gestion-documentaire/',       it: '/gestione-documentale/',     de: '/dokumentenmanagement/',    pt: '/gestao-documental/' },
  '/no-conformidades/':                  { en: '/corrective-actions/',  fr: '/actions-correctives/',        it: '/azioni-correttive/',        de: '/korrekturmassnahmen/',     pt: '/acoes-corretivas/' },
  '/gestion-de-activos/':                { en: '/asset-management/',    fr: '/gestion-des-actifs/',         it: '/gestione-degli-asset/',     de: '/anlagenverwaltung/',       pt: '/gestao-de-ativos/' },
  '/dashboard/':                         { en: '/dashboards/',          fr: '/tableaux-de-bord/',           it: '/dashboard/',                de: '/dashboards/',              pt: '/dashboards/' },
  '/ia/':                                { en: '/ai/',                  fr: '/ia/',                         it: '/ia/',                       de: '/ki/',                      pt: '/ia/' },
  '/integraciones/':                     { en: '/integrations/',        fr: '/integrations/',               it: '/integrazioni/',             de: '/integrationen/',           pt: '/integracoes/' },
  '/industria-general/':                 { en: '/manufacturing/',       fr: '/industrie-manufacturiere/',   it: '/industria-manifatturiera/', de: '/fertigungsindustrie/',     pt: '/industria-transformadora/' },
  '/industria-alimentaria/':             { en: '/food-industry/',       fr: '/industrie-agroalimentaire/',  it: '/industria-alimentare/',     de: '/lebensmittelindustrie/',   pt: '/industria-alimentar/' },
  '/casos-de-exito/':                    { en: '/case-studies/',        fr: '/etudes-de-cas/',              it: '/casi-di-successo/',         de: '/fallstudien/',             pt: '/casos-de-sucesso/' },
  '/politica-de-privacidad/':            { en: '/privacy-policy/',      fr: '/politique-de-confidentialite/', it: '/informativa-sulla-privacy/', de: '/datenschutzerklaerung/', pt: '/politica-de-privacidade/' },
  '/politica-de-cookies/':               { en: '/cookie-policy/',       fr: '/politique-de-cookies/',       it: '/informativa-sui-cookie/',   de: '/cookie-richtlinie/',       pt: '/politica-de-cookies/' },
  '/blog/':                              { en: '/blog/',                fr: '/blog/',                       it: '/blog/',                     de: '/blog/',                    pt: '/blog/' },
  '/glosario/':                          { en: '/glossary/',            fr: '/glossaire/',                  it: '/glossario/',                de: '/glossar/',                 pt: '/glossario/' },
};

/* Páginas comerciales: HTML escrito a mano, se traducen con el catálogo de
   cadenas (i18n/<lang>.json) para que el copy esté cuidado palabra a palabra. */
export const PAGINAS_CATALOGO = [
  { archivo: 'index.html',                             ruta: '/' },
  { archivo: 'incidencias/index.html',                 ruta: '/incidencias/' },
  { archivo: 'auditorias/index.html',                  ruta: '/auditorias/' },
  { archivo: 'gestor-documental/index.html',           ruta: '/gestor-documental/' },
  { archivo: 'no-conformidades/index.html',            ruta: '/no-conformidades/' },
  { archivo: 'gestion-de-activos/index.html',          ruta: '/gestion-de-activos/' },
  { archivo: 'dashboard/index.html',                   ruta: '/dashboard/' },
  { archivo: 'ia/index.html',                          ruta: '/ia/' },
  { archivo: 'integraciones/index.html',               ruta: '/integraciones/' },
  { archivo: 'industria-general/index.html',           ruta: '/industria-general/' },
  { archivo: 'industria-alimentaria/index.html',       ruta: '/industria-alimentaria/' },
  { archivo: 'casos-de-exito/index.html',              ruta: '/casos-de-exito/' },
  { archivo: 'politica-de-privacidad/index.html',      ruta: '/politica-de-privacidad/' },
  { archivo: 'politica-de-cookies/index.html',         ruta: '/politica-de-cookies/' },
  { archivo: '404.html',                               ruta: '/404.html', noIndexar: true },
];

/* Traduce una ruta española a la de otro idioma. Devuelve null si no está en
   el mapa (el llamador decide si dejar el enlace en español o descartarlo). */
export function traducirRuta(ruta, lang) {
  if (lang === SOURCE) return ruta;
  const pref = LANGS[lang].prefijo;
  const destino = RUTAS[ruta]?.[lang];
  if (destino) return destino === '/' ? pref + '/' : pref + destino;
  return null;
}
