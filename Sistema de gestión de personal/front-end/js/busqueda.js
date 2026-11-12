// =====================================================================
// Búsqueda por tecnologías y certificaciones (busqueda.html)
// Endpoints: GET /proyectos/tecnologias, GET /certificaciones/opciones
//            GET /empleados/busqueda?tecnologias=...&certificaciones=...
// =====================================================================

// ---------- Elementos del HTML ----------
const formulario = document.getElementById("frmBusqueda");
const contenedorTecnologias = document.getElementById("contTecnologias");
const contenedorCertificaciones = document.getElementById("contCertificaciones");
const textoResumen = document.getElementById("txtResumen");
const listaResultados = document.getElementById("lstResultados");

// Mensaje que aparece si no se marcó ninguna casilla
const mensajeError = document.getElementById("errBusqueda");


// ---------------------------------------------------------------------
// Crear una casilla (checkbox) con su etiqueta
//   nombreGrupo: "tecnologia" o "certificacion" (para encontrarlas después)
// ---------------------------------------------------------------------
function crearCasilla(nombreGrupo, valor, indice) {
    const id = `${nombreGrupo}-${indice}`;

    const etiqueta = document.createElement("label");
    etiqueta.classList.add("casilla");
    etiqueta.setAttribute("for", id);

    const casilla = document.createElement("input");
    casilla.type = "checkbox";
    casilla.id = id;
    casilla.name = nombreGrupo;
    casilla.value = valor;

    etiqueta.appendChild(casilla);
    etiqueta.append(" " + valor);   // append agrega el texto sin interpretar HTML
    return etiqueta;
}


// ---------------------------------------------------------------------
// Cargar las tecnologías registradas en los proyectos
// ---------------------------------------------------------------------
async function mostrarTecnologias() {
    try {
        const respuesta = await fetch(`${API_URL}/proyectos/tecnologias`);
        const tecnologias = await respuesta.json();

        contenedorTecnologias.innerHTML = "";
        if (tecnologias.length === 0) {
            contenedorTecnologias.textContent = "No hay proyectos registrados.";
            return;
        }

        tecnologias.forEach((tecnologia, indice) => {
            contenedorTecnologias.appendChild(crearCasilla("tecnologia", tecnologia, indice));
        });
    } catch (error) {
        console.log(error);
        mostrarErrorConexion();
    }
}


// ---------------------------------------------------------------------
// Cargar los nombres de las certificaciones (sin repetir)
// ---------------------------------------------------------------------
async function mostrarCertificaciones() {
    try {
        const respuesta = await fetch(`${API_URL}/certificaciones/opciones`);
        const certificaciones = await respuesta.json();

        // Puede haber dos certificaciones con el mismo nombre (de distintas
        // instituciones). La búsqueda es por nombre, así que se muestra una vez.
        const nombres = [];
        certificaciones.forEach(certificacion => {
            if (!nombres.includes(certificacion.nombre)) {
                nombres.push(certificacion.nombre);
            }
        });

        contenedorCertificaciones.innerHTML = "";
        if (nombres.length === 0) {
            contenedorCertificaciones.textContent = "No hay certificaciones registradas.";
            return;
        }

        nombres.forEach((nombre, indice) => {
            contenedorCertificaciones.appendChild(crearCasilla("certificacion", nombre, indice));
        });
    } catch (error) {
        console.log(error);
        mostrarErrorConexion();
    }
}


// Devuelve los valores de las casillas marcadas de un grupo
function obtenerMarcadas(nombreGrupo) {
    // :checked selecciona solo las casillas marcadas
    const marcadas = document.querySelectorAll(`input[name="${nombreGrupo}"]:checked`);

    const valores = [];
    marcadas.forEach(casilla => valores.push(casilla.value));
    return valores;
}


// ---------------------------------------------------------------------
// Buscar en el servidor
// ---------------------------------------------------------------------
async function buscar() {
    const tecnologias = obtenerMarcadas("tecnologia");
    const certificaciones = obtenerMarcadas("certificacion");

    // Validar: al menos UNA casilla en total (tecnología, certificación o ambas)
    if (tecnologias.length === 0 && certificaciones.length === 0) {
        mensajeError.classList.remove("oculto");
        textoResumen.textContent = "";
        listaResultados.innerHTML = "";
        return;
    }
    mensajeError.classList.add("oculto");

    // Armar la URL solo con los grupos que tienen casillas marcadas.
    // Las listas viajan separadas por comas: ?tecnologias=react,node.js
    const parametros = [];
    if (tecnologias.length > 0) {
        parametros.push("tecnologias=" + encodeURIComponent(tecnologias.join(",")));
    }
    if (certificaciones.length > 0) {
        parametros.push("certificaciones=" + encodeURIComponent(certificaciones.join(",")));
    }

    // join("&") une los parámetros: "tecnologias=react&certificaciones=scrum%20master"
    const url = `${API_URL}/empleados/busqueda?${parametros.join("&")}`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarErrorServidor(datos);
            return;
        }

        // datos = { total: 2, empleados: [...] }
        textoResumen.textContent = `Se encontraron ${datos.total} empleado(s)`;
        mostrarResultados(datos.empleados);
    } catch (error) {
        console.log(error);
        mostrarErrorConexion();
    }
}


function mostrarResultados(empleados) {
    listaResultados.innerHTML = "";

    if (empleados.length === 0) {
        listaResultados.innerHTML = '<li class="lista-vacia">Ningún empleado cumple todas las condiciones.</li>';
        return;
    }

    empleados.forEach(empleado => {
        // Proyectos que cumplieron el filtro (el servidor ya los filtró con populate + match)
        let etiquetasProyectos = "";
        empleado.proyectos.forEach(proyecto => {
            etiquetasProyectos += `<span class="etiqueta"><i class="fa-solid fa-diagram-project" aria-hidden="true"></i> ${escaparHTML(proyecto.nombre)}</span>`;
        });

        let etiquetasCertificaciones = "";
        empleado.certificaciones.forEach(certificacion => {
            etiquetasCertificaciones += `<span class="etiqueta"><i class="fa-solid fa-award" aria-hidden="true"></i> ${escaparHTML(certificacion.nombre)}</span>`;
        });

        const fila = document.createElement("li");
        fila.classList.add("fila");
        fila.innerHTML = `
            <div class="fila-info">
                <p class="fila-titulo">${escaparHTML(empleado.nombre)}</p>
                <p class="fila-detalle">${escaparHTML(empleado.correo)}</p>
                <div>${etiquetasProyectos}${etiquetasCertificaciones}</div>
            </div>
        `;
        listaResultados.appendChild(fila);
    });
}


// ---------- Eventos ----------

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    buscar();
});

// "Limpiar": desmarca las casillas (lo hace el navegador) y borra los resultados
formulario.addEventListener("reset", () => {
    mensajeError.classList.add("oculto");
    textoResumen.textContent = "";
    listaResultados.innerHTML = "";
});

mostrarTecnologias();
mostrarCertificaciones();
