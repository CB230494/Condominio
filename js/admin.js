/******************************************************
 * PANEL ADMINISTRATIVO
 ******************************************************/

function renderAdmin(seccion = "dashboard") {
  app.innerHTML = `
    <div class="layout admin-layout">
      <aside class="sidebar">
        <div class="brand">
          <i class="fa-solid fa-leaf"></i>
          Condominio<br>Los Jardines
        </div>

        <button class="menu-btn ${seccion === "dashboard" ? "active" : ""}" onclick="renderAdmin('dashboard')">
          <i class="fa-solid fa-chart-line"></i> Dashboard
        </button>

        <button class="menu-btn ${seccion === "usuarios" ? "active" : ""}" onclick="renderAdmin('usuarios')">
          <i class="fa-solid fa-users"></i> Usuarios
        </button>

        <button class="menu-btn ${seccion === "solicitudes" ? "active" : ""}" onclick="renderAdmin('solicitudes')">
          <i class="fa-solid fa-clipboard-list"></i> Solicitudes
        </button>

        <button class="menu-btn" onclick="cerrarSesion()">
          <i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión
        </button>
      </aside>

      <main class="main admin-main">
        <div class="topbar">
          <h2>${seccion === "dashboard" ? "Dashboard Ejecutivo" : "Panel Administrativo"}</h2>
          <div class="user-pill">Administrador <i class="fa-solid fa-user-shield"></i></div>
        </div>

        ${
          seccion === "usuarios"
            ? adminUsuarios()
            : seccion === "solicitudes"
            ? adminSolicitudes()
            : adminDashboard()
        }
      </main>

      <div class="admin-bottom-nav">
        <button class="${seccion === "dashboard" ? "active" : ""}" onclick="renderAdmin('dashboard')">
          <strong><i class="fa-solid fa-chart-line"></i></strong>
          Dashboard
        </button>

        <button class="${seccion === "usuarios" ? "active" : ""}" onclick="renderAdmin('usuarios')">
          <strong><i class="fa-solid fa-users"></i></strong>
          Usuarios
        </button>

        <button class="${seccion === "solicitudes" ? "active" : ""}" onclick="renderAdmin('solicitudes')">
          <strong><i class="fa-solid fa-clipboard-list"></i></strong>
          Solicitudes
        </button>

        <button onclick="cerrarSesion()">
          <strong><i class="fa-solid fa-right-from-bracket"></i></strong>
          Salir
        </button>
      </div>
    </div>
  `;

  if (seccion === "dashboard") cargarDashboardAdmin();
  if (seccion === "usuarios") cargarUsuariosAdmin();
  if (seccion === "solicitudes") cargarSolicitudesAdmin();
}

/******************************************************
 * DASHBOARD EJECUTIVO
 ******************************************************/

