/******************************************************
 * SOLICITUDES DEL USUARIO
 ******************************************************/

function renderNuevaSolicitud() {
  app.innerHTML = `
    <div class="mobile-content">

      <h2>Nueva solicitud</h2>

      <div class="form-card">

        <div class="field">
          <label>Tipo de solicitud</label>
          <select id="tipoSolicitud">
            <option value="Consulta">Consulta</option>
            <option value="Queja">Queja</option>
            <option value="Avería">Avería</option>
            <option value="Solicitud">Solicitud</option>
            <option value="Sugerencia">Sugerencia</option>
          </select>
        </div>

        <div class="field">
          <label>Prioridad</label>
          <select id="prioridadSolicitud">
            <option value="Baja">🟢 Baja</option>
            <option value="Media" selected>🟡 Media</option>
            <option value="Alta">🟠 Alta</option>
            <option value="Urgente">🔴 Urgente</option>
          </select>
        </div>

        <div class="field">
          <label>Asunto</label>
          <input id="asuntoSolicitud" placeholder="Ejemplo: Fuga de agua">
        </div>

        <div class="field">
          <label>Descripción</label>
          <textarea id="descripcionSolicitud" rows="6" placeholder="Describa detalladamente la situación..."></textarea>
        </div>

        <button class="btn" onclick="enviarSolicitud()">
          Enviar solicitud
        </button>

        <br><br>

        <button class="btn btn-outline" onclick="renderUsuario('inicio')">
          Cancelar
        </button>

      </div>

    </div>
  `;
}

/******************************************************
 * ENVIAR SOLICITUD
 ******************************************************/

async function enviarSolicitud() {
  const data = {
    idUsuario: currentUser.ID_USUARIO,
    nombre: currentUser.NOMBRE,
    apellidos: currentUser.APELLIDOS,
    telefono: currentUser.TELEFONO,
    correo: currentUser.CORREO,
    tipo: document.getElementById("tipoSolicitud").value,
    prioridad: document.getElementById("prioridadSolicitud").value,
    asunto: document.getElementById("asuntoSolicitud").value,
    descripcion: document.getElementById("descripcionSolicitud").value,
    responsable: "Pendiente de asignación"
  };

  const r = await API.registrarSolicitud(data);

  alert(r.mensaje);

  if (!r.ok) return;

  if (r.data.whatsappAdmin) {
    window.open(r.data.whatsappAdmin, "_blank");
  }

  renderUsuario("misSolicitudes");
}

/******************************************************
 * CARGAR SOLICITUDES
 ******************************************************/

async function cargarMisSolicitudes() {
  const contenedor = document.getElementById("misSolicitudesBox");

  const r = await API.listarSolicitudesUsuario({
    idUsuario: currentUser.ID_USUARIO,
    correo: currentUser.CORREO
  });

  if (!r.ok) {
    contenedor.innerHTML = r.mensaje;
    return;
  }

  const lista = r.data.solicitudes || [];

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <div class="card">
        No tiene solicitudes registradas.
      </div>
    `;
    return;
  }

  contenedor.innerHTML = lista.reverse().map(item => `
    <div class="card" style="margin-bottom:18px;">
      <h3>${item.ASUNTO}</h3>

      <p><b>Tipo:</b> ${item.TIPO}</p>
      <p><b>Prioridad:</b> ${item.PRIORIDAD || "Media"}</p>
      <p><b>Responsable:</b> ${item.RESPONSABLE || "Pendiente de asignación"}</p>
      <p><b>Fecha:</b> ${item.FECHA_HORA}</p>
      <p><b>Estado:</b> ${item.ESTADO}</p>

      <hr>

      <p>${item.DESCRIPCION}</p>

      <br>

      <b>Observación administración</b>
      <p>${item.OBSERVACION_ADMIN || "Sin observaciones"}</p>
    </div>
  `).join("");
}
