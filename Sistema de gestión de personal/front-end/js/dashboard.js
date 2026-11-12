// =====================================================================
// Panel principal (index.html)
// Endpoint: GET /estadisticas/resumen?dias=30
// =====================================================================

// Periodo para avisar de las certificaciones que están por vencer
const DIAS_AVISO = 30;

// ---------- Elementos del HTML ----------
const textoActualizado = document.getElementById("txtActualizado");
const botonActualizar = document.getElementById("btnActualizar");

// Tarjetas
const valorEmpleados = document.getElementById("valEmpleados");
const detalleEmpleados = document.getElementById("detEmpleados");
const valorCertificaciones = document.getElementById("valCertificaciones");
const detalleCertificaciones = document.getElementById("detCertificaciones");
const valorProyectos = document.getElementById("valProyectos");
const detalleProyectos = document.getElementById("detProyectos");
const valorPorVencer = document.getElementById("valPorVencer");
const detallePorVencer = document.getElementById("detPorVencer");

// Paneles
const listaEstados = document.querySelector("#lstEstados");
const listaTecnologias = document.querySelector("#lstTecnologias");
const listaCertificaciones = document.querySelector("#lstCertificaciones");
const listaUltimos = document.querySelector("#lstUltimos");


// ---------------------------------------------------------------------
// Pedir el resumen al servidor y mostrar cada parte
// ---------------------------------------------------------------------
async function cargarResumen() {
    try {
        const respuesta = await fetch(`${API_URL}/estadisticas/resumen?dias=${DIAS_AVISO}`);
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarErrorServidor(datos);
            return;
        }

        mostrarTarjetas(datos);

        // Cada lista del servidor se convierte a { etiqueta, cantidad } para dibujar las barras
        mostrarBarras(listaEstados, datos.proyectosPorEstado.map(estado => ({
            etiqueta: estado._id,
            cantidad: estado.cantidad
        })), "proyecto(s)");

        mostrarBarras(listaTecnologias, datos.tecnologiasMasUsadas.map(tecnologia => ({
            etiqueta: tecnologia._id,
            cantidad: tecnologia.cantidad
        })), "proyecto(s)");

        mostrarBarras(listaCertificaciones, datos.certificacionesMasComunes.map(certificacion => ({
            etiqueta: `${certificacion.nombre} (${certificacion.institucion})`,
            cantidad: certificacion.cantidad
        })), "empleado(s)");

        mostrarUltimosEmpleados(datos.ultimosEmpleados);

        // Hora de la última actualización
        const ahora = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
        textoActualizado.textContent = `Última actualización: ${ahora}`;
    } catch (error) {
        console.log(error);
        textoActualizado.textContent = "No se pudieron cargar los datos.";
        mostrarErrorConexion();
    }
}


// ---------------------------------------------------------------------
// Tarjetas: un número grande y un dato de apoyo debajo
// ---------------------------------------------------------------------
function mostrarTarjetas(datos) {
    valorEmpleados.textContent = datos.totales.empleados;
    detalleEmpleados.textContent = `${datos.empleadosSinCertificaciones} sin certificaciones`;

    valorCertificaciones.textContent = datos.totales.certificaciones;
    detalleCertificaciones.textContent = `${datos.vigencia.vencidas} vencida(s)`;

    // Proyectos "En curso": se buscan dentro de la lista por estado
    const enCurso = datos.proyectosPorEstado.find(estado => estado._id === "En curso");
    valorProyectos.textContent = datos.totales.proyectos;
    detalleProyectos.textContent = `${enCurso ? enCurso.cantidad : 0} en curso`;

    valorPorVencer.textContent = datos.vigencia.porVencer;
    detallePorVencer.textContent = `certificación(es) en los próximos ${datos.vigencia.dias} días`;
}


// ---------------------------------------------------------------------
// Barras horizontales
//   elementoLista: el <ul> donde se dibujan
//   lista: [{ etiqueta: "React", cantidad: 3 }, ...]
//   unidad: texto para el lector de pantalla ("proyecto(s)")
// ---------------------------------------------------------------------
function mostrarBarras(elementoLista, lista, unidad) {
    elementoLista.innerHTML = "";

    if (lista.length === 0) {
        elementoLista.innerHTML = '<li class="lista-vacia">Todavía no hay datos.</li>';
        return;
    }

    // La barra más larga corresponde a la cantidad mayor
    let maximo = 0;
    lista.forEach(elemento => {
        if (elemento.cantidad > maximo) {
            maximo = elemento.cantidad;
        }
    });

    lista.forEach(elemento => {
        const porcentaje = Math.round((elemento.cantidad / maximo) * 100);

        const fila = document.createElement("li");
        fila.title = `${elemento.etiqueta}: ${elemento.cantidad} ${unidad}`;   // texto al pasar el mouse
        fila.innerHTML = `
            <span class="barra-etiqueta">${escaparHTML(elemento.etiqueta)}</span>
            <span class="barra-valor">${elemento.cantidad}<span class="solo-lector"> ${unidad}</span></span>
            <span class="barra-riel" aria-hidden="true"><span class="barra-relleno"></span></span>
        `;

        // El ancho de la barra es proporcional a la cantidad
        fila.querySelector(".barra-relleno").style.width = porcentaje + "%";

        elementoLista.appendChild(fila);
    });
}


// ---------------------------------------------------------------------
// Lista de los últimos empleados registrados
// ---------------------------------------------------------------------
function mostrarUltimosEmpleados(empleados) {
    listaUltimos.innerHTML = "";

    if (empleados.length === 0) {
        listaUltimos.innerHTML = '<li class="lista-vacia">Todavía no hay empleados registrados.</li>';
        return;
    }

    empleados.forEach(empleado => {
        const fila = document.createElement("li");
        fila.classList.add("fila");
        fila.innerHTML = `
            <div class="fila-info">
                <p class="fila-titulo">${escaparHTML(empleado.nombre)}</p>
                <p class="fila-detalle">${escaparHTML(empleado.correo)} · Registrado el ${formatearFecha(empleado.createdAt)}</p>
            </div>
        `;
        listaUltimos.appendChild(fila);
    });
}


// ---------- Eventos ----------
botonActualizar.addEventListener("click", cargarResumen);

// Al abrir la página
cargarResumen();