function adminDashboard() {
  return `
    <div class="grid">
      <div class="card stat">
        <div class="icon"><i class="fa-solid fa-users"></i></div>
        <div>
          <h3 id="totalUsuarios">0</h3>
          <p>Usuarios registrados</p>
        </div>
      </div>

      <div class="card stat">
        <div class="icon"><i class="fa-solid fa-user-check"></i></div>
        <div>
          <h3 id="usuariosActivos">0</h3>
          <p>Usuarios activos</p>
        </div>
      </div>

      <div class="card stat">
        <div class="icon"><i class="fa-solid fa-clock"></i></div>
        <div>
          <h3 id="usuariosPendientes">0</h3>
          <p>Usuarios pendientes</p>
        </div>
      </div>

      <div class="card stat">
        <div class="icon"><i class="fa-solid fa-clipboard-list"></i></div>
        <div>
          <h3 id="totalSolicitudes">0</h3>
          <p>Solicitudes totales</p>
        </div>
      </div>

      <div class="card stat">
        <div class="icon"><i class="fa-solid fa-spinner"></i></div>
        <div>
          <h3 id="solicitudesProceso">0</h3>
          <p>En proceso</p>
        </div>
      </div>

      <div class="card stat">
        <div class="icon"><i class="fa-solid fa-lock"></i></div>
        <div>
          <h3 id="solicitudesCerradas">0</h3>
          <p>Cerradas</p>
        </div>
      </div>
    </div>

    <div class="section two-cols">
      <div class="card">
        <h3><i class="fa-solid fa-list-check"></i> Últimas solicitudes</h3>
        <div id="ultimasSolicitudesBox">Cargando...</div>
      </div>

      <div class="card">
        <h3><i class="fa-solid fa-user-group"></i> Últimos usuarios</h3>
        <div id="ultimosUsuariosBox">Cargando...</div>
      </div>
    </div>

    <div class="section two-cols">
      <div class="card">
        <h3><i class="fa-solid fa-chart-simple"></i> Indicadores</h3>

        <div class="metric-block">
          <strong>Solicitudes atendidas/cerradas</strong>
          <div class="progress-line">
            <div id="barraAtendidas" class="progress-fill"></div>
          </div>
          <small id="txtAtendidas">0%</small>
        </div>

        <br>

        <div class="metric-block">
          <strong>Usuarios activos</strong>
          <div class="progress-line">
            <div id="barraUsuariosActivos" class="progress-fill"></div>
          </div>
          <small id="txtUsuariosActivos">0%</small>
        </div>
      </div>

      <div class="card">
        <h3><i class="fa-solid fa-bolt"></i> Accesos rápidos</h3>

        <button class="btn" onclick="renderAdmin('solicitudes')">
          <i class="fa-solid fa-clipboard-list"></i> Ver solicitudes
        </button>
        <br><br>
        <button class="btn btn-outline" onclick="renderAdmin('usuarios')">
          <i class="fa-solid fa-users"></i> Gestionar usuarios
        </button>
      </div>
    </div>
  `;
}

async function cargarDashboardAdmin() {
  const usuariosResp = await API.listarUsuariosAdmin();
  const solicitudesResp = await API.listarSolicitudesAdmin();

  const usuarios = usuariosResp.ok ? usuariosResp.data.usuarios || [] : [];
  const solicitudes = solicitudesResp.ok ? solicitudesResp.data.solicitudes || [] : [];

  const usuariosActivos = usuarios.filter(u => u.ESTADO === "Activo").length;
  const usuariosPendientes = usuarios.filter(u => u.ESTADO === "Pendiente").length;

  const solicitudesProceso = solicitudes.filter(s => s.ESTADO === "En proceso").length;
  const solicitudesCerradas = solicitudes.filter(s => s.ESTADO === "Cerrada").length;
  const solicitudesAtendidas = solicitudes.filter(s => s.ESTADO === "Atendida" || s.ESTADO === "Cerrada").length;

  document.getElementById("totalUsuarios").innerText = usuarios.length;
  document.getElementById("usuariosActivos").innerText = usuariosActivos;
  document.getElementById("usuariosPendientes").innerText = usuariosPendientes;
  document.getElementById("totalSolicitudes").innerText = solicitudes.length;
  document.getElementById("solicitudesProceso").innerText = solicitudesProceso;
  document.getElementById("solicitudesCerradas").innerText = solicitudesCerradas;

  const ultimasSolicitudes = solicitudes.slice().reverse().slice(0, 5);
  const ultimosUsuarios = usuarios.slice().reverse().slice(0, 5);

  document.getElementById("ultimasSolicitudesBox").innerHTML =
    ultimasSolicitudes.length === 0
      ? "No hay solicitudes registradas."
      : ultimasSolicitudes.map(s => `
        <div class="list-item">
          <strong>${s.ASUNTO || ""}</strong><br>
          <small>${fechaBonitaAdmin(s.FECHA_HORA)}</small><br>
          <small>${s.NOMBRE_COMPLETO || ""} · ${s.TIPO || ""}</small><br>
          <span class="badge ${badgeSolicitud(estadoSeguro(s.ESTADO))}">${estadoSeguro(s.ESTADO)}</span>
          <span class="badge ${badgePrioridad(s.PRIORIDAD || "Media")}">${s.PRIORIDAD || "Media"}</span>
        </div>
      `).join("");

  document.getElementById("ultimosUsuariosBox").innerHTML =
    ultimosUsuarios.length === 0
      ? "No hay usuarios registrados."
      : ultimosUsuarios.map(u => `
        <div class="list-item">
          <strong>${u.NOMBRE || ""} ${u.APELLIDOS || ""}</strong><br>
          <small>${u.FILIAL || ""}</small><br>
          <small>${fechaBonitaAdmin(u.FECHA_REGISTRO)}</small><br>
          <span class="badge ${badgeUsuario(u.ESTADO)}">${u.ESTADO || "Pendiente"}</span>
        </div>
      `).join("");

  const pctAtendidas = solicitudes.length ? Math.round((solicitudesAtendidas / solicitudes.length) * 100) : 0;
  const pctActivos = usuarios.length ? Math.round((usuariosActivos / usuarios.length) * 100) : 0;

  document.getElementById("barraAtendidas").style.width = `${pctAtendidas}%`;
  document.getElementById("txtAtendidas").innerText = `${pctAtendidas}%`;

  document.getElementById("barraUsuariosActivos").style.width = `${pctActivos}%`;
  document.getElementById("txtUsuariosActivos").innerText = `${pctActivos}%`;
}

