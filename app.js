const app = document.getElementById("app");

let currentUser = null;
let currentView = "login";

const actividades = [
  { titulo: "Mantenimiento de jardines", fecha: "25 mayo", hora: "8:00 AM", lugar: "Zonas comunes" },
  { titulo: "Asamblea General", fecha: "28 mayo", hora: "6:00 PM", lugar: "Salón Social" },
  { titulo: "Clases de Yoga", fecha: "30 mayo", hora: "7:00 AM", lugar: "Área de Yoga" }
];

const avisos = [
  { titulo: "Mantenimiento de jardines", texto: "Se realizará mantenimiento en las áreas verdes.", tipo: "Aviso" },
  { titulo: "Recordatorio de pago", texto: "Recuerde cancelar la cuota de mantenimiento.", tipo: "Aviso" },
  { titulo: "Fiesta de la comunidad", texto: "Actividad familiar este sábado.", tipo: "Noticia" }
];

const solicitudes = [
  { titulo: "Fuga de agua en pasillo", usuario: "María López", estado: "Pendiente" },
  { titulo: "Problema con el ascensor", usuario: "Juan Pérez", estado: "En proceso" },
  { titulo: "Iluminación en zona común", usuario: "Ana García", estado: "Atendida" }
];

function render() {
  if (currentView === "login") renderLogin();
  if (currentView === "usuario") renderUsuario();
  if (currentView === "admin") renderAdmin("dashboard");
}

function renderLogin() {
  app.innerHTML = `
    <div class="login-screen">
      <div class="login-card">
        <div class="logo">🌿</div>
        <h1>Mi Condominio</h1>
        <p>Vive en armonía</p>

        <div class="field">
          <label>Correo electrónico</label>
          <input id="email" placeholder="tu@email.com">
        </div>

        <div class="field">
          <label>Contraseña</label>
          <input id="pass" type="password" placeholder="********">
        </div>

        <button class="btn" onclick="loginUsuario()">Iniciar como Usuario</button>
        <br><br>
        <button class="btn btn-outline" onclick="loginAdmin()">Ingresar como Administrador</button>
      </div>
    </div>
  `;
}

function loginUsuario() {
  currentUser = "Laura Gómez";
  currentView = "usuario";
  renderUsuario("inicio");
}

function loginAdmin() {
  currentUser = "Administrador";
  currentView = "admin";
  renderAdmin("dashboard");
}

function renderUsuario(seccion = "inicio") {
  app.innerHTML = `
    <div class="mobile-wrap">
      ${
        seccion === "inicio"
          ? usuarioInicio()
          : seccion === "avisos"
          ? usuarioAvisos()
          : seccion === "calendario"
          ? usuarioCalendario()
          : seccion === "reportar"
          ? usuarioReportar()
          : usuarioPerfil()
      }

      <div class="bottom-nav">
        <button class="nav-btn ${seccion === "inicio" ? "active" : ""}" onclick="renderUsuario('inicio')">
          <strong>🏠</strong>Inicio
        </button>

        <button class="nav-btn ${seccion === "avisos" ? "active" : ""}" onclick="renderUsuario('avisos')">
          <strong>🔔</strong>Avisos
        </button>

        <button class="floating" onclick="renderUsuario('reportar')">+</button>

        <button class="nav-btn ${seccion === "calendario" ? "active" : ""}" onclick="renderUsuario('calendario')">
          <strong>📅</strong>Calendario
        </button>

        <button class="nav-btn ${seccion === "perfil" ? "active" : ""}" onclick="renderUsuario('perfil')">
          <strong>👤</strong>Perfil
        </button>
      </div>
    </div>
  `;
}

function usuarioInicio() {
  return `
    <div class="hero">
      <div class="notify-bubble">
        🔔
        <span class="notify-count">3</span>
      </div>

      <div>
        <h1>Condominio<br>Los Jardines</h1>
        <p>Bienvenido, Laura 👋</p>
      </div>
    </div>

    <div class="mobile-content">
      <div class="actions">

        <div class="action-card" onclick="renderUsuario('avisos')">
          <div class="action-icon">🔔</div>
          <h3>Avisos</h3>
          <p>Entérate de las últimas noticias y avisos.</p>
          <span class="arrow">›</span>
        </div>

        <div class="action-card" onclick="renderUsuario('calendario')">
          <div class="action-icon">📅</div>
          <h3>Calendario</h3>
          <p>Consulta las actividades del condominio.</p>
          <span class="arrow">›</span>
        </div>

        <div class="action-card" onclick="renderUsuario('reportar')">
          <div class="action-icon">📝</div>
          <h3>Consulta o Queja</h3>
          <p>Envía tus consultas, quejas o sugerencias.</p>
          <span class="arrow">›</span>
        </div>

        <div class="action-card" onclick="renderUsuario('reportar')">
          <div class="action-icon">📷</div>
          <h3>Reportar Incidencia</h3>
          <p>Informa sobre situaciones o incidencias.</p>
          <span class="arrow">›</span>
        </div>

      </div>

      <div class="section-title">
        <h3>📅 Próximas actividades</h3>
        <a onclick="renderUsuario('calendario')">Ver todas</a>
      </div>

      ${actividades.map((a, i) => `
        <div class="activity-card">
          <div class="round-icon">${i === 0 ? "🌿" : i === 1 ? "👥" : "🧘"}</div>

          <div class="activity-info">
            <strong>${a.titulo}</strong><br>
            <small>📅 ${a.fecha}, ${a.hora} &nbsp; 📍 ${a.lugar}</small>
          </div>

          <span class="badge ${i === 0 ? "green" : i === 1 ? "blue" : "orange"}">
            Programada
          </span>
        </div>
      `).join("")}
    </div>
  `;
}

