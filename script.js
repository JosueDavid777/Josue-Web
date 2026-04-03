/* ═══════════════════════════════════════════
   MATRIX CANVAS ANIMATION
═══════════════════════════════════════════ */
(function initMatrix() {
  const canvas = document.getElementById('matrix');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const caracteres = "01";
  const fontSize = 16;
  let columnas = Math.floor(canvas.width / fontSize);
  const gotas = [];
  for (let x = 0; x < columnas; x++) gotas[x] = 1;

  function dibujar() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 255, 0, 0.4)";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < gotas.length; i++) {
      const texto = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
      ctx.fillText(texto, i * fontSize, gotas[i] * fontSize);
      if (gotas[i] * fontSize > canvas.height && Math.random() > 0.975) gotas[i] = 0;
      gotas[i]++;
    }
  }

  setInterval(dibujar, 33);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const nuevasColumnas = Math.floor(canvas.width / fontSize);
    for (let x = gotas.length; x < nuevasColumnas; x++) gotas[x] = 1;
    columnas = nuevasColumnas;
  });
})();


/* ═══════════════════════════════════════════
   NAVEGACIÓN ENTRE SECCIONES
═══════════════════════════════════════════ */
function mostrar(id) {
  if (document.getElementById(id).classList.contains('activa')) return;

  const scan = document.getElementById('page-scan');
  scan.classList.remove('scanning');
  void scan.offsetWidth;
  scan.classList.add('scanning');

  const flash = document.getElementById('page-flash');
  flash.classList.remove('flash-in');
  void flash.offsetWidth;
  flash.classList.add('flash-in');

  setTimeout(() => {
    document.querySelectorAll("section").forEach(s => s.classList.remove("activa"));
    document.querySelectorAll(".nav-btn").forEach(a => a.classList.remove("activo"));
    document.getElementById(id).classList.add("activa");
    document.getElementById("nav-" + id).classList.add("activo");
    window.scrollTo(0, 0);

    const wrap = document.querySelector(`#${id} .section-wrap`);
    if (wrap) {
      wrap.classList.remove('animating');
      void wrap.offsetWidth;
      wrap.classList.add('animating');
      setTimeout(() => wrap.classList.remove('animating'), 1200);
    }
  }, 120);
}


