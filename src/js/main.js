document.addEventListener('DOMContentLoaded', () =>
{
  console.log('layout-tailwind listo')
})

// Menú móvil 
const btnAbrir = document.getElementById('btn-abrir');
const btnCerrar = document.getElementById('btn-cerrar');
const menuMovil = document.getElementById('menu-movil');
const fondoMenu = document.getElementById('fondo-menu');
const linksMenu = document.querySelectorAll('#menu-movil a');
 
function abrirMenu() {
  // El aside entra deslizándose desde la derecha
  menuMovil.classList.remove('translate-x-full');
  // El fondo oscuro aparece suavemente
  fondoMenu.classList.remove('opacity-0', 'pointer-events-none');
}
 
function cerrarMenu() {
  menuMovil.classList.add('translate-x-full');
  fondoMenu.classList.add('opacity-0', 'pointer-events-none');
}
 
btnAbrir.addEventListener('click', abrirMenu);
btnCerrar.addEventListener('click', cerrarMenu);
fondoMenu.addEventListener('click', cerrarMenu); // clic afuera cierra el menú
 
linksMenu.forEach(function (link) {
  link.addEventListener('click', cerrarMenu);
});
 
// Slider torneos activos - array provisional
const torneos = [
  {
    nombre: "Copa Verano",
    deporte: "Fútbol",
    descripcion: "Torneo relámpago de fútbol 7 con fase de grupos y eliminatoria directa.",
    equipos: 16,
    fin: "2026-10-20T20:00:00",
    img: "../../src/assets/futbol.jpg",
  },
  {
    nombre: "Liga Vóley Barrial",
    deporte: "Vóley",
    descripcion: "Liga mixta de vóley, un partido por semana durante todo el mes.",
    equipos: 8,
    fin: "2026-10-31T21:00:00",
    img: "../../src/assets/voleyBarr.jpg",
  },
  {
    nombre: "Basket 3x3 Open",
    deporte: "Básquetbol",
    descripcion: "Torneo abierto de básquetbol 3x3. Inscripción por equipos de 4 jugadores.",
    equipos: 12,
    fin: "2026-10-25T18:30:00",
    img: "../../src/assets/basket.jpg",
  },
  {
    nombre: "Copa Handball",
    deporte: "Handball",
    descripcion: "Competencia de handball con partidos los fines de semana.",
    equipos: 10,
    fin: "2026-11-05T19:00:00",
    img: "../../src/assets/handball.jpg",
  },
];
 
(function initSliderTorneos() {
  const root = document.getElementById("slider-torneos");
  if (!root) return;
 
  const track = document.getElementById("slider-track");
  const dotsBox = document.getElementById("slider-dots");
  const n = torneos.length;
  let actual = 0;
  let autoplay;
 
  // tarjetulis torneos
  track.innerHTML = torneos.map((t, i) => `
    <article data-index="${i}" data-pos="hidden" aria-label="${t.nombre}"
      class="group absolute top-1/2 left-1/2 w-[230px] h-[330px] sm:w-[260px] sm:h-[360px]
             rounded-[20px] overflow-hidden bg-black text-white cursor-pointer
             -translate-x-1/2 -translate-y-1/2 scale-[.6] opacity-0 pointer-events-none
             transition-all duration-500 ease-in-out motion-reduce:transition-none
 
             data-[pos=0]:scale-100 data-[pos=0]:opacity-100 data-[pos=0]:z-30
             data-[pos=0]:pointer-events-auto data-[pos=0]:cursor-default
             data-[pos=0]:shadow-[0_20px_50px_rgba(0,0,0,.6)]
 
             data-[pos=-1]:scale-[.82] data-[pos=-1]:opacity-85 data-[pos=-1]:brightness-[.7]
             data-[pos=-1]:z-20 data-[pos=-1]:pointer-events-auto
             data-[pos=-1]:-translate-x-[calc(50%+150px)] sm:data-[pos=-1]:-translate-x-[calc(50%+200px)]
 
             data-[pos=1]:scale-[.82] data-[pos=1]:opacity-85 data-[pos=1]:brightness-[.7]
             data-[pos=1]:z-20 data-[pos=1]:pointer-events-auto
             data-[pos=1]:translate-x-[calc(-50%+150px)] sm:data-[pos=1]:translate-x-[calc(-50%+200px)]">
 
      <img src="${t.img}" alt="" class="absolute inset-0 w-full h-full object-cover">
      <div class="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.85),transparent_60%)]"></div>
 
      <!-- Equipos inscriptos -->
      <span class="absolute top-3 right-3.5 z-10 flex items-center gap-1 text-[13px] font-semibold">
        <span class="material-symbols-outlined text-[18px] text-[#CC8710]">groups</span>${t.equipos}
      </span>
 
      <!-- Info -->
      <div class="absolute inset-x-0 bottom-0 z-10 px-4 pt-4 pb-[60px] text-center
                  group-data-[pos=0]:text-left group-data-[pos=0]:pb-16
                  group-data-[pos=0]:bg-[linear-gradient(to_top,rgba(204,135,16,.92),rgba(204,135,16,.75))]">
        <h3 class="font-semibold text-xl leading-tight group-data-[pos=0]:text-2xl"
            style="font-family: 'Oswald', sans-serif;">${t.nombre}</h3>
        <div class="hidden group-data-[pos=0]:block mt-1.5">
          <p class="font-semibold text-base">Deporte: ${t.deporte}</p>
          <p class="mt-1.5 text-xs font-medium leading-snug">${t.descripcion}</p>
        </div>
      </div>
 
      <!-- Botón -->
      <a href="#"
        class="absolute left-0 bottom-3.5 z-20 py-1.5 pl-4 pr-6 rounded-r-[14px] text-[13px] font-semibold
               bg-black/55 text-white transition-colors duration-300
               group-data-[pos=0]:bg-[#1B1B1B]
               hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black focus-visible:outline-none">Detalles</a>
    </article>
  `).join("");
 
  //  Puntos 
  dotsBox.innerHTML = torneos.map((t, i) => `
    <button data-dot="${i}" aria-label="Ir a ${t.nombre}"
      class="h-2 w-2 rounded-full bg-white/35 transition-all duration-300 cursor-pointer
             aria-[current=true]:w-[22px] aria-[current=true]:bg-[#CC8710]"></button>
  `).join("");
 
  const cards = [...track.children];
  const dots = [...dotsBox.children];
 
  //  Posicionar: -1 izquierda, 0 centro, 1 derecha, "hidden" el resto 
  function render() {
    cards.forEach((card, i) => {
      let d = (i - actual + n) % n;
      if (d > n / 2) d -= n;
      card.dataset.pos = Math.abs(d) <= 1 ? d : "hidden";
      card.querySelector("a").tabIndex = d === 0 ? 0 : -1;
    });
    dots.forEach((dot, i) => dot.setAttribute("aria-current", i === actual));
  }
 
  function ir(i) {
    actual = (i + n) % n;
    render();
  }
 
  // Controles 
  document.getElementById("slider-prev").addEventListener("click", () => { ir(actual - 1); reiniciarAuto(); });
  document.getElementById("slider-next").addEventListener("click", () => { ir(actual + 1); reiniciarAuto(); });
 
  dotsBox.addEventListener("click", (e) => {
    const dot = e.target.closest("[data-dot]");
    if (dot) { ir(+dot.dataset.dot); reiniciarAuto(); }
  });
 
  track.addEventListener("click", (e) => {
    const card = e.target.closest("article");
    if (card && card.dataset.pos !== "0" && card.dataset.pos !== "hidden") {
      e.preventDefault();
      ir(+card.dataset.index);
      reiniciarAuto();
    }
  });
 
  // Teclado
  root.tabIndex = 0;
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") ir(actual - 1);
    if (e.key === "ArrowRight") ir(actual + 1);
  });
 
  // desliz táctil
  let startX = null;
  root.addEventListener("pointerdown", (e) => { startX = e.clientX; });
  root.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 50) { ir(actual + (dx < 0 ? 1 : -1)); reiniciarAuto(); }
    startX = null;
  });
 
  // Autoplay (pausa con el mouse encima) ----
  function iniciarAuto() { clearInterval(autoplay); autoplay = setInterval(() => ir(actual + 1), 5000); }
  function reiniciarAuto() { iniciarAuto(); }
  root.addEventListener("mouseenter", () => clearInterval(autoplay));
  root.addEventListener("mouseleave", iniciarAuto);
 
  render();
  iniciarAuto();
})();

// Flechas FAQ 
var faqPaneles = document.querySelectorAll('.panel-faq');
var faqBtnAnterior = document.getElementById('faq-prev');
var faqBtnSiguiente = document.getElementById('faq-next');
var faqActual = 0;

// Muestra solo el panel actual y esconde los demás
function faqMostrar() {
  for (var i = 0; i < faqPaneles.length; i++) {
    if (i === faqActual) {
      faqPaneles[i].classList.remove('hidden');
    } else {
      faqPaneles[i].classList.add('hidden');
    }
  }
}

// Solo se activa si los botones existen en la página
if (faqBtnAnterior && faqBtnSiguiente) {

  faqBtnSiguiente.addEventListener('click', function () {
    faqActual = faqActual + 1;
    if (faqActual >= faqPaneles.length) {
      faqActual = 0;
    }
    faqMostrar();
  });

  faqBtnAnterior.addEventListener('click', function () {
    faqActual = faqActual - 1;
    if (faqActual < 0) {
      faqActual = faqPaneles.length - 1;
    }
    faqMostrar();
  });

  faqMostrar();
}

