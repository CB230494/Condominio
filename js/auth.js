function renderLogin() {
  app.innerHTML = `
    <div class="login-screen">
      <div class="login-card">
        <div class="logo"><i class="fa-solid fa-leaf"></i></div>
        <h1>Condominio Los Jardines</h1>
        <p>Vive en armonía</p>

        <div class="field">
          <label><i class="fa-solid fa-envelope"></i> Correo electrónico</label>
          <input id="email" placeholder="tu@email.com">
        </div>

        <div class="field">
          <label><i class="fa-solid fa-lock"></i> Contraseña</label>
          <input id="pass" type="password" placeholder="********">
        </div>

        <button class="btn" onclick="loginUsuario()">
          <i class="fa-solid fa-right-to-bracket"></i> Iniciar sesión
        </button>

        <br><br>

        <button class="btn btn-outline" onclick="renderRegistro()">
          <i class="fa-solid fa-user-plus"></i> Crear cuenta
        </button>

        <div style="text-align:center; margin-top:22px;">
          <a onclick="renderAdminLogin()" style="font-size:12px; color:#6b7280; cursor:pointer;">
            <i class="fa-solid fa-user-shield"></i> Acceso administrativo
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
        <div class="logo"><i class="fa-solid fa-user-plus"></i></div>
        <h1>Registro de usuario</h1>
        <p>Complete sus datos para solicitar acceso.</p>

        <div class="field">
          <label><i class="fa-solid fa-user"></i> Nombre</label>
          <input id="regNombre" placeholder="Nombre">
        </div>

        <div class="field">
          <label><i class="fa-solid fa-user"></i> Apellidos</label>
          <input id="regApellidos" placeholder="Apellidos">
        </div>

        <div class="field">
          <label><i class="fa-solid fa-phone"></i> Teléfono</label>
          <input id="regTelefono" placeholder="86161763">
        </div>

        <div class="field">
          <label><i class="fa-solid fa-envelope"></i> Correo</label>
          <input id="regCorreo" placeholder="correo@email.com">
        </div>

        <div class="field">
          <label><i class="fa-solid fa-house"></i> Filial / Casa / Apartamento</label>
          <input id="regFilial" placeholder="Ejemplo: Casa 12">
        </div>

        <div class="field">
          <label><i class="fa-solid fa-building"></i> Torre</label>
          <input id="regTorre" placeholder="Opcional">
        </div>

        <div class="field">
          <label><i class="fa-solid fa-door-open"></i> Apartamento</label>
          <input id="regApartamento" placeholder="Opcional">
        </div>

        <div class="field">
          <label><i class="fa-solid fa-lock"></i> Contraseña</label>
          <input id="regPassword" type="password" placeholder="Crear contraseña">
        </div>

        <button class="btn" onclick="registrarUsuario()">
          <i class="fa-solid fa-floppy-disk"></i> Registrarme
        </button>

        <br><br>

        <button class="btn btn-outline" onclick="renderLogin()">
          <i class="fa-solid fa-arrow-left"></i> Volver
        </button>
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

  const r = await API.registrarUsuario(data);
  alert(r.mensaje);

  if (r.ok) renderLogin();
}

async function loginUsuario() {
  const correo = document.getElementById("email").value;
  const password = document.getElementById("pass").value;

  const r = await API.loginUsuario({ correo, password });

  if (!r.ok) {
    alert(r.mensaje);
    return;
  }

  currentUser = r.data.usuario;
  currentAdmin = null;

  localStorage.setItem("condoUser", JSON.stringify(currentUser));
  localStorage.removeItem("condoAdmin");

  renderUsuario("inicio");
}

function renderAdminLogin() {
  app.innerHTML = `
    <div class="login-screen">
      <div class="login-card">
        <div class="logo"><i class="fa-solid fa-user-shield"></i></div>
        <h1>Administrador</h1>
        <p>Acceso restringido</p>

        <div class="field">
          <label><i class="fa-solid fa-user"></i> Usuario</label>
          <input id="adminUser" placeholder="admin">
        </div>

        <div class="field">
          <label><i class="fa-solid fa-lock"></i> Contraseña</label>
          <input id="adminPass" type="password" placeholder="1234">
        </div>

        <button class="btn" onclick="loginAdmin()">
          <i class="fa-solid fa-right-to-bracket"></i> Ingresar
        </button>

        <br><br>

        <button class="btn btn-outline" onclick="renderLogin()">
          <i class="fa-solid fa-arrow-left"></i> Volver
        </button>
      </div>
    </div>
  `;
}

async function loginAdmin() {
  const usuario = document.getElementById("adminUser").value;
  const password = document.getElementById("adminPass").value;

  const r = await API.loginAdmin({ usuario, password });

  if (!r.ok) {
    alert(r.mensaje);
    return;
  }

  currentAdmin = r.data.admin;
  currentUser = null;

  localStorage.setItem("condoAdmin", JSON.stringify(currentAdmin));
  localStorage.removeItem("condoUser");

  renderAdmin("dashboard");
}

function cerrarSesion() {
  localStorage.removeItem("condoUser");
  localStorage.removeItem("condoAdmin");

  currentUser = null;
  currentAdmin = null;

  renderLogin();
}
