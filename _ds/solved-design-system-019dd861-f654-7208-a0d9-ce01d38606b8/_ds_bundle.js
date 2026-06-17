/* @ds-bundle: {"format":3,"namespace":"SolvedDesignSystem_019dd8","components":[],"sourceHashes":{"ui_kits/app/Atoms.jsx":"269bdba3591d","ui_kits/app/Icon.jsx":"afa7adb4029d","ui_kits/app/MobileApp.jsx":"8ce75a106474","ui_kits/app/MobileScreens.jsx":"f3122ab07aad","ui_kits/app/ScreenBoards.jsx":"a3871439e19a","ui_kits/app/ScreenInicio.jsx":"f27f4fec1374","ui_kits/app/ScreenList.jsx":"5b36c3656575","ui_kits/app/ScreenMore.jsx":"b6be4684af4e","ui_kits/app/Shell.jsx":"2ca7341a8b29","ui_kits/app/data.jsx":"a3512a5fa746","ui_kits/web/Img.jsx":"2e3e91a52ec0","ui_kits/web/WebFooter.jsx":"61249954eb3c","ui_kits/web/WebHero.jsx":"462cd02c49be","ui_kits/web/WebNav.jsx":"a85f837d7e3a","ui_kits/web/WebProducts.jsx":"9d671fc3a446","ui_kits/web/WebProof.jsx":"deb75f7dad7c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SolvedDesignSystem_019dd8 = window.SolvedDesignSystem_019dd8 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/app/Atoms.jsx
try { (() => {
// Solved · App — shared atoms (thumbnails, avatars, status dots)
const THUMBS = {
  oranges: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=120&h=120&fit=crop',
  bread: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&h=120&fit=crop',
  egg: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=120&h=120&fit=crop',
  grain: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=120&h=120&fit=crop',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=120&h=120&fit=crop',
  bun: 'https://images.unsplash.com/photo-1568051243858-533a607809a5?w=120&h=120&fit=crop',
  cookie: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=120&h=120&fit=crop',
  meat: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=120&h=120&fit=crop',
  fish: 'https://images.unsplash.com/photo-1535140728325-a4d3707eee61?w=120&h=120&fit=crop',
  warehouse: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=120&h=120&fit=crop'
};

// Thumbnail that falls back to the Solved monogram when no image / load fails
function Thumb({
  img,
  className
}) {
  const [failed, setFailed] = React.useState(false);
  const src = img && THUMBS[img];
  if (!src || failed) {
    return /*#__PURE__*/React.createElement("span", {
      className: `tbl__thumb ${className || ''}`
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "incidencia"
    }));
  }
  return /*#__PURE__*/React.createElement("span", {
    className: `tbl__thumb ${className || ''}`
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    onError: () => setFailed(true)
  }));
}
function Avatar({
  name,
  dash,
  className
}) {
  if (dash) return /*#__PURE__*/React.createElement("span", {
    className: `av av--dash ${className || ''}`
  });
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return /*#__PURE__*/React.createElement("span", {
    className: `av ${className || ''}`
  }, initial);
}
window.Thumb = Thumb;
window.Avatar = Avatar;
window.THUMBS = THUMBS;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Atoms.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Icon.jsx
try { (() => {
// Solved · App — inline icon set (Lucide-style, 1.8 stroke)
function Icon({
  name,
  className
}) {
  const p = ICONS[name] || '';
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    dangerouslySetInnerHTML: {
      __html: p
    }
  });
}
const ICONS = {
  menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  partner: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  home: '<path d="M3 9.5 12 3l9 6.5"/><path d="M5 10v10h14V10"/>',
  incidencia: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/>',
  accion: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  registro: '<path d="m4 7 2 2 3-3"/><path d="m4 14 2 2 3-3"/><path d="M13 7h7M13 15h7"/>',
  ai: '<rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 7V4M9 13h.01M15 13h.01M2 12h2M20 12h2"/>',
  chart: '<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/>',
  informe: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  trash: '<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  star: '<path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18l-5.8 3 1.1-6.5L2.6 9.8l6.5-.9z"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 14h18M9 4v16"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  kanban: '<rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="5" height="11" rx="1"/><rect x="17" y="4" width="4" height="14" rx="1"/>',
  chevL: '<path d="m15 18-6-6 6-6"/>',
  chevR: '<path d="m9 18 6-6-6-6"/>',
  chevRsmall: '<path d="m9 18 6-6-6-6"/>',
  first: '<path d="m18 17-5-5 5-5M11 17l-5-5 5-5"/>',
  last: '<path d="m6 17 5-5-5-5M13 17l5-5-5-5"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-2.7 2.7-2-2 2.7-2.7z"/>',
  flame: '<path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3s0 2 2 2 1-5 2-8z"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M12 3v13M7 8l5-5 5 5"/>',
  filePdf: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  folderBig: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.3 1a7 7 0 0 0-1.7-1L14.5 2h-5l-.4 2.5a7 7 0 0 0-1.7 1l-2.3-1-2 3.5L5 11a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.3-1a7 7 0 0 0 1.7 1l.4 2.5h5l.4-2.5a7 7 0 0 0 1.7-1l2.3 1 2-3.5-2-1.5a7 7 0 0 0 .1-1z"/>',
  sort: '<path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 6v14"/>',
  link: '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/><path d="M12 8v4l3 2"/>',
  collapse: '<path d="m11 17-5-5 5-5M18 17l-5-5 5-5"/>'
};
window.Icon = Icon;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Icon.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/MobileApp.jsx
try { (() => {
// Solved · App móvil — shell (top bar + bottom tabs + FAB + drawer)
function MobileApp() {
  const [route, setRoute] = useState('inicio');
  const [drawer, setDrawer] = useState(false);
  const TITLES = {
    inicio: 'Inicio',
    incidencias: 'Incidencias',
    acciones: 'Acciones',
    registros: 'Registros',
    documentos: 'Documentos',
    opensearch: 'Inicio',
    socio: 'Inicio de Socio',
    ai: 'AI',
    informes: 'Informes'
  };
  let body;
  switch (route) {
    case 'inicio':
      body = /*#__PURE__*/React.createElement(MInicio, null);
      break;
    case 'incidencias':
      body = /*#__PURE__*/React.createElement(MList, {
        module: "inc"
      });
      break;
    case 'acciones':
      body = /*#__PURE__*/React.createElement(MList, {
        module: "acc"
      });
      break;
    case 'registros':
      body = /*#__PURE__*/React.createElement(MRegistros, null);
      break;
    case 'documentos':
      body = /*#__PURE__*/React.createElement(MDocumentos, null);
      break;
    case 'opensearch':
      body = /*#__PURE__*/React.createElement(MOpenSearch, null);
      break;
    default:
      body = /*#__PURE__*/React.createElement(MPlaceholder, {
        route: route
      });
  }
  const go = r => {
    setRoute(r);
    setDrawer(false);
  };
  const TABS = [{
    id: 'inicio',
    label: 'Inicio',
    icon: 'home'
  }, {
    id: 'incidencias',
    label: 'Incidencias',
    icon: 'incidencia'
  }, {
    id: 'acciones',
    label: 'Acciones',
    icon: 'accion'
  }, {
    id: 'registros',
    label: 'Registros',
    icon: 'registro'
  }];
  const DRAWER_NAV = [{
    id: 'socio',
    label: 'Inicio de Socio',
    icon: 'partner'
  }, {
    id: 'inicio',
    label: 'Inicio',
    icon: 'home'
  }, {
    id: 'incidencias',
    label: 'Incidencias',
    icon: 'incidencia'
  }, {
    id: 'acciones',
    label: 'Acciones',
    icon: 'accion'
  }, {
    id: 'registros',
    label: 'Registros',
    icon: 'registro'
  }, {
    id: 'ai',
    label: 'AI',
    icon: 'ai'
  }, {
    id: 'opensearch',
    label: 'OpenSearch',
    icon: 'chart'
  }, {
    id: 'informes',
    label: 'Informes',
    icon: 'informe'
  }, {
    id: 'documentos',
    label: 'Documentos',
    icon: 'folder'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "mwrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "device"
  }, /*#__PURE__*/React.createElement("header", {
    className: "mtb"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mtb__burger",
    onClick: () => setDrawer(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "menu"
  })), /*#__PURE__*/React.createElement("span", {
    className: "mtb__title"
  }, TITLES[route]), /*#__PURE__*/React.createElement("span", {
    className: "mtb__sp"
  }), /*#__PURE__*/React.createElement("button", {
    className: "mtb__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell"
  })), /*#__PURE__*/React.createElement("button", {
    className: "mtb__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chat"
  })), /*#__PURE__*/React.createElement("span", {
    className: "mtb__avatar"
  }, "j")), /*#__PURE__*/React.createElement("div", {
    className: "mcontent"
  }, body), /*#__PURE__*/React.createElement("nav", {
    className: "mbottom"
  }, /*#__PURE__*/React.createElement("button", {
    className: `mtab ${route === 'inicio' ? 'is-active' : ''}`,
    onClick: () => go('inicio')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "home"
  }), " Inicio"), /*#__PURE__*/React.createElement("button", {
    className: `mtab ${route === 'incidencias' ? 'is-active' : ''}`,
    onClick: () => go('incidencias')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "incidencia"
  }), " Incidencias"), /*#__PURE__*/React.createElement("button", {
    className: "mfab",
    "aria-label": "Crear"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  })), /*#__PURE__*/React.createElement("button", {
    className: `mtab ${route === 'acciones' ? 'is-active' : ''}`,
    onClick: () => go('acciones')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "accion"
  }), " Acciones"), /*#__PURE__*/React.createElement("button", {
    className: `mtab ${route === 'registros' ? 'is-active' : ''}`,
    onClick: () => go('registros')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "registro"
  }), " Registros")), /*#__PURE__*/React.createElement("div", {
    className: `mdrawer ${drawer ? 'is-open' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "mdrawer__scrim",
    onClick: () => setDrawer(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "mdrawer__panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mdrawer__acct"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mdrawer__thumb"
  }), /*#__PURE__*/React.createElement("b", null, "Ultimate Demo 6")), DRAWER_NAV.map(n => /*#__PURE__*/React.createElement("button", {
    key: n.id,
    className: `mdrawer__link ${route === n.id ? 'is-active' : ''}`,
    onClick: () => go(n.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: n.icon
  }), " ", n.label)), /*#__PURE__*/React.createElement("button", {
    className: "mdrawer__link mdrawer__link--trash"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash"
  }), " Papelera")))));
}
function MPlaceholder({
  route
}) {
  const labels = {
    socio: 'Inicio de Socio',
    ai: 'AI',
    informes: 'Informes'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mpanel",
    style: {
      textAlign: 'center',
      color: 'var(--ink-400)',
      padding: 40
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      color: 'var(--ink-600)',
      margin: '0 0 6px'
    }
  }, labels[route]), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13
    }
  }, "M\xF3dulo no incluido en este kit de demostraci\xF3n."));
}
window.MobileApp = MobileApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/MobileApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/MobileScreens.jsx
try { (() => {
// Solved · App móvil — pantallas (reusa data.jsx, Icon.jsx, Atoms.jsx)
const {
  useState
} = React;
function MBarChart({
  data,
  color,
  max
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mbars"
  }, data.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.x,
    className: "mbars__col"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mbars__v"
  }, d.v), /*#__PURE__*/React.createElement("div", {
    className: "mbars__bar",
    style: {
      height: `${d.v / max * 100}%`,
      background: color
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "mbars__x"
  }, d.x.slice(5)))));
}

/* ---------- INICIO ---------- */
function MInicio() {
  const WEEK = [{
    wd: 'LUN',
    n: 8
  }, {
    wd: 'MAR',
    n: 9
  }, {
    wd: 'MIÉ',
    n: 10,
    today: true
  }, {
    wd: 'JUE',
    n: 11
  }, {
    wd: 'VIE',
    n: 12
  }, {
    wd: 'SÁB',
    n: 13
  }, {
    wd: 'DOM',
    n: 14
  }];
  const we = {
    8: [{
      id: 'UTD26_136',
      t: 'Produc…',
      k: 'inc'
    }, {
      id: 'UTD26_134',
      t: 'Pendie…',
      k: 'inc'
    }, {
      id: 'UTD26_135',
      t: 'KO en…',
      k: 'inc'
    }, {
      id: 'UTD26_AC_071',
      t: '',
      k: 'acc'
    }],
    9: [{
      id: 'UTD26_139',
      t: 'no se…',
      k: 'inc'
    }, {
      id: 'UTD26_138',
      t: '',
      k: 'inc'
    }, {
      id: 'UTD26_137',
      t: '',
      k: 'inc'
    }],
    10: [{
      id: 'UTD26_140',
      t: 'No',
      k: 'inc'
    }]
  };
  const [fav, setFav] = useState('inc');
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    className: "mpanel mgreet"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mgreet__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mgreet__av"
  }, "JA"), /*#__PURE__*/React.createElement("h2", null, "Buenas tardes,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", null, "javier.fernandez")), /*#__PURE__*/React.createElement("span", {
    className: "mgreet__cog"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "cog"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mgreet__meta"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar"
  }), " Mi\xE9rcoles, 10 de junio de 2026"), /*#__PURE__*/React.createElement("div", {
    className: "mgreet__counts"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--blue)',
      fontWeight: 600
    }
  }, "Solved"), /*#__PURE__*/React.createElement("span", {
    className: "b"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "incidencia"
  }), " 8"), /*#__PURE__*/React.createElement("span", {
    className: "o"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "accion"
  }), " 3"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "registro"
  }), " 0"))), /*#__PURE__*/React.createElement("section", {
    className: "mpanel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcal__hd"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mcal__arr"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevL"
  })), /*#__PURE__*/React.createElement("button", {
    className: "mcal__today"
  }, "Hoy"), /*#__PURE__*/React.createElement("button", {
    className: "mcal__arr"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevR"
  })), /*#__PURE__*/React.createElement("span", {
    className: "mcal__title"
  }, "8 al 14 junio")), /*#__PURE__*/React.createElement("div", {
    className: "mseg"
  }, /*#__PURE__*/React.createElement("button", {
    className: "is-active"
  }, "Semana"), /*#__PURE__*/React.createElement("button", null, "Agenda")), /*#__PURE__*/React.createElement("div", {
    className: "mcal__legend"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--ink-800)'
    }
  }, "Total 11"), /*#__PURE__*/React.createElement("span", {
    className: "lg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d",
    style: {
      background: 'var(--incidencia)'
    }
  }), " Inc. 8"), /*#__PURE__*/React.createElement("span", {
    className: "lg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d",
    style: {
      background: 'var(--accion)'
    }
  }), " Acc. 3")), /*#__PURE__*/React.createElement("div", {
    className: "mweek"
  }, WEEK.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.n,
    className: "mweek__day"
  }, /*#__PURE__*/React.createElement("div", {
    className: `mweek__dh ${d.today ? 'is-today' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "wd"
  }, d.wd), /*#__PURE__*/React.createElement("div", {
    className: "nu"
  }, d.n)), /*#__PURE__*/React.createElement("div", {
    className: "mweek__ev"
  }, (we[d.n] || []).map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `mev mev--${e.k}`
  }, /*#__PURE__*/React.createElement("b", null, e.id), e.t && /*#__PURE__*/React.createElement("span", null, e.t)))))))), /*#__PURE__*/React.createElement("section", {
    className: "mpanel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mwhd"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--warn)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star"
  })), /*#__PURE__*/React.createElement("h3", null, "Favoritos")), /*#__PURE__*/React.createElement("div", {
    className: "mfav-tabs"
  }, /*#__PURE__*/React.createElement("span", {
    className: `mfav-tab ${fav === 'inc' ? 'is-active' : ''}`,
    onClick: () => setFav('inc')
  }, "Incidencias (", FAVORITOS.inc.length, ")"), /*#__PURE__*/React.createElement("span", {
    className: `mfav-tab ${fav === 'acc' ? 'is-active' : ''}`,
    onClick: () => setFav('acc')
  }, "Acciones (", FAVORITOS.acc.length, ")")), FAVORITOS[fav].map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    className: "mfav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfav__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "star"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star"
  })), /*#__PURE__*/React.createElement("span", {
    className: "mfav__id",
    style: fav === 'acc' ? {
      color: 'var(--accion)'
    } : null
  }, it.id), /*#__PURE__*/React.createElement("span", {
    className: "mfav__date"
  }, it.date)), /*#__PURE__*/React.createElement("p", null, it.t)))), /*#__PURE__*/React.createElement("section", {
    className: "mpanel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mwhd"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "incidencia"
  }), /*#__PURE__*/React.createElement("h3", null, "Incidencias Abiertas"), /*#__PURE__*/React.createElement("span", {
    className: "sp"
  }), /*#__PURE__*/React.createElement("span", {
    className: "seg2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "is-active"
  }, "Creaci\xF3n"), /*#__PURE__*/React.createElement("button", null, "Cierre"))), INCIDENCIAS.slice(0, 5).map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    className: "mfav",
    style: {
      borderBottom: '1px solid var(--ink-50)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfav__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mfav__id"
  }, it.id)), /*#__PURE__*/React.createElement("p", null, it.desc)))));
}

