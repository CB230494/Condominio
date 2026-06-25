const API_URL = "https://script.google.com/macros/s/AKfycbyvMO2z8X_4B7qb4vFr6rVGGsEOgXGZNW3hscNZWnA-ogQpSfITrySJSnBq2uCdPtT4/exec";

async function apiRequest(accion, payload = {}) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({ accion, ...payload })
    });

    const text = await res.text();
    return JSON.parse(text);

  } catch (err) {
    console.error("ERROR API:", err);
    return {
      ok: false,
      mensaje: "No se pudo conectar con el backend."
    };
  }
}

const API = {
  loginUsuario: data => apiRequest("loginUsuario", data),
  loginAdmin: data => apiRequest("loginAdmin", data),
  registrarUsuario: data => apiRequest("registrarUsuario", data),

  listarUsuariosAdmin: () => apiRequest("listarUsuariosAdmin"),
  actualizarEstadoUsuario: data => apiRequest("actualizarEstadoUsuario", data),

  registrarSolicitud: data => apiRequest("registrarSolicitud", data),
  listarSolicitudesUsuario: data => apiRequest("listarSolicitudesUsuario", data),
  listarSolicitudesAdmin: () => apiRequest("listarSolicitudesAdmin"),
  actualizarSolicitud: data => apiRequest("actualizarSolicitud", data),

  registrarAviso: data => apiRequest("registrarAviso", data),
  listarAvisos: () => apiRequest("listarAvisos"),

  registrarActividad: data => apiRequest("registrarActividad", data),
  listarActividades: () => apiRequest("listarActividades")
};