// Líneas hr con efecto neón
const lineas = document.querySelectorAll(".hr-neon");
const colorNeon = "#CC8710";

// Estilo inicial de cada línea
lineas.forEach(function (linea) {
  linea.style.background = "linear-gradient(90deg, transparent, " + colorNeon + ", transparent)";
  linea.style.backgroundSize = "200% 100%";
});

let posicion = 0;   // movimiento de la luz
let brillo = 2;     // tamaño del neoncito
let subiendo = true;

setInterval(function () {
  // Mover la luz a lo largo de la línea
  posicion = posicion + 1;
  if (posicion >= 200) {
    posicion = 0;
  }

  // El neoncito sube y baja entre 2 y 10
  if (subiendo) {
    brillo = brillo + 0.2;
    if (brillo >= 10) {
      subiendo = false;
    }
  } else {
    brillo = brillo - 0.2;
    if (brillo <= 2) {
      subiendo = true;
    }
  }

  // Aplicar a todas las líneas
  lineas.forEach(function (linea) {
    linea.style.backgroundPosition = posicion + "% 0%";
    linea.style.filter = "drop-shadow(0 0 " + brillo + "px " + colorNeon + ")";
  });
}, 30);
 
// Bordes con efecto neón
const bordes = document.querySelectorAll(".borde-neon");
const colorBorde = "#CC8710";

let brilloBorde = 2;     // tamaño del resplandor
let subiendoBorde = true;

setInterval(function () {
  // El resplandor sube y baja entre 2 y 12
  if (subiendoBorde) {
    brilloBorde = brilloBorde + 0.2;
    if (brilloBorde >= 12) {
      subiendoBorde = false;
    }
  } else {
    brilloBorde = brilloBorde - 0.2;
    if (brilloBorde <= 2) {
      subiendoBorde = true;
    }
  }

  // Aplicar a todos los bordes
  bordes.forEach(function (borde) {
    borde.style.borderColor = colorBorde;
    borde.style.boxShadow =
      "0 0 " + brilloBorde + "px " + colorBorde + ", inset 0 0 " + brilloBorde + "px " + colorBorde;
  });
}, 30);

// Cambiar entre Inicio de sesión y Registro
const vistaLogin = document.getElementById("vista-login");
const vistaRegistro = document.getElementById("vista-registro");
const linkRegistro = document.getElementById("link-registro");
const linkLogin = document.getElementById("link-login");

// Solo se ejecuta si existen en la página
if (vistaLogin && vistaRegistro) {

  linkRegistro.addEventListener("click", function (e) {
    e.preventDefault(); // evita que el link recargue la página
    vistaLogin.classList.add("hidden");
    vistaRegistro.classList.remove("hidden");
  });

  linkLogin.addEventListener("click", function (e) {
    e.preventDefault();
    vistaRegistro.classList.add("hidden");
    vistaLogin.classList.remove("hidden");
  });
}

// Validar que las dos contraseñas sean iguales
function validarPassword() {
  const password = document.getElementById("password").value;
  const confirmar = document.getElementById("confirm-password").value;
  const mensaje = document.getElementById("mensajeErrorRegistro");

  if (confirmar !== "" && password !== confirmar) {
    mensaje.textContent = "Las contraseñas no coinciden";
  } else {
    mensaje.textContent = "";
  }
}

// Página a la que se envía al usuario cuando el acceso es correcto
const paginaDestino = "principal.html";

//  REGISTRO 
const formRegistro = document.getElementById("formRegistro");

if (formRegistro) {
  formRegistro.addEventListener("submit", function (e) {
    e.preventDefault(); // evita que el formulario recargue la página

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const email = document.getElementById("emailRegistro").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmar = document.getElementById("confirm-password").value;
    const mensaje = document.getElementById("mensajeErrorRegistro");

    // Validaciones
    if (password.length < 6) {
      mensaje.textContent = "La contraseña debe tener al menos 6 caracteres";
      return;
    }

    if (password !== confirmar) {
      mensaje.textContent = "Las contraseñas no coinciden";
      return;
    }

    // Guardar la cuenta en el navegador
    const usuario = {
      nombre: nombre,
      apellido: apellido,
      email: email,
      password: password
    };
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("sesionIniciada", "si");

    // Enviar a la otra página
    window.location.href = paginaDestino;
  });
}

// INICIO DE SESIÓN 
const formLogin = document.getElementById("formLogin");

if (formLogin) {
  formLogin.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("contrasena").value;
    const mensaje = document.getElementById("mensajeError");

    // Buscar la cuenta guardada
    const guardado = localStorage.getItem("usuario");

    if (guardado === null) {
      mensaje.textContent = "No existe ninguna cuenta. Regístrate primero";
      return;
    }

    const usuario = JSON.parse(guardado);

    if (email !== usuario.email || password !== usuario.password) {
      mensaje.textContent = "Email o contraseña incorrectos";
      return;
    }

    // Todo correcto
    localStorage.setItem("sesionIniciada", "si");
    window.location.href = paginaDestino;
  });
}

// ===== PÁGINA PRINCIPAL =====

// ---------- 1. Perfil ----------
const perfilNombre = document.getElementById("perfil-nombre");

if (perfilNombre) {
  const datosPerfil = localStorage.getItem("usuario");

  // Si hay una cuenta guardada, mostrar sus datos
  if (datosPerfil !== null) {
    const usuarioPerfil = JSON.parse(datosPerfil);
    perfilNombre.textContent = usuarioPerfil.nombre + " " + usuarioPerfil.apellido;
    document.getElementById("perfil-email").textContent = usuarioPerfil.email;
  }

  // Cerrar sesión
  document.getElementById("btn-cerrar-sesion").addEventListener("click", function () {
    localStorage.removeItem("sesionIniciada");
    window.location.href = "iniciosesion.html";
  });
}

// ---------- 2. Buscador + galería de torneos activos ----------
const galeria = document.getElementById("galeria-torneos");
const buscador = document.getElementById("buscador-torneos");
const sinResultados = document.getElementById("sin-resultados");
const maximoTorneos = 3; // cuántos torneos se muestran a la vez

function mostrarTorneos(texto) {
  texto = texto.toLowerCase().trim();
  galeria.innerHTML = "";
  let mostrados = 0;

  for (let i = 0; i < torneos.length; i++) {
    const t = torneos[i];

    // Buscar en el nombre y en el deporte
    const coincide = t.nombre.toLowerCase().includes(texto) || t.deporte.toLowerCase().includes(texto);

    if (coincide && mostrados < maximoTorneos) {
      galeria.innerHTML +=
        '<div class="flex items-center gap-3 border border-white/20 rounded-xl p-2 transition duration-300 hover:border-[#CC8710]">' +
          '<img src="' + t.img + '" alt="" class="w-16 h-16 rounded-lg object-cover bg-black">' +
          '<div class="flex-1">' +
            '<h3 class="font-semibold" style="font-family: \'Oswald\', sans-serif;">' + t.nombre + '</h3>' +
            '<p class="text-xs text-gray-300">' + t.deporte + ' · ' + t.equipos + ' equipos</p>' +
          '</div>' +
          '<a href="#" class="text-sm text-[#CC8710] hover:underline">Detalles</a>' +
        '</div>';
      mostrados = mostrados + 1;
    }
  }

  // Mensaje si no hay resultados
  if (mostrados === 0) {
    sinResultados.classList.remove("hidden");
  } else {
    sinResultados.classList.add("hidden");
  }
}

if (galeria && buscador) {
  mostrarTorneos("");  // al cargar, muestra los primeros

  buscador.addEventListener("input", function () {
    mostrarTorneos(buscador.value);
  });
}

// ---------- 4. Mis torneos (array provisional) ----------
const misTorneos = [
  { nombre: "Copa Verano", deporte: "Fútbol", estado: "En curso" },
  { nombre: "Basket 3x3 Open", deporte: "Básquetbol", estado: "Inscripto" },
];

const listaMisTorneos = document.getElementById("lista-mis-torneos");

if (listaMisTorneos) {
  const sinMisTorneos = document.getElementById("sin-mis-torneos");

  if (misTorneos.length === 0) {
    sinMisTorneos.classList.remove("hidden");
  }

  for (let i = 0; i < misTorneos.length; i++) {
    const m = misTorneos[i];

    listaMisTorneos.innerHTML +=
      '<div class="flex items-center justify-between gap-3 border border-white/20 rounded-xl p-3 transition duration-300 hover:border-[#CC8710]">' +
        '<div>' +
          '<h3 class="font-semibold" style="font-family: \'Oswald\', sans-serif;">' + m.nombre + '</h3>' +
          '<p class="text-xs text-gray-300">' + m.deporte + '</p>' +
        '</div>' +
        '<span class="text-xs uppercase tracking-widest text-[#CC8710] border border-[#CC8710] rounded-full px-3 py-1">' + m.estado + '</span>' +
      '</div>';
  }
}

// ===== CREAR TORNEO (stepper) =====
const formTorneo = document.getElementById("formTorneo");

