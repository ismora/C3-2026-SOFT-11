// =====================================================================
// Directorio de empleados (index.html)
// Endpoints: GET /empleados/listado  y  DELETE /empleados/:id
// =====================================================================

// ---------- Elementos del HTML ----------
const listaEmpleados = document.getElementById("lstEmpleados");
const textoResumen = document.getElementById("txtResumen");
const navPaginacion = document.getElementById("navPaginacion");
const formularioBuscar = document.querySelector("#frmBuscar");
const inputBuscar = document.querySelector("#txtBuscar");

// ---------- Datos de la paginación ----------
const EMPLEADOS_POR_PAGINA = 10;
let paginaActual = 1;


// ---------------------------------------------------------------------
// Pide al servidor UNA página de empleados y la muestra
// ---------------------------------------------------------------------
async function cargarEmpleados() {
    const buscar = inputBuscar.value.trim();

    // encodeURIComponent: convierte espacios, tildes y @ para que viajen bien en la URL
    const url = `${API_URL}/empleados/listado?pagina=${paginaActual}&limite=${EMPLEADOS_POR_PAGINA}&buscar=${encodeURIComponent(buscar)}`;

    try {
        // En un GET no se envía body, por eso no hacen falta method ni headers
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarErrorServidor(datos);
            return;
        }

        // datos = { total, pagina, limite, totalPaginas, empleados: [...] }
        mostrarResumen(datos.total);
        mostrarEmpleados(datos.empleados);
        mostrarPaginacion(datos.totalPaginas);
    } catch (error) {
        console.log(error);
        mostrarErrorConexion();
    }
}


// "1 - 10 de 57"
function mostrarResumen(total) {
    if (total === 0) {
        textoResumen.textContent = "0 resultados";
        return;
    }
    const desde = (paginaActual - 1) * EMPLEADOS_POR_PAGINA + 1;
    const hasta = Math.min(paginaActual * EMPLEADOS_POR_PAGINA, total);
    textoResumen.textContent = `${desde} - ${hasta} de ${total}`;
}


// Crea una fila (<li>) por cada empleado
function mostrarEmpleados(empleados) {
    listaEmpleados.innerHTML = ""; // limpiar la lista anterior

    if (empleados.length === 0) {
        listaEmpleados.innerHTML = '<li class="lista-vacia">No se encontraron empleados.</li>';
        return;
    }

    empleados.forEach(empleado => {
        const fila = document.createElement("li");
        fila.classList.add("fila");

        // escaparHTML evita que un texto con etiquetas se ejecute como HTML
        const nombre = escaparHTML(empleado.nombre);

        fila.innerHTML = `
            <div class="fila-info">
                <p class="fila-titulo">${nombre}</p>
                <p class="fila-detalle">
                    ${escaparHTML(empleado.correo)} ·
                    ${empleado.certificaciones.length} certificación(es) ·
                    ${empleado.proyectos.length} proyecto(s)
                </p>
            </div>
            <div class="fila-acciones">
                <button type="button" class="btn-icono btn-ver" aria-label="Ver el detalle de ${nombre}">
                    <i class="fa-solid fa-eye" aria-hidden="true"></i>
                </button>
                <button type="button" class="btn-icono peligro btn-eliminar" aria-label="Eliminar a ${nombre}">
                    <i class="fa-solid fa-trash" aria-hidden="true"></i>
                </button>
            </div>
        `;

        // Cada botón recibe el empleado de SU fila
        fila.querySelector(".btn-ver").addEventListener("click", () => verDetalle(empleado));
        fila.querySelector(".btn-eliminar").addEventListener("click", () => eliminarEmpleado(empleado));

        listaEmpleados.appendChild(fila);
    });
}


