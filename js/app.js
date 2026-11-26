
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

// CONTROL DE LOS CUATRO RITUALES

const ritualesCompletados = new Set();

const botonDormir = document.getElementById("boton-dormir");

function registrarRitualCompletado(nombre) {

    ritualesCompletados.add(nombre);

    mensajeRitual.textContent =
        `Has completado ${ritualesCompletados.size} de 4 rituales.`;

    if (ritualesCompletados.size === 4) {
        botonDormir.hidden = false;

        mensajeRitual.textContent =
            "Has completado los cuatro rituales. Ya puedes descansar.";
    }
}

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
    prepararMicrofono();

    return;
}
    
    if (ritual === "colores") {
        pantallaHabitacion.classList.remove("activa");
        document.getElementById("ritual-colores").classList.add("activa");

        reiniciarColores();
        return;
    }

    if (ritual === "ruido") {
        pantallaHabitacion.classList.remove("activa");
        document.getElementById("ritual-ruido").classList.add("activa");

        reiniciarRuido();
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

        registrarRitualCompletado("ovejas");
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
   MICRÓFONO AUTOMÁTICO
================================= */

let respiracionesCompletadas = 0;
let faseRespiracion = "lista";

let posicionInicialY = 0;
let intervaloCuenta = null;
let progresoInhalacion = 0;

let flujoMicrofono = null;
let contextoAudio = null;
let analizadorMicrofono = null;
let animacionMicrofono = null;

let microfonoListo = false;
let soplidoDetectado = false;
let momentoSoplido = null;

const zonaRespiracion = document.getElementById("zona-respiracion");
const esferaRespiracion = document.getElementById("esfera-respiracion");
const textoRespiracion = document.getElementById("texto-respiracion");

const numeroRespiraciones = document.getElementById("numero-respiraciones");
const indicacionGesto = document.getElementById("indicacion-gesto");
const mensajeRespiracion = document.getElementById("mensaje-respiracion");
const cuentaRegresiva = document.getElementById("cuenta-regresiva");

const finalRespiracion = document.getElementById("final-respiracion");


// PREPARAR EL MICRÓFONO AL ENTRAR

async function prepararMicrofono() {
    microfonoListo = false;

    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {

        mensajeRespiracion.textContent =
            "Necesitamos acceso al micrófono. Abre la experiencia desde una conexión segura HTTPS.";

        return;
    }

    try {
        mensajeRespiracion.textContent =
            "Preparando el micrófono...";

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

        analizadorMicrofono = contextoAudio.createAnalyser();

        analizadorMicrofono.fftSize = 1024;

        fuente.connect(analizadorMicrofono);

        microfonoListo = true;

        mensajeRespiracion.textContent =
            "El micrófono está listo. Puedes comenzar.";

        indicacionGesto.textContent =
            "Desliza tu dedo hacia abajo para inhalar.";

    } catch (error) {
        detenerMicrofono();

        mensajeRespiracion.textContent =
            "No pudimos acceder al micrófono. Revisa los permisos del navegador y vuelve a entrar al ritual.";
    }
}


// REINICIAR EL RITUAL

function reiniciarRespiracion() {
    detenerMicrofono();

    respiracionesCompletadas = 0;
    faseRespiracion = "lista";
    progresoInhalacion = 0;
    soplidoDetectado = false;

    numeroRespiraciones.textContent = "0";

    esferaRespiracion.style.transform = "scale(0.75)";
    textoRespiracion.textContent = "INHALA";

    indicacionGesto.textContent =
        "Desliza tu dedo hacia abajo para inhalar";

    mensajeRespiracion.textContent =
        "Preparando el micrófono...";

    cuentaRegresiva.textContent = "";

    finalRespiracion.classList.remove("visible");
}


// COMENZAR A INHALAR

function comenzarInhalacion() {
    if (!microfonoListo || faseRespiracion !== "lista") return;

    faseRespiracion = "inhalando";

    indicacionGesto.textContent =
        "Desliza lentamente hacia abajo";

    mensajeRespiracion.textContent =
        "Deja que la esfera crezca con tu movimiento.";

    textoRespiracion.textContent = "INHALA";

    progresoInhalacion = 0;
    esferaRespiracion.style.transform = "scale(0.75)";
}


// LLEGAR AL FINAL DE LA INHALACIÓN

function comenzarRetencion() {
    if (faseRespiracion !== "inhalando") return;

    faseRespiracion = "manteniendo";

    textoRespiracion.textContent = "MANTÉN";

    indicacionGesto.textContent =
        "Mantén tu dedo abajo";

    mensajeRespiracion.textContent =
        "Quédate aquí durante cuatro segundos.";

    let segundos = 4;

    cuentaRegresiva.textContent = segundos;

    intervaloCuenta = setInterval(() => {
        segundos--;

        if (segundos > 0) {
            cuentaRegresiva.textContent = segundos;

        } else {
            clearInterval(intervaloCuenta);

            cuentaRegresiva.textContent = "";

            faseRespiracion = "exhalando";

            textoRespiracion.textContent = "EXHALA";

            indicacionGesto.textContent =
                "Sin levantar el dedo, sopla hacia el micrófono";

            mensajeRespiracion.textContent =
                "Estamos escuchando tu respiración...";

            iniciarDeteccionSoplido();
        }

    }, 1000);
}


// ESCUCHAR EL SOPLIDO

function iniciarDeteccionSoplido() {
    if (!analizadorMicrofono || !microfonoListo) return;

    const datos = new Float32Array(
        analizadorMicrofono.fftSize
    );

    momentoSoplido = null;

    function escuchar() {
        if (faseRespiracion !== "exhalando") return;

        analizadorMicrofono.getFloatTimeDomainData(datos);

        let suma = 0;

        for (let i = 0; i < datos.length; i++) {
            suma += datos[i] * datos[i];
        }

        const volumen = Math.sqrt(suma / datos.length);

        // Detectar un soplido sostenido
        if (volumen > 0.07) {

            if (momentoSoplido === null) {
                momentoSoplido = Date.now();
            }

            if (Date.now() - momentoSoplido >= 450) {

                soplidoDetectado = true;

                textoRespiracion.textContent = "LISTO";

                indicacionGesto.textContent =
                    "Ahora puedes soltar tu dedo";

                mensajeRespiracion.textContent =
                    "Muy bien. Suelta para continuar.";

                cancelAnimationFrame(animacionMicrofono);

                return;
            }

        } else {
            momentoSoplido = null;
        }

        animacionMicrofono =
            requestAnimationFrame(escuchar);
    }

    escuchar();
}


// MOVIMIENTO DEL DEDO

zonaRespiracion.addEventListener("pointerdown", (evento) => {
    evento.preventDefault();

    if (faseRespiracion !== "lista") return;

    if (!microfonoListo) {
        mensajeRespiracion.textContent =
            "Primero necesitamos activar el micrófono.";

        return;
    }

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

    // La esfera crece mientras arrastras el dedo
    const escala = 0.75 + (progresoInhalacion * 0.60);

    esferaRespiracion.style.transform =
        `scale(${escala})`;

    if (progresoInhalacion >= 0.95) {
        comenzarRetencion();
    }
});


// SOLTAR EL DEDO

zonaRespiracion.addEventListener("pointerup", (evento) => {
    evento.preventDefault();

    if (faseRespiracion === "exhalando" && soplidoDetectado) {
        completarRespiracion();
        return;
    }

    if (
        faseRespiracion === "inhalando" ||
        faseRespiracion === "manteniendo" ||
        faseRespiracion === "exhalando"
    ) {
        cancelarRespiracion();
    }
});

zonaRespiracion.addEventListener("pointercancel", () => {
    if (
        faseRespiracion === "inhalando" ||
        faseRespiracion === "manteniendo" ||
        faseRespiracion === "exhalando"
    ) {
        cancelarRespiracion();
    }
});


// CANCELAR SI SUELTA ANTES DE SOPLAR

function cancelarRespiracion() {
    clearInterval(intervaloCuenta);

    if (animacionMicrofono !== null) {
        cancelAnimationFrame(animacionMicrofono);
        animacionMicrofono = null;
    }

    faseRespiracion = "lista";
    progresoInhalacion = 0;
    soplidoDetectado = false;

    esferaRespiracion.style.transform = "scale(0.75)";

    textoRespiracion.textContent = "INHALA";

    cuentaRegresiva.textContent = "";

    indicacionGesto.textContent =
        "Desliza hacia abajo para intentarlo otra vez";

    mensajeRespiracion.textContent =
        "Primero inhala, mantén y después sopla antes de soltar.";
}


// COMPLETAR UNA RESPIRACIÓN

function completarRespiracion() {
    if (
        faseRespiracion !== "exhalando" ||
        !soplidoDetectado
    ) return;

    if (animacionMicrofono !== null) {
        cancelAnimationFrame(animacionMicrofono);
        animacionMicrofono = null;
    }

    respiracionesCompletadas++;

    numeroRespiraciones.textContent =
        respiracionesCompletadas;

    soplidoDetectado = false;

    if (respiracionesCompletadas >= 4) {

        registrarRitualCompletado("respiracion");
        faseRespiracion = "terminada";

        textoRespiracion.textContent = "DESCANSA";

        indicacionGesto.textContent =
            "Has terminado.";

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


// DETENER EL MICRÓFONO

function detenerMicrofono() {
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

    analizadorMicrofono = null;
    microfonoListo = false;
}


// SALIR DEL RITUAL

function salirDeRespiracion() {
    clearInterval(intervaloCuenta);

    detenerMicrofono();

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


/* =================================
   INTERACCIÓN: REPETICIÓN DE COLORES
================================= */

let colorSeleccionado = "#E8A1A8";
let flujoCamaraColores = null;
let animacionColores = null;
let progresoColor = 0;
let camaraActiva = false;
let camaraCubierta = false;

const pantallaColores = document.getElementById("ritual-colores");
const circuloColor = document.getElementById("circulo-color");
const videoColores = document.getElementById("camara-colores");
const canvasColores = document.getElementById("canvas-colores");
const contextoColores = canvasColores.getContext("2d");

const textoColores = document.getElementById("texto-colores");
const mensajeColores = document.getElementById("mensaje-colores");
const botonCamaraColores = document.getElementById("activar-camara-colores");
const finalColores = document.getElementById("final-colores");

const opcionesColor = document.querySelectorAll(".color-opcion");


// ELEGIR COLOR

opcionesColor.forEach((opcion) => {
    opcion.addEventListener("click", () => {
        colorSeleccionado = opcion.dataset.color;

        circuloColor.style.background = colorSeleccionado;

        opcionesColor.forEach((elemento) => {
            elemento.classList.remove("seleccionado");
        });

        opcion.classList.add("seleccionado");

        textoColores.textContent = "Ahora cubre la cámara con tu dedo.";
        mensajeColores.textContent =
            "El círculo crecerá mientras cubres la cámara.";
    });
});


// REINICIAR

function reiniciarColores() {
    detenerCamaraColores();

    progresoColor = 0;
    camaraActiva = false;
    camaraCubierta = false; 

    pantallaColores.classList.remove("completo");

    circuloColor.style.background = colorSeleccionado;
    circuloColor.style.transform = "scale(0.15)";

    textoColores.textContent = "Escoge el color que quieras.";
    mensajeColores.textContent =
        "Cuando estés lista, cubre la cámara con tu dedo.";

    botonCamaraColores.hidden = false;
    botonCamaraColores.disabled = false;
    botonCamaraColores.textContent = "Activar cámara";

    finalColores.classList.remove("visible");
}


// ACTIVAR CÁMARA

async function activarCamaraColores() {
    try {
        mensajeColores.textContent =
            "Solicitando permiso para usar la cámara...";

        flujoCamaraColores =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: "environment" }
                },
                audio: false
            });

        videoColores.srcObject = flujoCamaraColores;

        await videoColores.play();

        canvasColores.width = 32;
        canvasColores.height = 32;

        camaraActiva = true;

        botonCamaraColores.hidden = true;

        textoColores.textContent =
            "Cubre la cámara con tu dedo.";

        mensajeColores.textContent =
            "El color comenzará a expandirse.";

        detectarCoberturaCamara();

    } catch (error) {
        mensajeColores.textContent =
            "No pudimos activar la cámara. Revisa los permisos y vuelve a intentarlo.";

        botonCamaraColores.textContent = "Intentar de nuevo";
    }
}