function usuarioAvisos() {
  return `
    <div class="mobile-content">
      <h2>Avisos y Noticias</h2>

      ${avisos.map((a, i) => `
        <div class="card list-item">
          <div class="activity-card" style="box-shadow:none; margin-bottom:0;">
            <div class="round-icon">${i === 0 ? "🌿" : i === 1 ? "💰" : "🎉"}</div>
            <div class="activity-info">
              <strong>${a.titulo}</strong>
              <p>${a.texto}</p>
              <span class="badge ${a.tipo === "Noticia" ? "blue" : "green"}">${a.tipo}</span>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function usuarioCalendario() {
  return `
    <div class="mobile-content">
      <h2>Calendario de Actividades</h2>

      <div class="card">
        <h3>Mayo 2024</h3>
        <p>Calendario visual de actividades del condominio.</p>
      </div>

      <br>

      ${actividades.map((a, i) => `
        <div class="activity-card">
          <div class="round-icon">${i === 0 ? "🌿" : i === 1 ? "👥" : "🧘"}</div>

          <div class="activity-info">
            <strong>${a.titulo}</strong><br>
            <small>📅 ${a.fecha}, ${a.hora}</small><br>
            <small>📍 ${a.lugar}</small>
          </div>

          <span class="badge ${i === 0 ? "green" : i === 1 ? "blue" : "orange"}">
            Programada
          </span>
        </div>
      `).join("")}
    </div>
  `;
}

function usuarioReportar() {
  return `
    <div class="mobile-content">
      <h2>Nueva Consulta o Queja</h2>

      <div class="form-card">
        <div class="field">
          <label>Tipo</label>
          <select>
            <option>Consulta</option>
            <option>Queja</option>
            <option>Incidencia</option>
            <option>Emergencia no crítica</option>
          </select>
        </div>

        <div class="field">
          <label>Asunto</label>
          <input placeholder="Ejemplo: Fuga de agua">
        </div>

        <div class="field">
          <label>Descripción</label>
          <textarea placeholder="Describa la situación..."></textarea>
        </div>

        <label><strong>Adjuntar foto o video</strong></label>
        <div class="upload-box">📷 Agregar archivo</div>

        <button class="btn" onclick="alert('Solicitud enviada en modo demo')">Enviar solicitud</button>
      </div>
    </div>
  `;
}

function usuarioPerfil() {
  return `
    <div class="mobile-content">
      <h2>Mi Perfil</h2>

      <div class="card" style="text-align:center">
        <div class="logo">👤</div>
        <h3>Laura Gómez</h3>
        <p>Torre A - Apartamento 102</p>
        <p>laura@email.com</p>
      </div>

      <br>

      <button class="btn btn-outline">Mis datos</button>
      <br><br>
      <button class="btn btn-outline">Mis reportes</button>
      <br><br>
      <button class="btn" onclick="currentView='login'; render()">Cerrar sesión</button>
    </div>
  `;
}

function renderAdmin(seccion) {
  app.innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <div class="brand">🌿 Condominio<br>Los Jardines</div>

        <button class="menu-btn ${seccion === "dashboard" ? "active" : ""}" onclick="renderAdmin('dashboard')">🏠 Dashboard</button>
        <button class="menu-btn ${seccion === "usuarios" ? "active" : ""}" onclick="renderAdmin('usuarios')">👥 Usuarios</button>
        <button class="menu-btn ${seccion === "actividades" ? "active" : ""}" onclick="renderAdmin('actividades')">📅 Actividades</button>
        <button class="menu-btn ${seccion === "avisos" ? "active" : ""}" onclick="renderAdmin('avisos')">🔔 Avisos</button>
        <button class="menu-btn ${seccion === "solicitudes" ? "active" : ""}" onclick="renderAdmin('solicitudes')">📝 Solicitudes</button>
        <button class="menu-btn" onclick="currentView='login'; render()">🚪 Cerrar sesión</button>
      </aside>

      <main class="main">
        <div class="topbar">
          <h2>Panel Administrativo</h2>
          <div class="user-pill">Administrador 👤</div>
        </div>

        ${
          seccion === "dashboard"
            ? adminDashboard()
            : seccion === "actividades"
            ? adminActividades()
            : seccion === "avisos"
            ? adminAvisos()
            : seccion === "solicitudes"
            ? adminSolicitudes()
            : adminUsuarios()
        }
      </main>
    </div>
  `;
}

function adminDashboard() {
  return `
    <div class="grid">
      <div class="card stat">
        <div class="icon">👥</div>
        <div>
          <h3>156</h3>
          <p>Usuarios activos</p>
        </div>
      </div>

      <div class="card stat">
        <div class="icon">📝</div>
        <div>
          <h3>23</h3>
          <p>Incidencias abiertas</p>
        </div>
      </div>

      <div class="card stat">
        <div class="icon">📅</div>
        <div>
          <h3>12</h3>
          <p>Actividades del mes</p>
        </div>
      </div>

      <div class="card stat">
        <div class="icon">🔔</div>
        <div>
          <h3>5</h3>
          <p>Avisos activos</p>
        </div>
      </div>
    </div>

    <div class="section two-cols">
      <div class="card">
        <h3>Solicitudes recientes</h3>

        ${solicitudes.map(s => `
          <div class="list-item">
            <strong>${s.titulo}</strong><br>
            <small>${s.usuario}</small><br><br>
            <span class="badge ${s.estado === "Atendida" ? "green" : s.estado === "En proceso" ? "blue" : "orange"}">
              ${s.estado}
            </span>
          </div>
        `).join("")}
      </div>

      <div class="card">
        <h3>Próximas actividades</h3>

        ${actividades.map(a => `
          <div class="list-item">
            <strong>${a.titulo}</strong><br>
            ${a.fecha}, ${a.hora}<br>
            <small>${a.lugar}</small>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function adminActividades() {
  return `
    <div class="two-cols">
      <div class="form-card">
        <h3>Nueva actividad</h3>

        <div class="field">
          <label>Título</label>
          <input placeholder="Ejemplo: Asamblea General">
        </div>

        <div class="field">
          <label>Fecha</label>
          <input type="date">
        </div>

        <div class="field">
          <label>Hora</label>
          <input type="time">
        </div>

        <div class="field">
          <label>Lugar</label>
          <input placeholder="Salón Social">
        </div>

        <button class="btn" onclick="alert('Actividad agregada en modo demo')">Guardar actividad</button>
      </div>

      <div class="card">
        <h3>Actividades registradas</h3>

        ${actividades.map(a => `
          <div class="list-item">
            <strong>${a.titulo}</strong><br>
            ${a.fecha}, ${a.hora}<br>
            <small>${a.lugar}</small>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function adminAvisos() {
  return `
    <div class="two-cols">
      <div class="form-card">
        <h3>Nuevo aviso</h3>

        <div class="field">
          <label>Título</label>
          <input placeholder="Título del aviso">
        </div>

        <div class="field">
          <label>Tipo</label>
          <select>
            <option>Aviso</option>
            <option>Noticia</option>
            <option>Recordatorio</option>
          </select>
        </div>

        <div class="field">
          <label>Mensaje</label>
          <textarea placeholder="Contenido del aviso..."></textarea>
        </div>

        <button class="btn" onclick="alert('Aviso publicado en modo demo')">Publicar aviso</button>
      </div>

      <div class="card">
        <h3>Avisos publicados</h3>

        ${avisos.map(a => `
          <div class="list-item">
            <strong>${a.titulo}</strong>
            <p>${a.texto}</p>
            <span class="badge ${a.tipo === "Noticia" ? "blue" : "green"}">${a.tipo}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function adminSolicitudes() {
  return `
    <div class="card">
      <h3>Consultas, quejas e incidencias</h3>

      ${solicitudes.map(s => `
        <div class="list-item">
          <strong>${s.titulo}</strong><br>
          <small>Enviado por: ${s.usuario}</small><br><br>

          <span class="badge ${s.estado === "Atendida" ? "green" : s.estado === "En proceso" ? "blue" : "orange"}">
            ${s.estado}
          </span>

          <br><br>

          <button class="btn" onclick="alert('Estado actualizado en modo demo')">
            Cambiar estado
          </button>
        </div>
      `).join("")}
    </div>
  `;
}

function adminUsuarios() {
  return `
    <div class="card">
      <h3>Usuarios registrados</h3>

      <div class="list-item">
        <strong>Laura Gómez</strong><br>
        Torre A - Apartamento 102<br>
        <span class="badge green">Activo</span>
      </div>

      <div class="list-item">
        <strong>Carlos Rivera</strong><br>
        Torre B - Apartamento 205<br>
        <span class="badge green">Activo</span>
      </div>

      <div class="list-item">
        <strong>María López</strong><br>
        Torre C - Apartamento 301<br>
        <span class="badge orange">Pendiente</span>
      </div>
    </div>
  `;
}

render();