// Crea los botones: ‹ Anterior  1  2  3  Siguiente ›
function mostrarPaginacion(totalPaginas) {
    navPaginacion.innerHTML = "";

    if (totalPaginas <= 1) {
        return; // con una sola página no hace falta paginación
    }

    navPaginacion.appendChild(crearBotonPagina("‹ Anterior", paginaActual - 1, paginaActual === 1));

    for (let numero = 1; numero <= totalPaginas; numero++) {
        const boton = crearBotonPagina(numero, numero, false);
        if (numero === paginaActual) {
            boton.classList.add("pagina-actual");
            boton.setAttribute("aria-current", "page");
        }
        boton.setAttribute("aria-label", "Página " + numero);
        navPaginacion.appendChild(boton);
    }

    navPaginacion.appendChild(crearBotonPagina("Siguiente ›", paginaActual + 1, paginaActual === totalPaginas));
}

function crearBotonPagina(texto, pagina, deshabilitado) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = texto;
    boton.disabled = deshabilitado;

    boton.addEventListener("click", () => {
        paginaActual = pagina;
        cargarEmpleados();
    });
    return boton;
}


// ---------------------------------------------------------------------
// Ver el detalle de un empleado en una ventana de SweetAlert2
// ---------------------------------------------------------------------
function verDetalle(empleado) {
    const direccion = empleado.direccion;

    // Certificaciones: "Scrum Master - Scrum.org"
    let listaCertificaciones = "";
    empleado.certificaciones.forEach(certificacion => {
        listaCertificaciones += `<li>${escaparHTML(certificacion.nombre)} - ${escaparHTML(certificacion.institucion)}</li>`;
    });

    // Proyectos: "Portal de matrícula (En curso)"
    let listaProyectos = "";
    empleado.proyectos.forEach(proyecto => {
        listaProyectos += `<li>${escaparHTML(proyecto.nombre)} (${escaparHTML(proyecto.estado)})</li>`;
    });

    Swal.fire({
        title: escaparHTML(empleado.nombre),
        confirmButtonColor: "#48589b",
        confirmButtonText: "Cerrar",
        html: `
            <div style="text-align: left; font-size: 0.95rem;">
                <p><strong>Correo:</strong> ${escaparHTML(empleado.correo)}</p>
                <p><strong>Dirección:</strong> ${escaparHTML(direccion.provincia)}, ${escaparHTML(direccion.canton)},
                    ${escaparHTML(direccion.distrito)}</p>
                <p><strong>Certificaciones:</strong></p>
                <ul>${listaCertificaciones || "<li>Sin certificaciones</li>"}</ul>
                <p><strong>Proyectos:</strong></p>
                <ul>${listaProyectos || "<li>Sin proyectos</li>"}</ul>
            </div>
        `
    });
}


// ---------------------------------------------------------------------
// Eliminar un empleado (pide confirmación antes)
// ---------------------------------------------------------------------
async function eliminarEmpleado(empleado) {
    const confirmacion = await Swal.fire({
        icon: "warning",
        title: "¿Eliminar empleado?",
        text: `Se eliminará a ${empleado.nombre}. Esta acción no se puede deshacer.`,
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#c0392b"
    });

    if (!confirmacion.isConfirmed) {
        return; // el usuario canceló
    }

    try {
        const respuesta = await fetch(`${API_URL}/empleados/${empleado._id}`, {
            method: "DELETE"
        });
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarErrorServidor(datos);
            return;
        }

        mostrarExito("Empleado eliminado", `${empleado.nombre} fue eliminado.`);

        // Si era el último de la página, se regresa a la página anterior
        if (listaEmpleados.children.length === 1 && paginaActual > 1) {
            paginaActual--;
        }
        cargarEmpleados();
    } catch (error) {
        console.log(error);
        mostrarErrorConexion();
    }
}


// ---------- Eventos ----------

// Buscar al presionar Enter en el buscador
formularioBuscar.addEventListener("submit", (evento) => {
    evento.preventDefault();   // evita que la página se recargue
    paginaActual = 1;          // una búsqueda nueva empieza en la página 1
    cargarEmpleados();
});

// Si se borra el texto del buscador, se vuelve a mostrar todo
inputBuscar.addEventListener("input", () => {
    if (inputBuscar.value === "") {
        paginaActual = 1;
        cargarEmpleados();
    }
});

// Al abrir la página
cargarEmpleados();
