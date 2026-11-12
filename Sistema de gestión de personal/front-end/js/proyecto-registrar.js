// =====================================================================
// Registrar proyecto (proyecto-registrar.html)
// Endpoints: POST /proyectos  y  GET /proyectos/tecnologias
// =====================================================================

// ---------- Elementos del HTML ----------
const formulario = document.getElementById("frmProyecto");
const inputNombre = document.getElementById("txtNombre");
const inputDescripcion = document.getElementById("txtDescripcion");
const inputTecnologias = document.getElementById("txtTecnologias");
const textoRegistradas = document.getElementById("txtRegistradas");
const inputFechaInicio = document.querySelector("#txtFechaInicio");
const inputFechaFin = document.querySelector("#txtFechaFin");
const selectEstado = document.querySelector("#sltEstado");


// ---------------------------------------------------------------------
// Mostrar las tecnologías que ya existen, para escribirlas igual
// ---------------------------------------------------------------------
async function mostrarTecnologiasRegistradas() {
    try {
        const respuesta = await fetch(`${API_URL}/proyectos/tecnologias`);
        const tecnologias = await respuesta.json();   // ["mongodb", "node.js", "react"]

        if (tecnologias.length === 0) {
            textoRegistradas.textContent = "ninguna todavía";
        } else {
            textoRegistradas.textContent = tecnologias.join(", ");
        }
    } catch (error) {
        textoRegistradas.textContent = "no se pudieron cargar";
    }
}


// "React, Node.js , ,MongoDB" → ["React", "Node.js", "MongoDB"]
function obtenerListaTecnologias() {
    return inputTecnologias.value
        .split(",")                              // separar por comas
        .map(tecnologia => tecnologia.trim())    // quitar espacios
        .filter(tecnologia => tecnologia !== ""); // descartar las vacías
}


// ---------------------------------------------------------------------
// Validar los datos. Devuelve true si todo está bien.
// ---------------------------------------------------------------------
function validar() {
    let hayError = false;

    const faltaNombre = inputNombre.value.trim() === "";
    marcarCampo(inputNombre, faltaNombre);

    const faltanTecnologias = obtenerListaTecnologias().length === 0;
    marcarCampo(inputTecnologias, faltanTecnologias);

    const faltaInicio = inputFechaInicio.value === "";
    marcarCampo(inputFechaInicio, faltaInicio);

    // Regla de negocio: la fecha de fin no puede ser anterior a la de inicio
    const finAntesDeInicio = inputFechaFin.value !== "" && inputFechaFin.value < inputFechaInicio.value;
    marcarCampo(inputFechaFin, finAntesDeInicio);

    if (faltaNombre || faltanTecnologias || faltaInicio || finAntesDeInicio) {
        hayError = true;
    }
    return !hayError;
}


// ---------------------------------------------------------------------
// Enviar los datos al servidor
// ---------------------------------------------------------------------
async function registrarProyecto() {
    const datosProyecto = {
        nombre: inputNombre.value.trim(),
        tecnologias: obtenerListaTecnologias(),
        fechaInicio: inputFechaInicio.value,
        estado: selectEstado.value
    };

    // Campos opcionales: solo se envían si tienen valor
    if (inputDescripcion.value.trim() !== "") {
        datosProyecto.descripcion = inputDescripcion.value.trim();
    }
    if (inputFechaFin.value !== "") {
        datosProyecto.fechaFin = inputFechaFin.value;
    }

    try {
        const respuesta = await fetch(`${API_URL}/proyectos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosProyecto)
        });
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarErrorServidor(datos);
            return;
        }

        mostrarExito("Proyecto registrado", `${datos.nombre} se registró correctamente.`);
        formulario.reset();
        mostrarTecnologiasRegistradas();   // puede haber tecnologías nuevas
    } catch (error) {
        console.log(error);
        mostrarErrorConexion();
    }
}


// ---------- Eventos ----------

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (validar()) {
        registrarProyecto();
    } else {
        formulario.querySelector(".invalido").focus();
    }
});

formulario.addEventListener("reset", () => limpiarErrores(formulario));

mostrarTecnologiasRegistradas();
