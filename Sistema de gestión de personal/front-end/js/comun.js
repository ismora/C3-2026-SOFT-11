// =====================================================================
// comun.js: funciones que usan TODAS las páginas.
// Se incluye antes del script propio de cada página.
// =====================================================================

// Dirección del back-end (NestJS). Si cambia el puerto, solo se cambia aquí.
const API_URL = "http://localhost:3000";


// ---------------------------------------------------------------------
// Evita que un texto con etiquetas HTML se "ejecute" al usar innerHTML.
// Ejemplo: si alguien registra el nombre "<b>Ana</b>", se muestra tal cual.
// ---------------------------------------------------------------------
function escaparHTML(texto) {
    const elemento = document.createElement("div");
    elemento.textContent = texto ?? "";
    return elemento.innerHTML;
}


// ---------------------------------------------------------------------
// Nest responde los errores así:
//   { "message": "Ya existe un empleado con ese correo.", "statusCode": 409 }
//   { "message": ["El nombre es obligatorio.", "..."], "statusCode": 400 }
// Esta función devuelve el mensaje listo para mostrarlo.
// ---------------------------------------------------------------------
function obtenerMensajeError(datos) {
    if (Array.isArray(datos.message)) {
        return datos.message.map(escaparHTML).join("<br>");
    }
    return escaparHTML(datos.message || "Ocurrió un error inesperado.");
}


// Mensaje cuando el back-end no está corriendo o no responde
function mostrarErrorConexion() {
    Swal.fire({
        icon: "error",
        title: "Sin conexión con el servidor",
        text: "Verifique que el back-end esté corriendo (npm run start:dev).",
        confirmButtonColor: "#48589b"
    });
}


// Mensaje de éxito
function mostrarExito(titulo, texto) {
    Swal.fire({
        icon: "success",
        title: titulo,
        text: texto,
        confirmButtonColor: "#48589b"
    });
}


// Mensaje de error que viene del servidor
function mostrarErrorServidor(datos) {
    Swal.fire({
        icon: "error",
        title: "No se pudo completar la acción",
        html: obtenerMensajeError(datos),
        confirmButtonColor: "#48589b"
    });
}


// "2027-06-25T00:00:00.000Z" → "25/06/2027"
// Se usa timeZone UTC para que la fecha no se corra un día en Costa Rica (UTC-6)
function formatearFecha(fechaTexto) {
    if (!fechaTexto) {
        return "Sin fecha";
    }
    return new Date(fechaTexto).toLocaleDateString("es-CR", { timeZone: "UTC" });
}


// Fecha de hoy con el formato de un <input type="date">: "2026-11-05"
// (se usa la fecha local de la computadora, no la de UTC)
function fechaDeHoy() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${hoy.getFullYear()}-${mes}-${dia}`;
}


// ---------------------------------------------------------------------
// Marca o desmarca un campo con error.
//  - La clase "invalido" pone el borde rojo y muestra su mensaje (ver CSS).
//  - aria-invalid avisa a los lectores de pantalla que el campo tiene un error.
// ---------------------------------------------------------------------
function marcarCampo(campo, hayError) {
    if (hayError) {
        campo.classList.add("invalido");
        campo.setAttribute("aria-invalid", "true");
    } else {
        campo.classList.remove("invalido");
        campo.removeAttribute("aria-invalid");
    }
}


// Quita las marcas de error de todos los campos de un formulario
function limpiarErrores(formulario) {
    const camposConError = formulario.querySelectorAll(".invalido");
    camposConError.forEach(campo => marcarCampo(campo, false));
}


// =====================================================================
// HERRAMIENTAS DE ACCESIBILIDAD (encabezado): tamaño de letra y modo oscuro.
// La preferencia se guarda en localStorage para que se mantenga entre páginas.
// =====================================================================
const TAMANNO_NORMAL = 16;
const TAMANNO_MINIMO = 14;
const TAMANNO_MAXIMO = 22;

// localStorage puede fallar (modo privado, permisos), por eso se usa try/catch
function leerPreferencia(clave) {
    try {
        return localStorage.getItem(clave);
    } catch (error) {
        return null;
    }
}

function guardarPreferencia(clave, valor) {
    try {
        localStorage.setItem(clave, valor);
    } catch (error) {
        // Si no se puede guardar, la página igual funciona
    }
}

function aplicarTamannoLetra(tamanno) {
    document.documentElement.style.fontSize = tamanno + "px";
    guardarPreferencia("tamannoLetra", tamanno);
}

function aplicarModoOscuro(activo) {
    document.body.classList.toggle("oscuro", activo);
    guardarPreferencia("modoOscuro", activo ? "si" : "no");

    const botonContraste = document.getElementById("btnContraste");
    if (botonContraste) {
        botonContraste.setAttribute("aria-pressed", activo ? "true" : "false");
    }
}

function iniciarHerramientas() {
    // 1. Recuperar las preferencias guardadas
    let tamannoActual = Number(leerPreferencia("tamannoLetra")) || TAMANNO_NORMAL;
    aplicarTamannoLetra(tamannoActual);
    aplicarModoOscuro(leerPreferencia("modoOscuro") === "si");

    // 2. Botones del encabezado
    const botonMenos = document.getElementById("btnLetraMenos");
    const botonNormal = document.getElementById("btnLetraNormal");
    const botonMas = document.getElementById("btnLetraMas");
    const botonContraste = document.getElementById("btnContraste");

    botonMenos.addEventListener("click", () => {
        if (tamannoActual > TAMANNO_MINIMO) {
            tamannoActual = tamannoActual - 2;
            aplicarTamannoLetra(tamannoActual);
        }
    });

    botonNormal.addEventListener("click", () => {
        tamannoActual = TAMANNO_NORMAL;
        aplicarTamannoLetra(tamannoActual);
    });

    botonMas.addEventListener("click", () => {
        if (tamannoActual < TAMANNO_MAXIMO) {
            tamannoActual = tamannoActual + 2;
            aplicarTamannoLetra(tamannoActual);
        }
    });

    botonContraste.addEventListener("click", () => {
        const activo = !document.body.classList.contains("oscuro");
        aplicarModoOscuro(activo);
    });
}

iniciarHerramientas();
