/******************************************************
 * PANEL ADMINISTRATIVO
 ******************************************************/

function renderAdmin(seccion = "dashboard") {
  app.innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <div class="brand">🌿 Condominio<br>Los Jardines</div>

        <button class="menu-btn ${seccion === "dashboard" ? "active" : ""}" onclick="renderAdmin('dashboard')">🏠 Dashboard</button>
        <button class="menu-btn ${seccion === "usuarios" ? "active" : ""}" onclick="renderAdmin('usuarios')">👥 Usuarios</button>
        <button class="menu-btn ${seccion === "solicitudes" ? "active" : ""}" onclick="renderAdmin('solicitudes')">📝 Solicitudes</button>
        <button class="menu-btn" onclick="cerrarSesion()">🚪 Cerrar sesión</button>
      </aside>

      <main class="main">
        <div class="topbar">
          <h2>Panel Administrativo</h2>
          <div class="user-pill">Administrador 👤</div>
        </div>

        ${
          seccion === "usuarios"
            ? adminUsuarios()
            : seccion === "solicitudes"
            ? adminSolicitudes()
            : adminDashboard()
        }
      </main>
    </div>
  `;

  if (seccion === "dashboard") cargarDashboardAdmin();
  if (seccion === "usuarios") cargarUsuariosAdmin();
  if (seccion === "solicitudes") cargarSolicitudesAdmin();
}

/******************************************************
 * DASHBOARD
 ******************************************************/

function adminDashboard() {
  return `
    <div class="grid">
      <div class="card stat">
        <div class="icon">👥</div>
        <div>
          <h3 id="totalUsuarios">0</h3>
          <p>Usuarios registrados</p>
        </div>
      </div>

      <div class="card stat">
        <div class="icon">🕓</div>
        <div>
          <h3 id="usuariosPendientes">0</h3>
          <p>Usuarios pendientes</p>
        </div>
      </div>

      <div class="card stat">
        <div class="icon">📝</div>
        <div>
          <h3 id="totalSolicitudes">0</h3>
          <p>Solicitudes registradas</p>
        </div>
      </div>
    </div>
  `;
}

async function cargarDashboardAdmin() {
  const usuarios = await API.listarUsuariosAdmin();
  const solicitudes = await API.listarSolicitudesAdmin();

  if (usuarios.ok) {
    const lista = usuarios.data.usuarios || [];
    document.getElementById("totalUsuarios").innerText = lista.length;
    document.getElementById("usuariosPendientes").innerText =
      lista.filter(u => u.ESTADO === "Pendiente").length;
  }

  if (solicitudes.ok) {
    document.getElementById("totalSolicitudes").innerText =
      (solicitudes.data.solicitudes || []).length;
  }
}

/******************************************************
 * USUARIOS ADMIN
 ******************************************************/

function adminUsuarios() {
  return `
    <div class="card">
      <h3>Usuarios registrados</h3>
      <div id="usuariosAdminBox">Cargando usuarios...</div>
    </div>
  `;
}

async function cargarUsuariosAdmin() {
  const box = document.getElementById("usuariosAdminBox");
  const r = await API.listarUsuariosAdmin();

  if (!r.ok) {
    box.innerHTML = r.mensaje;
    return;
  }

  const usuarios = r.data.usuarios || [];

  if (usuarios.length === 0) {
    box.innerHTML = "No hay usuarios registrados.";
    return;
  }

  box.innerHTML = usuarios.reverse().map(u => `
    <div class="list-item">
      <strong>${u.NOMBRE || ""} ${u.APELLIDOS || ""}</strong><br>
      <small>${u.CORREO || ""}</small><br>
      <small>Tel: ${u.TELEFONO || ""}</small><br>
      <small>Filial: ${u.FILIAL || ""}</small><br><br>

      <span class="badge ${badgeUsuario(u.ESTADO)}">${u.ESTADO}</span>

      <br><br>

      <button class="btn" onclick="cambiarEstadoUsuario('${u.ID_USUARIO}', 'Activo')">
        Aprobar
      </button>

      <br><br>

      <button class="btn btn-outline" onclick="cambiarEstadoUsuario('${u.ID_USUARIO}', 'Rechazado')">
        Rechazar
      </button>

      <br><br>

      <button class="btn btn-outline" onclick="cambiarEstadoUsuario('${u.ID_USUARIO}', 'Inactivo')">
        Desactivar
      </button>
    </div>
  `).join("");
}

async function cambiarEstadoUsuario(idUsuario, estado) {
  const r = await API.actualizarEstadoUsuario({
    idUsuario,
    estado
  });

  alert(r.mensaje);

  if (r.ok && r.data.whatsappUsuario) {
    window.open(r.data.whatsappUsuario, "_blank");
  }

  cargarUsuariosAdmin();
}

/******************************************************
 * SOLICITUDES ADMIN
 ******************************************************/

function adminSolicitudes() {
  return `
    <div class="card">
      <h3>Solicitudes registradas</h3>
      <div id="solicitudesAdminBox">Cargando solicitudes...</div>
    </div>
  `;
}

async function cargarSolicitudesAdmin() {
  const box = document.getElementById("solicitudesAdminBox");
  const r = await API.listarSolicitudesAdmin();

  if (!r.ok) {
    box.innerHTML = r.mensaje;
    return;
  }

  const solicitudes = r.data.solicitudes || [];

  if (solicitudes.length === 0) {
    box.innerHTML = "No hay solicitudes registradas.";
    return;
  }

  box.innerHTML = solicitudes.reverse().map(s => `
    <div class="list-item">
      <strong>${s.ASUNTO}</strong><br>
      <small>${s.FECHA_HORA}</small><br>
      <small>Usuario: ${s.NOMBRE_COMPLETO}</small><br><br>

      <span class="badge ${badgeSolicitud(s.ESTADO)}">${s.ESTADO}</span>

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
        <textarea id="obs_${s.ID_SOLICITUD}">${s.OBSERVACION_ADMIN || ""}</textarea>
      </div>

      <button class="btn" onclick="actualizarSolicitudAdmin('${s.ID_SOLICITUD}')">
        Guardar seguimiento
      </button>
    </div>
  `).join("");
}

async function actualizarSolicitudAdmin(idSolicitud) {
  const estado = document.getElementById(`estado_${idSolicitud}`).value;
  const observacion = document.getElementById(`obs_${idSolicitud}`).value;

  const r = await API.actualizarSolicitud({
    idSolicitud,
    estado,
    observacion,
    responsable: "Administrador"
  });

  alert(r.mensaje);

  if (r.ok && r.data.whatsappUsuario) {
    window.open(r.data.whatsappUsuario, "_blank");
  }

  cargarSolicitudesAdmin();
}

/******************************************************
 * BADGES
 ******************************************************/

function badgeUsuario(estado) {
  if (estado === "Activo") return "green";
  if (estado === "Rechazado") return "red";
  if (estado === "Inactivo") return "blue";
  return "orange";
}

function badgeSolicitud(estado) {
  if (estado === "Atendida" || estado === "Cerrada") return "green";
  if (estado === "En proceso") return "blue";
  return "orange";
}