/******************************************************
 * USUARIOS
 ******************************************************/

function adminUsuarios() {
  return `
    <div class="card">
      <h3><i class="fa-solid fa-users"></i> Usuarios registrados</h3>
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
      <small><i class="fa-solid fa-envelope"></i> ${u.CORREO || ""}</small><br>
      <small><i class="fa-solid fa-phone"></i> ${u.TELEFONO || ""}</small><br>
      <small><i class="fa-solid fa-house"></i> ${u.FILIAL || ""}</small><br>
      <small><i class="fa-solid fa-calendar-days"></i> ${fechaBonitaAdmin(u.FECHA_REGISTRO)}</small><br><br>

      <span class="badge ${badgeUsuario(u.ESTADO)}">${u.ESTADO || "Pendiente"}</span>

      <br><br>

      ${u.ESTADO !== "Activo" ? `
        <button class="btn" onclick="cambiarEstadoUsuario('${u.ID_USUARIO}', 'Activo')">
          <i class="fa-solid fa-user-check"></i> Aprobar
        </button>
        <br><br>
      ` : ""}

      ${u.ESTADO !== "Rechazado" ? `
        <button class="btn btn-outline" onclick="cambiarEstadoUsuario('${u.ID_USUARIO}', 'Rechazado')">
          <i class="fa-solid fa-user-xmark"></i> Rechazar
        </button>
        <br><br>
      ` : ""}

      ${u.ESTADO !== "Inactivo" ? `
        <button class="btn btn-outline" onclick="cambiarEstadoUsuario('${u.ID_USUARIO}', 'Inactivo')">
          <i class="fa-solid fa-user-slash"></i> Desactivar
        </button>
      ` : ""}
    </div>
  `).join("");
}

async function cambiarEstadoUsuario(idUsuario, estado) {
  const r = await API.actualizarEstadoUsuario({ idUsuario, estado });

  alert(r.mensaje);

  if (r.ok && r.data.whatsappUsuario) {
    window.open(r.data.whatsappUsuario, "_blank");
  }

  cargarUsuariosAdmin();
}

/******************************************************
 * SOLICITUDES
 ******************************************************/

