const API_URL = "https://script.google.com/macros/s/AKfycbyvMO2z8X_4B7qb4vFr6rVGGsEOgXGZNW3hscNZWnA-ogQpSfITrySJSnBq2uCdPtT4/exec";

const app = document.getElementById("app");

let currentUser = JSON.parse(localStorage.getItem("condoUser")) || null;
let currentAdmin = JSON.parse(localStorage.getItem("condoAdmin")) || null;
let currentView = currentUser ? "usuario" : currentAdmin ? "admin" : "login";

async function api(accion, payload = {}) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ accion, ...payload })
    });

    return await res.json();
  } catch (err) {
    return {
      ok: false,
      mensaje: "No se pudo conectar con el backend."
    };
  }
}

function render() {
  if (currentView === "login") renderLogin();
  if (currentView === "registro") renderRegistro();
  if (currentView === "usuario") renderUsuario("inicio");
  if (currentView === "adminLogin") renderAdminLogin();
  if (currentView === "admin") renderAdmin("dashboard");
}

/* LOGIN */

function renderLogin() {
  app.innerHTML = `
    <div class="login-screen">
      <div class="login-card">
        <div class="logo">🌿</div>
        <h1>Condominio Los Jardines</h1>
        <p>Vive en armonía</p>

        <div class="field">
          <label>Correo electrónico</label>
          <input id="email" placeholder="tu@email.com">
        </div>

        <div class="field">
          <label>Contraseña</label>
          <input id="pass" type="password" placeholder="********">
        </div>

        <button class="btn" onclick="loginUsuario()">Iniciar sesión</button>
        <br><br>
        <button class="btn btn-outline" onclick="currentView='registro'; render()">Crear cuenta</button>

        <div style="text-align:center; margin-top:22px;">
          <a onclick="currentView='adminLogin'; render()" style="font-size:12px; color:#6b7280; cursor:pointer;">
            Acceso administrativo
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderRegistro() {
  app.innerHTML = `
    <div class="login-screen">
      <div class="login-card">
        <div class="logo">👤</div>
        <h1>Registro de usuario</h1>
        <p>Complete sus datos para solicitar acceso.</p>

        <div class="field">
          <label>Nombre</label>
          <input id="regNombre" placeholder="Nombre">
        </div>

        <div class="field">
          <label>Apellidos</label>
          <input id="regApellidos" placeholder="Apellidos">
        </div>

        <div class="field">
          <label>Teléfono</label>
          <input id="regTelefono" placeholder="86161763">
        </div>

        <div class="field">
          <label>Correo</label>
          <input id="regCorreo" placeholder="correo@email.com">
        </div>

        <div class="field">
          <label>Filial / Casa / Apartamento</label>
          <input id="regFilial" placeholder="Ejemplo: Casa 12">
        </div>

        <div class="field">
          <label>Torre</label>
          <input id="regTorre" placeholder="Opcional">
        </div>

        <div class="field">
          <label>Apartamento</label>
          <input id="regApartamento" placeholder="Opcional">
        </div>

        <div class="field">
          <label>Contraseña</label>
          <input id="regPassword" type="password" placeholder="Crear contraseña">
        </div>

        <button class="btn" onclick="registrarUsuario()">Registrarme</button>
        <br><br>
        <button class="btn btn-outline" onclick="currentView='login'; render()">Volver</button>
      </div>
    </div>
  `;
}

async function registrarUsuario() {
  const data = {
    nombre: document.getElementById("regNombre").value,
    apellidos: document.getElementById("regApellidos").value,
    telefono: document.getElementById("regTelefono").value,
    correo: document.getElementById("regCorreo").value,
    filial: document.getElementById("regFilial").value,
    torre: document.getElementById("regTorre").value,
    apartamento: document.getElementById("regApartamento").value,
    password: document.getElementById("regPassword").value
  };

  const r = await api("registrarUsuario", data);
  alert(r.mensaje);

  if (r.ok) {
    currentView = "login";
    render();
  }
}

async function loginUsuario() {
  const correo = document.getElementById("email").value;
  const password = document.getElementById("pass").value;

  const r = await api("loginUsuario", { correo, password });

  if (!r.ok) {
    alert(r.mensaje);
    return;
  }

  currentUser = r.data.usuario;
  localStorage.setItem("condoUser", JSON.stringify(currentUser));
  currentView = "usuario";
  renderUsuario("inicio");
}

function renderAdminLogin() {
  app.innerHTML = `
    <div class="login-screen">
      <div class="login-card">
        <div class="logo">🔐</div>
        <h1>Administrador</h1>
        <p>Acceso restringido</p>

        <div class="field">
          <label>Usuario</label>
          <input id="adminUser" placeholder="admin">
        </div>

        <div class="field">
          <label>Contraseña</label>
          <input id="adminPass" type="password" placeholder="1234">
        </div>

        <button class="btn" onclick="loginAdmin()">Ingresar</button>
        <br><br>
        <button class="btn btn-outline" onclick="currentView='login'; render()">Volver</button>
      </div>
    </div>
  `;
}

async function loginAdmin() {
  const usuario = document.getElementById("adminUser").value;
  const password = document.getElementById("adminPass").value;

  const r = await api("loginAdmin", { usuario, password });

  if (!r.ok) {
    alert(r.mensaje);
    return;
  }

  currentAdmin = r.data.admin;
  localStorage.setItem("condoAdmin", JSON.stringify(currentAdmin));
  currentView = "admin";
  renderAdmin("dashboard");
}

/* USUARIO */

function renderUsuario(seccion = "inicio") {
  app.innerHTML = `
    <div class="mobile-wrap">
      ${
        seccion === "inicio"
          ? usuarioInicio()
          : seccion === "reportar"
          ? usuarioReportar()
          : seccion === "misSolicitudes"
          ? usuarioMisSolicitudes()
          : usuarioPerfil()
      }

      <div class="bottom-nav">
        <button class="nav-btn ${seccion === "inicio" ? "active" : ""}" onclick="renderUsuario('inicio')">
          <strong>🏠</strong>Inicio
        </button>

        <button class="nav-btn ${seccion === "misSolicitudes" ? "active" : ""}" onclick="renderUsuario('misSolicitudes')">
          <strong>📋</strong>Mis solicitudes
        </button>

        <button class="floating" onclick="renderUsuario('reportar')">+</button>

        <button class="nav-btn ${seccion === "perfil" ? "active" : ""}" onclick="renderUsuario('perfil')">
          <strong>👤</strong>Perfil
        </button>

        <button class="nav-btn" onclick="cerrarSesion()">
          <strong>🚪</strong>Salir
        </button>
      </div>
    </div>
  `;

  if (seccion === "misSolicitudes") cargarMisSolicitudes();
}

function usuarioInicio() {
  return `
    <div class="hero">
      <div>
        <h1>Condominio<br>Los Jardines</h1>
        <p>Bienvenido, ${currentUser.NOMBRE || "Usuario"} 👋</p>
      </div>
    </div>

    <div class="mobile-content">
      <div class="actions">

        <div class="action-card" onclick="renderUsuario('reportar')">
          <div class="action-icon">📝</div>
          <h3>Nueva solicitud</h3>
          <p>Reporte una avería, consulta o queja.</p>
          <span class="arrow">›</span>
        </div>

        <div class="action-card" onclick="renderUsuario('misSolicitudes')">
          <div class="action-icon">📋</div>
          <h3>Seguimiento</h3>
          <p>Revise el estado de sus solicitudes.</p>
          <span class="arrow">›</span>
        </div>

      </div>
    </div>
  `;
}

function usuarioReportar() {
  return `
    <div class="mobile-content">
      <h2>Nueva solicitud</h2>

      <div class="form-card">
        <div class="field">
          <label>Tipo</label>
          <select id="tipoSolicitud">
            <option>Consulta</option>
            <option>Queja</option>
            <option>Avería</option>
            <option>Solicitud</option>
            <option>Sugerencia</option>
          </select>
        </div>

        <div class="field">
          <label>Asunto</label>
          <input id="asuntoSolicitud" placeholder="Ejemplo: Fuga de agua">
        </div>

        <div class="field">
          <label>Descripción</label>
          <textarea id="descripcionSolicitud" placeholder="Describa la situación..."></textarea>
        </div>

        <button class="btn" onclick="enviarSolicitud()">Enviar solicitud</button>
      </div>
    </div>
  `;
}

async function enviarSolicitud() {
  const data = {
    idUsuario: currentUser.ID_USUARIO,
    nombre: currentUser.NOMBRE,
    apellidos: currentUser.APELLIDOS,
    telefono: currentUser.TELEFONO,
    correo: currentUser.CORREO,
    tipo: document.getElementById("tipoSolicitud").value,
    asunto: document.getElementById("asuntoSolicitud").value,
    descripcion: document.getElementById("descripcionSolicitud").value
  };

  const r = await api("registrarSolicitud", data);

  alert(r.mensaje);

  if (r.ok && r.data.whatsappAdmin) {
    window.open(r.data.whatsappAdmin, "_blank");
    renderUsuario("misSolicitudes");
  }
}

function usuarioMisSolicitudes() {
  return `
    <div class="mobile-content">
      <h2>Mis solicitudes</h2>
      <div id="misSolicitudesBox" class="card">
        Cargando solicitudes...
      </div>
    </div>
  `;
}

async function cargarMisSolicitudes() {
  const box = document.getElementById("misSolicitudesBox");

  const r = await api("listarSolicitudesUsuario", {
    idUsuario: currentUser.ID_USUARIO,
    correo: currentUser.CORREO
  });

  if (!r.ok) {
    box.innerHTML = r.mensaje;
    return;
  }

  const solicitudes = r.data.solicitudes || [];

  if (solicitudes.length === 0) {
    box.innerHTML = "No tiene solicitudes registradas.";
    return;
  }

  box.innerHTML = solicitudes.reverse().map(s => `
    <div class="list-item">
      <strong>${s.ASUNTO}</strong><br>
      <small>${s.FECHA_HORA}</small><br><br>
      <span class="badge ${badgeEstado(s.ESTADO)}">${s.ESTADO}</span>
      <p><strong>Tipo:</strong> ${s.TIPO}</p>
      <p>${s.DESCRIPCION}</p>
      ${
        s.OBSERVACION_ADMIN
          ? `<p><strong>Observación administración:</strong><br>${s.OBSERVACION_ADMIN}</p>`
          : `<p><em>Sin observaciones administrativas todavía.</em></p>`
      }
    </div>
  `).join("");
}

function usuarioPerfil() {
  return `
    <div class="mobile-content">
      <h2>Mi perfil</h2>

      <div class="card" style="text-align:center">
        <div class="logo">👤</div>
        <h3>${currentUser.NOMBRE} ${currentUser.APELLIDOS}</h3>
        <p>${currentUser.FILIAL || ""}</p>
        <p>${currentUser.CORREO}</p>
        <p>${currentUser.TELEFONO}</p>
      </div>
    </div>
  `;
}

/* ADMIN */

function renderAdmin(seccion = "dashboard") {
  app.innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <div class="brand">🌿 Condominio<br>Los Jardines</div>

        <button class="menu-btn ${seccion === "dashboard" ? "active" : ""}" onclick="renderAdmin('dashboard')">🏠 Dashboard</button>
        <button class="menu-btn ${seccion === "solicitudes" ? "active" : ""}" onclick="renderAdmin('solicitudes')">📝 Solicitudes</button>
        <button class="menu-btn ${seccion === "avisos" ? "active" : ""}" onclick="renderAdmin('avisos')">🔔 Avisos</button>
        <button class="menu-btn ${seccion === "actividades" ? "active" : ""}" onclick="renderAdmin('actividades')">📅 Actividades</button>
        <button class="menu-btn" onclick="cerrarSesion()">🚪 Cerrar sesión</button>
      </aside>

      <main class="main">
        <div class="topbar">
          <h2>Panel Administrativo</h2>
          <div class="user-pill">Administrador 👤</div>
        </div>

        ${
          seccion === "solicitudes"
            ? adminSolicitudes()
            : seccion === "avisos"
            ? adminAvisos()
            : seccion === "actividades"
            ? adminActividades()
            : adminDashboard()
        }
      </main>
    </div>
  `;

  if (seccion === "dashboard" || seccion === "solicitudes") cargarSolicitudesAdmin();
}

