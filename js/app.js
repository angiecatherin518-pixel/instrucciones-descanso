

// MENSAJES DE LA VOZ GUÍA

const mensajes = [
    "Mañana tienes una entrevista importante.",
    "Necesitas descansar para poder rendir.",
    "No puedes llegar cansada. Tienes muchas cosas por hacer.",
    "Debes dormir. Mañana tienes que estar preparada.",
    "Intenta relajarte. Es hora de descansar."
];

let mensajeActual = 0;
let escribiendo = false;

// ELEMENTOS DE LA PÁGINA

const mensaje = document.getElementById("mensaje");
const botonContinuar = document.getElementById("continuar");
const pantallaInicio = document.getElementById("inicio");
const pantallaHabitacion = document.getElementById("habitacion");

// AUDIOS DE LA ESCENA INICIAL

const audioRespiracion = document.getElementById("audio-respiracion");
const audioReloj = document.getElementById("audio-reloj");

let audiosInicioIniciados = false;

function iniciarAudiosInicio() {
    if (audiosInicioIniciados) return;

    const audios = [audioRespiracion, audioReloj];

    const reproducciones = audios.map((audio) => {
        if (!audio) return Promise.resolve(false);

        if (audio === audioRespiracion) {
           audio.volume = 0.5;
        }

        if (audio === audioReloj) {
           audio.volume = 0.30;
        }

        return audio.play()
            .then(() => true)
            .catch(() => false);
    });

    Promise.all(reproducciones).then((resultados) => {
        if (resultados.every(Boolean)) {
            audiosInicioIniciados = true;
        }
    });
}

function detenerAudiosInicio() {
    // La respiración agitada termina al salir de la escena inicial.
    if (audioRespiracion) {
        audioRespiracion.pause();
        audioRespiracion.currentTime = 0;
    }
}

// Intentar reproducir automáticamente al abrir la página.
iniciarAudiosInicio();

// Si el navegador bloquea la reproducción automática,
// iniciar los dos audios con el primer toque.
botonContinuar.addEventListener("click", iniciarAudiosInicio);

// DISMINUIR PROGRESIVAMENTE EL VOLUMEN DEL RELOJ

let temporizadorFadeReloj = null;

function bajarVolumenReloj(cantidadRituales) {
    if (!audioReloj) return;

    const volumenes = [0.24, 0.16, 0.08, 0.02];
    const volumenFinal = volumenes[cantidadRituales - 1];

    if (volumenFinal === undefined) return;

    clearInterval(temporizadorFadeReloj);

    const volumenInicial = audioReloj.volume;
    const duracion = 2000;
    const momentoInicio = performance.now();

    temporizadorFadeReloj = setInterval(() => {
        const progreso = Math.min(
            (performance.now() - momentoInicio) / duracion,
            1
        );

        audioReloj.volume =
            volumenInicial +
            (volumenFinal - volumenInicial) * progreso;

        if (progreso >= 1) {
            clearInterval(temporizadorFadeReloj);
            temporizadorFadeReloj = null;
        }
    }, 30);
}


/* =================================
   RELOJ DINÁMICO DE LA EXPERIENCIA
================================= */

const elementosHora = document.querySelectorAll(
    ".hora, .etiqueta-sueno"
);

const minutosIniciales = 2 * 60 + 47; // 02:47 AM
const minutosAlarma = 7 * 60;          // 07:00 AM

const inicioDelReloj = performance.now();