if (formTorneo) {

  const totalPasos = 4;
  let pasoActual = 1;

  const stepItems = document.querySelectorAll(".step-item");
  const stepLineas = document.querySelectorAll(".step-linea");
  const btnAtras = document.getElementById("btnAtras");
  const btnSiguiente = document.getElementById("btnSiguiente");
  const mensajeTorneo = document.getElementById("mensajeErrorTorneo");
  const selModalidad = document.getElementById("modalidadTorneo");
  const diasBtns = document.querySelectorAll(".dia-btn");

  // Evita que Enter envíe el formulario
  formTorneo.addEventListener("submit", function (e) {
    e.preventDefault();
  });

  // ---------- Mostrar el paso actual ----------
  function mostrarPaso() {

    // Mostrar solo el paso actual
    for (let i = 1; i <= totalPasos; i++) {
      const paso = document.getElementById("step-" + i);
      if (i === pasoActual) {
        paso.classList.remove("hidden");
      } else {
        paso.classList.add("hidden");
      }
    }

    // Colorear el stepper
    stepItems.forEach(function (item, indice) {
      const circulo = item.querySelector(".step-circulo");
      const texto = item.querySelector("span");

      if (indice + 1 <= pasoActual) {
        circulo.style.backgroundColor = "#CC8710";
        circulo.style.borderColor = "#CC8710";
        circulo.style.color = "#1B1B1B";
        texto.style.color = "#CC8710";
      } else {
        circulo.style.backgroundColor = "transparent";
        circulo.style.borderColor = "rgba(255, 255, 255, 0.4)";
        circulo.style.color = "white";
        texto.style.color = "#9CA3AF";
      }
    });

    // Colorear las líneas entre pasos
    stepLineas.forEach(function (linea, indice) {
      if (indice + 1 < pasoActual) {
        linea.style.backgroundColor = "#CC8710";
      } else {
        linea.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      }
    });

    // Botón Atrás: oculto en el paso 1
    if (pasoActual === 1) {
      btnAtras.classList.add("hidden");
    } else {
      btnAtras.classList.remove("hidden");
    }

    // Texto del botón principal
    if (pasoActual === totalPasos) {
      btnSiguiente.textContent = "Crear torneo";
    } else {
      btnSiguiente.textContent = "Siguiente";
    }

    mensajeTorneo.textContent = "";
  }

  // ---------- Modalidad: equipos o individual ----------
  function cambiarModalidad() {
    const esEquipo = selModalidad.value === "equipos";

    document.querySelectorAll(".bloque-equipo").forEach(function (bloque) {
      if (esEquipo) {
        bloque.classList.remove("hidden");
      } else {
        bloque.classList.add("hidden");
      }
    });

    document.querySelectorAll(".bloque-individual").forEach(function (bloque) {
      if (esEquipo) {
        bloque.classList.add("hidden");
      } else {
        bloque.classList.remove("hidden");
      }
    });
  }

  selModalidad.addEventListener("change", cambiarModalidad);
  cambiarModalidad();

  // ---------- Botones de los días ----------
  function pintarDia(boton) {
    if (boton.dataset.activo === "si") {
      boton.style.backgroundColor = "#CC8710";
      boton.style.borderColor = "#CC8710";
      boton.style.color = "#1B1B1B";
    } else {
      boton.style.backgroundColor = "transparent";
      boton.style.borderColor = "rgba(255, 255, 255, 0.4)";
      boton.style.color = "white";
    }
  }

  diasBtns.forEach(function (boton) {
    pintarDia(boton);

    boton.addEventListener("click", function () {
      if (boton.dataset.activo === "si") {
        boton.dataset.activo = "no";
      } else {
        boton.dataset.activo = "si";
      }
      pintarDia(boton);
    });
  });

  function diasElegidos() {
    const lista = [];
    diasBtns.forEach(function (boton) {
      if (boton.dataset.activo === "si") {
        lista.push(boton.textContent.trim());
      }
    });
    return lista;
  }

  // ---------- Validar cada paso ----------
  function validarPaso(numero) {

    if (numero === 1) {
      if (document.getElementById("nombreTorneo").value.trim() === "") {
        return "Escribe el nombre del torneo";
      }
      if (document.getElementById("deporteSelec").value.trim() === "") {
        return "Indica el deporte";
      }
    }

    if (numero === 2) {
      if (selModalidad.value === "equipos") {
        const jugadores = Number(document.getElementById("jugadoresPorEquipo").value);
        if (jugadores < 1) {
          return "Los jugadores por equipo deben ser al menos 1";
        }
      }
    }

    if (numero === 3) {
      const inicio = document.getElementById("fechaInicio").value;
      const fin = document.getElementById("fechaFin").value;
      const horaInicio = document.getElementById("horaInicio").value;
      const horaFin = document.getElementById("horaFin").value;

      if (inicio === "" || fin === "") {
        return "Elige la fecha de inicio y la de finalización";
      }
      if (fin < inicio) {
        return "La fecha de finalización no puede ser antes del inicio";
      }
      if (diasElegidos().length === 0) {
        return "Elige al menos un día para los partidos";
      }
      if (horaFin <= horaInicio) {
        return "La hora de fin debe ser después de la hora de inicio";
      }
    }

    if (numero === 4) {
      if (!document.getElementById("confirmCheck").checked) {
        return "Confirma que la información es correcta";
      }
    }

    return "";   // vacío = todo bien
  }

  // ---------- Resumen del paso 4 ----------
  function formatearFecha(fecha) {
    const partes = fecha.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
  }

  function llenarResumen() {
    const modalidadTexto = selModalidad.options[selModalidad.selectedIndex].text;
    let participantes = "";

    if (selModalidad.value === "equipos") {
      participantes = document.getElementById("equiposPart").value + " equipos de " +
                      document.getElementById("jugadoresPorEquipo").value + " jugadores";
    } else {
      participantes = document.getElementById("jugadoresPart").value + " jugadores";
    }

    document.getElementById("resNombre").textContent = document.getElementById("nombreTorneo").value.trim();

    document.getElementById("resDeporteCat").textContent =
      document.getElementById("deporteSelec").value.trim() + " / " +
      document.getElementById("categoria").value + " / " + modalidadTexto;

    document.getElementById("resFormatoEquipos").textContent =
      document.getElementById("formatoTorneo").value + " · " + participantes;

    document.getElementById("resFechas").textContent =
      formatearFecha(document.getElementById("fechaInicio").value) + " al " +
      formatearFecha(document.getElementById("fechaFin").value);

    document.getElementById("resHorarios").textContent =
      diasElegidos().join(", ") + " · " +
      document.getElementById("horaInicio").value + " a " +
      document.getElementById("horaFin").value;
  }

  // ---------- Guardar el torneo y cambiar de página ----------
  function crearTorneo() {
    const torneoNuevo = {
      nombre: document.getElementById("nombreTorneo").value.trim(),
      modalidad: selModalidad.value,
      deporte: document.getElementById("deporteSelec").value.trim(),
      categoria: document.getElementById("categoria").value,
      formato: document.getElementById("formatoTorneo").value,
      equipos: document.getElementById("equiposPart").value,
      jugadoresPorEquipo: document.getElementById("jugadoresPorEquipo").value,
      jugadores: document.getElementById("jugadoresPart").value,
      reglas: document.getElementById("reglasGenerales").value.trim(),
      fechaInicio: document.getElementById("fechaInicio").value,
      fechaFin: document.getElementById("fechaFin").value,
      dias: diasElegidos(),
      horaInicio: document.getElementById("horaInicio").value,
      horaFin: document.getElementById("horaFin").value
    };

    // Traer los torneos ya guardados (o una lista vacía) y agregar el nuevo
    const lista = JSON.parse(localStorage.getItem("torneosCreados") || "[]");
    lista.push(torneoNuevo);
    localStorage.setItem("torneosCreados", JSON.stringify(lista));

    window.location.href = "principal.html";
  }

  // ---------- Botones Siguiente y Atrás ----------
  btnSiguiente.addEventListener("click", function () {
    const error = validarPaso(pasoActual);

    if (error !== "") {
      mensajeTorneo.textContent = error;
      return;
    }

    if (pasoActual < totalPasos) {
      pasoActual = pasoActual + 1;
      if (pasoActual === totalPasos) {
        llenarResumen();
      }
      mostrarPaso();
    } else {
      crearTorneo();
    }
  });

  btnAtras.addEventListener("click", function () {
    pasoActual = pasoActual - 1;
    mostrarPaso();
  });

  mostrarPaso();
}

// ===== PERFIL DE TORNEO (tabla de posiciones) =====
const selectTorneo = document.getElementById("select-torneo");