// DETECTAR CADA VEZ QUE SE TAPA Y DESTAPA LA CÁMARA

function detectarCoberturaCamara() {
    if (!camaraActiva) return;

    if (videoColores.readyState >= 2) {

        contextoColores.drawImage(
            videoColores,
            0,
            0,
            canvasColores.width,
            canvasColores.height
        );

        const pixeles = contextoColores.getImageData(
            0,
            0,
            canvasColores.width,
            canvasColores.height
        ).data;

        let luminosidad = 0;
        let cantidadPixeles = 0;

        for (let i = 0; i < pixeles.length; i += 4) {
            luminosidad += (
                pixeles[i] * 0.299 +
                pixeles[i + 1] * 0.587 +
                pixeles[i + 2] * 0.114
            );

            cantidadPixeles++;
        }

        const promedio = luminosidad / cantidadPixeles;

        // DETECTAR CUANDO SE CUBRE LA CÁMARA
        if (promedio < 35 && !camaraCubierta) {

            camaraCubierta = true;

            // Cada cobertura agrega un 20 %
            progresoColor = Math.min(
                1,
                progresoColor + 0.20
            );

            actualizarCirculoColor();

            mensajeColores.textContent =
                `El color está creciendo: ${Math.round(progresoColor * 100)} %`;

            // Completar cuando llegue al 100 %
            if (progresoColor >= 1) {
                completarColores();
                return;
            }
        }

        // DETECTAR CUANDO SE DESTAPA LA CÁMARA
        if (promedio > 55 && camaraCubierta) {

            camaraCubierta = false;

            textoColores.textContent =
                "Vuelve a cubrir la cámara.";

            mensajeColores.textContent =
                `Llevas ${Math.round(progresoColor * 100)} %. Sigue repitiendo.`;
        }
    }

    animacionColores =
        requestAnimationFrame(detectarCoberturaCamara);
}