function actualizarReloj(forzarAlarma = false) {
    const segundosTranscurridos =
        (performance.now() - inicioDelReloj) / 1000;

    // El tiempo comienza lentamente y acelera progresivamente.
    const minutosAvanzados = Math.floor(
        segundosTranscurridos * 0.15 +
        (segundosTranscurridos * segundosTranscurridos) / 600
    );

    // El reloj no supera las 06:59 antes de la alarma.
    const horaActual = forzarAlarma
        ? minutosAlarma
        : Math.min(
            minutosIniciales + minutosAvanzados,
            minutosAlarma - 1
        );

    const hora24 = Math.floor(horaActual / 60) % 24;
    const minutos = horaActual % 60;

    const hora12 = hora24 % 12 || 12;
    const periodo = hora24 >= 12 ? "PM" : "AM";

    const horaFormateada =
        `${String(hora12).padStart(2, "0")}:` +
        `${String(minutos).padStart(2, "0")} ${periodo}`;

    elementosHora.forEach((elemento) => {
        elemento.textContent = horaFormateada;
    });
}

// Actualizar cada segundo.
actualizarReloj();

const intervaloReloj = setInterval(() => {
    actualizarReloj();
}, 1000);


// ESCRIBIR EL SIGUIENTE FRAGMENTO SIN BORRAR EL ANTERIOR

function escribirSiguienteMensaje() {
    if (escribiendo) return;

    mensajeActual++;

    if (mensajeActual < mensajes.length) {
        escribiendo = true;
        botonContinuar.disabled = true;

        const nuevoTexto = " " + mensajes[mensajeActual];
        let posicion = 0;

        function escribirLetra() {
            if (posicion < nuevoTexto.length) {
                mensaje.textContent += nuevoTexto.charAt(posicion);
                posicion++;

                setTimeout(escribirLetra, 35);
            } else {
                escribiendo = false;
                botonContinuar.disabled = false;
            }
        }

        escribirLetra();

    } else {
    detenerAudiosInicio();

    pantallaInicio.classList.remove("activa");
    pantallaHabitacion.classList.add("activa");
}
}

botonContinuar.addEventListener("click", escribirSiguienteMensaje);

// CONTROL DE LOS CUATRO RITUALES

const ritualesCompletados = new Set();

const botonDormir = document.getElementById("boton-dormir");

function registrarRitualCompletado(nombre) {

    ritualesCompletados.add(nombre);

    bajarVolumenReloj(ritualesCompletados.size);

    mensajeRitual.textContent =
        `Has completado ${ritualesCompletados.size} de 4 rituales.`;

    if (ritualesCompletados.size === 4) {
        botonDormir.hidden = false;

        mensajeRitual.textContent =
            "Has completado los cuatro rituales. Ya puedes descansar.";
    }
}

// AVANZAR EN LA NARRACIÓN



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

    prepararMicrofono();

    reiniciarRespiracion();

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


// DURACIÓN DE LA ANIMACIÓN DE LA COBIJA
const duracionGifCama = 1500;

// ACTIVAR LA ANIMACIÓN
function activarAnimacionCama(cama) {

    // Evitar que la animación se active varias veces
    if (cama.dataset.animando === "true") return;

    const ilustracion = cama.querySelector(".ilustracion-cama");

    // Si la cama todavía no tiene un GIF, abrir el ritual normalmente
    if (!ilustracion || !ilustracion.dataset.gif) {
        iniciarRitual(cama);
        return;
    }

    cama.dataset.animando = "true";

    // Ocultar la indicación mientras se reproduce el GIF
    cama.classList.add("animando");

    // Activar el GIF
    ilustracion.src = ilustracion.dataset.gif;

    // Esperar a que termine la animación y abrir el ritual
    setTimeout(() => {
        cama.dataset.animando = "false";
        cama.classList.remove("animando");
        iniciarRitual(cama);
    }, duracionGifCama);
}


// DETECTAR EL DESLIZAMIENTO
camas.forEach((cama) => {

    cama.addEventListener("pointerdown", (evento) => {
        inicioDeslizamiento = evento.clientY;
        cama.setPointerCapture(evento.pointerId);
    });

    cama.addEventListener("pointerup", (evento) => {

        const finalDeslizamiento = evento.clientY;
        const distancia = finalDeslizamiento - inicioDeslizamiento;

        if (distancia > 35) {
            activarAnimacionCama(cama);
        }
    });

    // También permite seleccionar con teclado
    cama.addEventListener("click", (evento) => {
        if (evento.detail === 0) {
            activarAnimacionCama(cama);
        }
    });

});

