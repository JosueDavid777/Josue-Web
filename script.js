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
   NAVEGACIÓN ENTRE SECCIONES + HISTORIAL
═══════════════════════════════════════════ */
let _navStack = ['sobre-mi'];

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

    // Empujar al historial del navegador
    history.pushState({ seccion: id }, '', '#' + id);
    _navStack.push(id);

    const wrap = document.querySelector(`#${id} .section-wrap`);
    if (wrap) {
      wrap.classList.remove('animating');
      void wrap.offsetWidth;
      wrap.classList.add('animating');
      setTimeout(() => wrap.classList.remove('animating'), 1200);
    }
  }, 120);
}

// Al cargar, leer el hash de la URL y navegar a esa sección
(function initHash() {
  const hash = window.location.hash.replace('#', '');
  const validas = ['sobre-mi', 'proyectos', 'reparaciones', 'certificaciones', 'contacto'];
  if (hash && validas.includes(hash)) {
    // Sin animación inicial
    document.querySelectorAll("section").forEach(s => s.classList.remove("activa"));
    document.querySelectorAll(".nav-btn").forEach(a => a.classList.remove("activo"));
    document.getElementById(hash).classList.add("activa");
    document.getElementById("nav-" + hash).classList.add("activo");
    _navStack = ['sobre-mi', hash];
  }
  history.replaceState({ seccion: document.querySelector('section.activa')?.id || 'sobre-mi' }, '', window.location.href);
})();

// Botón atrás del navegador
window.addEventListener('popstate', (e) => {
  const seccion = e.state?.seccion || 'sobre-mi';
  document.querySelectorAll("section").forEach(s => s.classList.remove("activa"));
  document.querySelectorAll(".nav-btn").forEach(a => a.classList.remove("activo"));
  document.getElementById(seccion).classList.add("activa");
  const navBtn = document.getElementById("nav-" + seccion);
  if (navBtn) navBtn.classList.add("activo");
  window.scrollTo(0, 0);
});


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
   DATOS DE CERTIFICACIONES SENA
═══════════════════════════════════════════ */
const certificaciones = {
  "plc-i": {
    codigo: "9213003320163CC1053324547C",
    titulo: "Controladores Lógicos Programables — PLC I",
    entidad: "SENA · Centro de Tecnologías del Transporte · Regional Distrito Capital",
    duracion: "40 horas",
    fecha: "03 de octubre de 2025",
    tag: "CERT_01 · OCT 2025",
    icono: "⚙️",
    descripcion: "Formación en el manejo, programación y configuración de Controladores Lógicos Programables (PLC). El curso abarca fundamentos de la lógica de control industrial, lenguajes de programación estándar IEC 61131-3 (Ladder, FBD, SFC), diseño de circuitos de automatización, diagnóstico de fallas en sistemas automatizados y aplicaciones prácticas en entornos industriales. Complementa directamente las habilidades en electrónica e ingeniería de control.",
    temas: [
      "Fundamentos de automatización industrial y PLCs",
      "Arquitectura interna y módulos de un PLC",
      "Lenguaje Ladder (KOP) y FBD",
      "Programación de entradas/salidas digitales y analógicas",
      "Temporizadores, contadores y secuenciadores",
      "Diagnóstico y resolución de fallas en sistemas PLC",
      "Aplicaciones prácticas de control industrial"
    ],
    pdfEmbed: "https://drive.google.com/file/d/1A6Sbjcgmp-ukS-uhOify15dyynPn6K4F/preview"
  },
  "python-eda": {
    codigo: "9533003353340CC1053324547C",
    titulo: "Análisis Exploratorio de Datos en Python",
    entidad: "SENA · Centro de Desarrollo Agroindustrial, Turístico y Tecnológico del Guaviare · Regional Guaviare",
    duracion: "48 horas",
    fecha: "11 de noviembre de 2025",
    tag: "CERT_02 · NOV 2025",
    icono: "🐍",
    descripcion: "Formación en análisis y exploración de conjuntos de datos utilizando Python como lenguaje principal. El curso cubre el uso de librerías fundamentales para ciencia de datos como Pandas, NumPy y Matplotlib/Seaborn, aplicando técnicas de limpieza, transformación, visualización e interpretación de datos. Fortalece las habilidades de programación en Python y abre la puerta al mundo del Data Science y la inteligencia artificial aplicada.",
    temas: [
      "Fundamentos de Python para ciencia de datos",
      "Manipulación de datos con Pandas y NumPy",
      "Limpieza y preprocesamiento de datasets",
      "Estadística descriptiva y análisis univariable/multivariable",
      "Visualización de datos con Matplotlib y Seaborn",
      "Detección de valores atípicos (outliers)",
      "Interpretación de resultados y generación de insights"
    ],
    pdfEmbed: "https://drive.google.com/file/d/1FmVGe1TztEkMKOcVW8Ff0i4-p51emYdy/preview"
  }
};

