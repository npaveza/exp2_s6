// auth.js

// Función para registrar usuario y guardar en localStorage
function registrarUsuario(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmarPassword = document.getElementById("confirmarPassword").value;
    const rol = document.getElementById("rol").value;

    if (password !== confirmarPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // Guardar datos del usuario en un objeto
    const usuario = { nombre, email, password, rol };

    // Guardar en localStorage como JSON
    localStorage.setItem(email, JSON.stringify(usuario));

    alert("Registro exitoso. Ahora puede iniciar sesión.");
    window.location.href = "login.html";
}

// Función para iniciar sesión y guardar usuario actual en sessionStorage
function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Recuperar usuario de localStorage
    const usuario = JSON.parse(localStorage.getItem(email));

    if (usuario && usuario.password === password) {
        // Guardar usuario en sessionStorage para la sesión actual
        sessionStorage.setItem("usuarioActual", JSON.stringify(usuario));
        window.location.href = "index.html";
    } else {
        alert("Correo o contraseña incorrectos.");
    }
}

// Función para cerrar sesión
function logout() {
    sessionStorage.removeItem("usuarioActual");
    window.location.href = "index.html";
}

// Función para obtener el usuario actual desde sessionStorage
function obtenerUsuarioActual() {
    return JSON.parse(sessionStorage.getItem("usuarioActual"));
}

// Actualizar menú en función de si el usuario está o no logueado
function updateMenu() {
    const usuarioActual = obtenerUsuarioActual();

    // Mostrar u ocultar elementos según el estado de sesión
    document.querySelectorAll(".logged-in").forEach(el => el.style.display = usuarioActual ? "block" : "none");
    document.querySelectorAll(".logged-out").forEach(el => el.style.display = usuarioActual ? "none" : "block");
    
    if (usuarioActual && usuarioActual.rol === "organizador") {
        document.querySelectorAll(".organizador").forEach(el => el.style.display = "block");
    }
}

// Inicializar listeners en elementos necesarios
document.addEventListener("DOMContentLoaded", () => {
    updateMenu();

    document.getElementById("registroForm")?.addEventListener("submit", registrarUsuario);
    document.getElementById("loginForm")?.addEventListener("submit", login);
    document.getElementById("logoutButton")?.addEventListener("click", logout);
});