if (selectTorneo) {

  // ---------- Datos provisionales (después vendrán de la base de datos) ----------
  // miRol puede ser: "organizador", "encargado", "participante" o "ninguno"
  // Cambia el miRol para probar cómo se ve cada permiso
  const torneosPerfil = {
    "copa-montevideo": {
      nombre: "Copa Montevideo 11",
      deporte: "Fútbol",
      fechaInicio: "2026-10-01",
      fechaFin: "2026-12-15",
      descripcion: "Torneo de fútbol 11 con partidos todos los fines de semana.",
      miRol: "organizador",
      encargados: ["Lucía Fernández"],
      solicitudes: [
        { nombre: "Los Halcones", capitan: "Martín Gómez" }
      ],
      equipos: [
        { nombre: "Atlético Norte", capitan: "Diego Pérez", pg: 5, pe: 1, pp: 0, gf: 14, gc: 4 },
        { nombre: "Deportivo Sur", capitan: "Ana Silva", pg: 4, pe: 1, pp: 1, gf: 11, gc: 6 },
        { nombre: "Unión Centro", capitan: "Carlos Díaz", pg: 3, pe: 2, pp: 1, gf: 9, gc: 7 },
        { nombre: "Racing Este", capitan: "Sofía Rojas", pg: 1, pe: 1, pp: 4, gf: 5, gc: 12 }
      ]
    },
    "liga-futsal": {
      nombre: "Liga de Fútbol Sala",
      deporte: "Fútbol sala",
      fechaInicio: "2026-10-10",
      fechaFin: "2026-11-30",
      descripcion: "Liga de fútbol sala, todos contra todos.",
      miRol: "participante",
      encargados: [],
      solicitudes: [],
      equipos: [
        { nombre: "Los Pibes", capitan: "Mateo Núñez", pg: 3, pe: 0, pp: 1, gf: 15, gc: 9 },
        { nombre: "Futsal Club", capitan: "Valentina Cruz", pg: 2, pe: 1, pp: 1, gf: 10, gc: 8 }
      ]
    },
    "torneo-handball": {
      nombre: "Torneo Abierto Handball",
      deporte: "Handball",
      fechaInicio: "2026-11-05",
      fechaFin: "2026-12-20",
      descripcion: "Competencia abierta de handball con partidos los fines de semana.",
      miRol: "ninguno",
      encargados: [],
      solicitudes: [],
      equipos: [
        { nombre: "Handball Montevideo", capitan: "Julia Ortiz", pg: 2, pe: 0, pp: 0, gf: 52, gc: 40 },
        { nombre: "Club Pocitos", capitan: "Andrés Silva", pg: 0, pe: 0, pp: 2, gf: 40, gc: 52 }
      ]
    }
  };

  const textoRol = {
    organizador: "Organizador",
    encargado: "Encargado",
    participante: "Participante",
    ninguno: "Espectador"
  };

  // ---------- Elementos de la página ----------
  const filtroMisTorneos = document.getElementById("filtro-mis-torneos");
  const bodyRanking = document.getElementById("body-ranking");
  const sinEquipos = document.getElementById("sin-equipos");
  const panelGestion = document.getElementById("panel-gestion");
  const bloquesOrganizador = document.querySelectorAll(".solo-organizador");

  const listaSolicitudes = document.getElementById("lista-solicitudes");
  const sinSolicitudes = document.getElementById("sin-solicitudes");
  const listaParticipantes = document.getElementById("lista-participantes");
  const listaEncargados = document.getElementById("lista-encargados");

  const inputNuevoEquipo = document.getElementById("nuevo-equipo");
  const inputNuevoCapitan = document.getElementById("nuevo-capitan");
  const inputNuevoEncargado = document.getElementById("nuevo-encargado");
  const editFechaInicio = document.getElementById("edit-fecha-inicio");
  const editFechaFin = document.getElementById("edit-fecha-fin");
  const editDescripcion = document.getElementById("edit-descripcion");
  const resLocal = document.getElementById("res-local");
  const resVisitante = document.getElementById("res-visitante");
  const resGolesLocal = document.getElementById("res-goles-local");
  const resGolesVisitante = document.getElementById("res-goles-visitante");

  const msgParticipantes = document.getElementById("msg-participantes");
  const msgEncargados = document.getElementById("msg-encargados");
  const msgInfo = document.getElementById("msg-info");
  const msgResultado = document.getElementById("msg-resultado");

  let torneoActual = null;   // el torneo que está elegido en el select

  // Estilos de los botones chicos que genera el JS
  const claseBoton = "border border-[#CC8710] text-xs uppercase tracking-widest px-3 py-1 cursor-pointer transition-all duration-300 hover:bg-[#CC8710] active:scale-95";
  const claseBotonPeligro = "border border-red-500 text-red-400 text-xs uppercase tracking-widest px-3 py-1 cursor-pointer transition-all duration-300 hover:bg-red-500 hover:text-white active:scale-95";

  // ---------- Funciones de ayuda ----------

  // Evita que un nombre con < o > rompa la página
  function limpiarTexto(texto) {
    return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function fechaBonita(fecha) {
    const partes = fecha.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
  }

  function mostrarMensaje(elemento, texto, esError) {
    elemento.textContent = texto;
    if (esError) {
      elemento.style.color = "#EF4444";
    } else {
      elemento.style.color = "#CC8710";
    }
  }

  function esOrganizador() {
    return torneoActual.miRol === "organizador";
  }

  function puedeEditar() {
    return torneoActual.miRol === "organizador" || torneoActual.miRol === "encargado";
  }

  // ---------- Select de torneos ----------
  function llenarSelect() {
    selectTorneo.innerHTML = "";

    for (const clave in torneosPerfil) {
      const t = torneosPerfil[clave];

      // Si está marcado el filtro, saltar los torneos donde no participo
      if (filtroMisTorneos.checked && t.miRol === "ninguno") {
        continue;
      }

      selectTorneo.innerHTML += '<option value="' + clave + '">' + t.nombre + '</option>';
    }
  }

  // ---------- Información del torneo ----------
  function pintarInfo() {
    document.getElementById("info-nombre").textContent = torneoActual.nombre;
    document.getElementById("info-deporte").textContent = torneoActual.deporte;
    document.getElementById("info-fechas").textContent =
      fechaBonita(torneoActual.fechaInicio) + " al " + fechaBonita(torneoActual.fechaFin);
    document.getElementById("info-rol").textContent = textoRol[torneoActual.miRol];
    document.getElementById("info-descripcion").textContent = torneoActual.descripcion;
  }

  // ---------- Tabla de posiciones ----------
  function pintarRanking() {
    const tabla = [];

    // Calcular PJ, DIF y PTS de cada equipo
    for (let i = 0; i < torneoActual.equipos.length; i++) {
      const e = torneoActual.equipos[i];
      tabla.push({
        nombre: e.nombre,
        capitan: e.capitan,
        pj: e.pg + e.pe + e.pp,
        pg: e.pg,
        pe: e.pe,
        pp: e.pp,
        gf: e.gf,
        gc: e.gc,
        dif: e.gf - e.gc,
        pts: e.pg * 3 + e.pe
      });
    }

    // Ordenar: más puntos primero. Si empatan, mejor diferencia. Si siguen igual, más goles a favor
    tabla.sort(function (a, b) {
      if (b.pts !== a.pts) { return b.pts - a.pts; }
      if (b.dif !== a.dif) { return b.dif - a.dif; }
      return b.gf - a.gf;
    });

    bodyRanking.innerHTML = "";

    for (let i = 0; i < tabla.length; i++) {
      const t = tabla[i];

      // El primero se resalta en naranja
      let colorPosicion = "text-white";
      if (i === 0) {
        colorPosicion = "text-[#CC8710]";
      }

      // La diferencia lleva + si es positiva
      let textoDif = String(t.dif);
      if (t.dif > 0) {
        textoDif = "+" + t.dif;
      }

      bodyRanking.innerHTML +=
        '<tr class="border-b border-white/10 transition duration-300 hover:bg-white/5">' +
          '<td class="py-3 px-2 font-bold ' + colorPosicion + '">' + (i + 1) + '</td>' +
          '<td class="py-3 px-2 text-left">' +
            '<span class="font-semibold">' + limpiarTexto(t.nombre) + '</span> ' +
            '<span class="text-xs text-gray-400">(' + limpiarTexto(t.capitan) + ')</span>' +
          '</td>' +
          '<td class="py-3 px-2">' + t.pj + '</td>' +
          '<td class="py-3 px-2">' + t.pg + '</td>' +
          '<td class="py-3 px-2">' + t.pe + '</td>' +
          '<td class="py-3 px-2">' + t.pp + '</td>' +
          '<td class="py-3 px-2">' + t.gf + '</td>' +
          '<td class="py-3 px-2">' + t.gc + '</td>' +
          '<td class="py-3 px-2">' + textoDif + '</td>' +
          '<td class="py-3 px-2 font-bold text-[#CC8710]">' + t.pts + '</td>' +
        '</tr>';
    }

    if (tabla.length === 0) {
      sinEquipos.classList.remove("hidden");
    } else {
      sinEquipos.classList.add("hidden");
    }
  }

  // ---------- Panel de gestión: listas ----------
  function pintarPanel() {

    // Solicitudes pendientes
    listaSolicitudes.innerHTML = "";
    for (let i = 0; i < torneoActual.solicitudes.length; i++) {
      const s = torneoActual.solicitudes[i];
      listaSolicitudes.innerHTML +=
        '<div class="flex items-center justify-between gap-3 border border-white/20 rounded-xl p-3">' +
          '<div>' +
            '<p class="font-semibold">' + limpiarTexto(s.nombre) + '</p>' +
            '<p class="text-xs text-gray-400">Capitán: ' + limpiarTexto(s.capitan) + '</p>' +
          '</div>' +
          '<div class="flex gap-2">' +
            '<button type="button" data-accion="aceptar" data-indice="' + i + '" class="' + claseBoton + '">Aceptar</button>' +
            '<button type="button" data-accion="rechazar" data-indice="' + i + '" class="' + claseBotonPeligro + '">Rechazar</button>' +
          '</div>' +
        '</div>';
    }
    if (torneoActual.solicitudes.length === 0) {
      sinSolicitudes.classList.remove("hidden");
    } else {
      sinSolicitudes.classList.add("hidden");
    }

    // Equipos inscriptos
    listaParticipantes.innerHTML = "";
    for (let i = 0; i < torneoActual.equipos.length; i++) {
      const e = torneoActual.equipos[i];
      listaParticipantes.innerHTML +=
        '<div class="flex items-center justify-between gap-3 border border-white/20 rounded-xl p-3">' +
          '<div>' +
            '<p class="font-semibold">' + limpiarTexto(e.nombre) + '</p>' +
            '<p class="text-xs text-gray-400">Capitán: ' + limpiarTexto(e.capitan) + '</p>' +
          '</div>' +
          '<button type="button" data-accion="eliminar" data-indice="' + i + '" class="' + claseBotonPeligro + '">Eliminar</button>' +
        '</div>';
    }

    // Encargados
    listaEncargados.innerHTML = "";
    for (let i = 0; i < torneoActual.encargados.length; i++) {
      listaEncargados.innerHTML +=
        '<div class="flex items-center justify-between gap-3 border border-white/20 rounded-xl p-3">' +
          '<p class="font-semibold">' + limpiarTexto(torneoActual.encargados[i]) + '</p>' +
          '<button type="button" data-accion="quitar" data-indice="' + i + '" class="' + claseBotonPeligro + '">Quitar permiso</button>' +
        '</div>';
    }

    // Selects del resultado de partido
    let opciones = "";
    for (let i = 0; i < torneoActual.equipos.length; i++) {
      opciones += '<option value="' + i + '">' + limpiarTexto(torneoActual.equipos[i].nombre) + '</option>';
    }
    resLocal.innerHTML = opciones;
    resVisitante.innerHTML = opciones;
    if (torneoActual.equipos.length > 1) {
      resVisitante.value = "1";
    }
  }

  // Rellena el formulario de información con los datos del torneo
  function llenarFormularioInfo() {
    editFechaInicio.value = torneoActual.fechaInicio;
    editFechaFin.value = torneoActual.fechaFin;
    editDescripcion.value = torneoActual.descripcion;
  }

  // ---------- Permisos: qué se muestra según el rol ----------
  function aplicarPermisos() {

    // El panel solo lo ven organizador y encargado
    if (puedeEditar()) {
      panelGestion.classList.remove("hidden");
    } else {
      panelGestion.classList.add("hidden");
    }

    // Participantes y encargados: solo el organizador
    bloquesOrganizador.forEach(function (bloque) {
      if (esOrganizador()) {
        bloque.classList.remove("hidden");
      } else {
        bloque.classList.add("hidden");
      }
    });
  }

  // ---------- Mostrar el torneo elegido ----------
  function mostrarPerfilTorneo() {
    torneoActual = torneosPerfil[selectTorneo.value];

    // Si no hay ningún torneo para mostrar
    if (!torneoActual) {
      bodyRanking.innerHTML = "";
      sinEquipos.classList.remove("hidden");
      panelGestion.classList.add("hidden");
      return;
    }

    pintarInfo();
    pintarRanking();
    pintarPanel();
    llenarFormularioInfo();
    aplicarPermisos();
  }

  // ---------- Eventos: filtros ----------
  selectTorneo.addEventListener("change", mostrarPerfilTorneo);

  filtroMisTorneos.addEventListener("change", function () {
    llenarSelect();
    mostrarPerfilTorneo();
  });

  // ---------- Eventos: solicitudes (aceptar / rechazar) ----------
  listaSolicitudes.addEventListener("click", function (e) {
    const accion = e.target.dataset.accion;
    if (!accion || !esOrganizador()) { return; }

    const indice = Number(e.target.dataset.indice);
    const solicitud = torneoActual.solicitudes[indice];

    if (accion === "aceptar") {
      torneoActual.equipos.push({
        nombre: solicitud.nombre, capitan: solicitud.capitan,
        pg: 0, pe: 0, pp: 0, gf: 0, gc: 0
      });
    }

    torneoActual.solicitudes.splice(indice, 1);   // sale de la lista de pendientes
    pintarRanking();
    pintarPanel();
  });

  // ---------- Eventos: eliminar un equipo ----------
  listaParticipantes.addEventListener("click", function (e) {
    if (e.target.dataset.accion !== "eliminar" || !esOrganizador()) { return; }

    if (!confirm("¿Seguro que quieres eliminar a este equipo?")) { return; }

    torneoActual.equipos.splice(Number(e.target.dataset.indice), 1);
    pintarRanking();
    pintarPanel();
  });

  // ---------- Eventos: agregar un equipo ----------
  document.getElementById("btn-agregar-equipo").addEventListener("click", function () {
    if (!esOrganizador()) { return; }

    const nombre = inputNuevoEquipo.value.trim();
    const capitan = inputNuevoCapitan.value.trim();

    if (nombre === "" || capitan === "") {
      mostrarMensaje(msgParticipantes, "Escribe el nombre del equipo y el del capitán", true);
      return;
    }

    torneoActual.equipos.push({ nombre: nombre, capitan: capitan, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0 });
    inputNuevoEquipo.value = "";
    inputNuevoCapitan.value = "";
    mostrarMensaje(msgParticipantes, "Equipo agregado", false);
    pintarRanking();
    pintarPanel();
  });

  // ---------- Eventos: encargados ----------
  document.getElementById("btn-agregar-encargado").addEventListener("click", function () {
    if (!esOrganizador()) { return; }

    const nombre = inputNuevoEncargado.value.trim();

    if (nombre === "") {
      mostrarMensaje(msgEncargados, "Escribe el nombre o email de la persona", true);
      return;
    }

    torneoActual.encargados.push(nombre);
    inputNuevoEncargado.value = "";
    mostrarMensaje(msgEncargados, "Permiso otorgado", false);
    pintarPanel();
  });

  listaEncargados.addEventListener("click", function (e) {
    if (e.target.dataset.accion !== "quitar" || !esOrganizador()) { return; }

    torneoActual.encargados.splice(Number(e.target.dataset.indice), 1);
    pintarPanel();
  });

  // ---------- Eventos: guardar información general ----------
  document.getElementById("btn-guardar-info").addEventListener("click", function () {
    if (!puedeEditar()) { return; }

    const inicio = editFechaInicio.value;
    const fin = editFechaFin.value;

    if (inicio === "" || fin === "") {
      mostrarMensaje(msgInfo, "Elige las dos fechas", true);
      return;
    }
    if (fin < inicio) {
      mostrarMensaje(msgInfo, "La fecha de fin no puede ser antes del inicio", true);
      return;
    }

    torneoActual.fechaInicio = inicio;
    torneoActual.fechaFin = fin;
    torneoActual.descripcion = editDescripcion.value.trim();

    pintarInfo();
    mostrarMensaje(msgInfo, "Información guardada", false);
  });

  // ---------- Eventos: registrar un resultado ----------
  document.getElementById("btn-registrar-resultado").addEventListener("click", function () {
    if (!puedeEditar()) { return; }

    const indiceLocal = Number(resLocal.value);
    const indiceVisitante = Number(resVisitante.value);
    const golesLocal = Number(resGolesLocal.value);
    const golesVisitante = Number(resGolesVisitante.value);

    if (torneoActual.equipos.length < 2) {
      mostrarMensaje(msgResultado, "Necesitas al menos dos equipos", true);
      return;
    }
    if (indiceLocal === indiceVisitante) {
      mostrarMensaje(msgResultado, "Elige dos equipos distintos", true);
      return;
    }
    if (golesLocal < 0 || golesVisitante < 0) {
      mostrarMensaje(msgResultado, "Los goles no pueden ser negativos", true);
      return;
    }

    const local = torneoActual.equipos[indiceLocal];
    const visitante = torneoActual.equipos[indiceVisitante];

    // Sumar los goles
    local.gf = local.gf + golesLocal;
    local.gc = local.gc + golesVisitante;
    visitante.gf = visitante.gf + golesVisitante;
    visitante.gc = visitante.gc + golesLocal;

    // Ganó, empató o perdió
    if (golesLocal > golesVisitante) {
      local.pg = local.pg + 1;
      visitante.pp = visitante.pp + 1;
    } else if (golesLocal < golesVisitante) {
      visitante.pg = visitante.pg + 1;
      local.pp = local.pp + 1;
    } else {
      local.pe = local.pe + 1;
      visitante.pe = visitante.pe + 1;
    }

    resGolesLocal.value = 0;
    resGolesVisitante.value = 0;
    mostrarMensaje(msgResultado, "Resultado registrado. La tabla se actualizó", false);
    pintarRanking();
  });

  // ---------- Arranque ----------
  llenarSelect();
  mostrarPerfilTorneo();
}

// ===== PÁGINAS DE LA APP (torneos, mis torneos, perfil, configuración, calendario) =====

const estiloOswald = "font-family: 'Oswald', sans-serif;";

// Evita que un texto con < o > rompa la página (si ya tienes esta función arriba, no la repitas)
function limpiarTexto(texto) {
  return String(texto).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Mensajes de aviso: naranja = bien, rojo = error
function ponerAviso(elemento, texto, esError) {
  elemento.textContent = texto;
  if (esError) {
    elemento.style.color = "#EF4444";
  } else {
    elemento.style.color = "#CC8710";
  }
}

// Color de la etiqueta de estado de un torneo
function claseEstadoTorneo(estado) {
  if (estado === "En curso") {
    return "bg-[#CC8710] text-[#1B1B1B]";
  }
  return "border border-[#CC8710] text-[#CC8710]";
}

// Marca en naranja el enlace de la página actual en el menú
const paginaActual = window.location.pathname.split("/").pop();

document.querySelectorAll("nav a, #menu-movil a").forEach(function (enlace) {
  if (paginaActual !== "" && enlace.getAttribute("href") === paginaActual) {
    enlace.style.color = "#CC8710";
  }
});


// ============================================================
//  TORNEOS ACTIVOS (buscador)
// ============================================================
const grillaTorneos = document.getElementById("grilla-torneos");

if (grillaTorneos) {

  // Datos provisionales (más adelante vendrán de la base de datos)
  const torneosActivos = [
    { nombre: "Copa Montevideo 11", deporte: "futbol", deporteTexto: "Fútbol", formato: "11 vs 11", icono: "football-outline", lugar: "Montevideo", cupos: "12/16", inicio: "15 Ago", estado: "En curso" },
    { nombre: "Liga de Fútbol Sala", deporte: "futbol-sala", deporteTexto: "Fútbol sala", formato: "5 vs 5", icono: "football-outline", lugar: "Montevideo", cupos: "8/10", inicio: "20 Ago", estado: "En inscripción" },
    { nombre: "Basket 3x3 Open", deporte: "basquet", deporteTexto: "Básquetbol", formato: "3 vs 3", icono: "basketball-outline", lugar: "Montevideo", cupos: "9/12", inicio: "25 Ago", estado: "En inscripción" },
    { nombre: "Pádel Cup", deporte: "padel", deporteTexto: "Pádel", formato: "Duplas", icono: "tennisball-outline", lugar: "Colonia", cupos: "7/8", inicio: "02 Sep", estado: "En inscripción" },
    { nombre: "Torneo Abierto Handball", deporte: "handball", deporteTexto: "Handball", formato: "Masculino / Femenino", icono: "trophy-outline", lugar: "Canelones", cupos: "6/8", inicio: "10 Sep", estado: "En inscripción" },
    { nombre: "Vóley Playa", deporte: "voley", deporteTexto: "Vóley", formato: "Duplas", icono: "trophy-outline", lugar: "Maldonado", cupos: "10/16", inicio: "05 Sep", estado: "En inscripción" }
  ];

  const selectCriterio = document.getElementById("select-criterio");
  const inputBusqueda = document.getElementById("input-busqueda");
  const selectDeporteTorneo = document.getElementById("select-deporte");
  const chips = document.querySelectorAll(".chip-deporte");
  const sinResultadosTorneos = document.getElementById("sin-resultados-torneos");

  // Pasa a minúsculas y quita las tildes: "Fútbol" y "futbol" cuentan como iguales
  function normalizarTexto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Pinta la etiqueta que está elegida
  function pintarChips() {
    chips.forEach(function (chip) {
      if (chip.dataset.deporte === selectDeporteTorneo.value) {
        chip.style.backgroundColor = "#CC8710";
        chip.style.borderColor = "#CC8710";
        chip.style.color = "#1B1B1B";
      } else {
        chip.style.backgroundColor = "transparent";
        chip.style.borderColor = "rgba(255, 255, 255, 0.4)";
        chip.style.color = "white";
      }
    });
  }

  // Dibuja las tarjetas que cumplen los filtros
  function mostrarTorneosActivos() {
    const texto = normalizarTexto(inputBusqueda.value.trim());
    const criterio = selectCriterio.value;
    const deporteElegido = selectDeporteTorneo.value;
    let mostrados = 0;

    grillaTorneos.innerHTML = "";

    for (let i = 0; i < torneosActivos.length; i++) {
      const t = torneosActivos[i];

      // Filtro por deporte ("otro" no filtra: ahí se escribe el deporte en el buscador)
      let coincideDeporte = true;
      if (deporteElegido !== "todos" && deporteElegido !== "otro") {
        coincideDeporte = (t.deporte === deporteElegido);
      }

      // Filtro por texto
      let coincideTexto = true;
      if (texto !== "") {
        const nombre = normalizarTexto(t.nombre);
        const deporte = normalizarTexto(t.deporteTexto);

        if (criterio === "nombre") {
          coincideTexto = nombre.includes(texto);
        } else if (criterio === "deporte") {
          coincideTexto = deporte.includes(texto);
        } else {
          coincideTexto = nombre.includes(texto) || deporte.includes(texto);
        }
      }

      if (coincideDeporte && coincideTexto) {
        grillaTorneos.innerHTML +=
          '<article class="flex flex-col rounded-3xl border border-white/20 p-5 text-white transition duration-300 hover:border-[#CC8710]">' +
            '<span class="self-start text-xs uppercase tracking-widest rounded-full px-3 py-1 mb-3 ' + claseEstadoTorneo(t.estado) + '">' + t.estado + '</span>' +
            '<h2 class="text-xl font-semibold" style="' + estiloOswald + '">' + limpiarTexto(t.nombre) + '</h2>' +
            '<p class="flex items-center gap-2 text-sm text-gray-300 mt-1">' +
              '<ion-icon name="' + t.icono + '" class="text-[#CC8710]"></ion-icon> ' + limpiarTexto(t.deporteTexto) + ' · ' + limpiarTexto(t.formato) +
            '</p>' +
            '<div class="flex flex-col gap-1 text-sm text-gray-300 my-4">' +
              '<span><strong class="text-white">Lugar:</strong> ' + limpiarTexto(t.lugar) + '</span>' +
              '<span><strong class="text-white">Cupos:</strong> ' + t.cupos + '</span>' +
              '<span><strong class="text-white">Inicio:</strong> ' + t.inicio + '</span>' +
            '</div>' +
            '<a href="torneo.html" class="mt-auto text-center text-white uppercase text-sm tracking-widest border border-[#CC8710] px-6 py-3 transition-all duration-300 hover:bg-[#CC8710] active:scale-95">Ver torneo</a>' +
          '</article>';
        mostrados = mostrados + 1;
      }
    }

    if (mostrados === 0) {
      sinResultadosTorneos.classList.remove("hidden");
    } else {
      sinResultadosTorneos.classList.add("hidden");
    }
  }

  // Elegir un deporte (desde el select o desde las etiquetas)
  function elegirDeporte(valor) {
    selectDeporteTorneo.value = valor;

    // "Otro": pasa a buscar por deporte y lleva el cursor al buscador
    if (valor === "otro") {
      selectCriterio.value = "deporte";
      inputBusqueda.focus();
    }

    pintarChips();
    mostrarTorneosActivos();
  }

  selectCriterio.addEventListener("change", mostrarTorneosActivos);
  inputBusqueda.addEventListener("input", mostrarTorneosActivos);

  selectDeporteTorneo.addEventListener("change", function () {
    elegirDeporte(selectDeporteTorneo.value);
  });

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      elegirDeporte(chip.dataset.deporte);
    });
  });

  pintarChips();
  mostrarTorneosActivos();
}


