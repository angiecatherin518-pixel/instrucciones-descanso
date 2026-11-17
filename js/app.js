
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

    if (ritual === "respiracion") {
        pantallaHabitacion.classList.remove("activa");
        document.getElementById("ritual-respiracion").classList.add("activa");

        reiniciarRespiracion();
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


/* =================================
   INTERACCIÓN: RESPIRACIÓN
================================= */

let respiracionesCompletadas = 0;
let faseRespiracion = "lista";
let temporizadorRespiracion = null;
let inicioGestoRespiracion = 0;

const esferaRespiracion = document.getElementById("esfera-respiracion");
const textoRespiracion = document.getElementById("texto-respiracion");
const numeroRespiraciones = document.getElementById("numero-respiraciones");

const indicacionGesto = document.getElementById("indicacion-gesto");
const mensajeRespiracion = document.getElementById("mensaje-respiracion");

const botonInhalar = document.getElementById("boton-inhalar");
const botonExhalar = document.getElementById("boton-exhalar");

const finalRespiracion = document.getElementById("final-respiracion");

function reiniciarRespiracion() {
    clearTimeout(temporizadorRespiracion);

    respiracionesCompletadas = 0;
    faseRespiracion = "lista";

    numeroRespiraciones.textContent = "0";

    esferaRespiracion.classList.remove("inhalando", "exhalando");
    textoRespiracion.textContent = "INHALA";

    indicacionGesto.textContent = "Desliza hacia abajo para inhalar";
    mensajeRespiracion.textContent = "Prepárate. No hay prisa.";

    botonInhalar.hidden = false;
    botonExhalar.hidden = true;

    finalRespiracion.classList.remove("visible");
}

function comenzarInhalacion() {
    if (faseRespiracion !== "lista") return;

    faseRespiracion = "inhalando";

    botonInhalar.hidden = true;

    textoRespiracion.textContent = "INHALA";
    indicacionGesto.textContent = "Llena tus pulmones suavemente";
    mensajeRespiracion.textContent = "Mantén este momento durante cuatro segundos.";

    esferaRespiracion.classList.remove("exhalando");
    esferaRespiracion.classList.add("inhalando");

    temporizadorRespiracion = setTimeout(() => {
        faseRespiracion = "exhalando";

        textoRespiracion.textContent = "EXHALA";
        indicacionGesto.textContent = "Suelta el aire lentamente";
        mensajeRespiracion.textContent = "Cuando estés lista, toca exhalar.";

        esferaRespiracion.classList.remove("inhalando");
        esferaRespiracion.classList.add("exhalando");

        botonExhalar.hidden = false;

    }, 4000);
}

function completarExhalacion() {
    if (faseRespiracion !== "exhalando") return;

    respiracionesCompletadas++;

    numeroRespiraciones.textContent = respiracionesCompletadas;

    esferaRespiracion.classList.remove("exhalando");

    if (respiracionesCompletadas >= 4) {
        faseRespiracion = "terminada";

        botonExhalar.hidden = true;

        textoRespiracion.textContent = "DESCANSA";
        indicacionGesto.textContent = "Has terminado.";
        mensajeRespiracion.textContent =
            "No tienes que controlar nada más.";

        setTimeout(() => {
            finalRespiracion.classList.add("visible");
        }, 1000);

    } else {
        faseRespiracion = "lista";

        textoRespiracion.textContent = "INHALA";
        indicacionGesto.textContent =
            "Desliza hacia abajo para la siguiente respiración";

        mensajeRespiracion.textContent =
            "Muy bien. Continúa a tu propio ritmo.";

        botonInhalar.hidden = false;
        botonExhalar.hidden = true;
    }
}

// Botón alternativo para inhalar
botonInhalar.addEventListener("click", comenzarInhalacion);

// Botón para exhalar
botonExhalar.addEventListener("click", completarExhalacion);

// Gesto de deslizar hacia abajo
const zonaRespiracion = document.getElementById("zona-respiracion");

zonaRespiracion.addEventListener("pointerdown", (evento) => {
    inicioGestoRespiracion = evento.clientY;
});

zonaRespiracion.addEventListener("pointerup", (evento) => {
    const distancia =
        evento.clientY - inicioGestoRespiracion;

    if (distancia > 35) {
        comenzarInhalacion();
    }
});

// Regresar a la habitación
document.getElementById("volver-respiracion").addEventListener("click", () => {
    clearTimeout(temporizadorRespiracion);

    document.getElementById("ritual-respiracion").classList.remove("activa");
    pantallaHabitacion.classList.add("activa");
});

// Terminar el ritual
document.getElementById("continuar-respiracion").addEventListener("click", () => {
    document.getElementById("ritual-respiracion").classList.remove("activa");
    pantallaHabitacion.classList.add("activa");
});
