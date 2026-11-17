
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

// SELECCIÓN DE LAS CAMAS Y DESLIZAMIENTO DE COBIJAS

const camas = document.querySelectorAll(".cama");
const mensajeRitual = document.getElementById("mensaje-ritual");

let inicioDeslizamiento = 0;

const nombresRituales = {
    ovejas: "Contar ovejas",
    respiracion: "Respiración consciente",
    colores: "Repetición de colores",
    ruido: "Reproducción de ruido blanco"
};

function iniciarRitual(cama) {
    const ritual = cama.dataset.ritual;

    // Evita activar varias veces la misma cama
    if (cama.classList.contains("deslizada")) return;

    cama.classList.add("deslizada");

    mensajeRitual.textContent =
        "Has elegido: " + nombresRituales[ritual] + ". ¡Vamos a comenzar!";

    console.log("Ritual seleccionado:", ritual);

    // Guardamos el ritual para desarrollarlo en el siguiente paso
    sessionStorage.setItem("ritualSeleccionado", ritual);
}

camas.forEach((cama) => {
    cama.addEventListener("pointerdown", (evento) => {
        inicioDeslizamiento = evento.clientY;
        cama.setPointerCapture(evento.pointerId);
    });

    cama.addEventListener("pointerup", (evento) => {
        const finalDeslizamiento = evento.clientY;
        const distancia = finalDeslizamiento - inicioDeslizamiento;

        // Si la persona desliza hacia abajo al menos 35 píxeles
        if (distancia > 35) {
            iniciarRitual(cama);
        }
    });

    // También permite seleccionar con teclado
    cama.addEventListener("click", (evento) => {
        if (evento.detail === 0) {
            iniciarRitual(cama);
        }
    });
});

