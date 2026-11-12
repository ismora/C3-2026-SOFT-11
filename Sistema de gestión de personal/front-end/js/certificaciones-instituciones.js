// =====================================================================
// Instituciones con más certificaciones (certificaciones-instituciones.html)
// Endpoint: GET /certificaciones/top-instituciones/:top
// =====================================================================

// ---------- Elementos del HTML ----------
const formulario = document.getElementById("frmFiltro");
const inputTop = document.getElementById("txtTop");
const textoResumen = document.getElementById("txtResumen");
const listaInstituciones = document.getElementById("lstInstituciones");


// ---------------------------------------------------------------------
// Consultar al servidor
// ---------------------------------------------------------------------
async function consultar() {
    const top = Number(inputTop.value);

    const esInvalido = !Number.isInteger(top) || top <= 0;
    marcarCampo(inputTop, esInvalido);
    if (esInvalido) {
        inputTop.focus();
        return;
    }

    try {
        // /5 → parámetro de RUTA
        const respuesta = await fetch(`${API_URL}/certificaciones/top-instituciones/${top}`);
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarErrorServidor(datos);
            return;
        }

        // datos = [{ _id: "Amazon", cantidadCertificaciones: 4 }, ...]
        textoResumen.textContent = `Las ${datos.length} instituciones con más certificaciones registradas`;
        mostrarInstituciones(datos);
    } catch (error) {
        console.log(error);
        mostrarErrorConexion();
    }
}


function mostrarInstituciones(instituciones) {
    listaInstituciones.innerHTML = "";

    if (instituciones.length === 0) {
        listaInstituciones.innerHTML = '<li class="lista-vacia">Todavía no hay certificaciones registradas.</li>';
        return;
    }

    // La primera es la que tiene más certificaciones (el servidor las ordena)
    const maximo = instituciones[0].cantidadCertificaciones;

    instituciones.forEach((institucion, indice) => {
        const cantidad = institucion.cantidadCertificaciones;
        const porcentaje = Math.round((cantidad / maximo) * 100);

        const fila = document.createElement("li");
        fila.classList.add("fila");
        fila.innerHTML = `
            <div class="fila-info">
                <p class="fila-titulo">${indice + 1}. ${escaparHTML(institucion._id)}</p>
                <p class="fila-detalle">${cantidad} certificación(es)</p>
                <div class="barra" aria-hidden="true"></div>
            </div>
        `;

        // El ancho de la barra es proporcional a la cantidad
        fila.querySelector(".barra").style.width = porcentaje + "%";

        listaInstituciones.appendChild(fila);
    });
}


// ---------- Eventos ----------

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    consultar();
});

consultar();