function adminDashboard() {
  return `
    <div class="grid">
      <div class="card stat">
        <div class="icon">📝</div>
        <div>
          <h3 id="totalSolicitudes">0</h3>
          <p>Solicitudes registradas</p>
        </div>
      </div>
    </div>

    <div class="section card">
      <h3>Solicitudes recientes</h3>
      <div id="adminSolicitudesBox">Cargando...</div>
    </div>
  `;
}

function adminSolicitudes() {
  return `
    <div class="card">
      <h3>Consultas, quejas, solicitudes y averías</h3>
      <div id="adminSolicitudesBox">Cargando...</div>
    </div>
  `;
}

async function cargarSolicitudesAdmin() {
  const box = document.getElementById("adminSolicitudesBox");
  const total = document.getElementById("totalSolicitudes");

  const r = await api("listarSolicitudesAdmin");

  if (!r.ok) {
    box.innerHTML = r.mensaje;
    return;
  }

  const solicitudes = r.data.solicitudes || [];

  if (total) total.innerText = solicitudes.length;

  if (solicitudes.length === 0) {
    box.innerHTML = "No hay solicitudes registradas.";
    return;
  }

  box.innerHTML = solicitudes.reverse().map(s => `
    <div class="list-item">
      <strong>${s.ASUNTO}</strong><br>
      <small>${s.FECHA_HORA}</small><br>
      <small>Enviado por: ${s.NOMBRE_COMPLETO}</small><br><br>

      <span class="badge ${badgeEstado(s.ESTADO)}">${s.ESTADO}</span>

      <p><strong>Tipo:</strong> ${s.TIPO}</p>
      <p>${s.DESCRIPCION}</p>

      <div class="field">
        <label>Estado</label>
        <select id="estado_${s.ID_SOLICITUD}">
          <option ${s.ESTADO === "Pendiente" ? "selected" : ""}>Pendiente</option>
          <option ${s.ESTADO === "En proceso" ? "selected" : ""}>En proceso</option>
          <option ${s.ESTADO === "Atendida" ? "selected" : ""}>Atendida</option>
          <option ${s.ESTADO === "Cerrada" ? "selected" : ""}>Cerrada</option>
        </select>
      </div>

      <div class="field">
        <label>Observación administrativa</label>
        <textarea id="obs_${s.ID_SOLICITUD}" placeholder="Comentario para el usuario...">${s.OBSERVACION_ADMIN || ""}</textarea>
      </div>

      <button class="btn" onclick="actualizarSolicitud('${s.ID_SOLICITUD}')">
        Guardar seguimiento
      </button>
    </div>
  `).join("");
}