// ACTUALIZAR EL TAMAÑO DEL CÍRCULO

function actualizarCirculoColor() {

    const escala = 0.15 + progresoColor * 8;

    circuloColor.style.transform =
        `scale(${escala})`;
}

// COMPLETAR RITUAL

function completarColores() {
    if (!camaraActiva) return;

    registrarRitualCompletado("colores");

    detenerCamaraColores();

    pantallaColores.classList.add("completo");

    mensajeColores.textContent =
        "El color ha llenado todo el espacio.";

    finalColores.classList.add("visible");

    botonCamaraColores.hidden = true;
}


// DETENER CÁMARA

function detenerCamaraColores() {
    camaraActiva = false;

    if (animacionColores !== null) {
        cancelAnimationFrame(animacionColores);
        animacionColores = null;
    }

    if (flujoCamaraColores) {
        flujoCamaraColores.getTracks().forEach((pista) => {
            pista.stop();
        });

        flujoCamaraColores = null;
    }

    videoColores.srcObject = null;
}


// BOTONES Y SALIDA

botonCamaraColores.addEventListener(
    "click",
    activarCamaraColores
);

function salirDeColores() {
    detenerCamaraColores();

    pantallaColores.classList.remove("activa", "completo");
    pantallaHabitacion.classList.add("activa");

    document.querySelector('[data-ritual="colores"]')
        .classList.remove("deslizada");
}

