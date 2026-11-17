
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


/* =================================
   INTERACCIÓN: RESPIRACIÓN
================================= */

let respiracionesCompletadas = 0;
let faseRespiracion = "lista";

let posicionInicialY = 0;
let temporizadorRespiracion = null;
let intervaloCuenta = null;
let progresoInhalacion = 0;

let microfonoActivo = false;
let flujoMicrofono = null;
let contextoAudio = null;
let animacionMicrofono = null;
let momentoSoplido = null;

const zonaRespiracion = document.getElementById("zona-respiracion");
const esferaRespiracion = document.getElementById("esfera-respiracion");
const textoRespiracion = document.getElementById("texto-respiracion");

const numeroRespiraciones = document.getElementById("numero-respiraciones");
const indicacionGesto = document.getElementById("indicacion-gesto");
const mensajeRespiracion = document.getElementById("mensaje-respiracion");
const cuentaRegresiva = document.getElementById("cuenta-regresiva");

const botonInhalar = document.getElementById("boton-inhalar");
const botonMicrofono = document.getElementById("boton-microfono");
const botonExhalar = document.getElementById("boton-exhalar");

const finalRespiracion = document.getElementById("final-respiracion");


// REINICIAR EL RITUAL

function reiniciarRespiracion() {
    detenerMicrofono();

    clearTimeout(temporizadorRespiracion);
    clearInterval(intervaloCuenta);

    respiracionesCompletadas = 0;
    faseRespiracion = "lista";
    progresoInhalacion = 0;

    numeroRespiraciones.textContent = "0";

    esferaRespiracion.style.transform = "scale(0.75)";
    textoRespiracion.textContent = "INHALA";

    indicacionGesto.textContent =
        "Desliza tu dedo hacia abajo para inhalar";

    mensajeRespiracion.textContent =
        "Prepárate. No hay prisa.";

    cuentaRegresiva.textContent = "";

    botonInhalar.hidden = true;
    botonMicrofono.hidden = true;
    botonExhalar.hidden = true;

    finalRespiracion.classList.remove("visible");
}


// COMENZAR A INHALAR

function comenzarInhalacion() {
    if (faseRespiracion !== "lista") return;

    faseRespiracion = "inhalando";

    indicacionGesto.textContent =
        "Desliza lentamente hacia abajo";

    mensajeRespiracion.textContent =
        "Deja que la esfera crezca con tu movimiento.";

    textoRespiracion.textContent = "INHALA";

    progresoInhalacion = 0;
    esferaRespiracion.style.transform = "scale(0.75)";
}


// DETECTAR CUANDO EL DEDO LLEGA ABAJO

function comenzarRetencion() {
    if (faseRespiracion !== "inhalando") return;

    faseRespiracion = "manteniendo";

    textoRespiracion.textContent = "MANTÉN";

    indicacionGesto.textContent =
        "Mantén tu dedo aquí durante cuatro segundos";

    mensajeRespiracion.textContent =
        "Quédate en este momento.";

    let segundos = 4;

    cuentaRegresiva.textContent = segundos;

    intervaloCuenta = setInterval(() => {
        segundos--;

        if (segundos > 0) {
            cuentaRegresiva.textContent = segundos;
        } else {
            clearInterval(intervaloCuenta);
            cuentaRegresiva.textContent = "";

            faseRespiracion = "lista-para-soltar";

            textoRespiracion.textContent = "SUELTA";

            indicacionGesto.textContent =
                "Ya puedes levantar tu dedo";

            mensajeRespiracion.textContent =
                "Ahora deja salir el aire suavemente.";
        }

    }, 1000);
}


// CUANDO LA PERSONA SUELTA EL DEDO

function prepararExhalacion() {
    if (faseRespiracion !== "lista-para-soltar") return;

    faseRespiracion = "exhalando";

    textoRespiracion.textContent = "EXHALA";

    indicacionGesto.textContent =
        "Sopla suavemente hacia el micrófono";

    mensajeRespiracion.textContent =
        "Deja salir el aire poco a poco.";

    esferaRespiracion.style.transform = "scale(0.75)";

    botonMicrofono.hidden = false;
    botonExhalar.hidden = false;
}


// MOVIMIENTO DEL DEDO: INHALACIÓN PROGRESIVA

zonaRespiracion.addEventListener("pointerdown", (evento) => {
    evento.preventDefault();

    if (faseRespiracion !== "lista") return;

    zonaRespiracion.setPointerCapture(evento.pointerId);

    posicionInicialY = evento.clientY;

    comenzarInhalacion();
});

zonaRespiracion.addEventListener("pointermove", (evento) => {
    evento.preventDefault();

    if (faseRespiracion !== "inhalando") return;

    const limites = zonaRespiracion.getBoundingClientRect();

    const distanciaDisponible =
        limites.bottom - posicionInicialY - 15;

    if (distanciaDisponible <= 0) return;

    const distanciaRecorrida =
        evento.clientY - posicionInicialY;

    progresoInhalacion = Math.max(
        0,
        Math.min(1, distanciaRecorrida / distanciaDisponible)
    );

    // La esfera crece mientras el dedo baja
    const escala = 0.75 + (progresoInhalacion * 0.60);

    esferaRespiracion.style.transform =
        `scale(${escala})`;

    if (progresoInhalacion >= 0.95) {
        comenzarRetencion();
    }
});

