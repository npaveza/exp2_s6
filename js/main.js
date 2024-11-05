// main.js
document.addEventListener("DOMContentLoaded", () => {
    updateMenu();

    document.getElementById("loginForm")?.addEventListener("submit", login);
    document.getElementById("registroForm")?.addEventListener("submit", registrarUsuario);
    document.getElementById("logoutButton")?.addEventListener("click", logout);
});