async function actualizarSolicitud(idSolicitud) {
  const estado = document.getElementById(`estado_${idSolicitud}`).value;
  const observacion = document.getElementById(`obs_${idSolicitud}`).value;

  const r = await api("actualizarSolicitud", {
    idSolicitud,
    estado,
    observacion,
    responsable: "Administrador"
  });

  alert(r.mensaje);

  if (r.ok && r.data.whatsappUsuario) {
    window.open(r.data.whatsappUsuario, "_blank");
    cargarSolicitudesAdmin();
  }
}

function adminAvisos() {
  return `
    <div class="two-cols">
      <div class="form-card">
        <h3>Nuevo aviso</h3>

        <div class="field">
          <label>Título</label>
          <input id="avisoTitulo">
        </div>

        <div class="field">
          <label>Tipo</label>
          <select id="avisoTipo">
            <option>Aviso</option>
            <option>Noticia</option>
            <option>Recordatorio</option>
          </select>
        </div>

        <div class="field">
          <label>Mensaje</label>
          <textarea id="avisoMensaje"></textarea>
        </div>

        <button class="btn" onclick="registrarAviso()">Publicar aviso</button>
      </div>
    </div>
  `;
}

async function registrarAviso() {
  const r = await api("registrarAviso", {
    titulo: document.getElementById("avisoTitulo").value,
    tipo: document.getElementById("avisoTipo").value,
    mensaje: document.getElementById("avisoMensaje").value,
    publicadoPor: "Administrador"
  });

  alert(r.mensaje);
}

