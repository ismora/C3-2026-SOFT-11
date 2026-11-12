// =====================================================================
// Certificaciones por vencer (certificaciones-por-vencer.html)
// Endpoint: GET /certificaciones/por-vencer?dias=90
// =====================================================================

// ---------- Elementos del HTML ----------
const formulario = document.getElementById("frmFiltro");
const inputDias = document.getElementById("txtDias");
const textoResumen = document.getElementById("txtResumen");
const listaCertificaciones = document.getElementById("lstCertificaciones");

const MILISEGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;


// Días que faltan desde hoy hasta una fecha
function diasRestantes(fechaTexto) {
    const diferencia = new Date(fechaTexto) - new Date();
    return Math.ceil(diferencia / MILISEGUNDOS_POR_DIA);
}


// ---------------------------------------------------------------------
// Consultar al servidor
// ---------------------------------------------------------------------
async function consultar() {
    const dias = Number(inputDias.value);

    // Validar: número entero mayor a 0
    const esInvalido = !Number.isInteger(dias) || dias <= 0;
    marcarCampo(inputDias, esInvalido);
    if (esInvalido) {
        inputDias.focus();
        return;
    }

    try {
        // ?dias=90 → parámetro de CONSULTA (filtra el resultado)
        const respuesta = await fetch(`${API_URL}/certificaciones/por-vencer?dias=${dias}`);
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarErrorServidor(datos);
            return;
        }

        textoResumen.textContent = `${datos.length} certificación(es) vencen en los próximos ${dias} días`;
        mostrarCertificaciones(datos);
    } catch (error) {
        console.log(error);
        mostrarErrorConexion();
    }
}


function mostrarCertificaciones(certificaciones) {
    listaCertificaciones.innerHTML = "";

    if (certificaciones.length === 0) {
        listaCertificaciones.innerHTML = '<li class="lista-vacia">Ninguna certificación vence en ese periodo.</li>';
        return;
    }

    certificaciones.forEach(certificacion => {
        const fecha = certificacion.vigencia.fechaExpiracion;
        const faltan = diasRestantes(fecha);

        const fila = document.createElement("li");
        fila.classList.add("fila");
        fila.innerHTML = `
            <div class="fila-info">
                <p class="fila-titulo">${escaparHTML(certificacion.nombre)}</p>
                <p class="fila-detalle">${escaparHTML(certificacion.institucion)} · Vence el ${formatearFecha(fecha)}</p>
            </div>
            <span class="etiqueta alerta">Faltan ${faltan} día(s)</span>
        `;
        listaCertificaciones.appendChild(fila);
    });
}


// ---------- Eventos ----------

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    consultar();
});

// Al abrir la página se consulta con el valor por defecto (90 días)
consultar();