function adminSolicitudes() {
  return `
    <div class="card">
      <h3><i class="fa-solid fa-clipboard-list"></i> Solicitudes registradas</h3>
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

  box.innerHTML = solicitudes.reverse().map(s => {
    const prioridad = s.PRIORIDAD || "Media";
    const estado = estadoSeguro(s.ESTADO);
    const responsable = s.RESPONSABLE || "Pendiente de asignación";

    return `
      <div class="list-item">
        <strong>${s.ASUNTO || ""}</strong><br>
        <small><i class="fa-solid fa-calendar-days"></i> ${fechaBonitaAdmin(s.FECHA_HORA)}</small><br>
        <small><i class="fa-solid fa-user"></i> ${s.NOMBRE_COMPLETO || ""}</small><br><br>

        <span class="badge ${badgeSolicitud(estado)}">Estado: ${estado}</span>
        <span class="badge ${badgePrioridad(prioridad)}">Prioridad: ${prioridad}</span>

        <p><strong>Tipo:</strong> ${s.TIPO || ""}</p>
        <p>${s.DESCRIPCION || ""}</p>

        ${renderFotosSolicitudAdmin(s)}

        <div class="field">
          <label>Prioridad</label>
          <select id="prioridad_${s.ID_SOLICITUD}">
            <option ${prioridad === "Baja" ? "selected" : ""}>Baja</option>
            <option ${prioridad === "Media" ? "selected" : ""}>Media</option>
            <option ${prioridad === "Alta" ? "selected" : ""}>Alta</option>
            <option ${prioridad === "Urgente" ? "selected" : ""}>Urgente</option>
          </select>
        </div>

        <div class="field">
          <label>Responsable</label>
          <input id="responsable_${s.ID_SOLICITUD}" value="${responsable}">
        </div>

        <div class="field">
          <label>Estado</label>
          <select id="estado_${s.ID_SOLICITUD}">
            <option ${estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
            <option ${estado === "En proceso" ? "selected" : ""}>En proceso</option>
            <option ${estado === "Atendida" ? "selected" : ""}>Atendida</option>
            <option ${estado === "Cerrada" ? "selected" : ""}>Cerrada</option>
          </select>
        </div>

        <div class="field">
          <label>Observación administrativa</label>
          <textarea id="obs_${s.ID_SOLICITUD}">${s.OBSERVACION_ADMIN || ""}</textarea>
        </div>

        ${s.FECHA_CIERRE ? `<p><strong>Fecha de cierre:</strong> ${fechaBonitaAdmin(s.FECHA_CIERRE)}</p>` : ""}

        <button class="btn" onclick="actualizarSolicitudAdmin('${s.ID_SOLICITUD}')">
          <i class="fa-solid fa-floppy-disk"></i> Guardar seguimiento
        </button>
      </div>
    `;
  }).join("");
}

async function actualizarSolicitudAdmin(idSolicitud) {
  const estado = document.getElementById(`estado_${idSolicitud}`).value;
  const observacion = document.getElementById(`obs_${idSolicitud}`).value;
  const prioridad = document.getElementById(`prioridad_${idSolicitud}`).value;
  const responsable = document.getElementById(`responsable_${idSolicitud}`).value;

  const r = await API.actualizarSolicitud({
    idSolicitud,
    estado,
    observacion,
    prioridad,
    responsable
  });

  alert(r.mensaje);

  if (r.ok && r.data.whatsappUsuario) {
    window.open(r.data.whatsappUsuario, "_blank");
  }

  cargarSolicitudesAdmin();
}

/******************************************************
 * UTILIDADES
 ******************************************************/

function renderFotosSolicitudAdmin(item) {
  const fotos = [item.FOTO_1, item.FOTO_2, item.FOTO_3].filter(Boolean);

  if (fotos.length === 0) return "";

  return `
    <div class="fotos-solicitud">
      <strong><i class="fa-solid fa-images"></i> Fotografías adjuntas</strong>
      <div class="fotos-grid">
        ${fotos.map((url, index) => `
          <a href="${url}" target="_blank">
            <img src="${url}" alt="Foto ${index + 1}">
          </a>
        `).join("")}
      </div>
    </div>
  `;
}

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

function badgePrioridad(prioridad) {
  if (prioridad === "Baja") return "green";
  if (prioridad === "Alta") return "orange";
  if (prioridad === "Urgente") return "red";
  return "orange";
}

function estadoSeguro(estado) {
  return ["Pendiente", "En proceso", "Atendida", "Cerrada"].includes(estado)
    ? estado
    : "Pendiente";
}

function fechaBonitaAdmin(valor) {
  if (!valor) return "";

  const fecha = new Date(valor);

  if (isNaN(fecha.getTime())) return valor;

  return fecha.toLocaleString("es-CR", {
    timeZone: "America/Costa_Rica",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