/* ═══════════════════════════════════════════
   FORMULARIO DE CONTACTO
═══════════════════════════════════════════ */
function enviarFormulario() {
  const nombre   = document.getElementById('f-nombre').value.trim();
  const email    = document.getElementById('f-email').value.trim();
  const servicio = document.getElementById('f-servicio').value;
  const mensaje  = document.getElementById('f-mensaje').value.trim();
  const status   = document.getElementById('form-status');
  const btn      = document.getElementById('form-btn');

  status.className = 'form-status';
  status.style.display = 'none';

  if (!nombre) { mostrarError('// ERROR: El nombre es requerido.'); return; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { mostrarError('// ERROR: Email inválido.'); return; }
  if (!servicio) { mostrarError('// ERROR: Selecciona un tipo de servicio.'); return; }
  if (!mensaje || mensaje.length < 10) { mostrarError('// ERROR: El mensaje debe tener al menos 10 caracteres.'); return; }

  btn.disabled = true;
  btn.textContent = '> ENVIANDO...';

  const textoWA = encodeURIComponent(
    `*Hola Josue!* Mensaje desde tu portafolio:\n\n*Nombre:* ${nombre}\n*Email:* ${email}\n*Servicio:* ${servicio}\n\n*Mensaje:*\n${mensaje}`
  );

  setTimeout(() => {
    window.open(`https://wa.me/573204353941?text=${textoWA}`, '_blank');
    status.className = 'form-status success';
    status.textContent = '✓ MENSAJE PREPARADO — Abriendo WhatsApp para enviarlo...';
    status.style.display = 'block';
    btn.disabled = false;
    btn.textContent = '> ENVIAR MENSAJE →';
    document.getElementById('f-nombre').value = '';
    document.getElementById('f-email').value = '';
    document.getElementById('f-servicio').value = '';
    document.getElementById('f-mensaje').value = '';
  }, 900);
}

function mostrarError(msg) {
  const status = document.getElementById('form-status');
  status.className = 'form-status error';
  status.textContent = msg;
  status.style.display = 'block';
}


/* ═══════════════════════════════════════════
   DATOS DE REPARACIONES
═══════════════════════════════════════════ */
const GH    = "https://raw.githubusercontent.com/JosueDavid777/Reparaciones-de-equipos-electr-nicos./refs/heads/main";
const MEDIA = `${GH}/REPARACIONES_ELECTRONICAS/2026-01-%20TV_LG32LF15R/07_Multimedia%2C%20videos%20e%20im%C3%A1genes`;
const MEDIA_PREMIER = `${GH}/REPARACIONES_ELECTRONICAS/2026-02-%20GRABADORA_PREMIER/07_Multimedia%2C%20videos%20e%20im%C3%A1genes`;

const reparaciones = {
  "lg32lf15r": {
    title: 'Televisor LG 32"',
    model: "LG · 32LF15R  ·  Reporte ST-0001  ·  03 de enero de 2026",
    mediaType: "videos",
    fault: "El televisor presentaba fallas intermitentes: no se escuchaba el audio, la placa de botones no respondía y el equipo se apagaba de forma espontánea.",
    solution: "Se identificó el capacitor C1118 de la placa principal como componente defectuoso. Su deterioro generaba ripple en la señal de 1.25 V al SoC causando los apagados y fallos de audio. Tras el reemplazo por un equivalente de 100 µF y el mantenimiento integral, el equipo quedó 100% operativo.",
    components: [
      "Capacitor C1118 — 100 µF / placa principal (regulación 1.25 V → SoC)",
      "Limpieza de polvo en circuitos y disipadores",
      "Verificación de conectores internos",
      "Revisión de soldaduras en placa principal y placa de potencia",
      "Limpieza de carcasa exterior e interior"
    ],
    videosBefore: [
      { src: `${MEDIA}/01_Imagenes%20y%20videos%20de%20fallas%20en%20el%20equipo/01_PRIMER_VIDEO_TV_LG_FALLA.mp4`, title: "Falla 1 — apagado espontáneo" },
      { src: `${MEDIA}/01_Imagenes%20y%20videos%20de%20fallas%20en%20el%20equipo/02_SEGUNDO_VIDEO_TV_LG_FALLA.mp4`, title: "Falla 2 — sin audio / botones" },
      { src: `${MEDIA}/01_Imagenes%20y%20videos%20de%20fallas%20en%20el%20equipo/03_TERCER_VIDEO_TV_LG_FALLA.mp4`, title: "Falla 3 — comportamiento intermitente" }
    ],
    videosAfter: [
      { src: `${MEDIA}/02_Videos%20de%20equipo%20funcionando%20y%20reparado/01_PRIMER_VIDEO_REPARACION.mp4`, title: "Proceso de intervención" },
      { src: `${MEDIA}/02_Videos%20de%20equipo%20funcionando%20y%20reparado/02_SEGUNDO_VIDEO_TV_YA_FUNCIONANDO.mp4`, title: "TV ya funcionando" },
      { src: `${MEDIA}/02_Videos%20de%20equipo%20funcionando%20y%20reparado/03_TERCER_VIDEO_TV_FUNCIONANDO_AL_100.mp4`, title: "Verificación final — 100% operativo" }
    ],
    pdf: `https://drive.google.com/file/d/1vO1wtC-THLGQUQsPzKwq1HE_L40Ql6hR/preview`
  },

  "tv-challenger": {
    title: "TV Challenger — Mantenimiento",
    model: "CHALLENGER  ·  Reporte ST-0002  ·  Enero 2026",
    mediaType: "images",
    fault: "El cliente solicitó mantenimiento preventivo general: limpieza interna, diagnóstico de placas y verificación de funcionamiento para asegurar rendimiento óptimo.",
    solution: "Se realizó limpieza profunda de polvo en placas de potencia, alimentación de pantalla y LEDs. Inspección visual de soldaduras, verificación de conectores y pruebas de funcionamiento. El equipo quedó en condiciones óptimas.",
    components: [
      "Limpieza de placa de potencia y alimentación de pantalla",
      "Limpieza e inspección de tiras de LEDs",
      "Desconexión y limpieza de mainboard",
      "Verificación de soldaduras y conectores",
      "Pruebas básicas de funcionamiento post-mantenimiento",
      "Limpieza de carcasa exterior e interior"
    ],
    imagesBefore: [],
    imagesAfter: [],
    pdf: null
  },

  "portatil-ram": {
    title: "Portátil — Aumento de RAM y Mantenimiento",
    model: "PORTÁTIL  ·  Reporte ST-0003  ·  2026",
    mediaType: "images",
    fault: "El equipo presentaba lentitud general y temperaturas elevadas. El cliente solicitó mejora de rendimiento mediante aumento de RAM y mantenimiento del sistema de refrigeración.",
    solution: "Se instaló módulo adicional de RAM ampliando la capacidad total. Se retiró el disipador, se aplicó pasta térmica nueva en CPU y GPU, y se realizó limpieza general. Las temperaturas bajaron significativamente y el rendimiento mejoró de forma notable.",
    components: [
      "Instalación de módulo de RAM adicional",
      "Retiro y limpieza del disipador de CPU/GPU",
      "Aplicación de pasta térmica nueva en CPU y GPU",
      "Limpieza de ventiladores y ductos de aire",
      "Limpieza general interior del chasis",
      "Verificación y pruebas de temperatura post-mantenimiento"
    ],
    imagesBefore: [],
    imagesAfter: [],
    pdf: null
  },

  "grabadora-premier": {
    title: "Grabadora Premier — Años 90",
    model: "PREMIER  ·  Reporte ST-0004  ·  2026",
    mediaType: "mixed",
    fault: "La grabadora presentaba un corto que impedía su encendido. Se detectaron tres problemas simultáneos: un capacitor explotado en la placa principal (sin información de capacitancia), corrosión severa en pistas críticas con decoloración marrón y sulfatación, y el parlante completamente desconectado. No se contaba con esquema eléctrico del equipo.",
    solution: "Mediante análisis de los componentes circundantes se dedujo el valor del capacitor dañado (22 µF). Se reemplazó el diodo sulfatado del puente rectificador, se reconectaron las pistas corroídas para restablecer continuidad y se reconectó el parlante correctamente en paralelo. La grabadora recuperó su funcionamiento completo con sonido estable.",
    components: [
      "Reemplazo de capacitor de acoplamiento — 22 µF (valor deducido por análisis comparativo)",
      "Reemplazo de diodo sulfatado en el puente rectificador",
      "Reconexión y restauración de pistas corroídas y levantadas",
      "Reconexión del parlante en paralelo (cable suelto)",
      "Verificación de fuente de alimentación y tensiones de salida",
      "Prueba de audio y funcionamiento general post-reparación"
    ],
    imagesBefore: [
      { src: `${MEDIA_PREMIER}/01_Imagenes%20y%20videos%20de%20fallas%20en%20el%20equipo/01_SULFATACION_EN_EQUIPO.jpg`, title: "Falla 1 — Sulfatación en el equipo" },
      { src: `${MEDIA_PREMIER}/01_Imagenes%20y%20videos%20de%20fallas%20en%20el%20equipo/02_CAPACITOR_EXPLOTADO.jpg`, title: "Falla 2 — Capacitor Explotado" },
      { src: `${MEDIA_PREMIER}/01_Imagenes%20y%20videos%20de%20fallas%20en%20el%20equipo/03_CABLES_SUELTOS_DE_LA_GRABADORA.jpg`, title: "Falla 3 — Cables sueltos" }
    ],
    videosAfter: [
      { src: `${MEDIA_PREMIER}/02_Videos%20de%20equipo%20funcionando%20y%20reparado/Video_equipo_funcionando.mp4`, title: "Grabadora Funcionando" }
    ],
    pdf: null
  },

  "cargador-radio": {
    title: "Adaptación de Cargador Móvil a Radio",
    model: "RADIO  ·  Reporte ST-0005  ·  2026",
    mediaType: "images",
    fault: "El radio no contaba con fuente de alimentación propia y dependía de pilas para funcionar. El cliente necesitaba una solución permanente de energía sin modificar la experiencia de uso del equipo.",
    solution: "Se analizó el circuito interno del radio para identificar el punto exacto de alimentación de voltaje. Una vez localizado el nodo de entrada, se adaptó un cargador de celular como fuente de poder, conectándolo de forma limpia al circuito interno. El radio quedó operativo con alimentación continua sin alterar su funcionamiento original.",
    components: [
      "Análisis del circuito interno para localizar punto de alimentación",
      "Medición de voltaje de operación del radio",
      "Adaptación de cargador de celular como fuente de alimentación permanente",
      "Conexión al nodo de alimentación identificado en la placa",
      "Verificación de polaridad y niveles de tensión",
      "Prueba de funcionamiento completo post-adaptación"
    ],
    imagesBefore: [],
    imagesAfter: [],
    pdf: null
  }
};


/* ═══════════════════════════════════════════
   HELPERS DE MEDIA
═══════════════════════════════════════════ */
function mkVideo(v, tipo) {
  const isBefore = tipo === 'before';
  return `<div class="video-tab-card ${isBefore ? 'before-card' : ''}">
    <div class="vid-thumb-wrap" onclick="playVid(this)">
      <video preload="none"><source src="${v.src}" type="video/mp4"></video>
      <div class="vid-overlay">
        <div class="vid-play-btn"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div>
        <span class="vid-type-label">${isBefore ? '● VIDEO DE FALLA' : '● EQUIPO REPARADO'}</span>
      </div>
    </div>
    <div class="video-tab-info">
      <p class="video-tab-badge ${tipo}">${isBefore ? '● FALLA' : '● REPARADO'}</p>
      <p class="video-tab-title">${v.title}</p>
    </div>
  </div>`;
}

function playVid(wrap) {
  const v = wrap.querySelector('video');
  wrap.classList.add('playing');
  v.controls = true;
  v.play();
}

function mkImg(img, tipo) {
  const isBefore = tipo === 'before';
  const badge = isBefore ? '● ANTES' : '● DESPUÉS';
  const cls = isBefore ? 'before' : 'after';
  if (img.src) {
    return `<div class="img-card" onclick="abrirLightbox('${img.src}')">
      <img src="${img.src}" alt="${img.title}" loading="lazy">
      <div class="img-caption">
        <p class="img-badge ${cls}">${badge}</p>
        <p class="img-title">${img.title}</p>
      </div>
    </div>`;
  }
  return `<div class="img-card" style="cursor:default;">
    <div class="img-card-placeholder">
      <span class="ph-icon">📷</span>
      <span class="ph-text">PRÓXIMAMENTE</span>
    </div>
    <div class="img-caption">
      <p class="img-badge ${cls}">${badge}</p>
      <p class="img-title">${img.title || 'Imagen pendiente'}</p>
    </div>
  </div>`;
}


/* ═══════════════════════════════════════════
   LIGHTBOX
═══════════════════════════════════════════ */
function abrirLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}