document.getElementById("volver-colores")
    .addEventListener("click", salirDeColores);

document.getElementById("continuar-colores")
    .addEventListener("click", salirDeColores);


/* =================================
   INTERACCIÓN: RUIDO BLANCO
================================= */

let contextoRuido = null;
let fuenteRuido = null;
let gananciaRuido = null;
let volumenActual = 0.35;
let orientacionActiva = false;

const botonActivarRuido = document.getElementById("activar-ruido");
const botonTerminarRuido = document.getElementById("terminar-ruido");

const controlRuido = document.getElementById("control-ruido");
const mensajeRuido = document.getElementById("mensaje-ruido");

const volumenRuido = document.getElementById("volumen-ruido");
const textoNivelRuido = document.getElementById("texto-nivel-ruido");

const indicadorNivelRuido = document.getElementById("nivel-ruido");
const indicadorInclinacion = document.getElementById("indicador-inclinacion");

const finalRuido = document.getElementById("final-ruido");


// REINICIAR EL RITUAL

function reiniciarRuido() {
    detenerSonidoRuido();

    volumenActual = 0.35;

    volumenRuido.value = 35;
    textoNivelRuido.textContent = "Intensidad: 35%";

    indicadorNivelRuido.style.width = "35%";
    indicadorInclinacion.style.left = "50%";

    mensajeRuido.textContent =
        "Enciende la radio para comenzar.";

    botonActivarRuido.hidden = false;
    botonActivarRuido.disabled = false;
    botonActivarRuido.textContent = "Encender radio";

    controlRuido.hidden = true;
    finalRuido.classList.remove("visible");

    document.getElementById("radio-ruido")
        .classList.remove("encendida");
}


