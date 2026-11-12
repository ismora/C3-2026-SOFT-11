// =====================================================================
// Asignar certificación a un empleado (asignar-certificacion.html)
// Endpoints: GET /empleados/opciones, GET /certificaciones/opciones
//            PATCH /empleados/:correo/certificaciones
// =====================================================================

// ---------- Elementos del HTML ----------
const formulario = document.getElementById("frmAsignar");
const listaEmpleados = document.getElementById("sltEmpleado");
const listaCertificaciones = document.getElementById("sltCertificacion");
const panelResultado = document.getElementById("pnlResultado");
const tituloResultado = document.getElementById("txtTituloResultado");
const listaAsignadas = document.getElementById("lstAsignados");


// ---------------------------------------------------------------------
// Llenar el <select> de empleados con los datos del servidor
// ---------------------------------------------------------------------
async function mostrarEmpleados() {
    try {
        const respuesta = await fetch(`${API_URL}/empleados/opciones`);
        const empleados = await respuesta.json();

        listaEmpleados.innerHTML = '<option value="">Seleccione un empleado</option>';

        empleados.forEach(empleado => {
            const nuevaOpcion = document.createElement("option"); // crear cada opción del select
            nuevaOpcion.value = empleado.correo;                  // dato que se envía al servidor
            nuevaOpcion.textContent = `${empleado.nombre} (${empleado.correo})`; // lo que ve el usuario
            listaEmpleados.appendChild(nuevaOpcion);
        });
    } catch (error) {
        console.log(error);
        mostrarErrorConexion();
    }
}


// ---------------------------------------------------------------------
// Llenar el <select> de certificaciones
// ---------------------------------------------------------------------
async function mostrarCertificaciones() {
    try {
        const respuesta = await fetch(`${API_URL}/certificaciones/opciones`);
        const certificaciones = await respuesta.json();

        listaCertificaciones.innerHTML = '<option value="">Seleccione una certificación</option>';

        certificaciones.forEach(certificacion => {
            const nuevaOpcion = document.createElement("option");
            nuevaOpcion.value = certificacion._id;   // el ObjectId de la certificación
            nuevaOpcion.textContent = `${certificacion.nombre} - ${certificacion.institucion}`;
            listaCertificaciones.appendChild(nuevaOpcion);
        });
    } catch (error) {
        console.log(error);
        mostrarErrorConexion();
    }
}


// ---------------------------------------------------------------------
// Validar que se hayan seleccionado ambos datos
// ---------------------------------------------------------------------
function validar() {
    const faltaEmpleado = listaEmpleados.value === "";
    const faltaCertificacion = listaCertificaciones.value === "";

    marcarCampo(listaEmpleados, faltaEmpleado);
    marcarCampo(listaCertificaciones, faltaCertificacion);

    return !faltaEmpleado && !faltaCertificacion;
}


// ---------------------------------------------------------------------
// Enviar la asignación al servidor
// ---------------------------------------------------------------------
async function asociarCertificacion() {
    const correo = listaEmpleados.value;

    // El correo va en la RUTA (identifica al empleado)
    // y el id de la certificación va en el BODY (el dato que se agrega)
    const datosCertificacion = {
        certificacionId: listaCertificaciones.value
    };

    try {
        const respuesta = await fetch(`${API_URL}/empleados/${encodeURIComponent(correo)}/certificaciones`, {
            method: "PATCH",
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

        mostrarExito("Certificación asignada", `Se actualizó la información de ${datos.nombre}.`);
        mostrarCertificacionesDelEmpleado(datos);
    } catch (error) {
        console.log(error);
        mostrarErrorConexion();
    }
}


// El servidor devuelve el empleado con sus certificaciones (populate)
function mostrarCertificacionesDelEmpleado(empleado) {
    tituloResultado.textContent = `Certificaciones de ${empleado.nombre}`;
    listaAsignadas.innerHTML = "";

    empleado.certificaciones.forEach(certificacion => {
        const fila = document.createElement("li");
        fila.classList.add("fila");
        fila.innerHTML = `
            <div class="fila-info">
                <p class="fila-titulo">${escaparHTML(certificacion.nombre)}</p>
                <p class="fila-detalle">${escaparHTML(certificacion.institucion)}</p>
            </div>
        `;
        listaAsignadas.appendChild(fila);
    });

    panelResultado.classList.remove("oculto");   // mostrar el panel
}


// ---------- Eventos ----------

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (validar()) {
        asociarCertificacion();
    } else {
        formulario.querySelector(".invalido").focus();
    }
});

// Al abrir la página se cargan las dos listas
mostrarEmpleados();
mostrarCertificaciones();