// ============================================================
//  MIS TORNEOS (pestañas)
// ============================================================
const botonesTabs = document.querySelectorAll(".tab-btn");

if (botonesTabs.length > 0) {

  // Datos provisionales (más adelante vendrán de la base de datos)
  const torneosParticipo = [
    { nombre: "Copa Montevideo 11", estado: "En curso", icono: "football-outline", deporteTexto: "Fútbol", formato: "11 vs 11",
      lugar: "Montevideo", equipo: "La Toronja Mecánica", extraIcono: "time-outline", extraTitulo: "Próximo partido", extraValor: "15 Ago - 20:00 hs" },
    { nombre: "Torneo de Primavera", estado: "En inscripción", icono: "trophy-outline", deporteTexto: "Voleibol", formato: "2 vs 2",
      lugar: "Canelones", equipo: "Karasuno", extraIcono: "calendar-outline", extraTitulo: "Inicio", extraValor: "10 Sep" }
  ];

  const torneosCreadosPorMi = [
    { nombre: "Torneo Abierto Handball", estado: "En inscripción", icono: "trophy-outline", deporteTexto: "Handball", formato: "7 vs 7",
      lugar: "Canelones", inscriptos: "6/8", situacion: "En espera" }
  ];

  // Una línea de detalle con ícono
  function lineaDetalle(icono, titulo, valor) {
    return '<p class="flex items-center gap-2">' +
             '<ion-icon name="' + icono + '" class="text-[#CC8710]"></ion-icon>' +
             '<span><strong class="text-white">' + titulo + ':</strong> ' + valor + '</span>' +
           '</p>';
  }

  function pintarParticipando() {
    const lista = document.getElementById("lista-participando");
    lista.innerHTML = "";

    for (let i = 0; i < torneosParticipo.length; i++) {
      const t = torneosParticipo[i];

      lista.innerHTML +=
        '<article class="flex flex-col rounded-3xl border border-white/20 p-5 text-white transition duration-300 hover:border-[#CC8710]">' +
          '<span class="self-start text-xs uppercase tracking-widest rounded-full px-3 py-1 mb-3 ' + claseEstadoTorneo(t.estado) + '">' + t.estado + '</span>' +
          '<h2 class="text-xl font-semibold" style="' + estiloOswald + '">' + limpiarTexto(t.nombre) + '</h2>' +
          '<p class="flex items-center gap-2 text-sm text-gray-300 mt-1">' +
            '<ion-icon name="' + t.icono + '" class="text-[#CC8710]"></ion-icon> ' + limpiarTexto(t.deporteTexto) + ' · ' + limpiarTexto(t.formato) +
          '</p>' +
          '<div class="flex flex-col gap-2 text-sm text-gray-300 my-4">' +
            lineaDetalle("location-outline", "Lugar", limpiarTexto(t.lugar)) +
            lineaDetalle("shirt-outline", "Mi equipo", limpiarTexto(t.equipo)) +
            lineaDetalle(t.extraIcono, t.extraTitulo, t.extraValor) +
          '</div>' +
          '<a href="torneo.html" class="mt-auto text-center text-white uppercase text-sm tracking-widest border border-[#CC8710] px-6 py-3 transition-all duration-300 hover:bg-[#CC8710] active:scale-95">Ver torneo</a>' +
        '</article>';
    }

    if (torneosParticipo.length === 0) {
      document.getElementById("vacio-participando").classList.remove("hidden");
    }
  }

  function pintarCreados() {
    const lista = document.getElementById("lista-creados");
    lista.innerHTML = "";

    for (let i = 0; i < torneosCreadosPorMi.length; i++) {
      const t = torneosCreadosPorMi[i];

      lista.innerHTML +=
        '<article class="flex flex-col rounded-3xl border border-white/20 p-5 text-white transition duration-300 hover:border-[#CC8710]">' +
          '<span class="self-start text-xs uppercase tracking-widest rounded-full px-3 py-1 mb-3 ' + claseEstadoTorneo(t.estado) + '">' + t.estado + '</span>' +
          '<h2 class="text-xl font-semibold" style="' + estiloOswald + '">' + limpiarTexto(t.nombre) + '</h2>' +
          '<p class="flex items-center gap-2 text-sm text-gray-300 mt-1">' +
            '<ion-icon name="' + t.icono + '" class="text-[#CC8710]"></ion-icon> ' + limpiarTexto(t.deporteTexto) + ' · ' + limpiarTexto(t.formato) +
          '</p>' +
          '<div class="flex flex-col gap-2 text-sm text-gray-300 my-4">' +
            lineaDetalle("location-outline", "Lugar", limpiarTexto(t.lugar)) +
            lineaDetalle("people-outline", "Inscriptos", t.inscriptos) +
            lineaDetalle("settings-outline", "Estado", limpiarTexto(t.situacion)) +
          '</div>' +
          '<a href="torneo.html" class="mt-auto flex items-center justify-center gap-2 text-white uppercase text-sm tracking-widest border border-[#CC8710] px-6 py-3 transition-all duration-300 hover:bg-[#CC8710] active:scale-95">' +
            '<ion-icon name="create-outline" class="text-lg"></ion-icon> Administrar torneo' +
          '</a>' +
        '</article>';
    }

    if (torneosCreadosPorMi.length === 0) {
      document.getElementById("vacio-creados").classList.remove("hidden");
    }
  }

  // Muestra una pestaña y esconde la otra
  function elegirTab(nombre) {
    document.getElementById("panel-participando").classList.add("hidden");
    document.getElementById("panel-creados").classList.add("hidden");
    document.getElementById("panel-" + nombre).classList.remove("hidden");

    botonesTabs.forEach(function (boton) {
      if (boton.dataset.tab === nombre) {
        boton.style.backgroundColor = "#CC8710";
        boton.style.borderColor = "#CC8710";
        boton.style.color = "#1B1B1B";
      } else {
        boton.style.backgroundColor = "transparent";
        boton.style.borderColor = "rgba(255, 255, 255, 0.4)";
        boton.style.color = "white";
      }
    });
  }

  botonesTabs.forEach(function (boton) {
    boton.addEventListener("click", function () {
      elegirTab(boton.dataset.tab);
    });
  });

  pintarParticipando();
  pintarCreados();
  elegirTab("participando");
}