// CREAR RUIDO BLANCO

function crearRuidoBlanco() {
    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    contextoRuido = new AudioContextClass();

    const duracion = 2;
    const frecuencia = contextoRuido.sampleRate;

    const buffer = contextoRuido.createBuffer(
        1,
        frecuencia * duracion,
        frecuencia
    );

    const datos = buffer.getChannelData(0);

    // Crear una señal de ruido blanco
    for (let i = 0; i < datos.length; i++) {
        datos[i] = Math.random() * 2 - 1;
    }

    fuenteRuido = contextoRuido.createBufferSource();
    fuenteRuido.buffer = buffer;
    fuenteRuido.loop = true;

    gananciaRuido = contextoRuido.createGain();
    gananciaRuido.gain.value = volumenActual;

    fuenteRuido.connect(gananciaRuido);
    gananciaRuido.connect(contextoRuido.destination);

    fuenteRuido.start();
}


// ENCENDER LA RADIO

async function encenderRadio() {
    try {
        botonActivarRuido.disabled = true;

        mensajeRuido.textContent =
            "Sintonizando la radio...";

        // Solicitar el permiso del sensor inmediatamente
        // después de tocar el botón.
        const permisoOrientacion = activarOrientacion();

        // Crear y activar el sonido.
        crearRuidoBlanco();

        await contextoRuido.resume();

        document.getElementById("radio-ruido")
            .classList.add("encendida");

        botonActivarRuido.hidden = true;
        controlRuido.hidden = false;

        // Esperar el resultado del permiso.
        await permisoOrientacion;

        if (orientacionActiva) {
            mensajeRuido.textContent =
                "Inclina tu celular hacia los lados para encontrar tu sonido.";
        }

    } catch (error) {
        console.error("Error al encender la radio:", error);

        mensajeRuido.textContent =
            "No pudimos iniciar la radio. Comprueba los permisos de audio.";

        botonActivarRuido.disabled = false;
    }
}


// ACTIVAR SENSOR DE INCLINACIÓN

async function activarOrientacion() {

    if (!("DeviceOrientationEvent" in window)) {
        mensajeRuido.textContent =
            "Tu dispositivo no permite detectar la inclinación. Usa la barra.";
        return;
    }

    if (
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
        try {
            const permiso =
                await DeviceOrientationEvent.requestPermission();

            if (permiso !== "granted") {
                mensajeRuido.textContent =
                    "No se concedió el permiso. Usa la barra de intensidad.";
                return;
            }

        } catch (error) {
            console.error(error);
            mensajeRuido.textContent =
                "No pudimos acceder al sensor. Usa la barra.";
            return;
        }
    }

    window.removeEventListener(
        "deviceorientation",
        cambiarIntensidadPorInclinacion
    );

    window.removeEventListener(
        "deviceorientationabsolute",
        cambiarIntensidadPorInclinacion
    );

    window.addEventListener(
        "deviceorientation",
        cambiarIntensidadPorInclinacion
    );

    window.addEventListener(
        "deviceorientationabsolute",
        cambiarIntensidadPorInclinacion
    );

    orientacionActiva = true;

    mensajeRuido.textContent =
        "Inclina tu celular hacia los lados para encontrar tu sonido.";
}

// CAMBIAR EL VOLUMEN

function cambiarVolumen(porcentaje) {
    volumenActual = Math.max(
        0,
        Math.min(1, porcentaje / 100)
    );

    if (gananciaRuido && contextoRuido) {
        gananciaRuido.gain.setTargetAtTime(
            volumenActual,
            contextoRuido.currentTime,
            0.08
        );
    }

    volumenRuido.value = porcentaje;

    textoNivelRuido.textContent =
        `Intensidad: ${Math.round(porcentaje)}%`;

    indicadorNivelRuido.style.width =
        `${porcentaje}%`;
}


function cambiarIntensidadPorInclinacion(evento) {

    if (!gananciaRuido) return;

    if (evento.gamma === null || evento.gamma === undefined) {
        return;
    }

    const inclinacion = Math.max(
        -30,
        Math.min(30, evento.gamma)
    );

    const porcentaje = ((inclinacion + 30) / 60) * 100;

    cambiarVolumen(porcentaje);

    indicadorInclinacion.style.left =
        `${porcentaje}%`;

    mensajeRuido.textContent =
        "Encuentra la intensidad que te resulte más agradable.";
}



