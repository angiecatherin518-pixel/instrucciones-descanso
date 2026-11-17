
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

    if (cama.classList.contains("deslizada")) return;

    cama.classList.add("deslizada");

    if (ritual === "ovejas") {
        pantallaHabitacion.classList.remove("activa");
        document.getElementById("ritual-ovejas").classList.add("activa");

        reiniciarOvejas();
        return;
    }

    mensajeRitual.textContent =
        "Este ritual estará disponible próximamente.";
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


/* =================================
   INTERACCIÓN: CONTAR OVEJAS
================================= */

let ovejasContadas = 0;

const oveja = document.getElementById("oveja");
const numeroOvejas = document.getElementById("numero-ovejas");
const botonSaltar = document.getElementById("saltar-oveja");
const instruccionOvejas = document.getElementById("instruccion-ovejas");
const finalOvejas = document.getElementById("final-ovejas");

function reiniciarOvejas() {
    ovejasContadas = 0;

    numeroOvejas.textContent = "0";
    instruccionOvejas.textContent =
        "Toca la pantalla para ayudar a la oveja a saltar.";

    botonSaltar.style.display = "inline-block";
    finalOvejas.classList.remove("visible");

    oveja.classList.remove("saltando");
    oveja.style.left = "8%";
}

function hacerSaltarOveja() {
    if (ovejasContadas >= 50) return;

    ovejasContadas++;

    numeroOvejas.textContent = ovejasContadas;

    // Reiniciar la animación para permitir el siguiente salto
    oveja.classList.remove("saltando");
    void oveja.offsetWidth;
    oveja.classList.add("saltando");

    if (ovejasContadas === 50) {
        instruccionOvejas.textContent =
            "Has ayudado a saltar a las 50 ovejas.";

        setTimeout(() => {
            botonSaltar.style.display = "none";
            finalOvejas.classList.add("visible");
        }, 750);
    }
}

botonSaltar.addEventListener("click", hacerSaltarOveja);

// También se puede tocar el paisaje para hacer saltar la oveja
document.querySelector(".paisaje-ovejas").addEventListener(
    "click",
    hacerSaltarOveja
);

// Regresar a la habitación
document.getElementById("volver-habitacion").addEventListener("click", () => {
    document.getElementById("ritual-ovejas").classList.remove("activa");
    pantallaHabitacion.classList.add("activa");
});

// Continuar después de contar las ovejas
document.getElementById("continuar-ovejas").addEventListener("click", () => {
    document.getElementById("ritual-ovejas").classList.remove("activa");
    pantallaHabitacion.classList.add("activa");
});