// ============================================================
//  PERFIL Y CUENTA (perfil.html y configuracion.html)
// ============================================================
const contenedorCuenta = document.getElementById("contenedor-cuenta");

if (contenedorCuenta) {

  // Datos provisionales (más adelante vendrán de la base de datos)
  const datosUsuario = {
    nombre: "Nombre Apellido",
    usuario: "usuario_ejemplo",
    correo: "ejemplo@correo.com",
    rol: "Participante",
    edad: 25,
    ubicacion: "Montevideo, Uruguay",
    certificado: "Aprobado",
    puntos: "1.890",
    deportes: [
      { nombre: "Fútbol", icono: "football-outline" },
      { nombre: "Fútbol sala", icono: "football-outline" }
    ],
    equipo: "Jugador independiente"
  };

  // Estilos que se repiten
  const claseInput = "w-full bg-transparent border-b border-white/40 text-white py-2 focus:outline-none focus:border-[#CC8710] transition duration-300";
  const claseBotonEditar = "border border-[#CC8710] text-xs uppercase tracking-widest px-3 py-1 cursor-pointer transition-all duration-300 hover:bg-[#CC8710] active:scale-95";
  const claseBotonGrande = "w-full text-white uppercase text-sm tracking-widest border border-[#CC8710] px-6 py-3 cursor-pointer transition-all duration-300 hover:bg-[#CC8710] active:scale-95";
  const claseBotonCancelar = "w-full text-gray-300 uppercase text-sm tracking-widest border border-white/40 px-6 py-3 cursor-pointer transition-all duration-300 hover:border-[#CC8710] hover:text-[#CC8710] active:scale-95";

  // ---------- Piezas del HTML de la cuenta ----------
  function filaCuenta(etiqueta, idDato, accion, textoBoton) {
    let dato = "";
    if (idDato !== "") {
      dato = '<span id="' + idDato + '" class="text-sm text-gray-300"></span>';
    }

    return '<div class="flex items-center justify-between gap-3 py-3 border-b border-white/10">' +
             '<span class="text-sm uppercase tracking-widest text-gray-400">' + etiqueta + '</span>' +
             '<div class="flex items-center gap-3">' + dato +
               '<button type="button" data-editar="' + accion + '" class="' + claseBotonEditar + '">' + textoBoton + '</button>' +
             '</div>' +
           '</div>';
  }

  function campoCuenta(id, etiqueta, tipo) {
    return '<div class="mb-4">' +
             '<label for="' + id + '" class="block text-sm uppercase tracking-widest text-gray-300 mb-2">' + etiqueta + '</label>' +
             '<input type="' + tipo + '" id="' + id + '" class="' + claseInput + '">' +
           '</div>';
  }

  function formularioCuenta(clave, titulo, descripcion, campos) {
    return '<form id="form-' + clave + '" data-form="' + clave + '" class="hidden border border-white/20 rounded-xl p-4 mt-4">' +
             '<h4 class="text-[#CC8710] font-bold uppercase tracking-widest" style="' + estiloOswald + '">' + titulo + '</h4>' +
             '<p class="text-sm text-gray-400 mb-4">' + descripcion + '</p>' +
             campos +
             '<div class="flex gap-3 mt-2">' +
               '<button type="button" data-cancelar="si" class="' + claseBotonCancelar + '">Cancelar</button>' +
               '<button type="submit" class="' + claseBotonGrande + '">Confirmar</button>' +
             '</div>' +
           '</form>';
  }

  // ---------- Armar la tarjeta de cuenta ----------
  contenedorCuenta.innerHTML =
    '<h3 class="text-[#CC8710] font-bold uppercase tracking-widest mb-1" style="' + estiloOswald + '">Información de cuenta</h3>' +
    filaCuenta("Nombre de usuario", "dato-usuario", "nombre", "Editar") +
    filaCuenta("Correo electrónico", "dato-correo", "correo", "Editar") +

    '<h3 class="text-[#CC8710] font-bold uppercase tracking-widest mt-6 mb-1" style="' + estiloOswald + '">Contraseña y seguridad</h3>' +
    filaCuenta("Contraseña", "", "clave", "Restablecer") +

    formularioCuenta("nombre", "Cambiar nombre de usuario", "Elige tu nuevo nombre de usuario a continuación.",
      campoCuenta("nombre-actual", "Nombre actual", "text") +
      campoCuenta("nombre-nuevo", "Nombre nuevo", "text")) +

    formularioCuenta("correo", "Cambiar correo electrónico", "Escribe tu nuevo correo y tu contraseña actual.",
      campoCuenta("correo-nuevo", "Correo nuevo", "email") +
      campoCuenta("correo-clave", "Contraseña actual", "password")) +

    formularioCuenta("clave", "Restablecer contraseña", "Debe tener al menos 8 caracteres.",
      campoCuenta("clave-actual", "Contraseña actual", "password") +
      campoCuenta("clave-nueva", "Contraseña nueva", "password") +
      campoCuenta("clave-repite", "Repite la contraseña nueva", "password")) +

    '<p id="aviso-cuenta" class="text-sm min-h-[20px] mt-4"></p>';

  // ---------- Mostrar los datos en la página ----------
  function ponerTexto(id, texto) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.textContent = texto;
    }
  }

  // **********@gmail.com
  function ocultarCorreo(correo) {
    const partes = correo.split("@");
    return "**********@" + partes[1];
  }

  function pintarPerfil() {
    ponerTexto("perfil-nombre-completo", datosUsuario.nombre);
    ponerTexto("perfil-usuario", datosUsuario.usuario);
    ponerTexto("perfil-rol", datosUsuario.rol);
    ponerTexto("perfil-edad", datosUsuario.edad);
    ponerTexto("perfil-ubicacion", datosUsuario.ubicacion);
    ponerTexto("perfil-certificado", datosUsuario.certificado);
    ponerTexto("perfil-puntos", datosUsuario.puntos);
    ponerTexto("perfil-equipo", datosUsuario.equipo);
    ponerTexto("dato-usuario", datosUsuario.usuario);
    ponerTexto("dato-correo", ocultarCorreo(datosUsuario.correo));

    // Etiquetas de deportes (solo existen en perfil.html)
    const cajaDeportes = document.getElementById("perfil-deportes");
    if (cajaDeportes) {
      cajaDeportes.innerHTML = "";
      for (let i = 0; i < datosUsuario.deportes.length; i++) {
        const d = datosUsuario.deportes[i];
        cajaDeportes.innerHTML +=
          '<span class="flex items-center gap-1 border border-[#CC8710] rounded-full px-3 py-1 text-sm">' +
            '<ion-icon name="' + d.icono + '" class="text-[#CC8710]"></ion-icon> ' + limpiarTexto(d.nombre) +
          '</span>';
      }
    }
  }

  // ---------- Abrir y cerrar los formularios de edición ----------
  const avisoCuenta = document.getElementById("aviso-cuenta");

  function cerrarFormularios() {
    contenedorCuenta.querySelectorAll("form").forEach(function (formulario) {
      formulario.classList.add("hidden");
    });
  }

  function abrirFormulario(clave) {
    cerrarFormularios();
    avisoCuenta.textContent = "";
    document.getElementById("form-" + clave).classList.remove("hidden");
  }

  contenedorCuenta.addEventListener("click", function (e) {
    const boton = e.target.closest("button");
    if (!boton) { return; }

    if (boton.dataset.editar) {
      abrirFormulario(boton.dataset.editar);
    }
    if (boton.dataset.cancelar) {
      cerrarFormularios();
    }
  });

  // ---------- Confirmar un cambio ----------
  contenedorCuenta.addEventListener("submit", function (e) {
    e.preventDefault();

    const clave = e.target.dataset.form;

    if (clave === "nombre") {
      const actual = document.getElementById("nombre-actual").value.trim();
      const nuevo = document.getElementById("nombre-nuevo").value.trim();

      if (actual !== datosUsuario.usuario) {
        ponerAviso(avisoCuenta, "El nombre actual no coincide", true);
        return;
      }
      if (!/^[a-zA-Z0-9_.]{3,30}$/.test(nuevo)) {
        ponerAviso(avisoCuenta, "El nombre nuevo debe tener entre 3 y 30 caracteres: letras, números, _ o .", true);
        return;
      }
      datosUsuario.usuario = nuevo;
    }

    if (clave === "correo") {
      const nuevo = document.getElementById("correo-nuevo").value.trim().toLowerCase();
      const claveActual = document.getElementById("correo-clave").value;

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevo)) {
        ponerAviso(avisoCuenta, "El correo no es válido", true);
        return;
      }
      if (claveActual === "") {
        ponerAviso(avisoCuenta, "Escribe tu contraseña actual", true);
        return;
      }
      datosUsuario.correo = nuevo;
    }

    if (clave === "clave") {
      const actual = document.getElementById("clave-actual").value;
      const nueva = document.getElementById("clave-nueva").value;
      const repite = document.getElementById("clave-repite").value;

      if (actual === "") {
        ponerAviso(avisoCuenta, "Escribe tu contraseña actual", true);
        return;
      }
      if (nueva.length < 8) {
        ponerAviso(avisoCuenta, "La contraseña nueva debe tener al menos 8 caracteres", true);
        return;
      }
      if (nueva !== repite) {
        ponerAviso(avisoCuenta, "Las contraseñas nuevas no coinciden", true);
        return;
      }
    }

    pintarPerfil();
    e.target.reset();
    cerrarFormularios();
    ponerAviso(avisoCuenta, "Cambio realizado (modo prueba: todavía no se guarda en el servidor)", false);
  });

  // ---------- Ventana de configuración (solo perfil.html) ----------
  const vistaConfig = document.getElementById("vista-configuracion");

  if (vistaConfig) {

    function cerrarConfig() {
      vistaConfig.classList.add("hidden");
      cerrarFormularios();
      avisoCuenta.textContent = "";
    }

    document.getElementById("btn-config").addEventListener("click", function () {
      vistaConfig.classList.remove("hidden");
    });

    document.getElementById("btn-cerrar-config").addEventListener("click", cerrarConfig);

    // Clic en el fondo oscuro cierra la ventana
    vistaConfig.addEventListener("click", function (e) {
      if (e.target === vistaConfig) {
        cerrarConfig();
      }
    });

    // La tecla Escape también la cierra
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        cerrarConfig();
      }
    });
  }

  pintarPerfil();
}