/* ═══════════════════════════════════════════
   MODAL DE REPARACIONES 
═══════════════════════════════════════════ */
function abrirModal(id) {
  const d = reparaciones[id];
  if (!d) return;

  document.getElementById("modal-title").textContent = d.title;
  document.getElementById("modal-model").textContent = d.model;
  document.getElementById("modal-fault").textContent = d.fault;
  document.getElementById("modal-solution").textContent = d.solution;

  const ul = document.getElementById("modal-components");
  ul.innerHTML = "";
  d.components.forEach(c => {
    const li = document.createElement("li");
    li.textContent = c;
    ul.appendChild(li);
  });

  const hasPdf = !!d.pdf;
  const mediaLabel = d.mediaType === 'videos' ? 'VIDEOS'
    : d.mediaType === 'mixed' ? 'IMÁGENES Y VIDEOS'
    : 'IMÁGENES';

  document.getElementById("modal-tabs-bar").innerHTML =
    `<button class="modal-tab active" onclick="cambiarTab(this,'modal-tab-falla')">TRABAJO REALIZADO</button>` +
    `<button class="modal-tab" onclick="cambiarTab(this,'modal-tab-media')">${mediaLabel}</button>` +
    (hasPdf ? `<button class="modal-tab" onclick="cambiarTab(this,'modal-tab-pdf')">DOCUMENTACIÓN PDF</button>` : '');

  const mediaDiv = document.getElementById("modal-tab-media");

  if (d.mediaType === 'videos') {
    const bHTML = d.videosBefore.map(v => mkVideo(v, 'before')).join("") ||
      `<p style="color:var(--muted);font-family:'Share Tech Mono',monospace;font-size:0.8rem;">Sin videos disponibles aún.</p>`;
    const aHTML = d.videosAfter.map(v => mkVideo(v, 'after')).join("") ||
      `<p style="color:var(--muted);font-family:'Share Tech Mono',monospace;font-size:0.8rem;">Sin videos disponibles aún.</p>`;
    mediaDiv.innerHTML =
      `<p class="vid-section-label before">● EQUIPO CON FALLA</p>
       <div class="videos-tab-grid">${bHTML}</div>
       <hr class="tab-divider">
       <p class="vid-section-label after">● EQUIPO REPARADO Y FUNCIONANDO</p>
       <div class="videos-tab-grid">${aHTML}</div>`;

  } else if (d.mediaType === 'mixed') {
    const bHTML = d.imagesBefore.map(i => mkImg(i, 'before')).join('');
    const aHTML = d.videosAfter.map(v => mkVideo(v, 'after')).join('');
    mediaDiv.innerHTML =
      `<p class="img-section-label before">● ANTES</p>
       <div class="images-tab-grid">${bHTML}</div>
       <hr class="tab-divider">
       <p class="vid-section-label after">● EQUIPO REPARADO Y FUNCIONANDO</p>
       <div class="videos-tab-grid">${aHTML}</div>`;

  } else {
    const defaultsMap = {
      'tv-challenger':   { b: [{ src: null, title: 'Placas antes de limpieza' }, { src: null, title: 'Interior con polvo' }],                a: [{ src: null, title: 'Placas limpias' }, { src: null, title: 'Equipo en funcionamiento' }] },
      'portatil-ram':    { b: [{ src: null, title: 'Interior antes del mantenimiento' }, { src: null, title: 'Disipador con pasta vieja' }],  a: [{ src: null, title: 'RAM instalada' }, { src: null, title: 'Pasta térmica aplicada' }] },
      'grabadora-premier':{ b: [{ src: null, title: 'Placa con capacitor explotado' }, { src: null, title: 'Pistas corroídas y sulfatadas' }],a: [{ src: null, title: 'Reparación completada' }, { src: null, title: 'Grabadora funcionando' }] },
      'cargador-radio':  { b: [{ src: null, title: 'Radio antes de la adaptación' }, { src: null, title: 'Circuito interno analizado' }],    a: [{ src: null, title: 'Adaptación completada' }, { src: null, title: 'Radio con alimentación permanente' }] }
    };
    const defs = defaultsMap[id] || { b: [{ src: null, title: 'Imagen pendiente' }], a: [{ src: null, title: 'Imagen pendiente' }] };
    const bFinal = d.imagesBefore.length ? d.imagesBefore : defs.b;
    const aFinal = d.imagesAfter.length ? d.imagesAfter : defs.a;
    mediaDiv.innerHTML =
      `<p class="img-section-label before">● ANTES</p>
       <div class="images-tab-grid">${bFinal.map(i => mkImg(i, 'before')).join("")}</div>
       <hr class="tab-divider">
       <p class="img-section-label after">● DESPUÉS</p>
       <div class="images-tab-grid">${aFinal.map(i => mkImg(i, 'after')).join("")}</div>
       <p class="img-pending-note">📷 Las imágenes estarán disponibles próximamente.<br>Cuando estén listas aparecerán aquí y podrás verlas en tamaño completo.</p>`;
  }

  document.getElementById("modal-pdf-area").innerHTML = d.pdf
    ? `<iframe src="${d.pdf}" title="Reporte PDF"></iframe>`
    : `<div class="pdf-placeholder">
        <div class="pdf-placeholder-icon">📄</div>
        <p class="pdf-placeholder-title">REPORTE PDF</p>
        <p class="pdf-placeholder-sub">El reporte estará disponible próximamente.</p>
       </div>`;

  document.querySelectorAll(".modal-tab-content").forEach(c => c.classList.remove("active"));
  document.getElementById("modal-tab-falla").classList.add("active");
  document.getElementById("modal-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function cerrarModal() {
  document.querySelectorAll(".modal video").forEach(v => { v.pause(); v.currentTime = 0; });
  document.getElementById("modal-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

function cerrarModalFuera(e) {
  if (e.target === document.getElementById("modal-overlay")) cerrarModal();
}

function cambiarTab(btn, tabId) {
  document.querySelectorAll(".modal-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".modal-tab-content").forEach(c => c.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(tabId).classList.add("active");
}

/* ═══════════════════════════════════════════
   MODAL PROYECTOS
═══════════════════════════════════════════ */
function abrirModalP(id) {
  const d = proyectos[id];
  if (!d) return;

  document.getElementById("modal-title").textContent = d.title;
  document.getElementById("modal-model").textContent = d.model;
  document.getElementById("modal-fault").textContent = d.fault;
  document.getElementById("modal-solution").textContent = d.solution;

  const ul = document.getElementById("modal-components");
  ul.innerHTML = "";
  d.components.forEach(c => {
    const li = document.createElement("li");
    li.textContent = c;
    ul.appendChild(li);
  });

  const hasPdf = !!d.pdf;
  const mediaLabel = d.mediaType === 'videos' ? 'VIDEOS'
    : d.mediaType === 'mixed' ? 'IMÁGENES Y VIDEOS'
    : 'IMÁGENES';

  document.getElementById("modal-tabs-bar").innerHTML =
    `<button class="modal-tab active" onclick="cambiarTab(this,'modal-tab-falla')">TRABAJO REALIZADO</button>` +
    `<button class="modal-tab" onclick="cambiarTab(this,'modal-tab-media')">${mediaLabel}</button>` +
    (hasPdf ? `<button class="modal-tab" onclick="cambiarTab(this,'modal-tab-pdf')">DOCUMENTACIÓN PDF</button>` : '');

  const mediaDiv = document.getElementById("modal-tab-media");

  if (d.mediaType === 'videos') {
    const bHTML = d.videosBefore.map(v => mkVideo(v, 'before')).join("") ||
      `<p style="color:var(--muted);font-family:'Share Tech Mono',monospace;font-size:0.8rem;">Sin videos disponibles aún.</p>`;
    const aHTML = d.videosAfter.map(v => mkVideo(v, 'after')).join("") ||
      `<p style="color:var(--muted);font-family:'Share Tech Mono',monospace;font-size:0.8rem;">Sin videos disponibles aún.</p>`;
    mediaDiv.innerHTML =
      `<p class="vid-section-label before">● EQUIPO CON FALLA</p>
       <div class="videos-tab-grid">${bHTML}</div>
       <hr class="tab-divider">
       <p class="vid-section-label after">● EQUIPO REPARADO Y FUNCIONANDO</p>
       <div class="videos-tab-grid">${aHTML}</div>`;

  } else if (d.mediaType === 'mixed') {
    const bHTML = d.imagesBefore.map(i => mkImg(i, 'before')).join('');
    const aHTML = d.videosAfter.map(v => mkVideo(v, 'after')).join('');
    mediaDiv.innerHTML =
      `<p class="img-section-label before">● PROYECTO FUNCIONANDO</p>
       <div class="images-tab-grid">${bHTML}</div>
       <div class="videos-tab-grid">${aHTML}</div>`;

  } else {
    const defaultsMap = {
      'bot-whatsapp':   { b: [{ src: null, title: 'Proyecto funcionando' }]},
      'portatil-ram':    { b: [{ src: null, title: 'Interior antes del mantenimiento' }, { src: null, title: 'Disipador con pasta vieja' }],  a: [{ src: null, title: 'RAM instalada' }, { src: null, title: 'Pasta térmica aplicada' }] },
      'grabadora-premier':{ b: [{ src: null, title: 'Placa con capacitor explotado' }, { src: null, title: 'Pistas corroídas y sulfatadas' }],a: [{ src: null, title: 'Reparación completada' }, { src: null, title: 'Grabadora funcionando' }] },

    const defs = defaultsMap[id] || { b: [{ src: null, title: 'Imagen pendiente' }], a: [{ src: null, title: 'Imagen pendiente' }] };
    const bFinal = d.imagesBefore.length ? d.imagesBefore : defs.b;
    const aFinal = d.imagesAfter.length ? d.imagesAfter : defs.a;
    mediaDiv.innerHTML =
      `<p class="img-section-label before">● ANTES</p>
       <div class="images-tab-grid">${bFinal.map(i => mkImg(i, 'before')).join("")}</div>
       <hr class="tab-divider">
       <p class="img-section-label after">● DESPUÉS</p>
       <div class="images-tab-grid">${aFinal.map(i => mkImg(i, 'after')).join("")}</div>
       <p class="img-pending-note">📷 Las imágenes estarán disponibles próximamente.<br>Cuando estén listas aparecerán aquí y podrás verlas en tamaño completo.</p>`;
  }

  document.getElementById("modal-pdf-area").innerHTML = d.pdf
    ? `<iframe src="${d.pdf}" title="Reporte PDF"></iframe>`
    : `<div class="pdf-placeholder">
        <div class="pdf-placeholder-icon">📄</div>
        <p class="pdf-placeholder-title">REPORTE PDF</p>
        <p class="pdf-placeholder-sub">El reporte estará disponible próximamente.</p>
       </div>`;

  document.querySelectorAll(".modal-tab-content").forEach(c => c.classList.remove("active"));
  document.getElementById("modal-tab-falla").classList.add("active");
  document.getElementById("modal-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function cerrarModalP() {
  document.querySelectorAll(".modal video").forEach(v => { v.pause(); v.currentTime = 0; });
  document.getElementById("modal-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

function cerrarModalFueraP(e) {
  if (e.target === document.getElementById("modal-overlay")) cerrarModal();
}

function cambiarTab(btn, tabId) {
  document.querySelectorAll(".modal-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".modal-tab-content").forEach(c => c.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(tabId).classList.add("active");
}
const GH    = "https://raw.githubusercontent.com/JosueDavid777/Reparaciones-de-equipos-electr-nicos./refs/heads/main";
const MEDIA = `${GH}/REPARACIONES_ELECTRONICAS/2026-01-%20TV_LG32LF15R/07_Multimedia%2C%20videos%20e%20im%C3%A1genes`;
const MEDIA_PREMIER = `${GH}/REPARACIONES_ELECTRONICAS/2026-02-%20GRABADORA_PREMIER/07_Multimedia%2C%20videos%20e%20im%C3%A1genes`;

const proyectos = {
  "bot-whatsapp": {
    title: 'Bot WhatsApp"',
    model: "LG · 32LF15R  ·  Reporte ST-0001  ·  03 de enero de 2026",
    mediaType: "videos",
    fault: "El televisor presentaba fallas intermitentes: no se escuchaba el audio, la placa de botones no respondía y el equipo se apagaba de forma espontánea.",
    solution: "Se identificó el capacitor C1118 de la placa principal como componente defectuoso. Su deterioro generaba ripple en la señal de 1.25 V al SoC causando los apagados y fallos de audio. Tras el reemplazo por un equivalente de 100 µF y el mantenimiento integral, el equipo quedó 100% operativo.",
    components: [
      "Capacitor C1118 — 100 µF / placa principal (regulación 1.25 V → SoC)",
      "Limpieza de polvo en circuitos y disipadores",
      "Verificación de conectores internos",
      "Revisión de soldaduras en placa principal y placa de potencia",
      "Limpieza de carcasa exterior e interior"
    ],
    videosBefore: [
    ],
    videosAfter: [
    ],
    pdf: `https://drive.google.com/file/d/1vO1wtC-THLGQUQsPzKwq1HE_L40Ql6hR/preview`
  },

  "tv-challenger": {
    title: "TV Challenger — Mantenimiento",
    model: "CHALLENGER  ·  Reporte ST-0002  ·  Enero 2026",
    mediaType: "images",
    fault: "El cliente solicitó mantenimiento preventivo general: limpieza interna, diagnóstico de placas y verificación de funcionamiento para asegurar rendimiento óptimo.",
    solution: "Se realizó limpieza profunda de polvo en placas de potencia, alimentación de pantalla y LEDs. Inspección visual de soldaduras, verificación de conectores y pruebas de funcionamiento. El equipo quedó en condiciones óptimas.",
    components: [
      "Limpieza de placa de potencia y alimentación de pantalla",
      "Limpieza e inspección de tiras de LEDs",
      "Desconexión y limpieza de mainboard",
      "Verificación de soldaduras y conectores",
      "Pruebas básicas de funcionamiento post-mantenimiento",
      "Limpieza de carcasa exterior e interior"
    ],
    imagesBefore: [],
    imagesAfter: [],
    pdf: null
  },

  "portatil-ram": {
    title: "Portátil — Aumento de RAM y Mantenimiento",
    model: "PORTÁTIL  ·  Reporte ST-0003  ·  2026",
    mediaType: "images",
    fault: "El equipo presentaba lentitud general y temperaturas elevadas. El cliente solicitó mejora de rendimiento mediante aumento de RAM y mantenimiento del sistema de refrigeración.",
    solution: "Se instaló módulo adicional de RAM ampliando la capacidad total. Se retiró el disipador, se aplicó pasta térmica nueva en CPU y GPU, y se realizó limpieza general. Las temperaturas bajaron significativamente y el rendimiento mejoró de forma notable.",
    components: [
      "Instalación de módulo de RAM adicional",
      "Retiro y limpieza del disipador de CPU/GPU",
      "Aplicación de pasta térmica nueva en CPU y GPU",
      "Limpieza de ventiladores y ductos de aire",
      "Limpieza general interior del chasis",
      "Verificación y pruebas de temperatura post-mantenimiento"
    ],
    imagesBefore: [],
    imagesAfter: [],
    pdf: null
  },

  "grabadora-premier": {
    title: "Grabadora Premier — Años 90",
    model: "PREMIER  ·  Reporte ST-0004  ·  2026",
    mediaType: "mixed",
    fault: "La grabadora presentaba un corto que impedía su encendido. Se detectaron tres problemas simultáneos: un capacitor explotado en la placa principal (sin información de capacitancia), corrosión severa en pistas críticas con decoloración marrón y sulfatación, y el parlante completamente desconectado. No se contaba con esquema eléctrico del equipo.",
    solution: "Mediante análisis de los componentes circundantes se dedujo el valor del capacitor dañado (22 µF). Se reemplazó el diodo sulfatado del puente rectificador, se reconectaron las pistas corroídas para restablecer continuidad y se reconectó el parlante correctamente en paralelo. La grabadora recuperó su funcionamiento completo con sonido estable.",
    components: [
      "Reemplazo de capacitor de acoplamiento — 22 µF (valor deducido por análisis comparativo)",
      "Reemplazo de diodo sulfatado en el puente rectificador",
      "Reconexión y restauración de pistas corroídas y levantadas",
      "Reconexión del parlante en paralelo (cable suelto)",
      "Verificación de fuente de alimentación y tensiones de salida",
      "Prueba de audio y funcionamiento general post-reparación"
    ],
    imagesBefore: [
      { src: `${MEDIA_PREMIER}/01_Imagenes%20y%20videos%20de%20fallas%20en%20el%20equipo/01_SULFATACION_EN_EQUIPO.jpg`, title: "Falla 1 — Sulfatación en el equipo" },
      { src: `${MEDIA_PREMIER}/01_Imagenes%20y%20videos%20de%20fallas%20en%20el%20equipo/02_CAPACITOR_EXPLOTADO.jpg`, title: "Falla 2 — Capacitor Explotado" },
      { src: `${MEDIA_PREMIER}/01_Imagenes%20y%20videos%20de%20fallas%20en%20el%20equipo/03_CABLES_SUELTOS_DE_LA_GRABADORA.jpg`, title: "Falla 3 — Cables sueltos" }
    ],
    videosAfter: [
      { src: `${MEDIA_PREMIER}/02_Videos%20de%20equipo%20funcionando%20y%20reparado/Video_equipo_funcionando.mp4`, title: "Grabadora Funcionando" }
    ],
    pdf: null
  },

  "cargador-radio": {
    title: "Adaptación de Cargador Móvil a Radio",
    model: "RADIO  ·  Reporte ST-0005  ·  2026",
    mediaType: "images",
    fault: "El radio no contaba con fuente de alimentación propia y dependía de pilas para funcionar. El cliente necesitaba una solución permanente de energía sin modificar la experiencia de uso del equipo.",
    solution: "Se analizó el circuito interno del radio para identificar el punto exacto de alimentación de voltaje. Una vez localizado el nodo de entrada, se adaptó un cargador de celular como fuente de poder, conectándolo de forma limpia al circuito interno. El radio quedó operativo con alimentación continua sin alterar su funcionamiento original.",
    components: [
      "Análisis del circuito interno para localizar punto de alimentación",
      "Medición de voltaje de operación del radio",
      "Adaptación de cargador de celular como fuente de alimentación permanente",
      "Conexión al nodo de alimentación identificado en la placa",
      "Verificación de polaridad y niveles de tensión",
      "Prueba de funcionamiento completo post-adaptación"
    ],
    imagesBefore: [],
    imagesAfter: [],
    pdf: null
  }
};

/* ═══════════════════════════════════════════
   KEYBOARD EVENTS
═══════════════════════════════════════════ */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    cerrarModal();
    cerrarLightbox();
  }
});