function restaurarCama(ritual) {
    const cama = document.querySelector(`[data-ritual="${ritual}"]`);
    if (!cama) return;

    const ilustracion = cama.querySelector(".ilustracion-cama");

    if (ilustracion) {
        ilustracion.src = ilustracion.dataset.imagenDeshecha;
    }

    cama.dataset.animando = "false";
    cama.classList.remove("animando");
    cama.classList.remove("deslizada");
}


/* =================================
   INTERACCIÓN: CONTAR OVEJAS
================================= */

let ovejasContadas = 0;
let puedeContarOveja = false;

let temporizadorSiguienteSalto = null;
let temporizadorAbrirConteo = null;
let temporizadorCerrarConteo = null;

const TOTAL_OVEJAS = 10;

const oveja = document.getElementById("oveja");
const numeroOvejas = document.getElementById("numero-ovejas");
const botonSaltar = document.getElementById("saltar-oveja");
const instruccionOvejas = document.getElementById("instruccion-ovejas");
const finalOvejas = document.getElementById("final-ovejas");
const pensamientoOvejas = document.getElementById("pensamiento-ovejas");

const pensamientosOvejas = {
    3: "¡3 ovejas y aún no tengo sueño!",
    4: "Tengo que dar la talla mañana, mi reputación está en juego.",
    5: "¡La entrevista, la entrevista, la entrevista!",
    6: "Necesito ser productivo para encontrar mi lugar en el mundo.",
    7: "Aunque… tal vez… trabajar no lo es todo.",
    8: "Cuántas veces en la vida me he obligado a descansar para producir al día siguiente, jummm… casi todas las noches en realidad…",
    10: "¡Ohhh síiii, por fin 10 ovejas!"
};

function mostrarPensamiento(elemento, texto) {
    elemento.classList.remove("visible");
    elemento.textContent = texto;

    requestAnimationFrame(() => {
        elemento.classList.add("visible");
    });
}

// DETENER TODOS LOS TEMPORIZADORES

function detenerSecuenciaOvejas() {
    clearTimeout(temporizadorSiguienteSalto);
    clearTimeout(temporizadorAbrirConteo);
    clearTimeout(temporizadorCerrarConteo);

    puedeContarOveja = false;
}

// REINICIAR EL RITUAL

function reiniciarOvejas() {
    detenerSecuenciaOvejas();

    ovejasContadas = 0;

    numeroOvejas.textContent = "0";

    pensamientoOvejas.textContent = "";
    pensamientoOvejas.classList.remove("visible");

    instruccionOvejas.textContent =
        "Observa el salto. Cuenta la oveja cuando llegue al punto más alto.";

    botonSaltar.style.display = "inline-block";
    botonSaltar.disabled = true;
    botonSaltar.textContent = "Espera el salto";

    finalOvejas.classList.remove("visible");

    oveja.classList.remove("saltando");
    oveja.style.left = "8%";

    // Comenzar los saltos automáticos
    programarSaltoOveja();
}

// HACER QUE LA OVEJA SALTE AUTOMÁTICAMENTE

