/******************************************************
 * SOLICITUDES DEL USUARIO
 ******************************************************/

function renderNuevaSolicitud() {
  app.innerHTML = `
    <div class="mobile-content">
      <h2><i class="fa-solid fa-pen-to-square"></i> Nueva solicitud</h2>

      <div class="form-card">
        <div class="field">
          <label><i class="fa-solid fa-list"></i> Tipo de solicitud</label>
          <select id="tipoSolicitud">
            <option value="Consulta">Consulta</option>
            <option value="Queja">Queja</option>
            <option value="Avería">Avería</option>
            <option value="Solicitud">Solicitud</option>
            <option value="Sugerencia">Sugerencia</option>
          </select>
        </div>

        <div class="field">
          <label><i class="fa-solid fa-triangle-exclamation"></i> Prioridad</label>
          <select id="prioridadSolicitud">
            <option value="Baja">Baja</option>
            <option value="Media" selected>Media</option>
            <option value="Alta">Alta</option>
            <option value="Urgente">Urgente</option>
          </select>
        </div>

        <div class="field">
          <label><i class="fa-solid fa-heading"></i> Asunto</label>
          <input id="asuntoSolicitud" placeholder="Ejemplo: Fuga de agua">
        </div>

        <div class="field">
          <label><i class="fa-solid fa-align-left"></i> Descripción</label>
          <textarea id="descripcionSolicitud" rows="6" placeholder="Describa detalladamente la situación..."></textarea>
        </div>

        <button class="btn" onclick="enviarSolicitud()">
          <i class="fa-solid fa-paper-plane"></i> Enviar solicitud
        </button>

        <br><br>

        <button class="btn btn-outline" onclick="renderUsuario('inicio')">
          <i class="fa-solid fa-arrow-left"></i> Cancelar
        </button>
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
        <i class="fa-solid fa-circle-info"></i> No tiene solicitudes registradas.
      </div>
    `;
    return;
  }

  contenedor.innerHTML = lista.reverse().map(item => {
    const estado = estadoValidoUsuario(item.ESTADO) ? item.ESTADO : "Pendiente";

    return `
      <div class="card" style="margin-bottom:18px;">
        <h3><i class="fa-solid fa-file-lines"></i> ${item.ASUNTO || ""}</h3>

        <p><i class="fa-solid fa-list"></i> <b>Tipo:</b> ${item.TIPO || ""}</p>
        <p><i class="fa-solid fa-triangle-exclamation"></i> <b>Prioridad:</b> ${item.PRIORIDAD || "Media"}</p>
        <p><i class="fa-solid fa-user-gear"></i> <b>Responsable:</b> ${item.RESPONSABLE || "Pendiente de asignación"}</p>
        <p><i class="fa-solid fa-calendar-days"></i> <b>Fecha:</b> ${fechaBonitaUsuario(item.FECHA_HORA)}</p>
        <p><i class="fa-solid fa-circle-check"></i> <b>Estado:</b> ${estado}</p>

        <hr>

        <p>${item.DESCRIPCION || ""}</p>

        <br>

        <b><i class="fa-solid fa-comment-dots"></i> Observación administración</b>
        <p>${item.OBSERVACION_ADMIN || "Sin observaciones"}</p>
      </div>
    `;
  }).join("");
}

function estadoValidoUsuario(estado) {
  return ["Pendiente", "En proceso", "Atendida", "Cerrada"].includes(estado);
}

function fechaBonitaUsuario(valor) {
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
