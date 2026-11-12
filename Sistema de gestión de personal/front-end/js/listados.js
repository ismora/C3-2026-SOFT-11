// =====================================================================
// Listados completos (listados.html)
// Endpoints: GET /empleados, GET /certificaciones, GET /proyectos
// =====================================================================

// ---------- Elementos del HTML ----------
const tablaEmpleados = document.getElementById("tblEmpleados");
const tablaCertificaciones = document.getElementById("tblCertificaciones");
const tablaProyectos = document.getElementById("tblProyectos");

const contadorEmpleados = document.getElementById("cntEmpleados");
const contadorCertificaciones = document.getElementById("cntCertificaciones");
const contadorProyectos = document.getElementById("cntProyectos");

// Todas las pestañas (botones con role="tab")
const pestannas = document.querySelectorAll('[role="tab"]');


// ---------------------------------------------------------------------
// Pestañas: mostrar el panel de la pestaña seleccionada y ocultar los demás
// ---------------------------------------------------------------------
function seleccionarPestanna(pestannaElegida) {
    pestannas.forEach(pestanna => {
        const esLaElegida = pestanna === pestannaElegida;

        // aria-selected indica cuál está seleccionada (y el CSS la pinta)
        pestanna.setAttribute("aria-selected", esLaElegida ? "true" : "false");

        // aria-controls tiene el id del panel de esa pestaña
        const panel = document.getElementById(pestanna.getAttribute("aria-controls"));
        panel.hidden = !esLaElegida;
    });
}


// Fila con un mensaje que ocupa todas las columnas
function filaMensaje(cantidadColumnas, mensaje) {
    return `<tr><td colspan="${cantidadColumnas}" class="lista-vacia">${mensaje}</td></tr>`;
}


// ---------------------------------------------------------------------
// Empleados
// ---------------------------------------------------------------------
async function cargarEmpleados() {
    try {
        const respuesta = await fetch(`${API_URL}/empleados`);
        const empleados = await respuesta.json();

        tablaEmpleados.innerHTML = ""; // limpiar la tabla
        contadorEmpleados.textContent = `(${empleados.length})`;

        if (empleados.length === 0) {
            tablaEmpleados.innerHTML = filaMensaje(5, "No hay empleados registrados.");
            return;
        }

        empleados.forEach(empleado => {
            // Certificaciones y proyectos se muestran como etiquetas
            let certificaciones = "";
            empleado.certificaciones.forEach(certificacion => {
                certificaciones += `<span class="etiqueta">${escaparHTML(certificacion.nombre)}</span> `;
            });

            let proyectos = "";
            empleado.proyectos.forEach(proyecto => {
                proyectos += `<span class="etiqueta">${escaparHTML(proyecto.nombre)}</span> `;
            });

            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td><strong>${escaparHTML(empleado.nombre)}</strong></td>
                <td>${escaparHTML(empleado.correo)}</td>
                <td>${escaparHTML(empleado.direccion.provincia)}</td>
                <td>${certificaciones || "—"}</td>
                <td>${proyectos || "—"}</td>
            `;
            tablaEmpleados.appendChild(fila);
        });
    } catch (error) {
        console.log(error);
        tablaEmpleados.innerHTML = filaMensaje(5, "No se pudieron cargar los empleados.");
    }
}


// ---------------------------------------------------------------------
// Certificaciones
// ---------------------------------------------------------------------

// Texto de la vigencia: "No expira", "Vence el 25/06/2027" o "Vencida"
function textoVigencia(vigencia) {
    if (!vigencia || !vigencia.expira) {
        return "No expira";
    }

    const fecha = formatearFecha(vigencia.fechaExpiracion);
    if (new Date(vigencia.fechaExpiracion) < new Date()) {
        return `<span class="etiqueta alerta">Vencida el ${fecha}</span>`;
    }
    return `Vence el ${fecha}`;
}

async function cargarCertificaciones() {
    try {
        const respuesta = await fetch(`${API_URL}/certificaciones`);
        const certificaciones = await respuesta.json();

        tablaCertificaciones.innerHTML = "";
        contadorCertificaciones.textContent = `(${certificaciones.length})`;

        if (certificaciones.length === 0) {
            tablaCertificaciones.innerHTML = filaMensaje(4, "No hay certificaciones registradas.");
            return;
        }

        certificaciones.forEach(certificacion => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td><strong>${escaparHTML(certificacion.nombre)}</strong></td>
                <td>${escaparHTML(certificacion.institucion)}</td>
                <td>${escaparHTML(certificacion.descripcion) || "—"}</td>
                <td>${textoVigencia(certificacion.vigencia)}</td>
            `;
            tablaCertificaciones.appendChild(fila);
        });
    } catch (error) {
        console.log(error);
        tablaCertificaciones.innerHTML = filaMensaje(4, "No se pudieron cargar las certificaciones.");
    }
}


// ---------------------------------------------------------------------
// Proyectos
// ---------------------------------------------------------------------
async function cargarProyectos() {
    try {
        const respuesta = await fetch(`${API_URL}/proyectos`);
        const proyectos = await respuesta.json();

        tablaProyectos.innerHTML = "";
        contadorProyectos.textContent = `(${proyectos.length})`;

        if (proyectos.length === 0) {
            tablaProyectos.innerHTML = filaMensaje(5, "No hay proyectos registrados.");
            return;
        }

        proyectos.forEach(proyecto => {
            let tecnologias = "";
            proyecto.tecnologias.forEach(tecnologia => {
                tecnologias += `<span class="etiqueta">${escaparHTML(tecnologia)}</span> `;
            });

            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td><strong>${escaparHTML(proyecto.nombre)}</strong></td>
                <td>${escaparHTML(proyecto.estado)}</td>
                <td>${tecnologias || "—"}</td>
                <td>${formatearFecha(proyecto.fechaInicio)}</td>
                <td>${proyecto.fechaFin ? formatearFecha(proyecto.fechaFin) : "—"}</td>
            `;
            tablaProyectos.appendChild(fila);
        });
    } catch (error) {
        console.log(error);
        tablaProyectos.innerHTML = filaMensaje(5, "No se pudieron cargar los proyectos.");
    }
}


// ---------- Eventos ----------

pestannas.forEach(pestanna => {
    pestanna.addEventListener("click", () => seleccionarPestanna(pestanna));
});

// Al abrir la página se cargan las tres tablas
cargarEmpleados();
cargarCertificaciones();
cargarProyectos();