function programarSaltoOveja() {
    if (ovejasContadas >= TOTAL_OVEJAS) return;

    puedeContarOveja = false;

    botonSaltar.disabled = true;
    botonSaltar.textContent = "Espera el salto";

    instruccionOvejas.textContent =
        "Observa cómo salta la oveja...";

    // Reiniciar la animación
    oveja.classList.remove("saltando");
    void oveja.offsetWidth;
    oveja.classList.add("saltando");

    // Habilitar el conteo cerca del punto más alto
    temporizadorAbrirConteo = setTimeout(() => {
        if (ovejasContadas >= TOTAL_OVEJAS) return;

        puedeContarOveja = true;

        botonSaltar.disabled = false;
        botonSaltar.textContent = "Contar oveja";

        instruccionOvejas.textContent =
            "¡Ahora! Cuenta la oveja en lo más alto del salto.";

    }, 500);

    // Cerrar la oportunidad de contar
    temporizadorCerrarConteo = setTimeout(() => {
        if (!puedeContarOveja) return;

        puedeContarOveja = false;

        botonSaltar.disabled = true;
        botonSaltar.textContent = "Espera el salto";

        instruccionOvejas.textContent =
            "Espera con calma el siguiente salto.";

    }, 1400);

    // Programar el siguiente salto
    temporizadorSiguienteSalto = setTimeout(() => {
        programarSaltoOveja();
    }, 2600);
}

// CONTAR SOLAMENTE EN EL MOMENTO CORRECTO

function hacerSaltarOveja() {
    if (!puedeContarOveja) {
        instruccionOvejas.textContent =
            "Todavía no. Espera a que la oveja llegue al punto más alto.";
        return;
    }

    puedeContarOveja = false;

    botonSaltar.disabled = true;
    botonSaltar.textContent = "Muy bien";

    ovejasContadas++;

    numeroOvejas.textContent = ovejasContadas;

    if (pensamientosOvejas[ovejasContadas]) {
    mostrarPensamiento(
        pensamientoOvejas,
        pensamientosOvejas[ovejasContadas]
    );
    } 

    instruccionOvejas.textContent =
        `Muy bien. Has contado ${ovejasContadas} de ${TOTAL_OVEJAS} ovejas.`;

    // FINALIZAR AL CONTAR LAS 10 OVEJAS

    if (ovejasContadas === TOTAL_OVEJAS) {
        detenerSecuenciaOvejas();

        registrarRitualCompletado("ovejas");

        instruccionOvejas.textContent =
            "Has contado las 10 ovejas. Ahora puedes descansar.";

        setTimeout(() => {
            botonSaltar.style.display = "none";
            finalOvejas.classList.add("visible");
        }, 700);
    }
}

// EL BOTÓN ES LA ÚNICA FORMA DE CONTAR

botonSaltar.addEventListener("click", hacerSaltarOveja);

// REGRESAR A LA HABITACIÓN

document.getElementById("volver-habitacion").addEventListener("click", () => {
    detenerSecuenciaOvejas();

    document.getElementById("ritual-ovejas").classList.remove("activa");
    pantallaHabitacion.classList.add("activa");

    restaurarCama("ovejas");
});

