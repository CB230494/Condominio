const app = document.getElementById("app");

let currentUser = JSON.parse(localStorage.getItem("condoUser")) || null;
let currentAdmin = JSON.parse(localStorage.getItem("condoAdmin")) || null;

function startApp() {
  if (currentAdmin) {
    renderAdmin("dashboard");
    return;
  }

  if (currentUser) {
    renderUsuario("inicio");
    return;
  }

  renderLogin();
}

startApp();
