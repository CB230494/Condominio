function renderUsuario(seccion = "inicio") {
  app.innerHTML = `
    <div class="mobile-wrap">
      ${
        seccion === "inicio"
          ? usuarioInicio()
          : seccion === "perfil"
          ? usuarioPerfil()
          : seccion === "misSolicitudes"
          ? usuarioMisSolicitudes()
          : usuarioInicio()
      }

      <div class="bottom-nav">
        <button class="nav-btn ${seccion === "inicio" ? "active" : ""}" onclick="renderUsuario('inicio')">
          <strong>🏠</strong>Inicio
        </button>

        <button class="nav-btn ${seccion === "misSolicitudes" ? "active" : ""}" onclick="renderUsuario('misSolicitudes')">
          <strong>📋</strong>Solicitudes
        </button>

        <button class="floating" onclick="renderNuevaSolicitud()">+</button>

        <button class="nav-btn ${seccion === "perfil" ? "active" : ""}" onclick="renderUsuario('perfil')">
          <strong>👤</strong>Perfil
        </button>

        <button class="nav-btn" onclick="cerrarSesion()">
          <strong>🚪</strong>Salir
        </button>
      </div>
    </div>
  `;

  if (seccion === "misSolicitudes") {
    cargarMisSolicitudes();
  }
}

function usuarioInicio() {
  return `
    <div class="hero">
      <div>
        <h1>Condominio<br>Los Jardines</h1>
        <p>Bienvenido, ${currentUser?.NOMBRE || "Usuario"} 👋</p>
      </div>
    </div>

    <div class="mobile-content">
      <div class="actions">
        <div class="action-card" onclick="renderNuevaSolicitud()">
          <div class="action-icon">📝</div>
          <h3>Nueva solicitud</h3>
          <p>Reporte una avería, consulta, queja o sugerencia.</p>
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

function usuarioPerfil() {
  return `
    <div class="mobile-content">
      <h2>Mi perfil</h2>

      <div class="card" style="text-align:center">
        <div class="logo">👤</div>
        <h3>${currentUser?.NOMBRE || ""} ${currentUser?.APELLIDOS || ""}</h3>
        <p><strong>Filial:</strong> ${currentUser?.FILIAL || ""}</p>
        <p><strong>Torre:</strong> ${currentUser?.TORRE || ""}</p>
        <p><strong>Apartamento:</strong> ${currentUser?.APARTAMENTO || ""}</p>
        <p><strong>Correo:</strong> ${currentUser?.CORREO || ""}</p>
        <p><strong>Teléfono:</strong> ${currentUser?.TELEFONO || ""}</p>
      </div>
    </div>
  `;
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