document.getElementById("continuar-ovejas").addEventListener("click", () => {
    detenerSecuenciaOvejas();

    document.getElementById("ritual-ovejas").classList.remove("activa");
    pantallaHabitacion.classList.add("activa");

    restaurarCama("ovejas");
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
const pensamientoRespiracion = document.getElementById("pensamiento-respiracion");

const pensamientosRespiracion = {
    1: "¿Exhalar? ¿Soltar?",
    2: "Soltarlo todo. Soltar las expectativas. Soltar mi necesidad de reconocimiento.",
    3: "Soltar el control de lo incontrolable…",
    4: "¡Pero qué estoy diciendo! ¡Rápido, rápido, duérmeteeee!"
};


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
    audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
    }
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

    pensamientoRespiracion.textContent = "";
    pensamientoRespiracion.classList.remove("visible");

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

// ESCUCHAR Y DETECTAR EL SOPLIDO

function iniciarDeteccionSoplido() {

    if (!analizadorMicrofono || !microfonoListo) return;

    const datos = new Float32Array(
        analizadorMicrofono.fftSize
    );

    let nivelAmbiente = 0;
    let muestrasAmbiente = 0;
    let inicioCalibracion = Date.now();

    momentoSoplido = null;

    function escuchar() {

        if (faseRespiracion !== "exhalando") return;

        analizadorMicrofono.getFloatTimeDomainData(datos);

        let suma = 0;

        for (let i = 0; i < datos.length; i++) {
            suma += datos[i] * datos[i];
        }

        const volumen = Math.sqrt(suma / datos.length);

        // Primero escuchar el sonido normal del ambiente.
        if (Date.now() - inicioCalibracion < 400) {

            nivelAmbiente += volumen;
            muestrasAmbiente++;

            mensajeRespiracion.textContent =
                "Preparando la escucha...";

        } else {

            // Calcular el nivel necesario para detectar el soplido.
            const promedioAmbiente =
                nivelAmbiente / Math.max(1, muestrasAmbiente);

            const umbral = Math.max(
                0.012,
                promedioAmbiente * 2.2
            );

            // Detectar cuando el aire supera el sonido ambiente.
            if (volumen > umbral) {

                if (momentoSoplido === null) {
                    momentoSoplido = Date.now();
                }

                // Un soplido sostenido durante 180 ms es suficiente.
                if (Date.now() - momentoSoplido >= 180) {

                    soplidoDetectado = true;

                    textoRespiracion.textContent = "LISTO";

                    indicacionGesto.textContent =
                        "Ahora puedes soltar tu dedo.";

                    mensajeRespiracion.textContent =
                        "Muy bien. Has completado la exhalación.";

                    cancelAnimationFrame(animacionMicrofono);

                    return;
                }

            } else {
                momentoSoplido = null;
            }
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

        if (pensamientosRespiracion[respiracionesCompletadas]) {
    mostrarPensamiento(
        pensamientoRespiracion,
        pensamientosRespiracion[respiracionesCompletadas]
    );
    }

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

    restaurarCama("respiracion");

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
let camaraElegida = "environment";

const nombreColor = document.getElementById("nombre-color");
const pensamientoColores = document.getElementById("pensamiento-colores");

const pensamientosColores = [
    {
        progreso: 0.05,
        texto: "Pensar en un color me hace pensar en mi propósito en el mundo…"
    },
    {
        progreso: 0.35,
        texto: "¿Qué pasa si solo existo sin un propósito claro? ¿Por qué todo debe tener un propósito, un fin, una funcionalidad?"
    },
    {
        progreso: 0.70,
        texto: "¿Y si solo estamos para ser? Soy, me transformo y vuelvo a ser…"
    },
    {
        progreso: 1,
        texto: "Bah! Esto no da tanto sueño… creo."
    }
];

let pensamientoColorActual = -1;

const selectorCamaraColores =
    document.getElementById("selector-camara-colores");

const botonesCamara =
    document.querySelectorAll(".boton-camara");

const nombresColores = {
    "#E8A1A8": "ROSA",
    "#A6B8E8": "AZUL",
    "#A9C6A5": "VERDE",
    "#D9BD8C": "AMARILLO",
    "#B9A2D8": "LILA"
};

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

        const nombre = nombresColores[colorSeleccionado];

        circuloColor.style.background = colorSeleccionado;

        nombreColor.textContent = nombre;

        textoColores.textContent =
            `Concéntrate en el color ${nombre.toLowerCase()}.`;

        opcionesColor.forEach((elemento) => {
            elemento.classList.remove("seleccionado");
        });

        opcion.classList.add("seleccionado");

        mensajeColores.textContent =
            "Ahora cubre y descubre la cámara para hacerlo crecer.";

    });

});

// ELEGIR CÁMARA

