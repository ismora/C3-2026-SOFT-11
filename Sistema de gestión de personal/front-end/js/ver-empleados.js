// =====================================================================
// Obtener empleados 
// Endpoint: GET /empleados
// =====================================================================

const tablaEmpleados = document.getElementById("tblUsuarios").querySelector("tbody");

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
            console.log(empleado);
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
            fila.innerHTML = `
                <td> <strong> ${empleado.nombre} </strong> </td>
                <td> ${empleado.correo}  </td>
                <td> ${certificaciones || "--"}  </td>
                <td> ${proyectos || "--"}  </td>
            `;

            tablaEmpleados.appendChild(fila);
        });

    } catch (error) {
        console.log(error);
        tablaEmpleados.innerHTML = "No se pudieron cargar los empleados.";
    }

}


cargarTabla();