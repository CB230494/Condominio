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
          <strong><i class="fa-solid fa-house"></i></strong>Inicio
        </button>

        <button class="nav-btn ${seccion === "misSolicitudes" ? "active" : ""}" onclick="renderUsuario('misSolicitudes')">
          <strong><i class="fa-solid fa-clipboard-list"></i></strong>Solicitudes
        </button>

        <button class="floating" onclick="renderNuevaSolicitud()">
          <i class="fa-solid fa-plus"></i>
        </button>

        <button class="nav-btn ${seccion === "perfil" ? "active" : ""}" onclick="renderUsuario('perfil')">
          <strong><i class="fa-solid fa-user"></i></strong>Perfil
        </button>

        <button class="nav-btn" onclick="cerrarSesion()">
          <strong><i class="fa-solid fa-right-from-bracket"></i></strong>Salir
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
        <p>Bienvenido, ${currentUser?.NOMBRE || "Usuario"}</p>
      </div>
    </div>

    <div class="mobile-content">
      <div class="actions">
        <div class="action-card" onclick="renderNuevaSolicitud()">
          <div class="action-icon"><i class="fa-solid fa-pen-to-square"></i></div>
          <h3>Nueva solicitud</h3>
          <p>Reporte una avería, consulta, queja o sugerencia.</p>
          <span class="arrow">›</span>
        </div>

        <div class="action-card" onclick="renderUsuario('misSolicitudes')">
          <div class="action-icon"><i class="fa-solid fa-list-check"></i></div>
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
      <h2><i class="fa-solid fa-user"></i> Mi perfil</h2>

      <div class="card" style="text-align:center">
        <div class="logo"><i class="fa-solid fa-circle-user"></i></div>

        <h3>${currentUser?.NOMBRE || ""} ${currentUser?.APELLIDOS || ""}</h3>

        <p><i class="fa-solid fa-house"></i> <strong>Filial:</strong> ${currentUser?.FILIAL || ""}</p>
        <p><i class="fa-solid fa-building"></i> <strong>Torre:</strong> ${currentUser?.TORRE || ""}</p>
        <p><i class="fa-solid fa-door-open"></i> <strong>Apartamento:</strong> ${currentUser?.APARTAMENTO || ""}</p>
        <p><i class="fa-solid fa-envelope"></i> <strong>Correo:</strong> ${currentUser?.CORREO || ""}</p>
        <p><i class="fa-solid fa-phone"></i> <strong>Teléfono:</strong> ${currentUser?.TELEFONO || ""}</p>
        <p><i class="fa-solid fa-circle-check"></i> <strong>Estado:</strong> ${currentUser?.ESTADO || ""}</p>
      </div>
    </div>
  `;
}

function usuarioMisSolicitudes() {
  return `
    <div class="mobile-content">
      <h2><i class="fa-solid fa-clipboard-list"></i> Mis solicitudes</h2>
      <div id="misSolicitudesBox" class="card">
        Cargando solicitudes...
      </div>
    </div>
  `;
}