botonesCamara.forEach((boton) => {

    boton.addEventListener("click", () => {

        camaraElegida = boton.dataset.camara;

        botonesCamara.forEach((elemento) => {
            elemento.classList.remove("seleccionado");
        });

        boton.classList.add("seleccionado");

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
    selectorCamaraColores.hidden = false;
    botonCamaraColores.disabled = false;
    botonCamaraColores.textContent = "Activar cámara";

    pensamientoColorActual = -1;
    pensamientoColores.textContent = "";
    pensamientoColores.classList.remove("visible");

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
                facingMode: { ideal: camaraElegida },
                width: { ideal: 640 },
                height: { ideal: 480 }
                },
                audio: false
            });

        videoColores.srcObject = flujoCamaraColores;

        await videoColores.play();

        canvasColores.width = 32;
        canvasColores.height = 32;

        camaraActiva = true;

        botonCamaraColores.hidden = true;

        selectorCamaraColores.hidden = true;

        textoColores.textContent =
            "Cubre la cámara con tu dedo.";

        mensajeColores.textContent =
            "El color comenzará a expandirse.";

        detectarCoberturaCamara();

    } catch (error) {

        selectorCamaraColores.hidden = false;
        botonCamaraColores.hidden = false;
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


// ACTUALIZAR EL TAMAÑO DEL CÍRCULO Y SU NOMBRE

function actualizarCirculoColor() {

    const escala = 0.15 + progresoColor * 8;

    pensamientosColores.forEach((pensamiento, indice) => {
    if (
        progresoColor >= pensamiento.progreso &&
        pensamientoColorActual < indice
    ) {
        pensamientoColorActual = indice;

        mostrarPensamiento(
            pensamientoColores,
            pensamiento.texto
        );
    }
});

    circuloColor.style.transform =
        `scale(${escala})`;

    // El nombre crece junto con el círculo.
    nombreColor.style.opacity = progresoColor > 0 ? "1" : "0";
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

    restaurarCama("respiracion");

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

const pensamientoRuido = document.getElementById("pensamiento-ruido");

const pensamientosRuido = [
    "Silenciar mis pensamientos autodestructivos no es suficiente.",
    "Este ruido despierta mi conciencia. ¿Quién soy en el mundo?",
    "¿Soy realmente yo quien decide o estoy alimentando sin querer las expectativas de un otro?"
];

let temporizadorPensamientosRuido = null;
let pensamientoRuidoActual = 0;

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

    iniciarPensamientosRuido();

}

function iniciarPensamientosRuido() {
    clearInterval(temporizadorPensamientosRuido);

    pensamientoRuidoActual = 0;

    pensamientoRuido.textContent = "";

    mostrarPensamiento(
        pensamientoRuido,
        pensamientosRuido[pensamientoRuidoActual]
    );

    temporizadorPensamientosRuido = setInterval(() => {
        pensamientoRuidoActual++;

        if (pensamientoRuidoActual < pensamientosRuido.length) {
            mostrarPensamiento(
                pensamientoRuido,
                pensamientosRuido[pensamientoRuidoActual]
            );
        } else {
            clearInterval(temporizadorPensamientosRuido);
            temporizadorPensamientosRuido = null;
        }
    }, 3500);
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

    clearInterval(temporizadorPensamientosRuido);
    temporizadorPensamientosRuido = null;

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


// APAGAR Y LIBERAR COMPLETAMENTE EL AUDIO

function detenerSonidoRuido() {

    clearInterval(temporizadorPensamientosRuido);
    temporizadorPensamientosRuido = null;

    window.removeEventListener(
        "deviceorientation",
        cambiarIntensidadPorInclinacion
    );

    window.removeEventListener(
        "deviceorientationabsolute",
        cambiarIntensidadPorInclinacion
    );

    orientacionActiva = false;

    if (fuenteRuido) {
        try {
            fuenteRuido.stop();
        } catch (error) {
            console.log("El sonido ya estaba detenido.");
        }

        try {
            fuenteRuido.disconnect();
        } catch (error) {}

        fuenteRuido = null;
    }

    if (gananciaRuido) {
        try {
            gananciaRuido.disconnect();
        } catch (error) {}

        gananciaRuido = null;
    }

    if (contextoRuido) {
        const contextoAnterior = contextoRuido;

        contextoRuido = null;

        contextoAnterior.close().catch((error) => {
            console.log("No se pudo cerrar el audio:", error);
        });
    }

    volumenActual = 0.35;
}


// BOTONES

botonActivarRuido.addEventListener("click", encenderRadio);

botonTerminarRuido.addEventListener("click", terminarRitualRuido);


// SALIR DEL RITUAL

function salirDeRuido() {

    document.getElementById("ritual-ruido")
        .classList.remove("activa");

    pantallaHabitacion.classList.add("activa");

    restaurarCama("respiracion");

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

// ELEMENTOS DE LA NARRACIÓN DEL SUEÑO

const narracionSueno = document.getElementById("narracion-sueno");
const ultimoPensamientoSueno = document.getElementById("ultimo-pensamiento-sueno");
const mensajeSueno = document.getElementById("mensaje-sueno");
const textoSuenoSecundario = document.getElementById("texto-sueno-secundario");
const zzzSueno = document.getElementById("zzz-sueno");

let temporizadorNarracion = [];
let temporizadorEscritura = null;

const finalEntrevista = document.getElementById("final-entrevista");
const finalDescanso = document.getElementById("final-descanso");
// ELEMENTOS DE LOS FINALES

const textoFinalEntrevista = document.getElementById("texto-final-entrevista");
const textoFinalDescanso = document.getElementById("texto-final-descanso");

const botonReiniciarEntrevista = finalEntrevista.querySelector(".reiniciar-experiencia");
const botonReiniciarDescanso = finalDescanso.querySelector(".reiniciar-experiencia");

// TEXTOS DE LOS FINALES

const parrafosFinalEntrevista = [
    "Lo lograste. Después de toda una noche intentando descansar, finalmente estás listo para cumplir con lo que se espera de ti.",

    "Una nueva jornada comienza y con ella, nuevas responsabilidades, nuevos objetivos y nuevas exigencias.",

    "Pero, ¿en qué momento dejamos de descansar por nosotros mismos y empezamos a hacerlo para seguir produciendo?"
];

const parrafosFinalDescanso = [
    "Decides no levantarte. La entrevista puede esperar. Las obligaciones también. Por una vez, no necesitas levantarte para cumplir con las expectativas, ni recuperar energías para una nueva jornada.",

    "No tienes que justificar tu descanso. Esta vez, simplemente duermes. No para producir, no para cumplir, no para llegar a ninguna parte.",

    "Solo porque puedes. Solo porque quieres. Solo por ser."
];

// ESCRIBIR LOS FINALES PROGRESIVAMENTE

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function escribirFinal(elemento, parrafos, boton) {

    elemento.innerHTML = "";
    boton.hidden = true;

    for (let i = 0; i < parrafos.length; i++) {

        const parrafo = document.createElement("p");

        elemento.appendChild(parrafo);

        for (let letra of parrafos[i]) {
            parrafo.textContent += letra;
            await esperar(35);
        }

        // Pausa entre párrafos.
        if (i < parrafos.length - 1) {
            await esperar(1400);
        }
    }

    // Mostrar el botón cuando termine toda la narración.
    await esperar(1200);
    boton.hidden = false;
}

const botonApagarAlarma = document.getElementById("apagar-alarma");
const botonPosponerAlarma = document.getElementById("posponer-alarma");

let temporizadorAlarma = null;

// ESCRIBIR LA NARRACIÓN LETRA POR LETRA

function escribirNarracion(elemento, texto, velocidad = 65) {
    clearInterval(temporizadorEscritura);

    elemento.textContent = "";
    let posicion = 0;

    temporizadorEscritura = setInterval(() => {
        elemento.textContent += texto.charAt(posicion);
        posicion++;

        if (posicion >= texto.length) {
            clearInterval(temporizadorEscritura);
            temporizadorEscritura = null;
        }
    }, velocidad);
}


// CAMBIAR DE ESCENA

function cambiarPantalla(actual, siguiente) {
    actual.classList.remove("activa");
    siguiente.classList.add("activa");
}


// COMENZAR A DORMIR

// COMENZAR LA TRANSICIÓN HACIA EL SUEÑO

function comenzarSueno() {

        // El reloj deja de sonar cuando la persona comienza a dormir.
    clearInterval(temporizadorFadeReloj);

    if (audioReloj) {
        audioReloj.pause();
        audioReloj.currentTime = 0;
    }

    // Limpiar temporizadores anteriores.
    temporizadorNarracion.forEach(clearTimeout);
    temporizadorNarracion = [];

    clearInterval(temporizadorEscritura);

    // Preparar los textos.
    narracionSueno.textContent = "";
    ultimoPensamientoSueno.hidden = true;
    mensajeSueno.hidden = true;
    zzzSueno.hidden = true;

    // Mostrar la escena del cielo y comenzar la narración.
    cambiarPantalla(pantallaHabitacion, escenaSueno);

    const textoPrincipal =
        "Ser, no ser, trabajar para ser, descansar para producir y repetir el ciclo…";

    escribirNarracion(narracionSueno, textoPrincipal, 75);

    // Después de terminar la primera reflexión.
    temporizadorNarracion.push(setTimeout(() => {

        ultimoPensamientoSueno.hidden = false;
        ultimoPensamientoSueno.classList.add("aparecer-sueno");

    }, 6500));

    // Aparece el mensaje de descanso.
    temporizadorNarracion.push(setTimeout(() => {

        mensajeSueno.hidden = false;

        mensajeSueno.classList.add("aparecer-sueno");

    }, 8500));

    // Finalmente aparecen los ronquidos.
    temporizadorNarracion.push(setTimeout(() => {

        zzzSueno.hidden = false;
        zzzSueno.classList.add("aparecer-sueno");

    }, 10500));

    // La alarma llega después de un momento de sueño.
    temporizadorAlarma = setTimeout(() => {
        mostrarAlarma();
    }, 20500);
}


// MOSTRAR LA ALARMA

function mostrarAlarma() {

    detenerSonidoRuido();

    clearTimeout(temporizadorAlarma);

    // Detener el reloj y marcar las 7:00 AM.
    clearInterval(intervaloReloj);
    actualizarReloj(true);

    cambiarPantalla(escenaSueno, escenaAlarma);
}


// APAGAR ALARMA: IR A LA ENTREVISTA

function levantarse() {

    clearTimeout(temporizadorAlarma);

    cambiarPantalla(escenaAlarma, finalEntrevista);

    escribirFinal(
        textoFinalEntrevista,
        parrafosFinalEntrevista,
        botonReiniciarEntrevista
    );
}


// POSPONER ALARMA: SEGUIR DESCANSANDO

function seguirDescansando() {

    clearTimeout(temporizadorAlarma);

    cambiarPantalla(escenaAlarma, finalDescanso);

    escribirFinal(
        textoFinalDescanso,
        parrafosFinalDescanso,
        botonReiniciarDescanso
    );
}


// BOTÓN PARA DORMIR
if (botonDormir) {
    botonDormir.addEventListener("click", comenzarSueno);
}

// BOTONES DE LA ALARMA
if (botonApagarAlarma) {
    botonApagarAlarma.addEventListener("click", levantarse);
}

if (botonPosponerAlarma) {
    botonPosponerAlarma.addEventListener("click", seguirDescansando);
}


// REINICIAR TODA LA EXPERIENCIA

document.querySelectorAll(".reiniciar-experiencia")
    .forEach((boton) => {

        boton.addEventListener("click", () => {

            // Detener el ruido blanco.
            detenerSonidoRuido();

            // Detener el micrófono.
            if (typeof detenerMicrofono === "function") {
                detenerMicrofono();
            }

            // Detener la cámara.
            if (typeof detenerCamaraColores === "function") {
                detenerCamaraColores();
            }

            // Cancelar la alarma pendiente.
            clearTimeout(temporizadorAlarma);

            // Reiniciar la página.
            window.location.reload();

        });

    });