const SENA_CONSULTA_URL = "https://certificados.sena.edu.co/CertificadoDigital/com.sena.consultacer";
const CC_JOSUE = "1053324547";


/* ═══════════════════════════════════════════
   MODAL DE CERTIFICACIONES
═══════════════════════════════════════════ */
function abrirModalCert(id) {
  const d = certificaciones[id];
  if (!d) return;

  document.getElementById("cmodal-titulo").textContent = d.titulo;
  document.getElementById("cmodal-entidad").textContent = d.entidad;
  document.getElementById("cmodal-tag").textContent = d.tag;
  document.getElementById("cmodal-duracion").textContent = d.duracion;
  document.getElementById("cmodal-fecha").textContent = d.fecha;
  document.getElementById("cmodal-codigo").textContent = d.codigo;
  document.getElementById("cmodal-descripcion").textContent = d.descripcion;

  const ul = document.getElementById("cmodal-temas");
  ul.innerHTML = "";
  d.temas.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    ul.appendChild(li);
  });

  // Botón consultar en SENA
  const btnConsultar = document.getElementById("cmodal-btn-consultar");
  btnConsultar.href = SENA_CONSULTA_URL;
  btnConsultar.target = "_blank";

  // Resetear tabs
  document.querySelectorAll(".cmodal-tab-content").forEach(c => c.classList.remove("active"));
  document.querySelectorAll(".cmodal-tab").forEach(t => t.classList.remove("active"));
  document.getElementById("cmodal-tab-info").classList.add("active");
  document.querySelector(".cmodal-tab[data-tab='cmodal-tab-info']").classList.add("active");

  // Configurar PDF embebido en tab PDF
  const pdfArea = document.getElementById("cmodal-pdf-area");
  if (d.pdfEmbed) {
    pdfArea.innerHTML = `<iframe src="${d.pdfEmbed}" title="Certificado PDF" style="width:100%;height:560px;border:none;display:block;border-radius:6px;"></iframe>`;
  } else {
    pdfArea.innerHTML = `<div class="pdf-placeholder">
      <div class="pdf-placeholder-icon">📄</div>
      <p class="pdf-placeholder-title">CERTIFICADO PDF</p>
      <p class="pdf-placeholder-sub">El certificado estará disponible próximamente.</p>
    </div>`;
  }

  document.getElementById("cmodal-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function cerrarModalCert() {
  // Pausar iframe al cerrar
  const pdfArea = document.getElementById("cmodal-pdf-area");
  if (pdfArea) pdfArea.innerHTML = '';
  document.getElementById("cmodal-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

function cerrarModalCertFuera(e) {
  if (e.target === document.getElementById("cmodal-overlay")) cerrarModalCert();
}

function cambiarTabCert(btn, tabId) {
  document.querySelectorAll(".cmodal-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".cmodal-tab-content").forEach(c => c.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(tabId).classList.add("active");
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
      { src: `${MEDIA}/01_Imagenes%20y%20videos%20de%20fallas%20en%20el%20equipo/01_PRIMER_VIDEO_TV_LG_FALLA.mp4`, title: "Falla 1 — sin audio / botones" },
      { src: `${MEDIA}/01_Imagenes%20y%20videos%20de%20fallas%20en%20el%20equipo/02_SEGUNDO_VIDEO_TV_LG_FALLA.mp4`, title: "Falla 2 — apagado espontáneo" },
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
    mediaType: "mixed",
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
    imagesBefore: [
      {src: "https://raw.githubusercontent.com/JosueDavid777/Reparaciones-de-equipos-electr-nicos./refs/heads/main/REPARACIONES_ELECTRONICAS/2026%20-%2005%20-ADAPTACION_RADIO/ANTES/01_RADIO_CON_CARGADOR_PARA_ADAPTAR.jpg", title: "Radio con cargador de telefono a adaptar"},
      {src: "https://raw.githubusercontent.com/JosueDavid777/Reparaciones-de-equipos-electr-nicos./refs/heads/main/REPARACIONES_ELECTRONICAS/2026%20-%2005%20-ADAPTACION_RADIO/ANTES/02_CARGADOR_CON_PUNTAS_EXPUESTAS.jpg", title: "Cargador con puntas expuestas"},
      {src: "https://raw.githubusercontent.com/JosueDavid777/Reparaciones-de-equipos-electr-nicos./refs/heads/main/REPARACIONES_ELECTRONICAS/2026%20-%2005%20-ADAPTACION_RADIO/ANTES/03_ENTRADA_A_ADAPTAR.jpg", title: "Radio con entrada a adaptar"}
    ],
    videosAfter: [
      { src: "https://raw.githubusercontent.com/JosueDavid777/Reparaciones-de-equipos-electr-nicos./refs/heads/main/REPARACIONES_ELECTRONICAS/2026%20-%2005%20-ADAPTACION_RADIO/DESPUES/01_RADIO_CON_CARGADOR_SONANDO.mp4", title: "Radio Funcionando" },
      { src: "https://raw.githubusercontent.com/JosueDavid777/Reparaciones-de-equipos-electr-nicos./refs/heads/main/REPARACIONES_ELECTRONICAS/2026%20-%2005%20-ADAPTACION_RADIO/DESPUES/02_RADIO_CERRADO_SONANO.mp4", title: "Radio sellado Funcionando" }
    ],
    pdf: null
  },

  // ── CAMBIO 1: LG32CS410 — ahora tiene mediaType "mixed" con videos de la radio
  //             y el PDF del TV LG (mismo drive link del ST-0001)
  "lg32cs410": {
    title: "Diagnóstico TV LG 32CS410",
    model: "LG · LG32CS410  ·  Reporte ST-0006  ·  Abril 2026",
    mediaType: "mixed",
    fault: "El televisor no enciende tras descarga eléctrica (rayo). Se detectó ausencia de voltaje en línea de 3.3V de la mainboard. Se sospecha daño en el SoC principal.",
    solution: "Se realizó análisis detallado de la mainboard para restablecer la línea de 3.3V. Se identificó falla crítica en el SoC por sobretensión. Se reemplazó el transistor Q710 y capacitores de filtrado, pero el voltaje máximo alcanzado fue ~2.2V — insuficiente. La mainboard presenta daño severo no recuperable; se recomienda reemplazo completo.",
    components: [
      "Inspección inicial y verificación de ausencia de encendido",
      "Medición de líneas de alimentación en la mainboard (énfasis en 3.3V)",
      "Diagnóstico de posible daño por sobretensión (descarga eléctrica)",
      "Identificación de la etapa reguladora de 3.3V",
      "Reemplazo del transistor Q710 en la línea de regulación",
      "Sustitución de capacitores de filtrado asociados",
      "Monitoreo de voltaje tras intervención (máximo ~2.2V)",
      "Evaluación del estado del SoC (sin respuesta)",
      "Determinación de falla crítica en mainboard no reparable"
    ],
    imagesBefore: [
      { src: `${MEDIA_PREMIER}/01_Imagenes%20y%20videos%20de%20fallas%20en%20el%20equipo/01_SULFATACION_EN_EQUIPO.jpg`, title: "Estado inicial — mainboard inspeccionada" },
      { src: `${MEDIA_PREMIER}/01_Imagenes%20y%20videos%20de%20fallas%20en%20el%20equipo/02_CAPACITOR_EXPLOTADO.jpg`, title: "Componentes dañados identificados" },
      { src: `${MEDIA_PREMIER}/01_Imagenes%20y%20videos%20de%20fallas%20en%20el%20equipo/03_CABLES_SUELTOS_DE_LA_GRABADORA.jpg`, title: "Inspección de circuito de alimentación" }
    ],
    videosAfter: [
      { src: "https://raw.githubusercontent.com/JosueDavid777/Reparaciones-de-equipos-electr-nicos./refs/heads/main/REPARACIONES_ELECTRONICAS/2026%20-%2005%20-ADAPTACION_RADIO/DESPUES/01_RADIO_CON_CARGADOR_SONANDO.mp4", title: "Prueba de voltaje tras intervención" },
      { src: "https://raw.githubusercontent.com/JosueDavid777/Reparaciones-de-equipos-electr-nicos./refs/heads/main/REPARACIONES_ELECTRONICAS/2026%20-%2005%20-ADAPTACION_RADIO/DESPUES/02_RADIO_CERRADO_SONANO.mp4", title: "Diagnóstico final documentado" }
    ],
    pdf: `https://drive.google.com/file/d/1vO1wtC-THLGQUQsPzKwq1HE_L40Ql6hR/preview`
  }
};


/* ═══════════════════════════════════════════
   DATOS DE PROYECTOS
═══════════════════════════════════════════ */
const proyectos = {
  "bot-whatsapp": {
    title: "Bot de WhatsApp con IA",
    tag: "PROYECTO_01 · 2026",
    objetivo: "Crear un bot inteligente desplegado en WhatsApp capaz de mantener conversaciones fluidas, entender mensajes de voz y responder de forma natural en español e inglés, sin requerir intervención humana.",
    descripcion: "Bot inteligente desplegado en WhatsApp que reconoce mensajes de voz, los transcribe y responde en dos idiomas. Utiliza la API de Groq para procesamiento de lenguaje natural, Baileys como librería de conexión a WhatsApp Web, y está desplegado 24/7 en Railway. El sistema mantiene contexto conversacional y puede adaptarse a diferentes tipos de consultas.",
    materiales: [
      "Python — lenguaje principal del backend",
      "Baileys — librería Node.js para conexión a WhatsApp Web",
      "Groq API — modelo de lenguaje (LLaMA 3) para respuestas IA",
      "Railway — plataforma de despliegue en la nube (hosting 24/7)",
      "Node.js — entorno de ejecución del servidor",
      "Web Services API — integración y comunicación entre servicios",
      "Reconocimiento de voz (Whisper) — transcripción de audio a texto"
    ],
    pasos: [
      "Configurar entorno Node.js y conectar Baileys a WhatsApp Web mediante QR",
      "Implementar listener de mensajes de texto y audio entrantes",
      "Integrar la API de Groq con prompt system para comportamiento del bot",
      "Agregar pipeline de transcripción de voz con Whisper para mensajes de audio",
      "Manejar contexto conversacional almacenando historial por chat",
      "Configurar variables de entorno y desplegar en Railway con auto-restart",
      "Pruebas de respuesta, latencia y manejo de errores en producción"
    ],
    images: [
      { src: null, title: "Interfaz del bot en WhatsApp" },
      { src: null, title: "Código del servidor en Railway" }
    ],
    video: { src: null, title: "Demo — Bot respondiendo en tiempo real" },
    link: "https://wa.me/573204353941?text=Hola%20bot%20de%20Josue",
    linkLabel: "PROBAR BOT"
  },

  "asistente-python": {
    title: "Asistente Virtual en Python",
    tag: "PROYECTO_02 · NOV 2025",
    objetivo: "Desarrollar un asistente virtual de escritorio con reconocimiento de voz que ejecute comandos del sistema operativo y automatice tareas cotidianas mediante instrucciones habladas.",
    descripcion: "Asistente virtual con reconocimiento y ejecución de comandos de voz. El sistema escucha en tiempo real, interpreta la instrucción, y ejecuta acciones como abrir aplicaciones, buscar en internet, reproducir música o consultar información. Implementado íntegramente en Python con librerías de automatización e inteligencia artificial. Código publicado en GitHub.",
    materiales: [
      "Python — lenguaje principal",
      "SpeechRecognition — captura y conversión de voz a texto",
      "pyttsx3 — síntesis de voz (text-to-speech) offline",
      "OpenAI / Groq API — procesamiento de lenguaje natural",
      "PyAutoGUI — automatización de interfaz gráfica",
      "subprocess — ejecución de comandos del sistema operativo",
      "Wikipedia API — consulta de información enciclopédica",
      "webbrowser — control del navegador web"
    ],
    pasos: [
      "Configurar micrófono y calibrar umbral de ruido ambiental",
      "Implementar loop de escucha continua con detección de palabra clave",
      "Parsear el texto reconocido e identificar el comando solicitado",
      "Mapear comandos a funciones: abrir apps, buscar, reproducir, etc.",
      "Integrar respuesta de voz para confirmar acciones al usuario",
      "Agregar módulo de IA para comandos no estructurados o preguntas",
      "Empaquetar y documentar el proyecto para publicación en GitHub"
    ],
    images: [
      { src: null, title: "Código del asistente virtual" }
    ],
    video: { src: null, title: "Demo — Asistente ejecutando comandos de voz" },
    link: "https://github.com/JosueDavid777",
    linkLabel: "VER EN GITHUB"
  },

  "biometrico": {
    title: "Sistema Biométrico con Microcontrolador",
    tag: "PROYECTO_03 · FEB–MAY 2024",
    objetivo: "Diseñar e implementar un sistema de autenticación por huella dactilar que integre hardware (microcontrolador + sensor biométrico) con software (Python), permitiendo registro, validación y gestión de usuarios.",
    descripcion: "Sistema de autenticación biométrica que combina un microcontrolador (Arduino) con un sensor de huella dactilar y una interfaz de gestión en Python. La comunicación hardware-software se realiza por puerto serial. El sistema permite registrar huellas, validar usuarios y gestionar una base de datos local de accesos. Proyecto universitario completo con documentación técnica.",
    materiales: [
      "Arduino UNO / Nano — microcontrolador principal",
      "Sensor de huella dactilar FPM10A / R307 — captura biométrica",
      "Python — interfaz de gestión y comunicación serial",
      "pyserial — comunicación serial Python ↔ Arduino",
      "Arduino IDE (C/C++) — programación del microcontrolador",
      "SQLite — base de datos local de usuarios y registros",
      "Tkinter — interfaz gráfica de usuario en Python",
      "Cable USB — comunicación y alimentación del Arduino"
    ],
    pasos: [
      "Conectar sensor FPM10A al Arduino y verificar comunicación por serial",
      "Programar el firmware en Arduino (C) para captura y almacenamiento de huellas",
      "Establecer protocolo de comunicación serial entre Arduino y Python",
      "Desarrollar módulo Python para envío de comandos y recepción de respuestas",
      "Implementar base de datos SQLite para almacenar IDs de usuarios y huellas",
      "Crear interfaz gráfica con Tkinter: registro, validación y administración",
      "Pruebas de precisión, tiempo de respuesta y manejo de errores biométricos",
      "Documentar el proyecto y publicar en GitHub con guía de instalación"
    ],
    images: [
      { src: null, title: "Hardware — Arduino y sensor de huella" }
    ],
    video: { src: null, title: "Demo — Autenticación biométrica en funcionamiento" },
    link: "https://github.com/JosueDavid777/Sistema-de-autenticaci-n-biom-trica-con-microcontrolador-y-Python",
    linkLabel: "VER EN GITHUB"
  },

  // ── NUEVO PROYECTO: Fuente de Alimentación Regulable Conmutada
  "fuente-conmutada": {
    title: "Fuente de Alimentación Regulable Conmutada",
    tag: "PROYECTO_04 · 2026",
    objetivo: "Diseñar y construir una fuente de alimentación conmutada con salida de voltaje regulable, capaz de suministrar tensión estable y eficiente para bancos de trabajo de electrónica, reemplazando fuentes comerciales de alto costo.",
    descripcion: "Fuente de alimentación de tipo conmutada (switching) con regulación de voltaje de salida ajustable. A diferencia de las fuentes lineales convencionales, la topología conmutada ofrece mayor eficiencia energética y menor disipación de calor. El proyecto integra etapas de rectificación, filtrado, conversión DC-DC y regulación con retroalimentación, junto con protecciones básicas contra sobrecorriente y cortocircuito. Ideal como herramienta de banco para alimentar circuitos en desarrollo y pruebas electrónicas.",
    materiales: [
      "Transformador de red — reducción de tensión AC",
      "Puente rectificador — conversión AC → DC",
      "Capacitores electrolíticos de filtrado — estabilización de tensión",
      "Controlador PWM (TL494 / UC3843 / similar) — control de conmutación",
      "MOSFET de potencia — elemento de conmutación principal",
      "Inductor de salida — almacenamiento de energía y filtrado",
      "Diodo Schottky de recuperación rápida — rectificación de salida",
      "Potenciómetro multivuelta — ajuste de voltaje de salida",
      "Regulador de referencia (TL431 o similar) — lazo de retroalimentación",
      "Capacitores cerámicos y de tantalio — filtrado de alta frecuencia",
      "Resistencias de potencia — divisor de tensión y limitación",
      "Disipadores de calor — gestión térmica del MOSFET",
      "PCB diseñada a medida — montaje compacto y organizado",
      "Carcasa con panel frontal — display y controles de usuario"
    ],
    pasos: [
      "Definir especificaciones: rango de voltaje de salida, corriente máxima y topología (flyback / buck)",
      "Seleccionar el controlador PWM y calcular frecuencia de conmutación óptima",
      "Dimensionar el transformador o inductor según la potencia requerida",
      "Diseñar el circuito de retroalimentación con TL431 para regulación precisa",
      "Implementar protecciones: límite de corriente, apagado por sobrecalentamiento",
      "Diseñar y fabricar la PCB con separación adecuada de zonas de alta y baja tensión",
      "Montar componentes, soldar y verificar visualmente antes de energizar",
      "Pruebas de voltaje en vacío, con carga nominal y con carga máxima",
      "Medir rizado de salida con osciloscopio y ajustar filtrado si es necesario",
      "Integrar display de voltaje/corriente y ensamblar en carcasa final"
    ],
    images: [
      { src: null, title: "PCB diseñada — vista superior" },
      { src: null, title: "Prototipo en protoboard" },
      { src: null, title: "Ensamblaje final con carcasa" }
    ],
    video: { src: null, title: "Demo — Regulación de voltaje en tiempo real" },
    link: null,
    linkLabel: "VER EN GITHUB"
  }
};


/* ═══════════════════════════════════════════
   HELPERS DE MEDIA (REPARACIONES)
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
   HELPERS DE MEDIA (PROYECTOS)
═══════════════════════════════════════════ */
function mkProyImg(img) {
  if (img.src) {
    return `<div class="img-card" onclick="abrirLightbox('${img.src}')">
      <img src="${img.src}" alt="${img.title}" loading="lazy">
      <div class="img-caption">
        <p class="img-badge after">● CAPTURA</p>
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
      <p class="img-badge after">● CAPTURA</p>
      <p class="img-title">${img.title || 'Imagen pendiente'}</p>
    </div>
  </div>`;
}

function mkProyVideo(v) {
  if (v && v.src) {
    return `<div class="video-tab-card">
      <div class="vid-thumb-wrap" onclick="playVid(this)">
        <video preload="none"><source src="${v.src}" type="video/mp4"></video>
        <div class="vid-overlay">
          <div class="vid-play-btn"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div>
          <span class="vid-type-label">● VIDEO DEL PROYECTO</span>
        </div>
      </div>
      <div class="video-tab-info">
        <p class="video-tab-badge after">● DEMO</p>
        <p class="video-tab-title">${v.title}</p>
      </div>
    </div>`;
  }
  return `<div class="video-tab-card" style="cursor:default;">
    <div class="vid-thumb-wrap" style="cursor:default;">
      <div class="vid-overlay" style="cursor:default;">
        <div class="vid-play-btn" style="opacity:0.35;border-color:rgba(0,255,65,0.3);background:rgba(0,255,65,0.04);">
          <svg viewBox="0 0 24 24" style="fill:rgba(0,255,65,0.4)"><polygon points="5,3 19,12 5,21"/></svg>
        </div>
        <span class="vid-type-label" style="opacity:0.4;">● PRÓXIMAMENTE</span>
      </div>
    </div>
    <div class="video-tab-info">
      <p class="video-tab-badge after" style="opacity:0.4;">● DEMO</p>
      <p class="video-tab-title" style="opacity:0.5;">${v ? v.title : 'Video pendiente'}</p>
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
      'tv-challenger':    { b: [{ src: null, title: 'Placas antes de limpieza' }, { src: null, title: 'Interior con polvo' }], a: [{ src: null, title: 'Placas limpias' }, { src: null, title: 'Equipo en funcionamiento' }] },
      'portatil-ram':     { b: [{ src: null, title: 'Interior antes del mantenimiento' }, { src: null, title: 'Disipador con pasta vieja' }], a: [{ src: null, title: 'RAM instalada' }, { src: null, title: 'Pasta térmica aplicada' }] },
      'grabadora-premier':{ b: [{ src: null, title: 'Placa con capacitor explotado' }, { src: null, title: 'Pistas corroídas y sulfatadas' }], a: [{ src: null, title: 'Reparación completada' }, { src: null, title: 'Grabadora funcionando' }] },
      'cargador-radio':   { b: [{ src: null, title: 'Radio antes de la adaptación' }, { src: null, title: 'Circuito interno analizado' }], a: [{ src: null, title: 'Adaptación completada' }, { src: null, title: 'Radio con alimentación permanente' }] },
      'lg32cs410':        { b: [{ src: null, title: 'Estado inicial del televisor' }, { src: null, title: 'Mainboard inspeccionada' }], a: [{ src: null, title: 'Intervención realizada' }, { src: null, title: 'Diagnóstico final' }] },
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
   MODAL DE PROYECTOS
═══════════════════════════════════════════ */
function abrirModalProyecto(id) {
  const d = proyectos[id];
  if (!d) return;

  document.getElementById("pmodal-title").textContent = d.title;
  document.getElementById("pmodal-tag").textContent = d.tag;
  document.getElementById("pmodal-objetivo").textContent = d.objetivo;
  document.getElementById("pmodal-descripcion").textContent = d.descripcion;

  const ulMat = document.getElementById("pmodal-materiales");
  ulMat.innerHTML = "";
  d.materiales.forEach(m => {
    const li = document.createElement("li");
    li.textContent = m;
    ulMat.appendChild(li);
  });

  const ulPasos = document.getElementById("pmodal-pasos");
  ulPasos.innerHTML = "";
  d.pasos.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="paso-num">${String(i + 1).padStart(2, '0')}</span><span>${p}</span>`;
    ulPasos.appendChild(li);
  });

  const linkBtn = document.getElementById("pmodal-link");
  if (d.link) {
    linkBtn.href = d.link;
    linkBtn.textContent = `> ${d.linkLabel} →`;
    linkBtn.style.display = 'inline-flex';
  } else {
    linkBtn.style.display = 'none';
  }

  const mediaDiv = document.getElementById("pmodal-tab-media");
  let mediaHTML = '';

  if (d.images && d.images.length > 0) {
    mediaHTML += `<p class="img-section-label after">● CAPTURAS DEL PROYECTO</p>
      <div class="images-tab-grid">${d.images.map(img => mkProyImg(img)).join('')}</div>`;
  }

  if (d.images && d.images.length > 0 && d.video) {
    mediaHTML += `<hr class="tab-divider">`;
  }

  if (d.video) {
    mediaHTML += `<p class="vid-section-label after" style="margin-top:0;">● VIDEO DEL PROYECTO</p>
      <div class="videos-tab-grid">${mkProyVideo(d.video)}</div>`;
  }

  if (!mediaHTML) {
    mediaHTML = `<p style="color:var(--muted);font-family:'Share Tech Mono',monospace;font-size:0.8rem;padding:20px 0;">Sin multimedia disponible aún.</p>`;
  }

  mediaDiv.innerHTML = mediaHTML;

  document.querySelectorAll(".pmodal-tab-content").forEach(c => c.classList.remove("active"));
  document.querySelectorAll(".pmodal-tab").forEach(t => t.classList.remove("active"));
  document.getElementById("pmodal-tab-desc").classList.add("active");
  document.querySelector(".pmodal-tab[data-tab='pmodal-tab-desc']").classList.add("active");

  document.getElementById("pmodal-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function cerrarModalProyecto() {
  document.querySelectorAll("#pmodal-overlay video").forEach(v => { v.pause(); v.currentTime = 0; });
  document.getElementById("pmodal-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

function cerrarModalProyectoFuera(e) {
  if (e.target === document.getElementById("pmodal-overlay")) cerrarModalProyecto();
}

function cambiarTabProyecto(btn, tabId) {
  document.querySelectorAll(".pmodal-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".pmodal-tab-content").forEach(c => c.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(tabId).classList.add("active");
}


/* ═══════════════════════════════════════════
   KEYBOARD EVENTS
═══════════════════════════════════════════ */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    cerrarModal();
    cerrarModalProyecto();
    cerrarModalCert();
    cerrarLightbox();
  }
});
