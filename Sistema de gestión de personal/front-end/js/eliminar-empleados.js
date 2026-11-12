// =====================================================================
// Eliminar empleados 
// Endpoints: GET, DELETE /empleados
// =====================================================================

const tablaEmpleados = document.querySelector("#tblUsuarios tbody");

async function cargarTabla(){
    try{
        const respuesta = await fetch("http://localhost:3000/empleados"); // No se indica el tipo de método (GET) porque fetch() usa GET por defecto
        const empleados = await respuesta.json();

        tablaEmpleados.innerHTML = ""; // Instrucción que limpia la tabla

        if (empleados.length === 0) {
            tablaEmpleados.innerHTML = "No hay empleados registrados.";
            return; // Sin empleados termina la ejecución de la función 
        }

        empleados.forEach(empleado => {
            // Certificaciones y proyectos 
            let certificaciones = "";
            empleado.certificaciones.forEach(certificacion => {
                certificaciones += `<span class="etiqueta"> ${certificacion.nombre} </span>`;
            });

            let proyectos = "";
            empleado.proyectos.forEach(proyecto => {
                proyectos += `<span class="etiqueta">${proyecto.nombre}</span> `;
            });

            const fila = document.createElement("tr");
            console.log(empleado._id, empleado.nombre)
            fila.innerHTML = `
                <td> <strong> ${empleado.nombre} </strong> </td>
                <td> ${empleado.correo}  </td>
                <td> ${certificaciones || "--"}  </td>
                <td> ${proyectos || "--"}  </td>
                <td>
                    <button class="btn-eliminar" data-id="${empleado._id}" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>

            `;

            tablaEmpleados.appendChild(fila);
        });

    } catch (error) {
        console.log(error);
        tablaEmpleados.innerHTML = "No se pudieron cargar los empleados.";
    }
}

async function eliminarEmpleado(id, fila) {
    const confirmacion = await Swal.fire({
        icon: "warning",
        title: "¿Eliminar empleado?",
        text: "Esta acción no se puede deshacer.",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#c81f66",
        cancelButtonColor: "#6c757d"
    });

    if (!confirmacion.isConfirmed) return false; // Si el usuario selecciono cancelar 

    try {
        const resp = await fetch(`http://localhost:3000/empleados/${id}`, {
            method: "DELETE",
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        fila.remove();

        Swal.fire({
            icon: "success",
            title: "Empleado eliminado",
            text: "El registro se eliminó correctamente.",
            confirmButtonColor: "#48589b"
        });
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "No se pudo eliminar",
            text: "Ocurrió un error al eliminar el empleado.",
            confirmButtonColor: "#48589b"
        });
    }
}

// Escuchador de eventos en la tabla: cuando se haga clic en el botón eliminar se ejecuta el evento 
tablaEmpleados.addEventListener("click", (e) => {
    const boton = e.target.closest(".btn-eliminar");
    if (!boton) return;

    // dataset: Permite leer un atributo data-* desde JS
    eliminarEmpleado(boton.dataset.id, boton.closest("tr"));
});

cargarTabla();