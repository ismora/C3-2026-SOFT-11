// =====================================================================
// Asignar proyecto a un empleado (asignar-proyecto.html)
// Endpoints: GET /empleados/opciones, GET /proyectos/opciones
//            PATCH /empleados/:correo/proyectos
// =====================================================================

// ---------- Elementos del HTML ----------
const formulario = document.getElementById("frmAsignar");
const listaEmpleados = document.getElementById("sltEmpleado");
const listaProyectos = document.getElementById("sltProyecto");
const panelResultado = document.getElementById("pnlResultado");
const tituloResultado = document.getElementById("txtTituloResultado");
const listaAsignados = document.getElementById("lstAsignados");


// ---------------------------------------------------------------------
// Llenar el <select> de empleados
// ---------------------------------------------------------------------
async function mostrarEmpleados() {
    try {
        const respuesta = await fetch(`${API_URL}/empleados/opciones`);
        const empleados = await respuesta.json();

        listaEmpleados.innerHTML = '<option value="">Seleccione un empleado</option>';

        empleados.forEach(empleado => {
            const nuevaOpcion = document.createElement("option");
            nuevaOpcion.value = empleado.correo;
            nuevaOpcion.textContent = `${empleado.nombre} (${empleado.correo})`;
            listaEmpleados.appendChild(nuevaOpcion);
        });
    } catch (error) {
        console.log(error);
        mostrarErrorConexion();
    }
}


// ---------------------------------------------------------------------
// Llenar el <select> de proyectos
// ---------------------------------------------------------------------
async function mostrarProyectos() {
    try {
        const respuesta = await fetch(`${API_URL}/proyectos/opciones`);
        const proyectos = await respuesta.json();

        listaProyectos.innerHTML = '<option value="">Seleccione un proyecto</option>';

        proyectos.forEach(proyecto => {
            const nuevaOpcion = document.createElement("option");
            nuevaOpcion.value = proyecto._id;
            nuevaOpcion.textContent = `${proyecto.nombre} (${proyecto.estado})`;
            listaProyectos.appendChild(nuevaOpcion);
        });
    } catch (error) {
        console.log(error);
        mostrarErrorConexion();
    }
}


function validar() {
    const faltaEmpleado = listaEmpleados.value === "";
    const faltaProyecto = listaProyectos.value === "";

    marcarCampo(listaEmpleados, faltaEmpleado);
    marcarCampo(listaProyectos, faltaProyecto);

    return !faltaEmpleado && !faltaProyecto;
}


// ---------------------------------------------------------------------
// Enviar la asignación al servidor
// ---------------------------------------------------------------------
async function asignarProyecto() {
    const correo = listaEmpleados.value;
    const datosProyecto = {
        proyectoId: listaProyectos.value
    };

    try {
        const respuesta = await fetch(`${API_URL}/empleados/${encodeURIComponent(correo)}/proyectos`, {
            method: "PATCH",
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

        mostrarExito("Proyecto asignado", `Se actualizó la información de ${datos.nombre}.`);
        mostrarProyectosDelEmpleado(datos);
    } catch (error) {
        console.log(error);
        mostrarErrorConexion();
    }
}


// El servidor devuelve el empleado con sus proyectos (populate)
function mostrarProyectosDelEmpleado(empleado) {
    tituloResultado.textContent = `Proyectos de ${empleado.nombre}`;
    listaAsignados.innerHTML = "";

    empleado.proyectos.forEach(proyecto => {
        // Las tecnologías se muestran como etiquetas
        let etiquetas = "";
        proyecto.tecnologias.forEach(tecnologia => {
            etiquetas += `<span class="etiqueta">${escaparHTML(tecnologia)}</span>`;
        });

        const fila = document.createElement("li");
        fila.classList.add("fila");
        fila.innerHTML = `
            <div class="fila-info">
                <p class="fila-titulo">${escaparHTML(proyecto.nombre)}</p>
                <p class="fila-detalle">Estado: ${escaparHTML(proyecto.estado)}</p>
                <div>${etiquetas}</div>
            </div>
        `;
        listaAsignados.appendChild(fila);
    });

    panelResultado.classList.remove("oculto");
}


// ---------- Eventos ----------

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (validar()) {
        asignarProyecto();
    } else {
        formulario.querySelector(".invalido").focus();
    }
});

mostrarEmpleados();
mostrarProyectos();