zonaRespiracion.addEventListener("pointerup", (evento) => {
    evento.preventDefault();

    if (faseRespiracion === "lista-para-soltar") {
        prepararExhalacion();

    } else if (
        faseRespiracion === "inhalando" ||
        faseRespiracion === "manteniendo"
    ) {
        // Si suelta antes de completar los cuatro segundos,
        // vuelve a intentarlo.

        clearInterval(intervaloCuenta);

        faseRespiracion = "lista";
        progresoInhalacion = 0;

        esferaRespiracion.style.transform = "scale(0.75)";
        textoRespiracion.textContent = "INHALA";

        cuentaRegresiva.textContent = "";

        indicacionGesto.textContent =
            "Inténtalo de nuevo y mantén tu dedo abajo";

        mensajeRespiracion.textContent =
            "No hay prisa.";
    }
});

zonaRespiracion.addEventListener("pointercancel", () => {
    if (
        faseRespiracion === "inhalando" ||
        faseRespiracion === "manteniendo"
    ) {
        clearInterval(intervaloCuenta);

        faseRespiracion = "lista";
        progresoInhalacion = 0;

        esferaRespiracion.style.transform = "scale(0.75)";
        cuentaRegresiva.textContent = "";
        textoRespiracion.textContent = "INHALA";
    }
});


// ACTIVAR EL MICRÓFONO

async function activarMicrofono() {
    if (faseRespiracion !== "exhalando" || microfonoActivo) return;

    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {

        mensajeRespiracion.textContent =
            "Tu navegador no permite utilizar el micrófono aquí. Puedes usar el botón alternativo.";

        return;
    }

    try {
        botonMicrofono.disabled = true;

        mensajeRespiracion.textContent =
            "Solicitando permiso para utilizar el micrófono...";

        flujoMicrofono = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) {
            throw new Error("Audio no disponible");
        }

        contextoAudio = new AudioContextClass();

        await contextoAudio.resume();

        const fuente =
            contextoAudio.createMediaStreamSource(flujoMicrofono);

        const analizador = contextoAudio.createAnalyser();

        analizador.fftSize = 1024;

        fuente.connect(analizador);

        const datos = new Float32Array(analizador.fftSize);

        microfonoActivo = true;
        momentoSoplido = null;

        mensajeRespiracion.textContent =
            "Ahora sopla suavemente hacia el micrófono.";

        botonMicrofono.textContent = "Sopla suavemente...";

        function detectarSoplido() {
            if (!microfonoActivo) return;

            analizador.getFloatTimeDomainData(datos);

            let suma = 0;

            for (let i = 0; i < datos.length; i++) {
                suma += datos[i] * datos[i];
            }

            const volumen = Math.sqrt(suma / datos.length);

            // Detecta un sonido sostenido de cierta intensidad.
            if (volumen > 0.10) {
                if (momentoSoplido === null) {
                    momentoSoplido = Date.now();
                }

                if (Date.now() - momentoSoplido > 300) {
                    completarExhalacion();
                    return;
                }

            } else {
                momentoSoplido = null;
            }

            animacionMicrofono =
                requestAnimationFrame(detectarSoplido);
        }

        detectarSoplido();

    } catch (error) {
        detenerMicrofono();

        botonMicrofono.disabled = false;

        mensajeRespiracion.textContent =
            "No pudimos acceder al micrófono. Puedes exhalar con el botón alternativo.";
    }
}


// DETENER EL MICRÓFONO

function detenerMicrofono() {
    microfonoActivo = false;

    if (animacionMicrofono !== null) {
        cancelAnimationFrame(animacionMicrofono);
        animacionMicrofono = null;
    }

    if (flujoMicrofono) {
        flujoMicrofono.getTracks().forEach((pista) => {
            pista.stop();
        });

        flujoMicrofono = null;
    }

    if (contextoAudio) {
        contextoAudio.close();
        contextoAudio = null;
    }

    botonMicrofono.disabled = false;
    botonMicrofono.textContent = "🎙 Soplar para exhalar";
}


// COMPLETAR UNA EXHALACIÓN

function completarExhalacion() {
    if (faseRespiracion !== "exhalando") return;

    detenerMicrofono();

    respiracionesCompletadas++;

    numeroRespiraciones.textContent = respiracionesCompletadas;

    botonMicrofono.hidden = true;
    botonExhalar.hidden = true;

    if (respiracionesCompletadas >= 4) {
        faseRespiracion = "terminada";

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

        esferaRespiracion.style.transform = "scale(0.75)";
    }
}


// BOTONES

botonInhalar.addEventListener("click", comenzarInhalacion);

botonMicrofono.addEventListener("click", activarMicrofono);

botonExhalar.addEventListener("click", completarExhalacion);


// VOLVER A LA HABITACIÓN

function salirDeRespiracion() {
    detenerMicrofono();

    clearInterval(intervaloCuenta);
    clearTimeout(temporizadorRespiracion);

    document.getElementById("ritual-respiracion")
        .classList.remove("activa");

    pantallaHabitacion.classList.add("activa");

    document.querySelector('[data-ritual="respiracion"]')
        .classList.remove("deslizada");
}

document.getElementById("volver-respiracion")
    .addEventListener("click", salirDeRespiracion);

document.getElementById("continuar-respiracion")
    .addEventListener("click", salirDeRespiracion);