// ============================================================
//  CALENDARIO
// ============================================================
const diasContenedor = document.getElementById("dias-contenedor");

if (diasContenedor) {

  const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const hoy = new Date();
  let mesVista = hoy.getMonth();
  let anioVista = hoy.getFullYear();

  // Convierte una fecha en texto "2026-10-25"
  function claveFecha(fecha) {
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return fecha.getFullYear() + "-" + mes + "-" + dia;
  }

  const claveHoy = claveFecha(hoy);
  let diaElegido = claveHoy;

  // Eventos provisionales: "diasDesdeHoy" los coloca cerca de la fecha actual
  // (más adelante vendrán de la base de datos con su fecha real)
  const eventosBase = [
    { diasDesdeHoy: 1, hora: "20:00", titulo: "Semifinal", torneo: "Copa Montevideo 11", tipo: "Partido" },
    { diasDesdeHoy: 3, hora: "19:00", titulo: "Fecha 2", torneo: "Liga de Fútbol Sala", tipo: "Partido" },
    { diasDesdeHoy: 3, hora: "21:00", titulo: "Fecha 2", torneo: "Basket 3x3 Open", tipo: "Partido" },
    { diasDesdeHoy: 8, hora: "10:00", titulo: "Cierre de inscripciones", torneo: "Torneo Abierto Handball", tipo: "Inscripción" },
    { diasDesdeHoy: 15, hora: "18:00", titulo: "Inicio del torneo", torneo: "Vóley Playa", tipo: "Inicio" }
  ];

  const eventos = [];
  for (let i = 0; i < eventosBase.length; i++) {
    const e = eventosBase[i];
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + e.diasDesdeHoy);
    eventos.push({ fecha: claveFecha(fecha), hora: e.hora, titulo: e.titulo, torneo: e.torneo, tipo: e.tipo });
  }

  // Eventos de un día
  function eventosDelDia(clave) {
    const lista = [];
    for (let i = 0; i < eventos.length; i++) {
      if (eventos[i].fecha === clave) {
        lista.push(eventos[i]);
      }
    }
    return lista;
  }

  // Lista de eventos del día elegido
  function pintarEventos() {
    const lista = document.getElementById("lista-eventos");
    const partes = diaElegido.split("-");   // [año, mes, día]

    document.getElementById("eventos-titulo").textContent =
      "Eventos del " + Number(partes[2]) + " de " + nombresMeses[Number(partes[1]) - 1].toLowerCase();

    const delDia = eventosDelDia(diaElegido);
    lista.innerHTML = "";

    if (delDia.length === 0) {
      lista.innerHTML = '<p class="text-sm text-gray-400">No hay eventos este día</p>';
      return;
    }

    for (let i = 0; i < delDia.length; i++) {
      const ev = delDia[i];
      lista.innerHTML +=
        '<div class="flex items-center justify-between gap-3 border border-white/20 rounded-xl p-3 transition duration-300 hover:border-[#CC8710]">' +
          '<div>' +
            '<p class="font-semibold" style="' + estiloOswald + '">' + limpiarTexto(ev.titulo) + '</p>' +
            '<p class="text-xs text-gray-400">' + limpiarTexto(ev.torneo) + ' · ' + ev.hora + ' hs</p>' +
          '</div>' +
          '<span class="text-xs uppercase tracking-widest text-[#CC8710] border border-[#CC8710] rounded-full px-3 py-1">' + ev.tipo + '</span>' +
        '</div>';
    }
  }

  // Dibuja el mes completo
  function pintarCalendario() {
    document.getElementById("mes-anio").textContent = nombresMeses[mesVista] + " " + anioVista;
    diasContenedor.innerHTML = "";

    const primerDia = new Date(anioVista, mesVista, 1).getDay();       // 0 = domingo
    const totalDias = new Date(anioVista, mesVista + 1, 0).getDate();  // cuántos días tiene el mes

    // Espacios vacíos antes del día 1
    for (let i = 0; i < primerDia; i++) {
      diasContenedor.innerHTML += "<div></div>";
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const clave = claveFecha(new Date(anioVista, mesVista, dia));
      const hayEventos = eventosDelDia(clave).length > 0;

      // Estilo según sea el día elegido, el de hoy o uno normal
      let clases = "relative aspect-square flex items-center justify-center rounded-lg border text-sm cursor-pointer transition-all duration-300 active:scale-95 ";
      if (clave === diaElegido) {
        clases += "bg-[#CC8710] border-[#CC8710] text-[#1B1B1B] font-bold";
      } else if (clave === claveHoy) {
        clases += "border-[#CC8710] text-[#CC8710] font-bold hover:bg-[#CC8710]/20";
      } else {
        clases += "border-white/10 text-white hover:border-[#CC8710]";
      }

      // Puntito si ese día hay eventos
      let punto = "";
      if (hayEventos) {
        let colorPunto = "bg-[#CC8710]";
        if (clave === diaElegido) {
          colorPunto = "bg-[#1B1B1B]";
        }
        punto = '<span class="absolute bottom-1 w-1.5 h-1.5 rounded-full ' + colorPunto + '"></span>';
      }

      diasContenedor.innerHTML += '<button type="button" data-fecha="' + clave + '" class="' + clases + '">' + dia + punto + '</button>';
    }

    pintarEventos();
  }

  // Clic en un día
  diasContenedor.addEventListener("click", function (e) {
    const boton = e.target.closest("button");
    if (!boton) { return; }

    diaElegido = boton.dataset.fecha;
    pintarCalendario();
  });

  // Mes anterior y siguiente
  document.getElementById("btn-prev").addEventListener("click", function () {
    mesVista = mesVista - 1;
    if (mesVista < 0) {
      mesVista = 11;
      anioVista = anioVista - 1;
    }
    pintarCalendario();
  });

  document.getElementById("btn-next").addEventListener("click", function () {
    mesVista = mesVista + 1;
    if (mesVista > 11) {
      mesVista = 0;
      anioVista = anioVista + 1;
    }
    pintarCalendario();
  });

  pintarCalendario();
}
