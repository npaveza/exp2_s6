// eventos.js
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente cargado");
    mostrarEventos();
});

function mostrarEventos() {
    const eventosContainer = document.getElementById("eventos-container");
    eventosContainer.innerHTML = "";

    const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    console.log("Eventos cargados:", eventos); // Verificar si los datos se cargan
    eventos.forEach((evento, index) => {
        const eventoHTML = `
            <div class="col-md-4 evento-card">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${evento.nombre}</h5>
                        <p class="card-text">${evento.lugar} - ${evento.fecha} ${evento.hora}</p>
                        <button class="btn btn-primary" onclick="mostrarDetalle(${index})">Ver Detalle</button>
                        ${obtenerUsuarioActual()?.rol === "organizador" ? `<button class="btn btn-danger" onclick="eliminarEvento(${index})">Eliminar</button>` : ""}
                    </div>
                </div>
            </div>
        `;
        eventosContainer.innerHTML += eventoHTML;
    });
}


function agregarEvento(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const lugar = document.getElementById("lugar").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

    const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    eventos.push({ nombre, lugar, fecha, hora });
    localStorage.setItem("eventos", JSON.stringify(eventos));

    window.location.href = "ver-eventos.html";
}

function eliminarEvento(index) {
    const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    eventos.splice(index, 1);
    localStorage.setItem("eventos", JSON.stringify(eventos));
    mostrarEventos();
}


function mostrarDetalle(index) {
    const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    const evento = eventos[index];

    if (evento) {
        // Mostrar detalles del evento
        document.getElementById("comentariosModalLabel").textContent = evento.nombre;
        document.getElementById("comentariosModalLugar").textContent = evento.lugar;
        document.getElementById("comentariosModalFecha").textContent = evento.fecha;
        document.getElementById("comentariosModalHora").textContent = evento.hora;

        // Cargar comentarios (si existen)
        const comentariosLista = document.getElementById("comentarios-lista");
        comentariosLista.innerHTML = ""; // Limpiar lista de comentarios
        const comentarios = evento.comentarios || [];
        
        comentarios.forEach(comentario => {
            const comentarioElemento = document.createElement("p");
            comentarioElemento.textContent = comentario;
            comentariosLista.appendChild(comentarioElemento);
        });

        // Guardar el índice del evento en el formulario de comentarios
        document.getElementById("comentarioForm").dataset.eventoIndex = index;

        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById("comentariosModal"));
        modal.show();
    } else {
        console.error("Evento no encontrado");
    }
}

document.getElementById("comentarioForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const comentarioInput = document.getElementById("comentario");
    const comentario = comentarioInput.value.trim();
    if (comentario) {
        const eventoIndex = this.dataset.eventoIndex;
        const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
        
        eventos[eventoIndex].comentarios = eventos[eventoIndex].comentarios || [];
        eventos[eventoIndex].comentarios.push(comentario);
        
        localStorage.setItem("eventos", JSON.stringify(eventos));

        comentarioInput.value = ""; // Limpiar el campo de texto
        mostrarDetalle(eventoIndex); // Actualizar lista de comentarios
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const comentariosModal = new bootstrap.Modal(document.getElementById("comentariosModal"));

    document.getElementById("comentariosModal").addEventListener('hidden.bs.modal', () => {
        document.body.classList.remove("modal-open");
        document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
    });
});