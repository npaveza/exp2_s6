document.addEventListener("DOMContentLoaded", function() {
    // Cargar el menú dinámico
    loadNavbar();

    const loggedInUser = JSON.parse(localStorage.getItem("usuarioActual"));
    const currentPage = document.body.getAttribute("data-page");

    if (!loggedInUser) {
        // Redirige si no hay sesión activa y se intenta acceder a páginas protegidas
        if (currentPage === "ver-eventos" || currentPage === "agregar-evento") {
            console.log("Redirigiendo a login por falta de sesión...");
        //    window.location.href = "login.html";
        }
    } else {
        const userRole = loggedInUser.rol;
        console.log("Rol del usuario logueado:", userRole);

        // Validar acceso según rol
        if (currentPage === "ver-eventos" && (userRole !== "visitante" && userRole !== "organizador")) {
            console.log("Redirigiendo a login - rol no permitido en ver-eventos.");
        //    window.location.href = "login.html";
        }

        if (currentPage === "agregar-evento" && userRole !== "organizador") {
            console.log("Redirigiendo a ver-eventos - rol no permitido en agregar-evento.");
            window.location.href = "ver-eventos.html";
        }
    }


    
    if (currentPage === "ver-eventos") {
        displayEvents();
    } else if (currentPage === "evento-detalle") {
        displayEventDetails();
    } else if (currentPage === "agregar-evento") {
        addEventHandler();
    } else if (currentPage === "registro") {
        registerUserHandler();
    } else if (currentPage === "login") {
        loginUserHandler();
    }

    // Función para cargar y mostrar el menú de navegación
    function loadNavbar() {
        const navbar = document.getElementById("navbarNav");
        fetch("navbar.html")
            .then(response => {
                if (!response.ok) throw new Error("Error al cargar navbar");
                return response.text();
            })
            .then(data => {
                navbar.innerHTML = data;
                updateMenu();
            })
            .catch(error => console.error("Error al cargar el navbar:", error));
    }

    // Función para mostrar el menú basado en el rol del usuario logueado
    function updateMenu() {
        const menu = document.getElementById("menu");
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
    
        if (user) {
            menu.innerHTML = `
                <li class="nav-item"><a class="nav-link" href="index.html">Inicio</a></li>
                <li class="nav-item"><a class="nav-link" href="ver-eventos.html">Ver Eventos</a></li>
                ${user.role === "organizador" ? '<li class="nav-item"><a class="nav-link" href="agregar-evento.html">Agregar Evento</a></li>' : ""}
                <li class="nav-item"><a class="nav-link" href="#" onclick="logout()">Logout</a></li>
            `;
        } else {
            menu.innerHTML = `
                <li class="nav-item"><a class="nav-link" href="index.html">Inicio</a></li>
                <li class="nav-item"><a class="nav-link" href="registro.html">Registro</a></li>
                <li class="nav-item"><a class="nav-link" href="login.html">Login</a></li>
            `;
        }
    }
    

    // Función para cerrar sesión
    window.logout = function() {
        localStorage.removeItem("loggedInUser");
        window.location.href = "index.html";
    };

    // Función para manejar el registro de usuario en registro.html
    function registerUserHandler() {
        const registerForm = document.getElementById("registerForm");
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const email = document.getElementById("registerEmail").value;
            const password = document.getElementById("registerPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const role = document.getElementById("role").value;

            if (password !== confirmPassword) {
                alert("Las contraseñas no coinciden");
                return;
            }

            const users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.some(user => user.email === email)) {
                alert("Este correo ya está registrado");
                return;
            }

            users.push({ email, password, role });
            localStorage.setItem("users", JSON.stringify(users));
            alert("Usuario registrado con éxito");
            window.location.href = "login.html";
        });
    }

    // Función para manejar el inicio de sesión en login.html
    function loginUserHandler() {
        const loginForm = document.getElementById("loginForm");
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
    
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(u => u.email === email && u.password === password);
    
            if (user) {
                localStorage.setItem("loggedInUser", JSON.stringify(user));
                console.log("Usuario guardado en localStorage:", user);
                alert("Inicio de sesión exitoso");
                window.location.href = "index.html";
            } else {
                alert("Correo o contraseña incorrectos");
            }
        });
    }

    // Función para mostrar la lista de eventos en ver-eventos.html
    function displayEvents() {
        const eventList = document.getElementById("eventList");
    
        if (!eventList) {
            console.warn("Elemento eventList no encontrado en el DOM");
            return;
        }
    
        const events = JSON.parse(localStorage.getItem("events")) || [];
        if (events.length === 0) {
            eventList.innerHTML = "<p>No hay eventos disponibles</p>";
        } else {
            events.forEach((event, index) => {
                const eventCard = document.createElement("div");
                eventCard.classList.add("col-md-4", "mb-3");
                eventCard.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${event.eventName}</h5>
                            <p>Lugar: ${event.location}</p>
                            <p>Fecha: ${event.date}</p>
                            <a href="evento-detalle.html?index=${index}" class="btn btn-primary">Ver Detalles</a>
                            ${user && user.role === "organizador" ? `<button class="btn btn-danger" onclick="deleteEvent(${index})">Eliminar</button>` : ""}
                        </div>
                    </div>`;
                eventList.appendChild(eventCard);
            });
        }
    }

    // Función para eliminar un evento (solo organizador)
    window.deleteEvent = function(index) {
        const events = JSON.parse(localStorage.getItem("events")) || [];
        events.splice(index, 1);
        localStorage.setItem("events", JSON.stringify(events));
        alert("Evento eliminado con éxito");
        window.location.reload();
    };

    // Función para manejar la adición de un nuevo evento en agregar-evento.html
    function addEventHandler() {
        const addEventForm = document.getElementById("addEventForm");
        addEventForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const eventName = document.getElementById("eventName").value;
            const location = document.getElementById("eventLocation").value;
            const date = document.getElementById("eventDate").value;
            const description = document.getElementById("eventDescription").value;

            const events = JSON.parse(localStorage.getItem("events")) || [];
            events.push({ eventName, location, date, description, comments: [] });
            localStorage.setItem("events", JSON.stringify(events));

            alert("Evento agregado con éxito");
            window.location.href = "ver-eventos.html";
        });
    }

    // Función para mostrar los detalles de un evento en evento-detalle.html
    function displayEventDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const index = urlParams.get("index");
        const events = JSON.parse(localStorage.getItem("events")) || [];
        const event = events[index];

        if (event) {
            document.getElementById("eventTitle").textContent = event.eventName;
            document.getElementById("eventDetails").innerHTML = `
                <p><strong>Lugar:</strong> ${event.location}</p>
                <p><strong>Fecha:</strong> ${event.date}</p>
                <p><strong>Descripción:</strong> ${event.description}</p>
            `;

            const commentsList = document.getElementById("commentsList");
            if (event.comments && event.comments.length > 0) {
                event.comments.forEach(comment => {
                    const commentItem = document.createElement("li");
                    commentItem.textContent = comment;
                    commentsList.appendChild(commentItem);
                });
            } else {
                commentsList.innerHTML = "<p>No hay comentarios aún.</p>";
            }

            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            if (loggedInUser && loggedInUser.role === "visitante") {
                const submitComment = document.getElementById("submitComment");
                submitComment.addEventListener("click", function() {
                    const commentText = document.getElementById("commentText").value;
                    if (commentText) {
                        event.comments = event.comments || [];
                        event.comments.push(commentText);
                        events[index] = event;
                        localStorage.setItem("events", JSON.stringify(events));
                        alert("Comentario agregado");
                        window.location.reload();
                    }
                });
            } else {
                document.getElementById("commentSection").style.display = "none";
            }
        } else {
            alert("Evento no encontrado");
            window.location.href = "ver-eventos.html";
        }
    }
});