// ENCONTRAR LA INTENSIDAD IDEAL

function terminarRitualRuido() {
    if (!contextoRuido) return;

    registrarRitualCompletado("ruido");

    window.removeEventListener(
        "deviceorientation",
        cambiarIntensidadPorInclinacion
    );

    orientacionActiva = false;

    controlRuido.hidden = true;
    finalRuido.classList.add("visible");

    mensajeRuido.textContent =
        "Has encontrado tu propia frecuencia.";
}


// APAGAR Y LIBERAR EL AUDIO

function detenerSonidoRuido() {
    window.removeEventListener(
        "deviceorientation",
        cambiarIntensidadPorInclinacion
    );

    orientacionActiva = false;

    if (fuenteRuido) {
        try {
            fuenteRuido.stop();
        } catch (error) {
            // La fuente ya estaba detenida.
        }

        fuenteRuido = null;
    }

    if (contextoRuido) {
        contextoRuido.close();
        contextoRuido = null;
    }

    gananciaRuido = null;
}


// BOTONES

botonActivarRuido.addEventListener("click", encenderRadio);

botonTerminarRuido.addEventListener("click", terminarRitualRuido);


// SALIR DEL RITUAL

function salirDeRuido() {
    detenerSonidoRuido();

    document.getElementById("ritual-ruido")
        .classList.remove("activa");

    pantallaHabitacion.classList.add("activa");

    document.querySelector('[data-ritual="ruido"]')
        .classList.remove("deslizada");
}

document.getElementById("volver-ruido")
    .addEventListener("click", salirDeRuido);

document.getElementById("continuar-ruido")
    .addEventListener("click", salirDeRuido);

/* =================================
   INTERACCIÓN: EL SUEÑO Y LA ALARMA
================================= */

const escenaSueno = document.getElementById("escena-sueno");
const escenaAlarma = document.getElementById("escena-alarma");

const finalEntrevista = document.getElementById("final-entrevista");
const finalDescanso = document.getElementById("final-descanso");

const botonDespertar = document.getElementById("despertar-manualmente");
const botonApagarAlarma = document.getElementById("apagar-alarma");
const botonPosponerAlarma = document.getElementById("posponer-alarma");

let temporizadorAlarma = null;


// CAMBIAR DE ESCENA

function cambiarPantalla(actual, siguiente) {
    actual.classList.remove("activa");
    siguiente.classList.add("activa");
}


// COMENZAR A DORMIR

function comenzarSueno() {

    cambiarPantalla(pantallaHabitacion, escenaSueno);

    // La alarma aparece después de unos segundos.
    temporizadorAlarma = setTimeout(() => {
        mostrarAlarma();
    }, 10000);
}


// MOSTRAR LA ALARMA

function mostrarAlarma() {

    clearTimeout(temporizadorAlarma);

    cambiarPantalla(escenaSueno, escenaAlarma);
}


// APAGAR ALARMA: IR A LA ENTREVISTA

function levantarse() {

    clearTimeout(temporizadorAlarma);

    cambiarPantalla(escenaAlarma, finalEntrevista);
}


// POSPONER ALARMA: SEGUIR DESCANSANDO

function seguirDescansando() {

    clearTimeout(temporizadorAlarma);

    cambiarPantalla(escenaAlarma, finalDescanso);
}


// BOTÓN PARA DORMIR

botonDormir.addEventListener("click", comenzarSueno);


// BOTÓN PARA PASAR A LA ALARMA ANTES

botonDespertar.addEventListener("click", mostrarAlarma);


// BOTONES DE LA ALARMA

botonApagarAlarma.addEventListener("click", levantarse);

botonPosponerAlarma.addEventListener("click", seguirDescansando);


// TAMBIÉN SE PUEDE APAGAR DESLIZANDO HACIA ABAJO

let inicioDeslizamientoAlarma = 0;

escenaAlarma.addEventListener("pointerdown", (evento) => {
    inicioDeslizamientoAlarma = evento.clientY;
});

escenaAlarma.addEventListener("pointerup", (evento) => {

    const distancia =
        evento.clientY - inicioDeslizamientoAlarma;

    if (distancia > 70) {
        levantarse();
    }
});


// VOLVER A COMENZAR LA EXPERIENCIA

document.querySelectorAll(".reiniciar-experiencia")
    .forEach((boton) => {

        boton.addEventListener("click", () => {
            window.location.reload();
        });

    });