function adminActividades() {
  return `
    <div class="two-cols">
      <div class="form-card">
        <h3>Nueva actividad</h3>

        <div class="field">
          <label>Título</label>
          <input id="actTitulo">
        </div>

        <div class="field">
          <label>Fecha</label>
          <input id="actFecha" type="date">
        </div>

        <div class="field">
          <label>Hora</label>
          <input id="actHora" type="time">
        </div>

        <div class="field">
          <label>Lugar</label>
          <input id="actLugar">
        </div>

        <div class="field">
          <label>Descripción</label>
          <textarea id="actDescripcion"></textarea>
        </div>

        <button class="btn" onclick="registrarActividad()">Guardar actividad</button>
      </div>
    </div>
  `;
}

async function registrarActividad() {
  const r = await api("registrarActividad", {
    titulo: document.getElementById("actTitulo").value,
    fechaActividad: document.getElementById("actFecha").value,
    hora: document.getElementById("actHora").value,
    lugar: document.getElementById("actLugar").value,
    descripcion: document.getElementById("actDescripcion").value,
    publicadoPor: "Administrador"
  });

  alert(r.mensaje);
}

/* UTILIDADES */

function badgeEstado(estado) {
  if (estado === "Atendida" || estado === "Cerrada") return "green";
  if (estado === "En proceso") return "blue";
  return "orange";
}

function cerrarSesion() {
  localStorage.removeItem("condoUser");
  localStorage.removeItem("condoAdmin");
  currentUser = null;
  currentAdmin = null;
  currentView = "login";
  render();
}

render();
