// =====================================================================
// Registrar certificación (certificacion-registrar.html)
// Endpoint: POST /certificaciones
// =====================================================================

// ---------- Elementos del HTML ----------
const formulario = document.getElementById("frmCertificacion");
const inputNombre = document.getElementById("txtNombre");
const inputInstitucion = document.getElementById("txtInstitucion");
const inputDescripcion = document.getElementById("txtDescripcion");
const casillaExpira = document.querySelector("#chkExpira");
const grupoFecha = document.querySelector("#grpFecha");
const inputFecha = document.querySelector("#txtFechaExpiracion");


// ---------------------------------------------------------------------
// Mostrar u ocultar la fecha según la casilla "tiene fecha de expiración"
// ---------------------------------------------------------------------
function actualizarCampoFecha() {
    if (casillaExpira.checked) {
        grupoFecha.classList.remove("oculto");
        inputFecha.required = true;
    } else {
        grupoFecha.classList.add("oculto");
        inputFecha.required = false;
        inputFecha.value = "";
        marcarCampo(inputFecha, false);
    }
}


// ---------------------------------------------------------------------
// Validar los datos. Devuelve true si todo está bien.
// ---------------------------------------------------------------------
function validar() {
    let hayError = false;

    // querySelectorAll con [required] incluye la fecha solo si es obligatoria
    const camposRequeridos = formulario.querySelectorAll("[required]");
    camposRequeridos.forEach(campo => {
        const estaVacio = campo.value.trim() === "";
        marcarCampo(campo, estaVacio);
        if (estaVacio) {
            hayError = true;
        }
    });

    // La fecha de expiración debe ser posterior a hoy.
    // Las fechas "AAAA-MM-DD" se pueden comparar como texto.
    if (casillaExpira.checked && inputFecha.value !== "" && inputFecha.value <= fechaDeHoy()) {
        marcarCampo(inputFecha, true);
        hayError = true;
    }

    return !hayError;
}


// ---------------------------------------------------------------------
// Enviar los datos al servidor
// ---------------------------------------------------------------------
async function registrarCertificacion() {
    // Mismos nombres que CrearCertificacionDto y VigenciaDto
    const datosCertificacion = {
        nombre: inputNombre.value.trim(),
        institucion: inputInstitucion.value.trim(),
        vigencia: {
            expira: casillaExpira.checked
        }
    };

    if (inputDescripcion.value.trim() !== "") {
        datosCertificacion.descripcion = inputDescripcion.value.trim();
    }

    if (casillaExpira.checked) {
        datosCertificacion.vigencia.fechaExpiracion = inputFecha.value;
    }

    try {
        const respuesta = await fetch(`${API_URL}/certificaciones`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosCertificacion)
        });
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarErrorServidor(datos);
            return;
        }

        mostrarExito("Certificación registrada", `${datos.nombre} (${datos.institucion}) se registró correctamente.`);
        formulario.reset();
    } catch (error) {
        console.log(error);
        mostrarErrorConexion();
    }
}


// ---------- Eventos ----------

casillaExpira.addEventListener("change", actualizarCampoFecha);

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (validar()) {
        registrarCertificacion();
    } else {
        formulario.querySelector(".invalido").focus();
    }
});

// "reset" ocurre ANTES de que se limpien los campos;
// setTimeout espera a que terminen de limpiarse para ocultar la fecha
formulario.addEventListener("reset", () => {
    limpiarErrores(formulario);
    setTimeout(actualizarCampoFecha, 0);
});