/* ---------- LISTA (Incidencias / Acciones) ---------- */
function MList({
  module
}) {
  const isInc = module === 'inc';
  const [view, setView] = useState('tabla');
  const counts = isInc ? {
    o: 130,
    r: 1,
    c: 4
  } : {
    o: 41,
    r: 4,
    c: 24
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mlt"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mviewtabs"
  }, /*#__PURE__*/React.createElement("button", {
    className: `mviewtab ${view === 'tabla' ? 'is-active' : ''}`,
    onClick: () => setView('tabla')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "table"
  }), " Tabla"), /*#__PURE__*/React.createElement("button", {
    className: `mviewtab mviewtab--icon ${view === 'cal' ? 'is-active' : ''}`,
    onClick: () => setView('cal')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar"
  })), /*#__PURE__*/React.createElement("button", {
    className: `mviewtab mviewtab--icon ${view === 'kanban' ? 'is-active' : ''}`,
    onClick: () => setView('kanban')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "kanban"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mstatus"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mstatus__main"
  }, "Abierto ", /*#__PURE__*/React.createElement("span", {
    className: "c"
  }, counts.o)), /*#__PURE__*/React.createElement("span", {
    className: "mstatus__chip mstatus__chip--review"
  }, counts.r), /*#__PURE__*/React.createElement("span", {
    className: "mstatus__chip mstatus__chip--closed"
  }, counts.c))), view === 'kanban' ? /*#__PURE__*/React.createElement(MKanban, null) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "msub"
  }, /*#__PURE__*/React.createElement("button", {
    className: "msub__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search"
  })), /*#__PURE__*/React.createElement("button", {
    className: "msub__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "filter"
  })), /*#__PURE__*/React.createElement("button", {
    className: "msub__ico msub__ico--star"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star"
  })), /*#__PURE__*/React.createElement("button", {
    className: "msub__ico msub__ico--chart"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chart"
  })), /*#__PURE__*/React.createElement("span", {
    className: "msub__sp"
  }), /*#__PURE__*/React.createElement("select", {
    defaultValue: isInc ? '50' : '100'
  }, /*#__PURE__*/React.createElement("option", null, "20"), /*#__PURE__*/React.createElement("option", null, "50"), /*#__PURE__*/React.createElement("option", null, "100")), /*#__PURE__*/React.createElement("span", {
    className: "msub__range"
  }, "1\u2013", isInc ? 50 : 41, " / ", counts.o), /*#__PURE__*/React.createElement("button", {
    className: "msub__pg"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevL"
  })), /*#__PURE__*/React.createElement("button", {
    className: "msub__pg"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevR"
  }))), isInc ? INCIDENCIAS.map(it => /*#__PURE__*/React.createElement(MIncCard, {
    key: it.id,
    it: it
  })) : ACCIONES.map(it => /*#__PURE__*/React.createElement(MAccCard, {
    key: it.id,
    it: it
  }))));
}
function MIncCard({
  it
}) {
  const open = it.st === 'open';
  return /*#__PURE__*/React.createElement("div", {
    className: `mcard ${open ? 'mcard--accent-warn' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcard__top"
  }, /*#__PURE__*/React.createElement(Thumb, {
    img: it.img,
    className: "mthumb"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mcard__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcard__hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mcard__id mcard__id--inc"
  }, it.id), /*#__PURE__*/React.createElement("span", {
    className: `dot-st dot-st--${it.st}`
  }), /*#__PURE__*/React.createElement("span", {
    className: "mcard__star"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star"
  }))), it.desc && it.desc !== '—' && /*#__PURE__*/React.createElement("p", {
    className: "mcard__desc"
  }, it.desc), /*#__PURE__*/React.createElement("div", {
    className: "mcard__chips"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mchip mchip--time"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "history"
  }), " ", it.fc.split(' ').slice(-1)[0]), it.fx && /*#__PURE__*/React.createElement("span", {
    className: "mchip mchip--closed"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "accion"
  }), " ", it.fx)), /*#__PURE__*/React.createElement("p", {
    className: "mcard__resp"
  }, "Responsable: ", /*#__PURE__*/React.createElement("b", null, it.creador)))));
}
function MAccCard({
  it
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mcard mcard--accent-acc"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcard__top"
  }, /*#__PURE__*/React.createElement(Thumb, {
    img: it.img,
    className: "mthumb"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mcard__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcard__hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mcard__id mcard__id--acc"
  }, it.id), /*#__PURE__*/React.createElement("span", {
    className: "dot-st dot-st--review"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mcard__mini"
  }, it.flags && it.flags.includes('reg') && /*#__PURE__*/React.createElement(Icon, {
    name: "registro"
  }), it.flags && it.flags.includes('doc') && /*#__PURE__*/React.createElement(Icon, {
    name: "incidencia"
  }), it.flags && it.flags.includes('wrench') && /*#__PURE__*/React.createElement(Icon, {
    name: "wrench"
  })), /*#__PURE__*/React.createElement("span", {
    className: "mcard__star"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "mcard__desc"
  }, it.desc), it.inc && /*#__PURE__*/React.createElement("p", {
    className: "mcard__sub"
  }, "ID incidencia: ", it.inc.split(' ')[0]), /*#__PURE__*/React.createElement("div", {
    className: "mcard__chips"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mchip mchip--time"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "history"
  }), " ", it.fc)), /*#__PURE__*/React.createElement("p", {
    className: "mcard__resp"
  }, "Responsable: ", /*#__PURE__*/React.createElement("b", null, it.resp || 'A Definir')))));
}

/* ---------- KANBAN ---------- */
function MKanban() {
  const cols = [{
    key: 'open',
    label: 'Abierto',
    n: 41,
    items: KANBAN.open
  }, {
    key: 'review',
    label: 'En Revisión',
    n: 4,
    items: KANBAN.review
  }, {
    key: 'closed',
    label: 'Cerrado',
    n: 24,
    items: KANBAN.closed
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "mkb"
  }, cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.key,
    className: `mkbcol mkbcol--${c.key}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkbcol__hd"
  }, c.label, /*#__PURE__*/React.createElement("span", {
    className: "cnt"
  }, c.n)), c.items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    className: "mkbcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mkbcard__hd"
  }, it.img && /*#__PURE__*/React.createElement(Thumb, {
    img: it.img,
    className: "mkbcard__thumb"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mkbcard__id"
  }, it.id)), it.src && /*#__PURE__*/React.createElement("span", {
    className: `mkbcard__src ${it.srcType === 'reg' ? 'mkbcard__src--reg' : ''}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.srcType === 'reg' ? 'registro' : 'incidencia'
  }), " ", it.src), it.tag && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "mkbcard__tag"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.tag === 'Correctivo' ? 'wrench' : 'flame'
  }), " ", it.tag)), /*#__PURE__*/React.createElement("div", {
    className: "mkbcard__date"
  }, it.date))))));
}

/* ---------- REGISTROS ---------- */
function MRegistros() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mlt"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mviewtabs"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mviewtab is-active"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "table"
  }), " Lista"), /*#__PURE__*/React.createElement("button", {
    className: "mviewtab mviewtab--icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mstatus"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mstatus__main"
  }, "Pendientes ", /*#__PURE__*/React.createElement("span", {
    className: "c"
  }, "100")), /*#__PURE__*/React.createElement("span", {
    className: "mstatus__chip",
    style: {
      background: 'var(--registro)'
    }
  }, "296"), /*#__PURE__*/React.createElement("span", {
    className: "mstatus__chip mstatus__chip--closed"
  }, "30"))), /*#__PURE__*/React.createElement("div", {
    className: "msub"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mseg",
    style: {
      margin: 0,
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "is-active",
    style: {
      padding: '5px 10px'
    }
  }, "Detallada"), /*#__PURE__*/React.createElement("button", {
    style: {
      padding: '5px 10px'
    }
  }, "Compacta")), /*#__PURE__*/React.createElement("button", {
    className: "msub__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search"
  })), /*#__PURE__*/React.createElement("button", {
    className: "msub__ico msub__ico--sort"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sort"
  })), /*#__PURE__*/React.createElement("button", {
    className: "msub__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "filter"
  })), /*#__PURE__*/React.createElement("span", {
    className: "msub__sp"
  }), /*#__PURE__*/React.createElement("span", {
    className: "msub__range"
  }, "1\u201320 / 100")), REGISTROS.map(r => /*#__PURE__*/React.createElement(React.Fragment, {
    key: r.num
  }, /*#__PURE__*/React.createElement("div", {
    className: "mregdate"
  }, /*#__PURE__*/React.createElement("span", null, r.date)), /*#__PURE__*/React.createElement("div", {
    className: "mreg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mreg__hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mreg__num"
  }, r.num), /*#__PURE__*/React.createElement("span", {
    className: "mreg__st"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d"
  }), " Incompleto")), /*#__PURE__*/React.createElement("div", {
    className: "mreg__title"
  }, r.title), /*#__PURE__*/React.createElement("div", {
    className: "mreg__tags"
  }, r.tags.map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: `tag tag--${t.c}`
  }, t.t))), /*#__PURE__*/React.createElement("div", {
    className: "mreg__roles"
  }, r.roles.map(([k, label, name], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `mreg__role mreg__role--${k}`
  }, /*#__PURE__*/React.createElement("b", null, label), /*#__PURE__*/React.createElement("span", null, name)))), /*#__PURE__*/React.createElement("div", {
    className: "mreg__created"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "history"
  }), " Creado el: ", r.created)))));
}

/* ---------- DOCUMENTOS ---------- */
function MDocumentos() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    className: "mdocs__req"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mdocs__reqrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mdocs__sel"
  }, "Documentos requeridos ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevR"
  })), /*#__PURE__*/React.createElement("button", {
    className: "mdocs__new"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }), " Nueva lista")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mdocs__warn"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d"
  }), " A 1 lista le faltan documentos")), /*#__PURE__*/React.createElement("p", {
    className: "mdocs__hint"
  }, "Lleva el control de qu\xE9 documentos deben existir en esta carpeta.")), /*#__PURE__*/React.createElement("div", {
    className: "mtoggle3"
  }, /*#__PURE__*/React.createElement("button", {
    className: "is-active"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "partner"
  }), " Vista de tarjetas"), /*#__PURE__*/React.createElement("button", null, /*#__PURE__*/React.createElement(Icon, {
    name: "table"
  })), /*#__PURE__*/React.createElement("button", null, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mdoccard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mdoccard__hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "chk"
  }), /*#__PURE__*/React.createElement("b", null, "TRAMITES Y D\u2026"), /*#__PURE__*/React.createElement("span", {
    className: "mdoccard__v",
    style: {
      color: 'var(--ink-400)'
    }
  }, "0"), /*#__PURE__*/React.createElement("span", {
    className: "mdoccard__menu"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevR"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mdoccard__folder"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "folderBig"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mdoccard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mdoccard__hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "chk"
  }), /*#__PURE__*/React.createElement("b", null, "DEVOLUCI\xD3N \u2026"), /*#__PURE__*/React.createElement("span", {
    className: "mdoccard__v"
  }, "v1"), /*#__PURE__*/React.createElement("span", {
    className: "mdoccard__menu"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevR"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mdoccard__img"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mdoccard__bang"
  }, "!"))), /*#__PURE__*/React.createElement("div", {
    className: "mdoccard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mdoccard__hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "chk"
  }), /*#__PURE__*/React.createElement("b", null, "CERTIFICACI\xD3\u2026"), /*#__PURE__*/React.createElement("span", {
    className: "mdoccard__v"
  }, "v1"), /*#__PURE__*/React.createElement("span", {
    className: "mdoccard__menu"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevR"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mdoccard__preview"
  }, /*#__PURE__*/React.createElement("h5", null, "Checklist Dicovery adaptado SDRs"), /*#__PURE__*/React.createElement("p", null, "Nos definimos a partir de apertura porque para hacerlo bien, la parte de Discovery tiene que durar m\xE1ximo 15 minutos."), /*#__PURE__*/React.createElement("span", {
    className: "sit"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d"
  }), " S - Situation"), /*#__PURE__*/React.createElement("span", {
    className: "mdoccard__bang"
  }, "!"))));
}

/* ---------- OPENSEARCH ---------- */
function MOpenSearch() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mos__range"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar"
  }), " Last 1 year ", /*#__PURE__*/React.createElement("span", {
    className: "show"
  }, "Show dates"), /*#__PURE__*/React.createElement("span", {
    className: "ref"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "refresh"
  }))), /*#__PURE__*/React.createElement("section", {
    className: "mpanel mos__chart"
  }, /*#__PURE__*/React.createElement("h4", null, "Incidencias abiertas por mes"), /*#__PURE__*/React.createElement("span", {
    className: "mos__legend"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d",
    style: {
      background: '#34A88A'
    }
  }), " Incidencias"), /*#__PURE__*/React.createElement(MBarChart, {
    data: OS_OPEN,
    color: "#34A88A",
    max: 120
  })), /*#__PURE__*/React.createElement("section", {
    className: "mpanel mos__chart"
  }, /*#__PURE__*/React.createElement("h4", null, "Incidencias cerradas por mes"), /*#__PURE__*/React.createElement("span", {
    className: "mos__legend"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d",
    style: {
      background: '#C84B82'
    }
  }), " Incidencias"), /*#__PURE__*/React.createElement(MBarChart, {
    data: OS_CLOSED,
    color: "#C84B82",
    max: 40
  })));
}
Object.assign(window, {
  MInicio,
  MList,
  MKanban,
  MRegistros,
  MDocumentos,
  MOpenSearch
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/MobileScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ScreenBoards.jsx
try { (() => {
// Solved · App — Kanban + Month calendar (shared by Incidencias / Acciones)
function Kanban({
  module
}) {
  const cols = [{
    key: 'open',
    label: 'Abierto',
    n: 41,
    items: KANBAN.open
  }, {
    key: 'review',
    label: 'En Revisión',
    n: 4,
    items: KANBAN.review
  }, {
    key: 'closed',
    label: 'Cerrado',
    n: 24,
    items: KANBAN.closed
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "kb"
  }, cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.key,
    className: `kbcol kbcol--${c.key}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbcol__hd"
  }, c.label, /*#__PURE__*/React.createElement("span", {
    className: "cnt"
  }, c.n)), /*#__PURE__*/React.createElement("div", {
    className: "kbcards"
  }, c.items.map(it => /*#__PURE__*/React.createElement("article", {
    key: it.id,
    className: "kbcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbcard__top"
  }, /*#__PURE__*/React.createElement(Thumb, {
    img: it.img
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbcard__hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbcard__id"
  }, it.id), /*#__PURE__*/React.createElement("span", {
    className: "sp"
  }), /*#__PURE__*/React.createElement("span", {
    className: "kbcard__date"
  }, it.date)), /*#__PURE__*/React.createElement("p", null, it.desc), /*#__PURE__*/React.createElement("div", {
    className: "kbcard__foot"
  }, it.src && /*#__PURE__*/React.createElement("span", {
    className: it.srcType === 'reg' ? 'tag tag--violet' : 'chip-src'
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.srcType === 'reg' ? 'registro' : 'incidencia'
  }), " ", it.src), it.tag && /*#__PURE__*/React.createElement("span", {
    className: "chip-imm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.tag === 'Correctivo' ? 'wrench' : 'flame'
  }), " ", it.tag))))))))));
}
function MonthCalendar({
  module
}) {
  const isInc = module === 'inc';
  const dows = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  // junio 2026 starts on Monday (1 = Mon). 30 days.
  const cells = [];
  for (let d = 1; d <= 30; d++) cells.push(d);
  // trailing days of next month to fill the last row
  const trailing = (7 - 30 % 7) % 7;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lt",
    style: {
      marginTop: -2
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cal-w__nav"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cal-w__arr"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevL"
  })), /*#__PURE__*/React.createElement("button", {
    className: "cal-w__today"
  }, "Hoy"), /*#__PURE__*/React.createElement("button", {
    className: "cal-w__arr"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevR"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "cal-w__title"
  }, "junio 2026"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "toggle2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "is-active"
  }, "Mes"), /*#__PURE__*/React.createElement("button", null, "Semana"), /*#__PURE__*/React.createElement("button", null, "D\xEDa"), /*#__PURE__*/React.createElement("button", null, "Agenda"))), /*#__PURE__*/React.createElement("div", {
    className: "cal-w__legend",
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--ink-800)'
    }
  }, "Total 20"), /*#__PURE__*/React.createElement("span", {
    className: "lg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d",
    style: {
      background: 'var(--st-open)'
    }
  }), " Acciones abiertas 17"), /*#__PURE__*/React.createElement("span", {
    className: "lg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d",
    style: {
      background: 'var(--st-closed)'
    }
  }), " Acciones cerradas 1"), /*#__PURE__*/React.createElement("span", {
    className: "lg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d",
    style: {
      background: 'var(--st-review)'
    }
  }), " Acciones en revisi\xF3n 2")), /*#__PURE__*/React.createElement("div", {
    className: "month"
  }, /*#__PURE__*/React.createElement("div", {
    className: "month__grid"
  }, dows.map(d => /*#__PURE__*/React.createElement("div", {
    key: d,
    className: "month__dh"
  }, d)), cells.map(d => {
    const evs = MONTH_EVENTS[d] || [];
    const more = MONTH_MORE[d];
    return /*#__PURE__*/React.createElement("div", {
      key: d,
      className: `month__cell ${d === 10 ? 'is-today' : ''}`
    }, evs.length > 0 && /*#__PURE__*/React.createElement("span", {
      className: "cnt"
    }, evs.length + (more || 0)), /*#__PURE__*/React.createElement("span", {
      className: "n"
    }, d), /*#__PURE__*/React.createElement("div", {
      className: "month__ev"
    }, evs.map((e, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: `ev ev--${e.k}`
    }, /*#__PURE__*/React.createElement("b", null, e.id), e.t && /*#__PURE__*/React.createElement("span", null, e.t))), more && /*#__PURE__*/React.createElement("span", {
      className: "month__more"
    }, "+", more, " m\xE1s")));
  }), Array.from({
    length: trailing
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: `t${i}`,
    className: "month__cell is-out"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, i + 1))))));
}
window.Kanban = Kanban;
window.MonthCalendar = MonthCalendar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ScreenBoards.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ScreenInicio.jsx
try { (() => {
// Solved · App — Inicio (home dashboard)
function ScreenInicio({
  onNav
}) {
  const WEEK = [{
    wd: 'LUN',
    n: 8
  }, {
    wd: 'MAR',
    n: 9
  }, {
    wd: 'MIÉ',
    n: 10,
    today: true
  }, {
    wd: 'JUE',
    n: 11
  }, {
    wd: 'VIE',
    n: 12
  }, {
    wd: 'SÁB',
    n: 13
  }, {
    wd: 'DOM',
    n: 14
  }];
  const weekEvents = {
    8: [{
      id: 'UTD26_136_002',
      t: 'Producto el mal estad…',
      k: 'inc'
    }, {
      id: 'UTD26_134_GLO',
      t: 'Pendiente de …',
      k: 'inc'
    }, {
      id: 'UTD26_135_001',
      t: "KO en el: 'BUENAS PR…",
      k: 'inc'
    }, {
      id: 'UTD26_133_GLO',
      t: 'o',
      k: 'inc'
    }, {
      id: 'UTD26_AC_071_GLO',
      t: 'REGISTROS DE MAN…',
      k: 'acc'
    }],
    9: [{
      id: 'UTD26_139_NUT',
      t: 'no se sabe',
      k: 'inc'
    }, {
      id: 'UTD26_138_EXQ',
      t: '',
      k: 'inc'
    }, {
      id: 'UTD26_137_EXQ',
      t: '',
      k: 'inc'
    }],
    10: [{
      id: 'UTD26_140_002',
      t: 'No',
      k: 'inc'
    }]
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "home"
  }, /*#__PURE__*/React.createElement("div", {
    className: "home__main"
  }, /*#__PURE__*/React.createElement("section", {
    className: "panel greet"
  }, /*#__PURE__*/React.createElement("span", {
    className: "greet__av"
  }, "JA"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Buenas tardes, ", /*#__PURE__*/React.createElement("b", null, "javier.fernandez")), /*#__PURE__*/React.createElement("div", {
    className: "greet__meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar"
  }), " Mi\xE9rcoles, 10 de junio de 2026")), /*#__PURE__*/React.createElement("div", {
    className: "greet__meta",
    style: {
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "m",
    style: {
      color: 'var(--blue)',
      fontWeight: 600
    }
  }, "Solved"), /*#__PURE__*/React.createElement("span", {
    className: "m"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "incidencia"
  }), " 8"), /*#__PURE__*/React.createElement("span", {
    className: "m",
    style: {
      color: 'var(--accion)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "accion"
  }), " 3"), /*#__PURE__*/React.createElement("span", {
    className: "m",
    style: {
      color: 'var(--registro)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "registro"
  }), " 0"))), /*#__PURE__*/React.createElement("span", {
    className: "greet__sp"
  }), /*#__PURE__*/React.createElement("div", {
    className: "greet__actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "qa qa--inc",
    onClick: () => onNav('incidencias')
  }, /*#__PURE__*/React.createElement("span", {
    className: "qa__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "incidencia"
  })), " Crear incidencia"), /*#__PURE__*/React.createElement("button", {
    className: "qa qa--acc",
    onClick: () => onNav('acciones')
  }, /*#__PURE__*/React.createElement("span", {
    className: "qa__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "accion"
  })), " Crear acci\xF3n"), /*#__PURE__*/React.createElement("button", {
    className: "qa qa--reg",
    onClick: () => onNav('registros')
  }, /*#__PURE__*/React.createElement("span", {
    className: "qa__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "registro"
  })), " Realizar registro"), /*#__PURE__*/React.createElement("button", {
    className: "tb__ico",
    style: {
      color: 'var(--ink-400)'
    },
    "aria-label": "Ajustes"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "cog"
  })))), /*#__PURE__*/React.createElement("section", {
    className: "panel cal-w"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cal-w__hd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cal-w__nav"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cal-w__arr"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevL"
  })), /*#__PURE__*/React.createElement("button", {
    className: "cal-w__today"
  }, "Hoy"), /*#__PURE__*/React.createElement("button", {
    className: "cal-w__arr"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevR"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "cal-w__title"
  }, "8 al 14 de junio 2026"), /*#__PURE__*/React.createElement("span", {
    className: "cal-w__sp"
  }), /*#__PURE__*/React.createElement("div", {
    className: "toggle2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "is-active"
  }, "Semana"), /*#__PURE__*/React.createElement("button", null, "Agenda"))), /*#__PURE__*/React.createElement("div", {
    className: "cal-w__legend"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--ink-800)'
    }
  }, "Total 11"), /*#__PURE__*/React.createElement("span", {
    className: "lg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d",
    style: {
      background: 'var(--incidencia)'
    }
  }), " Incidencias abiertas 8"), /*#__PURE__*/React.createElement("span", {
    className: "lg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d",
    style: {
      background: 'var(--accion)'
    }
  }), " Acciones abiertas 3"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      color: 'var(--ink-400)',
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center'
    }
  }, "Fecha de creaci\xF3n")), /*#__PURE__*/React.createElement("div", {
    className: "weekgrid"
  }, WEEK.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.n,
    className: "weekgrid__day"
  }, /*#__PURE__*/React.createElement("div", {
    className: `weekgrid__dh ${d.today ? 'is-today' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "wd"
  }, d.wd), /*#__PURE__*/React.createElement("div", {
    className: "nu"
  }, d.n)), /*#__PURE__*/React.createElement("div", {
    className: "weekgrid__events"
  }, (weekEvents[d.n] || []).map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `ev ev--${e.k}`
  }, /*#__PURE__*/React.createElement("b", null, e.id), e.t && /*#__PURE__*/React.createElement("span", null, e.t)))))))), /*#__PURE__*/React.createElement("div", {
    className: "home__bottom"
  }, /*#__PURE__*/React.createElement("section", {
    className: "panel wcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wcard__hd"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "incidencia"
  }), /*#__PURE__*/React.createElement("h3", null, "Incidencias Abiertas"), /*#__PURE__*/React.createElement("span", {
    className: "sp"
  }), /*#__PURE__*/React.createElement("div", {
    className: "toggle2 toggle-cc"
  }, /*#__PURE__*/React.createElement("button", {
    className: "is-active"
  }, "Creaci\xF3n"), /*#__PURE__*/React.createElement("button", null, "Cierre"))), INCIDENCIAS.slice(0, 5).map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    className: "list-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "list-item__id"
  }, it.id), /*#__PURE__*/React.createElement("p", null, it.desc)))), /*#__PURE__*/React.createElement("section", {
    className: "panel wcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wcard__hd"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "accion"
  }), /*#__PURE__*/React.createElement("h3", null, "Acciones"), /*#__PURE__*/React.createElement("span", {
    className: "sp"
  }), /*#__PURE__*/React.createElement("div", {
    className: "toggle2 toggle-cc"
  }, /*#__PURE__*/React.createElement("button", {
    className: "is-active"
  }, "Creaci\xF3n"), /*#__PURE__*/React.createElement("button", null, "Cierre"))), ACCIONES.slice(0, 4).map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    className: "list-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "list-item__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "list-item__id list-item__id--acc"
  }, it.id), /*#__PURE__*/React.createElement("span", {
    className: "list-item__date"
  }, it.fc.split(' ')[0])), /*#__PURE__*/React.createElement("p", null, it.desc), it.flags && it.flags.includes('reg') && /*#__PURE__*/React.createElement("div", {
    className: "list-item__row",
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip-imm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flame"
  }), " Inmediato")), it.inc && /*#__PURE__*/React.createElement("div", {
    className: "list-item__row",
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip-src"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "incidencia"
  }), " ", it.inc.split(' ')[0]))))), /*#__PURE__*/React.createElement("section", {
    className: "panel wcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wcard__hd"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "registro"
  }), /*#__PURE__*/React.createElement("h3", null, "Registros pendientes")), REG_PENDIENTES.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.num,
    className: "list-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "list-item__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "list-item__dot"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 13
    }
  }, it.num), /*#__PURE__*/React.createElement("span", {
    className: "list-item__date"
  }, it.date)), /*#__PURE__*/React.createElement("p", null, it.t)))))), /*#__PURE__*/React.createElement("aside", {
    className: "home__side"
  }, /*#__PURE__*/React.createElement("section", {
    className: "panel wcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wcard__hd"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--warn)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star"
  })), /*#__PURE__*/React.createElement("h3", null, "Favoritos")), /*#__PURE__*/React.createElement(FavBlock, null))));
}
function FavBlock() {
  const [tab, setTab] = useState('inc');
  const items = FAVORITOS[tab];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "fav-tabs"
  }, /*#__PURE__*/React.createElement("span", {
    className: `fav-tab ${tab === 'inc' ? 'is-active' : ''}`,
    onClick: () => setTab('inc')
  }, "Incidencias (", FAVORITOS.inc.length, ")"), /*#__PURE__*/React.createElement("span", {
    className: `fav-tab ${tab === 'acc' ? 'is-active' : ''}`,
    onClick: () => setTab('acc')
  }, "Acciones (", FAVORITOS.acc.length, ")")), items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    className: "fav-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fav-item__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "star"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star"
  })), /*#__PURE__*/React.createElement("span", {
    className: "fav-item__id",
    style: tab === 'acc' ? {
      color: 'var(--accion)'
    } : null
  }, it.id), /*#__PURE__*/React.createElement("span", {
    className: "fav-item__date"
  }, it.date)), /*#__PURE__*/React.createElement("p", null, it.t))));
}
window.ScreenInicio = ScreenInicio;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ScreenInicio.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ScreenList.jsx
try { (() => {
// Solved · App — Incidencias / Acciones (Tabla · Calendario · Kanban)
function ScreenList({
  module
}) {
  const isInc = module === 'inc';
  const [view, setView] = useState('tabla'); // tabla | calendario | kanban
  const [status, setStatus] = useState('open'); // open | review | closed

  const counts = isInc ? {
    open: 130,
    review: 1,
    closed: 4
  } : {
    open: 41,
    review: 4,
    closed: 24
  };
  const addLabel = isInc ? 'Añadir Incidencia' : 'Crear Acción';
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lt"
  }, /*#__PURE__*/React.createElement("div", {
    className: "viewtabs"
  }, /*#__PURE__*/React.createElement("button", {
    className: `viewtab ${view === 'tabla' ? 'is-active' : ''}`,
    onClick: () => setView('tabla')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "table"
  }), " Tabla"), /*#__PURE__*/React.createElement("button", {
    className: `viewtab ${view === 'calendario' ? 'is-active' : ''}`,
    onClick: () => setView('calendario')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar"
  }), " Calendario"), /*#__PURE__*/React.createElement("button", {
    className: `viewtab ${view === 'kanban' ? 'is-active' : ''}`,
    onClick: () => setView('kanban')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "kanban"
  }), " Kanban")), /*#__PURE__*/React.createElement("div", {
    className: "statustabs"
  }, /*#__PURE__*/React.createElement("button", {
    className: `statustab ${status === 'open' ? 'is-active' : ''}`,
    onClick: () => setStatus('open')
  }, "Abierto ", /*#__PURE__*/React.createElement("span", {
    className: "cnt"
  }, counts.open)), /*#__PURE__*/React.createElement("button", {
    className: `statustab statustab--review ${status === 'review' ? 'is-active' : ''}`,
    onClick: () => setStatus('review')
  }, "En Revisi\xF3n ", /*#__PURE__*/React.createElement("span", {
    className: "cnt"
  }, counts.review)), /*#__PURE__*/React.createElement("button", {
    className: `statustab statustab--closed ${status === 'closed' ? 'is-active' : ''}`,
    onClick: () => setStatus('closed')
  }, "Cerrado ", /*#__PURE__*/React.createElement("span", {
    className: "cnt"
  }, counts.closed))), /*#__PURE__*/React.createElement("button", {
    className: `btn-add ${isInc ? '' : 'btn-add--accion'}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: isInc ? 'incidencia' : 'accion'
  }), " ", addLabel)), view === 'tabla' && /*#__PURE__*/React.createElement(ListTable, {
    module: module
  }), view === 'calendario' && /*#__PURE__*/React.createElement(MonthCalendar, {
    module: module
  }), view === 'kanban' && /*#__PURE__*/React.createElement(Kanban, {
    module: module
  }));
}
function SubToolbar({
  total,
  shown,
  pages
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "subt"
  }, /*#__PURE__*/React.createElement("button", {
    className: "subt__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search"
  })), /*#__PURE__*/React.createElement("button", {
    className: "subt__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "filter"
  })), /*#__PURE__*/React.createElement("button", {
    className: "subt__ico subt__ico--star"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star"
  })), /*#__PURE__*/React.createElement("button", {
    className: "subt__ico subt__ico--chart"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chart"
  })), /*#__PURE__*/React.createElement("span", {
    className: "subt__sp"
  }), /*#__PURE__*/React.createElement("div", {
    className: "subt__page"
  }, /*#__PURE__*/React.createElement("span", null, "Mostrar:"), /*#__PURE__*/React.createElement("select", {
    defaultValue: shown
  }, /*#__PURE__*/React.createElement("option", null, "20"), /*#__PURE__*/React.createElement("option", null, "50"), /*#__PURE__*/React.createElement("option", null, "100")), /*#__PURE__*/React.createElement("span", {
    className: "subt__range"
  }, "1\u2013", shown, " de ", total), /*#__PURE__*/React.createElement("button", {
    className: "pgbtn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "first"
  })), /*#__PURE__*/React.createElement("button", {
    className: "pgbtn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevL"
  })), pages.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: `pgbtn ${p === 1 ? 'is-active' : ''}`
  }, p)), /*#__PURE__*/React.createElement("button", {
    className: "pgbtn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevR"
  })), /*#__PURE__*/React.createElement("button", {
    className: "pgbtn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "last"
  }))));
}
function ListTable({
  module
}) {
  const isInc = module === 'inc';
  if (isInc) {
    return /*#__PURE__*/React.createElement("div", {
      className: "panel"
    }, /*#__PURE__*/React.createElement(SubToolbar, {
      total: 130,
      shown: 50,
      pages: [1, 2, 3]
    }), /*#__PURE__*/React.createElement("table", {
      className: "tbl"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        width: 70
      }
    }), /*#__PURE__*/React.createElement("th", null, "Descripci\xF3n"), /*#__PURE__*/React.createElement("th", null, "Creador"), /*#__PURE__*/React.createElement("th", {
      className: "c"
    }, "Prioridad"), /*#__PURE__*/React.createElement("th", null, "Fecha de creaci\xF3n"), /*#__PURE__*/React.createElement("th", null, "Fecha de cierre"))), /*#__PURE__*/React.createElement("tbody", null, INCIDENCIAS.map(it => /*#__PURE__*/React.createElement("tr", {
      key: it.id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "tbl__lead"
    }, /*#__PURE__*/React.createElement("span", {
      className: "tbl__check"
    }), /*#__PURE__*/React.createElement("span", {
      className: "tbl__star"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "star"
    })))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "tbl__lead"
    }, /*#__PURE__*/React.createElement(Thumb, {
      img: it.img
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "tbl__id tbl__id--inc"
    }, it.id, " ", /*#__PURE__*/React.createElement("span", {
      className: `dot-st dot-st--${it.st}`
    })), /*#__PURE__*/React.createElement("div", {
      className: "tbl__desc"
    }, it.desc)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "who"
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: it.creador
    }), " ", it.creador)), /*#__PURE__*/React.createElement("td", {
      className: "c"
    }, /*#__PURE__*/React.createElement(PrioBadge, {
      p: it.prio
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "date-c"
    }, it.fc)), /*#__PURE__*/React.createElement("td", null, it.fx ? /*#__PURE__*/React.createElement("span", {
      className: "date-x"
    }, it.fx) : ''))))));
  }
  // Acciones
  return /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement(SubToolbar, {
    total: 41,
    shown: 100,
    pages: [1]
  }), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: 70
    }
  }), /*#__PURE__*/React.createElement("th", null, "Descripci\xF3n"), /*#__PURE__*/React.createElement("th", null, "Fecha de creaci\xF3n"), /*#__PURE__*/React.createElement("th", null, "Responsable"), /*#__PURE__*/React.createElement("th", null, "Fecha de cierre"), /*#__PURE__*/React.createElement("th", null, "Resultado"), /*#__PURE__*/React.createElement("th", null, "Incidencia"))), /*#__PURE__*/React.createElement("tbody", null, ACCIONES.map(it => /*#__PURE__*/React.createElement("tr", {
    key: it.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "tbl__lead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tbl__check"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tbl__star"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star"
  })))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "tbl__lead"
  }, /*#__PURE__*/React.createElement(Thumb, {
    img: it.img
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "tbl__id tbl__id--acc"
  }, it.id, /*#__PURE__*/React.createElement("span", {
    className: "tbl__mini"
  }, it.flags && it.flags.includes('reg') && /*#__PURE__*/React.createElement(Icon, {
    name: "registro"
  }), it.flags && it.flags.includes('doc') && /*#__PURE__*/React.createElement(Icon, {
    name: "incidencia"
  }), it.flags && it.flags.includes('wrench') && /*#__PURE__*/React.createElement(Icon, {
    name: "wrench"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "tbl__desc"
  }, it.desc)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "date-c"
  }, it.fc)), /*#__PURE__*/React.createElement("td", null, it.resp ? /*#__PURE__*/React.createElement("span", {
    className: "who"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: it.resp
  }), " ", it.resp) : /*#__PURE__*/React.createElement("span", {
    className: "who"
  }, /*#__PURE__*/React.createElement(Avatar, {
    dash: true
  }), " A Definir")), /*#__PURE__*/React.createElement("td", null, it.fx ? /*#__PURE__*/React.createElement("span", {
    className: "date-x"
  }, it.fx) : ''), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "tbl__desc",
    style: {
      maxWidth: '32ch'
    }
  }, it.inc)))))));
}
function PrioBadge({
  p
}) {
  if (p === 'media') return /*#__PURE__*/React.createElement("span", {
    className: "pri pri--media"
  }, "Media");
  if (p === 'def') return /*#__PURE__*/React.createElement("span", {
    className: "pri pri--def"
  }, "A Definir");
  return /*#__PURE__*/React.createElement("span", {
    className: "pri pri--empty"
  }, "(Vac\xEDo)");
}
window.ScreenList = ScreenList;
window.PrioBadge = PrioBadge;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ScreenList.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ScreenMore.jsx
try { (() => {
// Solved · App — Registros (timeline list) + Documentos + OpenSearch
function ScreenRegistros() {
  const [tab, setTab] = useState('pend'); // pend | plan | hist
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lt"
  }, /*#__PURE__*/React.createElement("div", {
    className: "viewtabs"
  }, /*#__PURE__*/React.createElement("button", {
    className: "viewtab is-active"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "table"
  }), " Lista"), /*#__PURE__*/React.createElement("button", {
    className: "viewtab"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar"
  }), " Calendario")), /*#__PURE__*/React.createElement("div", {
    className: "statustabs"
  }, /*#__PURE__*/React.createElement("button", {
    className: `statustab ${tab === 'pend' ? 'is-active' : ''}`,
    onClick: () => setTab('pend')
  }, "Pendientes ", /*#__PURE__*/React.createElement("span", {
    className: "cnt"
  }, "100")), /*#__PURE__*/React.createElement("button", {
    className: `statustab ${tab === 'plan' ? 'is-active' : ''}`,
    onClick: () => setTab('plan')
  }, "Planificados ", /*#__PURE__*/React.createElement("span", {
    className: "cnt"
  }, "296")), /*#__PURE__*/React.createElement("button", {
    className: `statustab ${tab === 'hist' ? 'is-active' : ''}`,
    onClick: () => setTab('hist')
  }, "Historial ", /*#__PURE__*/React.createElement("span", {
    className: "cnt"
  }, "30"))), /*#__PURE__*/React.createElement("button", {
    className: "btn-add btn-add--accion",
    style: {
      borderColor: '#C9A8F0',
      color: 'var(--registro)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "registro"
  }), " Empezar uno")), /*#__PURE__*/React.createElement("div", {
    className: "subt panel",
    style: {
      borderRadius: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "toggle2",
    style: {
      marginRight: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "is-active"
  }, "Detallada"), /*#__PURE__*/React.createElement("button", null, "Compacta")), /*#__PURE__*/React.createElement("button", {
    className: "subt__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search"
  })), /*#__PURE__*/React.createElement("button", {
    className: "subt__ico",
    style: {
      color: 'var(--accion)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sort"
  })), /*#__PURE__*/React.createElement("button", {
    className: "subt__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "filter"
  })), /*#__PURE__*/React.createElement("span", {
    className: "subt__sp"
  }), /*#__PURE__*/React.createElement("div", {
    className: "subt__page"
  }, /*#__PURE__*/React.createElement("span", null, "Mostrar:"), /*#__PURE__*/React.createElement("select", {
    defaultValue: "20"
  }, /*#__PURE__*/React.createElement("option", null, "20"), /*#__PURE__*/React.createElement("option", null, "50")), /*#__PURE__*/React.createElement("span", {
    className: "subt__range"
  }, "1\u201320 de 100"), /*#__PURE__*/React.createElement("button", {
    className: "pgbtn is-active"
  }, "1"), /*#__PURE__*/React.createElement("button", {
    className: "pgbtn"
  }, "2"), /*#__PURE__*/React.createElement("button", {
    className: "pgbtn"
  }, "3"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-400)'
    }
  }, "\u2026"), /*#__PURE__*/React.createElement("button", {
    className: "pgbtn"
  }, "5"), /*#__PURE__*/React.createElement("button", {
    className: "pgbtn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevR"
  })))), REGISTROS.map(r => /*#__PURE__*/React.createElement(React.Fragment, {
    key: r.num
  }, /*#__PURE__*/React.createElement("div", {
    className: "regdate"
  }, /*#__PURE__*/React.createElement("span", {
    className: "regdate__pill"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar"
  }), " ", r.date)), /*#__PURE__*/React.createElement("div", {
    className: "regrow"
  }, /*#__PURE__*/React.createElement("img", {
    className: "regrow__thumb",
    src: THUMBS.warehouse,
    alt: "",
    onError: e => {
      e.target.style.visibility = 'hidden';
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "regrow__main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "regrow__hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "regrow__num"
  }, r.num), /*#__PURE__*/React.createElement("span", {
    className: "regrow__title"
  }, r.title)), /*#__PURE__*/React.createElement("div", {
    className: "regrow__meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "regrow__st"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d"
  }), " Incompleto"), r.tags.map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: `tag tag--${t.c}`
  }, t.t)), /*#__PURE__*/React.createElement("span", {
    className: "regrow__created"
  }, "Creado el: ", r.created))), /*#__PURE__*/React.createElement("div", {
    className: "regrow__roles"
  }, r.roles.map(([k, label, name], i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: `rolechip rolechip--${k}`
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: name
  }), /*#__PURE__*/React.createElement("span", {
    className: "rolechip__t"
  }, /*#__PURE__*/React.createElement("b", null, label), /*#__PURE__*/React.createElement("span", null, name))))), /*#__PURE__*/React.createElement("span", {
    className: "regrow__chev"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevR"
  }))))));
}
function ScreenDocumentos() {
  return /*#__PURE__*/React.createElement("div", {
    className: "dms"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "panel dms__folders"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dms__fhd"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "folder"
  }), " Carpetas ", /*#__PURE__*/React.createElement("span", {
    className: "sp"
  }), /*#__PURE__*/React.createElement("button", {
    className: "subt__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dms__home is-active"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "home"
  }), " Todos los Documentos ", /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, "2")), /*#__PURE__*/React.createElement("div", {
    className: "dms__tree"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dms__node"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "folder"
  }), " PLAN DE ASEGURA\u2026 ", /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, "2")), /*#__PURE__*/React.createElement("div", {
    className: "dms__node dms__node--child"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "folder"
  }), " TRAMITES Y DO\u2026 ", /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, "0")), /*#__PURE__*/React.createElement("div", {
    className: "dms__node pdf dms__node--child"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "filePdf"
  }), " CERTIFICACI\xD3N FINAL DE OBRA (LIQUIDACI\xD3N)"), /*#__PURE__*/React.createElement("div", {
    className: "dms__node pdf dms__node--child"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "filePdf"
  }), " DEVOLUCI\xD3N DE AVALES"))), /*#__PURE__*/React.createElement("section", {
    className: "panel dms__main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dms__mhd"
  }, /*#__PURE__*/React.createElement("h2", null, "Todos los Documentos"), /*#__PURE__*/React.createElement("span", {
    className: "sp"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn-upload"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload"
  }), " Subir Nuevo Documento")), /*#__PURE__*/React.createElement("div", {
    className: "subt",
    style: {
      border: 'none',
      padding: '0 0 14px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "subt__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search"
  })), /*#__PURE__*/React.createElement("button", {
    className: "subt__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "history"
  })), /*#__PURE__*/React.createElement("button", {
    className: "subt__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "link"
  })), /*#__PURE__*/React.createElement("button", {
    className: "subt__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sort"
  })), /*#__PURE__*/React.createElement("button", {
    className: "subt__ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "filter"
  })), /*#__PURE__*/React.createElement("button", {
    className: "subt__ico subt__ico--star"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "toggle2",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "is-active"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "partner"
  }), " Vista de tarjetas"), /*#__PURE__*/React.createElement("button", null, "Vista de tabla"), /*#__PURE__*/React.createElement("button", null, "Vista de calendario")), /*#__PURE__*/React.createElement("div", {
    className: "dms__cards"
  }, /*#__PURE__*/React.createElement("article", {
    className: "foldercard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "foldercard__hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tbl__check"
  }), /*#__PURE__*/React.createElement("b", null, "PLAN DE ASEGURAMIENTO DE LA \u2026"), /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, "2")), /*#__PURE__*/React.createElement("div", {
    className: "foldercard__body"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "folderBig"
  }))))));
}
function ScreenOpenSearch() {
  const fields = ['Creador', 'Prioridad', 'Estado', 'Categoría', 'Responsable'];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "os__bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "os__sp"
  }), /*#__PURE__*/React.createElement("div", {
    className: "os__range"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, "Last 1 year"), /*#__PURE__*/React.createElement("span", {
    className: "show"
  }, "Show dates")), /*#__PURE__*/React.createElement("button", {
    className: "os__refresh"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "refresh"
  }), " Refresh")), /*#__PURE__*/React.createElement("section", {
    className: "panel os__filters"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kicker"
  }, "Filtros"), /*#__PURE__*/React.createElement("div", {
    className: "os__fgrid"
  }, fields.map(f => /*#__PURE__*/React.createElement("div", {
    key: f,
    className: "os__field"
  }, /*#__PURE__*/React.createElement("label", null, f), /*#__PURE__*/React.createElement("div", {
    className: "sel"
  }, "Select\u2026 ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevR"
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "os__charts"
  }, /*#__PURE__*/React.createElement("section", {
    className: "panel os__chart"
  }, /*#__PURE__*/React.createElement("h4", null, "Incidencias abiertas por mes"), /*#__PURE__*/React.createElement(BarChart, {
    data: OS_OPEN,
    color: "#34A88A",
    max: 120
  }), /*#__PURE__*/React.createElement("span", {
    className: "os__legend"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d",
    style: {
      background: '#34A88A'
    }
  }), " Incidencias"), /*#__PURE__*/React.createElement("table", {
    className: "ostbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Fecha de creaci\xF3n"), /*#__PURE__*/React.createElement("th", null, "Incidencias"))), /*#__PURE__*/React.createElement("tbody", null, OS_OPEN.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.x
  }, /*#__PURE__*/React.createElement("td", null, r.x), /*#__PURE__*/React.createElement("td", null, r.v)))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null, "140"))))), /*#__PURE__*/React.createElement("section", {
    className: "panel os__chart"
  }, /*#__PURE__*/React.createElement("h4", null, "Incidencias cerradas por mes"), /*#__PURE__*/React.createElement(BarChart, {
    data: OS_CLOSED,
    color: "#C84B82",
    max: 40
  }), /*#__PURE__*/React.createElement("span", {
    className: "os__legend"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d",
    style: {
      background: '#C84B82'
    }
  }), " Incidencias"), /*#__PURE__*/React.createElement("table", {
    className: "ostbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Fecha de cierre"), /*#__PURE__*/React.createElement("th", null, "Incidencias"))), /*#__PURE__*/React.createElement("tbody", null, OS_CLOSED.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.x
  }, /*#__PURE__*/React.createElement("td", null, r.x), /*#__PURE__*/React.createElement("td", null, r.v)))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null, "47")))))));
}
function BarChart({
  data,
  color,
  max
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "bars"
  }, data.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.x,
    className: "bars__col"
  }, /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, d.v), /*#__PURE__*/React.createElement("div", {
    className: "bars__bar",
    style: {
      height: `${d.v / max * 100}%`,
      background: color
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "bars__x"
  }, d.x))));
}
window.ScreenRegistros = ScreenRegistros;
window.ScreenDocumentos = ScreenDocumentos;
window.ScreenOpenSearch = ScreenOpenSearch;
window.BarChart = BarChart;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ScreenMore.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Shell.jsx
try { (() => {
// Solved · App — shell: blue top bar + white sidebar + routing
const {
  useState
} = React;
const NAV = [{
  id: 'socio',
  label: 'Inicio de Socio',
  icon: 'partner'
}, {
  id: 'inicio',
  label: 'Inicio',
  icon: 'home'
}, {
  id: 'incidencias',
  label: 'Incidencias',
  icon: 'incidencia'
}, {
  id: 'acciones',
  label: 'Acciones',
  icon: 'accion'
}, {
  id: 'registros',
  label: 'Registros',
  icon: 'registro'
}, {
  id: 'ai',
  label: 'AI',
  icon: 'ai'
}, {
  id: 'opensearch',
  label: 'OpenSearch',
  icon: 'chart'
}, {
  id: 'informes',
  label: 'Informes',
  icon: 'informe'
}, {
  id: 'documentos',
  label: 'Documentos',
  icon: 'folder'
}];
const TITLES = {
  socio: 'Inicio de Socio',
  inicio: 'Inicio',
  incidencias: 'Incidencias',
  acciones: 'Acciones',
  registros: 'Registros',
  ai: 'AI',
  opensearch: 'Inicio',
  informes: 'Informes',
  documentos: 'Documentos'
};
function TopBar({
  title,
  onBurger
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "tb"
  }, /*#__PURE__*/React.createElement("button", {
    className: "tb__burger",
    onClick: onBurger,
    "aria-label": "Men\xFA"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "menu"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tb__brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logotipo-solved.png",
    alt: "Solved"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tb__title"
  }, title), /*#__PURE__*/React.createElement("span", {
    className: "tb__sp"
  }), /*#__PURE__*/React.createElement("button", {
    className: "tb__ico",
    "aria-label": "Notificaciones"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell"
  })), /*#__PURE__*/React.createElement("button", {
    className: "tb__ico",
    "aria-label": "Mensajes"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chat"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tb__avatar"
  }, "j"));
}
function Sidebar({
  route,
  onNav,
  mini
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: `side ${mini ? 'side--mini' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "side__acct"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side__thumb"
  }), /*#__PURE__*/React.createElement("b", {
    className: "side__txt"
  }, "Ultimate Demo 6")), /*#__PURE__*/React.createElement("nav", {
    className: "side__nav"
  }, NAV.map(n => /*#__PURE__*/React.createElement("button", {
    key: n.id,
    className: `side__link ${route === n.id ? 'is-active' : ''}`,
    onClick: () => onNav(n.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: n.icon
  }), /*#__PURE__*/React.createElement("span", {
    className: "side__txt"
  }, n.label)))), /*#__PURE__*/React.createElement("div", {
    className: "side__spacer"
  }), !mini && /*#__PURE__*/React.createElement("div", {
    className: "side__acctbox"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side__acctbox-hd"
  }, /*#__PURE__*/React.createElement("b", null, "Cambiar de cuenta"), /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, "3")), /*#__PURE__*/React.createElement("span", null, "Ultimate Demo 6"), /*#__PURE__*/React.createElement("div", {
    className: "side__search"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search"
  }), " Escribe para buscar\u2026")), /*#__PURE__*/React.createElement("div", {
    className: "side__trash"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash"
  }), /*#__PURE__*/React.createElement("span", {
    className: "side__txt"
  }, "Papelera")));
}
function App() {
  const [route, setRoute] = useState('inicio');
  const [mini, setMini] = useState(false);
  let screen;
  switch (route) {
    case 'inicio':
      screen = /*#__PURE__*/React.createElement(ScreenInicio, {
        onNav: setRoute
      });
      break;
    case 'incidencias':
      screen = /*#__PURE__*/React.createElement(ScreenList, {
        module: "inc"
      });
      break;
    case 'acciones':
      screen = /*#__PURE__*/React.createElement(ScreenList, {
        module: "acc"
      });
      break;
    case 'registros':
      screen = /*#__PURE__*/React.createElement(ScreenRegistros, null);
      break;
    case 'opensearch':
      screen = /*#__PURE__*/React.createElement(ScreenOpenSearch, null);
      break;
    case 'documentos':
      screen = /*#__PURE__*/React.createElement(ScreenDocumentos, null);
      break;
    default:
      screen = /*#__PURE__*/React.createElement(ScreenPlaceholder, {
        route: route
      });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "sv"
  }, /*#__PURE__*/React.createElement(TopBar, {
    title: TITLES[route],
    onBurger: () => setMini(m => !m)
  }), /*#__PURE__*/React.createElement("div", {
    className: `sv__body ${mini ? 'sv__body--collapsed' : ''}`
  }, /*#__PURE__*/React.createElement(Sidebar, {
    route: route,
    onNav: setRoute,
    mini: mini
  }), /*#__PURE__*/React.createElement("main", {
    className: "screen"
  }, screen)), /*#__PURE__*/React.createElement("button", {
    className: "sv__fab",
    "aria-label": "Crear"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  })));
}
function ScreenPlaceholder({
  route
}) {
  const labels = {
    socio: 'Inicio de Socio',
    ai: 'AI',
    informes: 'Informes'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      padding: 48,
      textAlign: 'center',
      color: 'var(--ink-400)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      color: 'var(--ink-600)',
      margin: '0 0 6px'
    }
  }, labels[route]), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "M\xF3dulo no incluido en este kit de demostraci\xF3n."));
}
window.App = App;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.jsx
try { (() => {
// Solved · App — mock data sampled from the live "Ultimate Demo 6" account
const INCIDENCIAS = [{
  id: 'UTD26_140_002',
  desc: 'No',
  st: 'open',
  creador: 'Javier',
  prio: 'media',
  fc: '13:06',
  fx: '00:00',
  img: null
}, {
  id: 'UTD26_139_NUT',
  desc: 'no se sabe',
  st: 'none',
  creador: 'javier.fernand…',
  prio: 'empty',
  fc: '09/06/2026 12:26',
  fx: null,
  img: null
}, {
  id: 'UTD26_138_EXQ',
  desc: 'Producto cítrico fuera de especificación',
  st: 'none',
  creador: 'javier.fernand…',
  prio: 'empty',
  fc: '09/06/2026 10:12',
  fx: null,
  img: 'oranges'
}, {
  id: 'UTD26_137_EXQ',
  desc: '—',
  st: 'none',
  creador: 'Javier',
  prio: 'empty',
  fc: '09/06/2026 10:07',
  fx: null,
  img: null
}, {
  id: 'UTD26_136_002',
  desc: 'Producto el mal estado. mal olor',
  st: 'open',
  creador: 'Javier',
  prio: 'media',
  fc: '08/06/2026 13:07',
  fx: '08/06/2026 00:00',
  img: 'bread'
}, {
  id: 'UTD26_135_001',
  desc: "KO en el: 'BUENAS PRACTICAS: ESTANTERIAS', del registro: Control Almacenes - ID: 26_108",
  st: 'none',
  creador: 'javier.fernand…',
  prio: 'def',
  fc: '08/06/2026 12:26',
  fx: null,
  img: null
}, {
  id: 'UTD26_134_GLO',
  desc: 'Pendiente de …',
  st: 'none',
  creador: 'Javier',
  prio: 'empty',
  fc: '08/06/2026 12:17',
  fx: null,
  img: null
}, {
  id: 'UTD26_133_GLO',
  desc: 'o',
  st: 'none',
  creador: 'javier.fernand…',
  prio: 'empty',
  fc: '08/06/2026 11:46',
  fx: null,
  img: 'egg'
}, {
  id: 'UTD26_132_002',
  desc: 'KO en el: BUENAS PRACTICAS: REVISION PALETS DE MADERA CORRECTOS SIN …',
  st: 'none',
  creador: 'javier.fernand…',
  prio: 'def',
  fc: '04/06/2026 16:20',
  fx: null,
  img: 'grain'
}, {
  id: 'UTD26_131_002',
  desc: 'Fallo en contenido efectivo',
  st: 'open',
  creador: 'Javier',
  prio: 'media',
  fc: '04/06/2026 16:07',
  fx: null,
  img: 'grain'
}, {
  id: 'UTD26_130_002',
  desc: 'Producto en mal estado',
  st: 'open',
  creador: 'Javier',
  prio: 'media',
  fc: '04/06/2026 14:06',
  fx: '04/06/2026 00:00',
  img: 'bread'
}, {
  id: 'UTD26_128_ANG',
  desc: 'Producto llega con moho por temperatura inadecuada',
  st: 'open',
  creador: 'javier.fernand…',
  prio: 'media',
  fc: '03/06/2026 14:58',
  fx: null,
  img: 'egg'
}];
const ACCIONES = [{
  id: 'UTD26_AC_071_GLO',
  desc: 'REGISTROS DE MANTENIMIENTOS - ID: 26_110 - ¿Existe avería?…',
  flags: ['reg', 'wrench'],
  fc: '08/06/2026 13:22',
  resp: null,
  fx: null,
  inc: '',
  img: null
}, {
  id: 'UTD26_AC_070_002',
  desc: 'Retirar producto',
  flags: ['doc'],
  fc: '08/06/2026 13:13',
  resp: 'Javier',
  fx: null,
  inc: 'UTD26_136_002 Producto el mal estado. mal olor',
  img: 'bread'
}, {
  id: 'UTD26_AC_069_GLO',
  desc: 'test',
  flags: ['doc'],
  fc: '08/06/2026 12:23',
  resp: null,
  fx: null,
  inc: 'UTD26_134_GLO Pendiente de …',
  img: null
}, {
  id: 'UTD26_AC_068_002',
  desc: 'test',
  flags: ['doc'],
  fc: '04/06/2026 16:15',
  resp: null,
  fx: null,
  inc: 'UTD26_131_002 Fallo en contenido efectivo',
  img: 'grain'
}, {
  id: 'UTD26_AC_067_ANG',
  desc: 'test',
  flags: ['doc', 'wrench'],
  fc: '04/06/2026 16:13',
  resp: null,
  fx: null,
  inc: 'UTD26_129_ANG Producto llega con moho por temperatura inadecuada',
  img: 'grain'
}, {
  id: 'UTD26_AC_065_002',
  desc: 'test',
  flags: ['doc'],
  fc: '04/06/2026 14:09',
  resp: 'Javier',
  fx: null,
  inc: 'UTD26_130_002 Producto en mal estado',
  img: 'bread'
}, {
  id: 'UTD26_AC_064_ANG',
  desc: 'Retirada del producto',
  flags: ['doc', 'wrench'],
  fc: '03/06/2026 15:13',
  resp: null,
  fx: null,
  inc: 'UTD26_129_ANG Producto llega con moho por temperatura inadecuada',
  img: 'grain'
}, {
  id: 'UTD26_AC_062_REC',
  desc: 'Retirar palet',
  flags: ['doc', 'wrench'],
  fc: '02/06/2026 16:23',
  resp: null,
  fx: null,
  inc: 'UTD26_124_REC Palet en mal estado',
  img: 'pizza'
}, {
  id: 'UTD26_AC_061_REC',
  desc: 'Rechazo del pedido',
  flags: ['doc', 'wrench'],
  fc: '02/06/2026 13:11',
  resp: null,
  fx: null,
  inc: 'UTD26_123_REC Palet roto. Cntenido dañado',
  img: 'bread'
}, {
  id: 'UTD26_AC_060_002',
  desc: 'Desclasificar',
  flags: ['doc'],
  fc: '02/06/2026 10:11',
  resp: 'Javier',
  fx: '03/06/2026 00:00',
  inc: 'UTD26_122_002 Peaje bajo',
  img: 'bun'
}, {
  id: 'UTD26_AC_059_002',
  desc: 'Retirar palet. Ver si reparar o tirar.',
  flags: ['doc'],
  fc: '02/06/2026 09:16',
  resp: 'Javier',
  fx: '03/06/2026 12:00',
  inc: 'UTD26_120_002 Rotura de palet al transportarlo de una ubicación a otra',
  img: 'cookie'
}, {
  id: 'UTD26_AC_058_002',
  desc: 'Retirada del producto',
  flags: ['doc'],
  fc: '01/06/2026 17:13',
  resp: null,
  fx: '01/06/2026 17:30',
  inc: 'UTD26_118_002 producto en mal estado',
  img: 'bread'
}];
const KANBAN = {
  open: [{
    id: 'UTD26_AC_071_GLO',
    date: '08/06/2026 13:22',
    desc: 'REGISTROS DE MANTENIMIENTOS - ID: 26_110 - ¿Existe avería? Arreglar máquina',
    src: '26_110',
    srcType: 'reg',
    tag: 'Inmediato',
    img: null
  }, {
    id: 'UTD26_AC_070_002',
    date: '08/06/2026 13:13',
    desc: 'Retirar producto',
    src: 'UTD26_136_002',
    img: 'bread'
  }, {
    id: 'UTD26_AC_069_GLO',
    date: '08/06/2026 12:23',
    desc: 'test',
    src: 'UTD26_134_GLO',
    img: null
  }, {
    id: 'UTD26_AC_068_002',
    date: '04/06/2026 16:15',
    desc: 'test',
    src: 'UTD26_131_002',
    img: 'grain'
  }, {
    id: 'UTD26_AC_067_ANG',
    date: '04/06/2026 16:13',
    desc: 'test',
    src: 'UTD26_129_ANG',
    tag: 'Correctivo',
    img: 'grain'
  }, {
    id: 'UTD26_AC_065_002',
    date: '04/06/2026 14:09',
    desc: 'test',
    src: 'UTD26_130_002',
    img: 'bread'
  }, {
    id: 'UTD26_AC_064_ANG',
    date: '03/06/2026 15:13',
    desc: 'Retirada del producto',
    src: 'UTD26_129_ANG',
    tag: 'Inmediato',
    img: 'grain'
  }],
  review: [{
    id: 'UTD26_AC_063_002',
    date: '03/06/2026 12:10',
    desc: 'Retirar mercancía afectada',
    src: 'UTD26_125_002',
    img: 'meat'
  }, {
    id: 'UTD26_AC_052_002',
    date: '01/06/2026 11:13',
    desc: 'Ajustar temperatura máquina',
    src: 'UTD26_112_002',
    img: 'fish'
  }, {
    id: 'UTD26_AC_037_001',
    date: '26/05/2026 16:51',
    desc: 'Reparar y planificar preventivo adelantado',
    src: 'UTD26_087_001',
    img: null
  }, {
    id: 'UTD26_AC_034',
    date: '25/05/2026 16:54',
    desc: 'Pedir pieza rota empaquetadora',
    src: 'UTD26_081_REC',
    img: null
  }],
  closed: [{
    id: 'UTD26_AC_066_002',
    date: '04/06/2026 16:12',
    desc: 'Regular nivel',
    src: 'UTD26_131_002',
    img: 'grain'
  }, {
    id: 'TEMP_AC_UTD26',
    date: '29/05/2026 19:00',
    desc: 'He arreglado la máquina pero no he pedido la pieza',
    src: 'UTD26_110_001',
    img: null
  }, {
    id: 'UTD26_AC_048_002',
    date: '28/05/2026 12:12',
    desc: 'Retirada de la mercancía afectada',
    src: 'UTD26_104_002',
    img: 'warehouse'
  }, {
    id: 'UTD26_AC_032_002',
    date: '22/05/2026 12:35',
    desc: 'Retirada del producto',
    src: 'UTD26_078_002',
    img: null
  }, {
    id: 'UTD26_AC_028_001',
    date: '20/05/2026 15:22',
    desc: 'Limpiar zona',
    src: 'UTD26_068_001',
    img: null
  }, {
    id: 'UTD26_AC_026_001',
    date: '20/05/2026 14:13',
    desc: 'contactar servicio técnico',
    src: 'UTD26_064_001',
    img: null
  }, {
    id: 'UTD26_AC_025_001',
    date: '19/05/2026 16:20',
    desc: 'Retirada de lote defectuoso 45678g5rt',
    src: 'UTD26_059_001',
    img: null
  }]
};

// Month calendar (junio 2026) — events keyed by day-of-month
const MONTH_EVENTS = {
  1: [{
    id: 'UTD26_AC_058_002',
    t: 'Retirada del producto',
    k: 'inc',
    doc: true
  }, {
    id: 'UTD26_AC_057_VRI',
    t: 'Mantenimiento arregla cinta',
    k: 'inc',
    wrench: true
  }, {
    id: 'UTD26_AC_056_VRI',
    t: 'Declaración de merma',
    k: 'inc',
    wrench: true
  }],
  2: [{
    id: 'UTD26_AC_062_REC',
    t: 'Retirar palet',
    k: 'inc',
    wrench: true
  }, {
    id: 'UTD26_AC_061_REC',
    t: 'Rechazo del pedido',
    k: 'inc',
    wrench: true
  }, {
    id: 'UTD26_AC_060_002',
    t: 'Desclasificar',
    k: 'inc',
    doc: true
  }],
  3: [{
    id: 'UTD26_AC_064_ANG',
    t: 'Retirada del producto',
    k: 'inc',
    wrench: true
  }, {
    id: 'UTD26_AC_063_002',
    t: 'Retirar mercancía afectada',
    k: 'review',
    doc: true
  }],
  4: [{
    id: 'UTD26_AC_068_002',
    t: 'test',
    k: 'inc',
    doc: true
  }, {
    id: 'UTD26_AC_067_ANG',
    t: 'test',
    k: 'inc',
    wrench: true
  }, {
    id: 'UTD26_AC_066_002',
    t: 'Regular nivel',
    k: 'closed',
    doc: true
  }],
  8: [{
    id: 'UTD26_AC_071_GLO',
    t: 'REGISTROS DE MANTENIMIENTOS - ID: 2…',
    k: 'inc',
    reg: true,
    wrench: true
  }, {
    id: 'UTD26_AC_070_002',
    t: 'Retirar producto',
    k: 'inc',
    doc: true
  }, {
    id: 'UTD26_AC_069_GLO',
    t: 'test',
    k: 'inc',
    doc: true
  }]
};
const MONTH_MORE = {
  1: 4,
  2: 1,
  4: 1
};
const REGISTROS = [{
  date: '06 JUL 2026',
  num: '26_010',
  title: 'Control Almacenes',
  tags: [{
    t: 'mantenimiento',
    c: 'green'
  }, {
    t: 'automoción, envasado +3',
    c: 'violet'
  }],
  created: '06/07/26 11:17',
  roles: [['resp', 'Responsable', 'Javier']]
}, {
  date: '29 JUN 2026',
  num: '26_014',
  title: 'Control Almacenes',
  tags: [{
    t: 'mantenimiento',
    c: 'green'
  }, {
    t: 'automoción, envasado +3',
    c: 'violet'
  }],
  created: '29/06/26 11:17',
  roles: [['resp', 'Responsable', 'Javier'], ['exec', 'Ejecutor', 'Javier'], ['verif', 'Verificador', 'Javier']]
}, {
  date: '22 JUN 2026',
  num: '26_027',
  title: 'Control Almacenes',
  tags: [{
    t: 'mantenimiento',
    c: 'green'
  }, {
    t: 'automoción, envasado +3',
    c: 'violet'
  }],
  created: '22/06/26 11:17',
  roles: [['resp', 'Responsable', 'Javier']]
}, {
  date: '15 JUN 2026',
  num: '26_038',
  title: 'Control Almacenes',
  tags: [{
    t: 'mantenimiento',
    c: 'green'
  }, {
    t: 'automoción, envasado +3',
    c: 'violet'
  }],
  created: '15/06/26 11:17',
  roles: [['resp', 'Responsable', 'Javier']]
}, {
  date: '08 JUN 2026',
  num: '26_042',
  title: 'Control Almacenes',
  tags: [{
    t: 'mantenimiento',
    c: 'green'
  }, {
    t: 'automoción, envasado +3',
    c: 'violet'
  }],
  created: '08/06/26 11:17',
  roles: [['resp', 'Responsable', 'Javier']]
}];
const FAVORITOS = {
  inc: [{
    id: 'UTD26_106_002',
    date: '28/05/2026',
    t: 'Producto No Conforme. El lote de hueveras está saliendo húmedo al tacto al final del túnel de secado. Solicitada revisión de los…'
  }, {
    id: 'UTD26_099_003',
    date: '28/05/2026',
    t: 'Humedad de pulpa disparada'
  }],
  acc: [{
    id: 'UTD26_AC_044_002',
    date: '27/05/2026',
    t: 'Revisar parámetros del túnel de secado'
  }]
};
const REG_PENDIENTES = [{
  num: '26_090',
  date: '23/04/2026',
  t: 'FORMATO ACTA DE DESTRUCCIÓN DE PRODUCTOS NO CONFORMES'
}, {
  num: '26_056',
  date: '23/04/2026',
  t: 'REGISTROS DE MANTENIMIENTOS'
}, {
  num: '26_032',
  date: '18/05/2026',
  t: 'FORMATO ACTA DE DESTRUCCIÓN DE PRODUCTOS NO CONFORMES'
}, {
  num: '26_047',
  date: '21/05/2026',
  t: 'Registro P1.1 Entradas y Salidas Pescado'
}];
const OS_OPEN = [{
  x: '2026-04-01',
  v: 6
}, {
  x: '2026-05-01',
  v: 105
}, {
  x: '2026-06-01',
  v: 29
}];
const OS_CLOSED = [{
  x: '2026-04-01',
  v: 1
}, {
  x: '2026-05-01',
  v: 35
}, {
  x: '2026-06-01',
  v: 11
}];
Object.assign(window, {
  INCIDENCIAS,
  ACCIONES,
  KANBAN,
  MONTH_EVENTS,
  MONTH_MORE,
  REGISTROS,
  FAVORITOS,
  REG_PENDIENTES,
  OS_OPEN,
  OS_CLOSED
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/Img.jsx
try { (() => {
// Solved · Web — image that shows a branded placeholder until (and unless)
// the real source actually loads. Faithful landing references real
// trysolved.com media; in environments where hotlinking is blocked the
// clean placeholder shows instead of a broken-image glyph.
function Img({
  src,
  alt,
  label,
  className,
  style
}) {
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const showPh = !loaded || failed;
  return /*#__PURE__*/React.createElement(React.Fragment, null, showPh && /*#__PURE__*/React.createElement("div", {
    className: `img-ph ${className || ''}`,
    style: style,
    "aria-label": alt
  }, /*#__PURE__*/React.createElement("span", null, label || alt || 'Imagen')), src && !failed && /*#__PURE__*/React.createElement("img", {
    className: className,
    style: {
      ...(style || {}),
      display: loaded ? 'block' : 'none'
    },
    src: src,
    alt: alt,
    onLoad: () => setLoaded(true),
    onError: () => setFailed(true)
  }));
}
window.Img = Img;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/Img.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/WebFooter.jsx
try { (() => {
// Solved · Web — final CTA + footer
function WebCTA() {
  return /*#__PURE__*/React.createElement("section", {
    className: "cta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cta__box"
  }, /*#__PURE__*/React.createElement("h2", null, "Habla con un especialista en operaciones"), /*#__PURE__*/React.createElement("p", null, "Te ense\xF1amos c\xF3mo Solved alinea a tus equipos y reduce el tiempo de gesti\xF3n desde la primera semana."), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary btn--lg"
  }, "Solicita una demo gratis"))));
}
function WebFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer__in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer__brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logotipo-solved.png",
    alt: "Solved"
  }), /*#__PURE__*/React.createElement("p", null, "El software que alinea las operaciones de tu f\xE1brica."), /*#__PURE__*/React.createElement("span", {
    className: "addr"
  }, "Edificio Angels, C. Sc Puerto 13, Poblados Mar\xEDtimos, 46024 Valencia")), /*#__PURE__*/React.createElement("div", {
    className: "footer__col"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kicker"
  }, "Producto"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", null, "Auditor\xEDas")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", null, "Gesti\xF3n de incidencias")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", null, "Datos avanzados")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", null, "Industria alimentaria")))), /*#__PURE__*/React.createElement("div", {
    className: "footer__col"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kicker"
  }, "Empresa"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", null, "Inicio")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", null, "Blog")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", null, "Clientes")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", null, "Solicita una demo")))), /*#__PURE__*/React.createElement("div", {
    className: "footer__col"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kicker"
  }, "Legal"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", null, "Pol\xEDtica de privacidad")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", null, "Pol\xEDtica de cookies")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", null, "LinkedIn"))))), /*#__PURE__*/React.createElement("div", {
    className: "footer__bottom"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Solved \u2014 Volstone Technology Services S.L."), /*#__PURE__*/React.createElement("span", null, "Hecho en Valencia"))));
}
window.WebCTA = WebCTA;
window.WebFooter = WebFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/WebFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/WebHero.jsx
try { (() => {
// Solved · Web — hero + stats band
function WebHero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap hero__in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hero__eyebrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, "SOLVED"), " Software de operaciones para f\xE1bricas"), /*#__PURE__*/React.createElement("h1", null, "Operaciones m\xE1s eficientes para tu ", /*#__PURE__*/React.createElement("em", null, "f\xE1brica")), /*#__PURE__*/React.createElement("p", {
    className: "hero__sub"
  }, "El software que alinea a los equipos de planta, oficina y direcci\xF3n: control de calidad, mejora continua y optimizaci\xF3n de procesos en un solo lugar."), /*#__PURE__*/React.createElement("div", {
    className: "hero__ctas"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary btn--lg"
  }, "Solicita una demo gratis"), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--ghost"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hero__play"
  }, "\u25B6"), " Ver demo")), /*#__PURE__*/React.createElement("div", {
    className: "hero__trust"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "\u2713"), " Integra con tus ERP, MES y SCADA"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "\u2713"), " Implementaci\xF3n en 2-3 semanas"))), /*#__PURE__*/React.createElement("div", {
    className: "hero__art"
  }, /*#__PURE__*/React.createElement(Img, {
    src: "https://trysolved.com/wp-content/uploads/2025/03/Hero-image.png",
    alt: "Panel de operaciones de Solved",
    label: "Hero \xB7 panel de operaciones Solved"
  }))));
}
function WebStats() {
  const stats = [{
    n: '+18%',
    l: 'Productividad por empleado en el equipo'
  }, {
    n: '+90%',
    l: 'Ahorro en tiempo de gestión de incidencias'
  }, {
    n: '+2.000',
    l: 'Horas de trabajo ahorradas al año'
  }, {
    n: '100%',
    l: 'Visibilidad de los procesos operativos'
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stats__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kicker"
  }, "Optimiza tus procesos con Solved"), /*#__PURE__*/React.createElement("h2", null, "Automatiza el an\xE1lisis y la gesti\xF3n de incidencias de tu f\xE1brica"), /*#__PURE__*/React.createElement("p", null, "Centraliza la operativa de todas las \xE1reas y deja que los datos trabajen por ti.")), /*#__PURE__*/React.createElement("div", {
    className: "stats__grid"
  }, stats.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.l,
    className: "stat"
  }, /*#__PURE__*/React.createElement("b", {
    className: "tabular"
  }, s.n), /*#__PURE__*/React.createElement("span", null, s.l))))));
}
window.WebHero = WebHero;
window.WebStats = WebStats;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/WebHero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/WebNav.jsx
try { (() => {
// Solved · Web — top navigation (faithful to trysolved.com)
function Caret() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  }));
}
function WebNav() {
  return /*#__PURE__*/React.createElement("header", {
    className: "nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap nav__in"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav__logo",
    href: "#"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logotipo-solved.png",
    alt: "Solved"
  })), /*#__PURE__*/React.createElement("ul", {
    className: "nav__links"
  }, /*#__PURE__*/React.createElement("li", {
    className: "nav__item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav__link"
  }, "Productos ", /*#__PURE__*/React.createElement(Caret, null)), /*#__PURE__*/React.createElement("div", {
    className: "nav__menu"
  }, /*#__PURE__*/React.createElement("a", null, /*#__PURE__*/React.createElement("b", null, "Auditor\xEDas"), /*#__PURE__*/React.createElement("span", null, "Checklists proactivas y personalizadas")), /*#__PURE__*/React.createElement("a", null, /*#__PURE__*/React.createElement("b", null, "Gesti\xF3n de incidencias"), /*#__PURE__*/React.createElement("span", null, "Incidencias y acciones correctivas")), /*#__PURE__*/React.createElement("a", null, /*#__PURE__*/React.createElement("b", null, "Datos avanzados"), /*#__PURE__*/React.createElement("span", null, "Dashboards e informes en tiempo real")))), /*#__PURE__*/React.createElement("li", {
    className: "nav__item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav__link"
  }, "Industrias ", /*#__PURE__*/React.createElement(Caret, null)), /*#__PURE__*/React.createElement("div", {
    className: "nav__menu"
  }, /*#__PURE__*/React.createElement("a", null, /*#__PURE__*/React.createElement("b", null, "Industria general"), /*#__PURE__*/React.createElement("span", null, "Fabricaci\xF3n y procesos")), /*#__PURE__*/React.createElement("a", null, /*#__PURE__*/React.createElement("b", null, "Industria alimentaria"), /*#__PURE__*/React.createElement("span", null, "Seguridad y calidad alimentaria")))), /*#__PURE__*/React.createElement("li", {
    className: "nav__item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav__link"
  }, "Blog"))), /*#__PURE__*/React.createElement("div", {
    className: "nav__cta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav__login"
  }, "Iniciar sesi\xF3n"), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary"
  }, "Solicita una demo"))));
}
window.WebNav = WebNav;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/WebNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/WebProducts.jsx
try { (() => {
// Solved · Web — client logos + product cards + video
function WebLogos() {
  const names = ['Fritoper', 'Lácteos Romar', 'Prilux', 'Wetaca', 'Dogfy', 'True Gum', 'Pampling', 'Gufresco'];
  return /*#__PURE__*/React.createElement("section", {
    className: "logos"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("p", null, "M\xE1s de 50 empresas industriales ya conf\xEDan en Solved"), /*#__PURE__*/React.createElement("div", {
    className: "logos__row"
  }, names.map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    className: "logos__chip"
  }, n)))));
}
function WebVideo() {
  return /*#__PURE__*/React.createElement("section", {
    className: "video"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kicker"
  }, "Tour r\xE1pido"), /*#__PURE__*/React.createElement("h2", null, "Descubre Solved en 1 minuto")), /*#__PURE__*/React.createElement("div", {
    className: "video__frame"
  }, /*#__PURE__*/React.createElement("div", {
    className: "video__play"
  }, "\u25B6"), /*#__PURE__*/React.createElement("span", {
    className: "video__label"
  }, "Solved \xB7 de la incidencia a la acci\xF3n correctiva"))));
}
function WebProducts() {
  const items = [{
    k: 'Auditorías',
    d: 'Prevé problemas con checklists personalizadas y proactivas. Programa rondas, recoge evidencias y cierra no conformidades.',
    cta: 'Revisa tus ítems',
    img: 'https://trysolved.com/wp-content/uploads/2025/12/d6c2028fca9de6771e9d8b8eee222fc25b0b5637-1024x1024.png'
  }, {
    k: 'Incidencias y acciones correctivas',
    d: 'Centraliza incidencias, asigna responsables y prioriza tareas. Cada problema queda visible para todas las áreas implicadas.',
    cta: 'Reporta tus incidencias',
    img: 'https://trysolved.com/wp-content/uploads/2025/12/55324ccd39444b95e2c0b16727798513780df85c-1024x1024.png'
  }, {
    k: 'Informes y datos',
    d: 'Accede a datos en tiempo real y obtén una visión estratégica de la planta para decidir con cabeza, no con intuición.',
    cta: 'Decide en base a tus datos',
    img: 'https://trysolved.com/wp-content/uploads/2025/12/7ed5664b4abed416c2a5fa47cc1e49b8b26a4c78-1024x1024.png'
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "products"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kicker"
  }, "Producto"), /*#__PURE__*/React.createElement("h2", null, "Las mejores herramientas para todas las \xE1reas"), /*#__PURE__*/React.createElement("p", null, "Una \xFAnica plataforma para gestionar la calidad y la operativa de toda tu f\xE1brica.")), /*#__PURE__*/React.createElement("div", {
    className: "products__grid"
  }, items.map(it => /*#__PURE__*/React.createElement("article", {
    key: it.k,
    className: "product"
  }, /*#__PURE__*/React.createElement("div", {
    className: "product__art"
  }, /*#__PURE__*/React.createElement(Img, {
    src: it.img,
    alt: it.k,
    label: it.k
  })), /*#__PURE__*/React.createElement("div", {
    className: "product__body"
  }, /*#__PURE__*/React.createElement("h3", null, it.k), /*#__PURE__*/React.createElement("p", null, it.d), /*#__PURE__*/React.createElement("span", {
    className: "product__link"
  }, it.cta, " \u2192")))))));
}
window.WebLogos = WebLogos;
window.WebVideo = WebVideo;
window.WebProducts = WebProducts;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/WebProducts.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/WebProof.jsx
try { (() => {
// Solved · Web — benefits + value props + testimonials
function I({
  d
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: d
  }));
}
function WebBenefits() {
  const list = [{
    d: 'M12 8v4l3 3 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    b: 'Menos tiempo en gestión',
    p: 'Hasta un 90% de ahorro en el tiempo dedicado a gestionar incidencias.'
  }, {
    d: 'M3 17l6-6 4 4 8-8',
    b: 'Más productividad',
    p: 'Un 18% de aumento en la productividad por empleado del equipo.'
  }, {
    d: 'M12 2v20 M2 12h20',
    b: 'Horas recuperadas',
    p: 'Más de 2.000 horas de trabajo ahorradas anualmente.'
  }, {
    d: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    b: 'Transparencia total',
    p: '100% de visibilidad en todos los procesos operativos.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "benefits"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap benefits__in"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "kicker",
    style: {
      color: 'var(--blue-700)'
    }
  }, "Por qu\xE9 Solved"), /*#__PURE__*/React.createElement("h2", null, "Optimiza tu proceso de calidad con Solved"), /*#__PURE__*/React.createElement("div", {
    className: "benefits__list"
  }, list.map(x => /*#__PURE__*/React.createElement("div", {
    key: x.b,
    className: "benefit"
  }, /*#__PURE__*/React.createElement("span", {
    className: "benefit__ico"
  }, /*#__PURE__*/React.createElement(I, {
    d: x.d
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, x.b), /*#__PURE__*/React.createElement("p", null, x.p)))))), /*#__PURE__*/React.createElement("div", {
    className: "benefits__art"
  }, /*#__PURE__*/React.createElement(Img, {
    src: "https://trysolved.com/wp-content/uploads/2025/03/Ventajas-Solved-1024x927.png",
    alt: "Ventajas de Solved",
    label: "Ventajas \xB7 vista de la plataforma"
  }))));
}
function WebValues() {
  const vals = [{
    d: 'M3 7l9-4 9 4-9 4-9-4z M3 7v10l9 4 9-4V7',
    t: 'Control total de tus operaciones desde donde estés: planta, oficina o en movimiento.'
  }, {
    d: 'M4 6h16 M4 12h16 M4 18h16',
    t: 'Integración precisa con los principales ERP del mercado.'
  }, {
    d: 'M12 8v4l3 3 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    t: 'Resultados rápidos: implementación media de 2-3 semanas.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "values"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kicker"
  }, "El mejor aliado para los equipos de tu f\xE1brica"), /*#__PURE__*/React.createElement("h2", null, "Dise\xF1ado para lograr todos tus objetivos"), /*#__PURE__*/React.createElement("p", null, "Nuestro \xE9xito se basa en facilitar al m\xE1ximo el trabajo de las personas que hacen funcionar la planta.")), /*#__PURE__*/React.createElement("div", {
    className: "values__grid"
  }, vals.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "value"
  }, /*#__PURE__*/React.createElement("span", {
    className: "value__ico"
  }, /*#__PURE__*/React.createElement(I, {
    d: v.d
  })), /*#__PURE__*/React.createElement("p", null, v.t), /*#__PURE__*/React.createElement("a", null, "Descubre c\xF3mo funciona \u2192"))))));
}
function WebTestimonials() {
  const quotes = [{
    q: 'Con Solved tenemos visibilidad en tiempo real de todo lo que ocurre en nuestros centros productivos. Hemos mejorado el control de la merma y reducido enormemente los tiempos de comunicación y la duplicidad de tareas.',
    n: 'Sergio Pérez',
    r: 'Director general · Fritoper',
    av: 'SP'
  }, {
    q: 'Teníamos una forma muy manual de comunicar las incidencias y las acciones a realizar. Con Solved tenemos a todo el equipo conectado y reaccionamos con mucha agilidad.',
    n: 'Rosa Gómez',
    r: 'Responsable de Sistemas de Gestión · Lácteos Romar',
    av: 'RG'
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "testi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kicker"
  }, "Clientes"), /*#__PURE__*/React.createElement("h2", null, "M\xE1s de 50 empresas ya conf\xEDan en Solved")), /*#__PURE__*/React.createElement("div", {
    className: "testi__grid"
  }, quotes.map(c => /*#__PURE__*/React.createElement("figure", {
    key: c.n,
    className: "quote"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quote__stars"
  }, "\u2605\u2605\u2605\u2605\u2605"), /*#__PURE__*/React.createElement("p", null, "\u201C", c.q, "\u201D"), /*#__PURE__*/React.createElement("figcaption", {
    className: "quote__by"
  }, /*#__PURE__*/React.createElement("span", {
    className: "quote__av"
  }, c.av), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, c.n), /*#__PURE__*/React.createElement("span", null, c.r))))))));
}
window.WebBenefits = WebBenefits;
window.WebValues = WebValues;
window.WebTestimonials = WebTestimonials;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/WebProof.jsx", error: String((e && e.message) || e) }); }

})();
