/******************************************************
 * SOLICITUDES DEL USUARIO
 ******************************************************/

let fotosSolicitud = [];

function renderNuevaSolicitud() {
  fotosSolicitud = [];

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

        <div class="field">
          <label><i class="fa-solid fa-camera"></i> Adjuntar fotografías</label>
          <input id="fotosInput" type="file" accept="image/*" multiple onchange="procesarFotosSolicitud(event)">
          <small>Puede adjuntar hasta 3 imágenes.</small>
        </div>

        <div id="previewFotosSolicitud" class="preview-fotos"></div>

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

async function procesarFotosSolicitud(event) {
  const archivos = Array.from(event.target.files || []);

  if (archivos.length > 3) {
    alert("Solo puede adjuntar un máximo de 3 imágenes.");
  }

  fotosSolicitud = [];

  const seleccionadas = archivos.slice(0, 3);

  for (const archivo of seleccionadas) {
    const base64 = await comprimirImagenSolicitud(archivo, 1200, 0.75);
    fotosSolicitud.push(base64);
  }

  mostrarPreviewFotos();
}

function mostrarPreviewFotos() {
  const contenedor = document.getElementById("previewFotosSolicitud");

  if (!contenedor) return;

  if (fotosSolicitud.length === 0) {
    contenedor.innerHTML = "";
    return;
  }

  contenedor.innerHTML = fotosSolicitud.map((foto, index) => `
    <div class="foto-preview">
      <img src="${foto}" alt="Foto ${index + 1}">
      <button type="button" onclick="eliminarFotoSolicitud(${index})">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `).join("");
}

function eliminarFotoSolicitud(index) {
  fotosSolicitud.splice(index, 1);
  mostrarPreviewFotos();

  const input = document.getElementById("fotosInput");
  if (input) input.value = "";
}

function comprimirImagenSolicitud(file, maxWidth = 1200, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();

      img.onload = function () {
        const canvas = document.createElement("canvas");

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL("image/jpeg", quality);
        resolve(base64);
      };

      img.onerror = reject;
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function enviarSolicitud() {
  const asunto = document.getElementById("asuntoSolicitud").value.trim();
  const descripcion = document.getElementById("descripcionSolicitud").value.trim();

  if (!asunto || !descripcion) {
    alert("Debe completar el asunto y la descripción.");
    return;
  }

  const data = {
    idUsuario: currentUser.ID_USUARIO,
    nombre: currentUser.NOMBRE,
    apellidos: currentUser.APELLIDOS,
    telefono: currentUser.TELEFONO,
    correo: currentUser.CORREO,
    tipo: document.getElementById("tipoSolicitud").value,
    prioridad: document.getElementById("prioridadSolicitud").value,
    asunto,
    descripcion,
    responsable: "Pendiente de asignación",
    foto1: fotosSolicitud[0] || "",
    foto2: fotosSolicitud[1] || "",
    foto3: fotosSolicitud[2] || ""
  };

  const r = await API.registrarSolicitud(data);

  alert(r.mensaje);

  if (!r.ok) return;

  if (r.data.whatsappAdmin) {
    window.open(r.data.whatsappAdmin, "_blank");
  }

  fotosSolicitud = [];
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

        ${renderFotosSolicitudUsuario(item)}

        <br>

        <b><i class="fa-solid fa-comment-dots"></i> Observación administración</b>
        <p>${item.OBSERVACION_ADMIN || "Sin observaciones"}</p>
      </div>
    `;
  }).join("");
}

function renderFotosSolicitudUsuario(item) {
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
