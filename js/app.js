
// MENSAJES DE LA VOZ GUÍA

const mensajes = [
    "Mañana tienes una entrevista importante.",
    "Necesitas descansar para poder rendir.",
    "No puedes llegar cansada. Tienes muchas cosas por hacer.",
    "Debes dormir. Mañana tienes que estar preparada.",
    "Intenta relajarte. Es hora de descansar."
];

let mensajeActual = 0;

// ELEMENTOS DE LA PÁGINA

const mensaje = document.getElementById("mensaje");
const botonContinuar = document.getElementById("continuar");

const pantallaInicio = document.getElementById("inicio");
const pantallaHabitacion = document.getElementById("habitacion");

// AVANZAR EN LA NARRACIÓN

botonContinuar.addEventListener("click", () => {

    mensajeActual++;

    if (mensajeActual < mensajes.length) {

        mensaje.textContent = mensajes[mensajeActual];

        // Reinicia la animación del texto
        mensaje.style.animation = "none";
        void mensaje.offsetWidth;
        mensaje.style.animation = "aparecer 1s ease";

    } else {

        // Pasar a la habitación

        pantallaInicio.classList.remove("activa");
        pantallaHabitacion.classList.add("activa");

    }

});

// SELECCIÓN DE RITUALES

const camas = document.querySelectorAll(".cama");

camas.forEach((cama) => {

    cama.addEventListener("click", () => {

        const ritual = cama.dataset.ritual;

        console.log("Ritual seleccionado:", ritual);

    });

});
