// =====================================================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// =====================================================================
// getElementById("id")        → busca UN elemento por su id (sin #)
// querySelector("selector")   → busca el PRIMER elemento que cumpla el selector de CSS
//                               (#id, .clase, etiqueta, [atributo]...)
// querySelectorAll("selector")→ busca TODOS los elementos que cumplan el selector
//                               (devuelve una lista que se recorre con for...of)

// --- Formulario y botones ---
const formSolicitud = document.getElementById("formSolicitud");
const btnRevisar = document.getElementById("btnRevisar");
const btnEnviar = document.querySelector("#btnEnviar");     // con querySelector el id lleva #
const btnLimpiar = document.querySelector("#btnLimpiar");

// --- Sección 1: datos del solicitante ---
const inputNombre = document.getElementById("nombre");
const inputApellidos = document.getElementById("apellidos");
const selectTipoIdentificacion = document.getElementById("tipoIdentificacion");
const inputIdentificacion = document.getElementById("identificacion");
const textoAyudaIdentificacion = document.getElementById("ayuda-identificacion");
const selectTipoUsuario = document.getElementById("tipoUsuario");
const contenedorTipoUsuario = document.getElementById("contenedorTipoUsuario");

// --- Sección 2: contacto ---
const inputCorreo = document.querySelector("#correo");
const inputTelefono = document.querySelector("#telefono");
const selectProvincia = document.querySelector("#provincia");

// --- Sección 3: centro educativo ---
const inputNombreCentro = document.getElementById("nombreCentro");
const inputCodigo = document.getElementById("codigoInstitucional");
const inputCantidad = document.getElementById("cantidadEstudiantes");
// Todos los checkbox cuyo atributo name sea "niveles"
const checkboxesNiveles = document.querySelectorAll('input[name="niveles"]');

// --- Sección 4: configuración del censo ---
const inputNombreCenso = document.getElementById("nombreCenso");
const inputFechaApertura = document.getElementById("fechaApertura");
const inputFechaCierre = document.getElementById("fechaCierre");
const selectFormularios = document.getElementById("formularios");
const contenedorBadges = document.getElementById("contenedorBadges");
const inputDescripcion = document.getElementById("descripcion");
const textoContador = document.getElementById("contador-descripcion");

// --- Sección 5: responsables adicionales ---
const listaResponsables = document.getElementById("listaResponsables");
const btnAgregarResponsable = document.getElementById("btnAgregarResponsable");

// --- Sección 6: confirmación ---
const switchPlantilla = document.getElementById("guardarPlantilla");
const contenedorPlantilla = document.getElementById("contenedorPlantilla");
const inputNombrePlantilla = document.getElementById("nombrePlantilla");
const checkTerminos = document.getElementById("terminos");

// --- Barra de progreso ---
const contenedorProgreso = document.getElementById("barraProgreso");
const barraProgreso = document.querySelector(".progress-bar");      // por clase
const textoPorcentaje = document.getElementById("porcentajeProgreso");

// --- Modal de Bootstrap ---
const modalRevision = new bootstrap.Modal(document.getElementById("modalRevision"));
const cuerpoModal = document.getElementById("modalRevisionCuerpo");
const btnConfirmarEnvio = document.getElementById("btnConfirmarEnvio");


// =====================================================================
// 2. EXPRESIONES REGULARES Y VARIABLES GENERALES
// =====================================================================
// ^ = inicio del texto, $ = final del texto
// \d = un dígito, {n,m} = entre n y m veces, ? = opcional, [ ] = caracteres permitidos

const regexNombre = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{2,40}$/;  // letras (con tildes y ñ) y espacios
const regexCedula = /^[1-9]-?\d{4}-?\d{4}$/;           // 1-2345-6789 o 123456789
const regexDimex = /^\d{11,12}$/;                      // 11 o 12 dígitos
const regexPasaporte = /^[A-Za-z0-9]{6,12}$/;          // de 6 a 12 letras o números
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;   // algo@algo.algo
const regexTelefono = /^[245678]\d{3}-?\d{4}$/;        // 8 dígitos, inicia con 2, 4, 5, 6, 7 u 8
const regexCodigo = /^\d{4,5}$/;                       // 4 o 5 dígitos

const MAX_RESPONSABLES = 3;     // máximo de responsables adicionales
let numeroResponsable = 0;      // sirve para crear id únicos en cada fila nueva

let listaErrores = [];          // aquí se guardan los errores de la última validación
let seIntentoEnviar = false;    // después del primer intento, se valida mientras se escribe


// =====================================================================
// 3. FUNCIONES PARA MARCAR LOS CAMPOS
// =====================================================================

// Marca un campo con error: borde rojo, mensaje debajo y lo agrega a la lista
function marcarError(input, etiqueta, mensaje) {
    input.classList.add("is-invalid");        // clase de Bootstrap: borde rojo
    input.classList.remove("is-valid");

    // Cada campo tiene un <div id="error-..."> para su mensaje
    const divError = document.getElementById("error-" + input.id);
    divError.textContent = mensaje;
    divError.classList.add("d-block");        // d-block obliga a que el mensaje se vea

    // Se guarda el error para mostrarlo luego en el modal o en SweetAlert
    listaErrores.push({ campo: input, etiqueta: etiqueta, mensaje: mensaje });
}

// Marca un campo como correcto: borde verde y sin mensaje
function marcarCorrecto(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");          // clase de Bootstrap: borde verde

    const divError = document.getElementById("error-" + input.id);
    divError.textContent = "";
    divError.classList.remove("d-block");
}


// =====================================================================
// 4. FUNCIONES DE VALIDACIÓN
// =====================================================================
// Mensajes de error USABLES: dicen qué está mal y cómo corregirlo.
//   ✘ "Campo inválido"
//   ✔ "El teléfono tiene 8 dígitos e inicia con 2, 4, 5, 6, 7 u 8. Ej.: 8888-1234."

// --- Valida un campo de texto con una expresión regular ---
function validarConRegex(input, etiqueta, regex, mensajeVacio, mensajeFormato) {
    const valor = input.value.trim();          // trim() quita los espacios de los extremos

    if (valor === "") {
        marcarError(input, etiqueta, mensajeVacio);
    } else if (regex.test(valor) === false) {  // test() devuelve true si el texto cumple el patrón
        marcarError(input, etiqueta, mensajeFormato);
    } else {
        marcarCorrecto(input);
    }
}

// --- Valida que un texto tenga una cantidad mínima de caracteres ---
function validarLargo(input, etiqueta, minimo, mensajeVacio) {
    const largo = input.value.trim().length;

    if (largo === 0) {
        marcarError(input, etiqueta, mensajeVacio);
    } else if (largo < minimo) {
        marcarError(input, etiqueta, "Debe tener al menos " + minimo + " caracteres (lleva " + largo + ").");
    } else {
        marcarCorrecto(input);
    }
}

// --- Valida que se haya elegido una opción de un select ---
function validarSeleccion(select, etiqueta, mensaje) {
    if (select.value === "") {
        marcarError(select, etiqueta, mensaje);
    } else {
        marcarCorrecto(select);
    }
}

// --- Identificación: el formato depende del tipo elegido ---
function validarIdentificacion() {
    const tipo = selectTipoIdentificacion.value;
    let regex;
    let mensaje;

    if (tipo === "fisica") {
        regex = regexCedula;
        mensaje = "La cédula física tiene 9 dígitos y no inicia con 0. Ej.: 1-2345-6789.";
    } else if (tipo === "dimex") {
        regex = regexDimex;
        mensaje = "El DIMEX tiene 11 o 12 dígitos, sin guiones.";
    } else {
        regex = regexPasaporte;
        mensaje = "El pasaporte tiene de 6 a 12 letras o números, sin espacios.";
    }

    validarConRegex(inputIdentificacion, "Identificación", regex, "Escriba su número de identificación.", mensaje);
}

// --- Cantidad de estudiantes: número entre 1 y 5000 ---
function validarCantidad() {
    const cantidad = Number(inputCantidad.value);   // el valor de un input siempre es texto

    if (inputCantidad.value === "") {
        marcarError(inputCantidad, "Cantidad de estudiantes", "Indique la cantidad de estudiantes.");
    } else if (cantidad < 1 || cantidad > 5000 || Number.isInteger(cantidad) === false) {
        marcarError(inputCantidad, "Cantidad de estudiantes", "Debe ser un número entero entre 1 y 5000.");
    } else {
        marcarCorrecto(inputCantidad);
    }
}

// --- Niveles: al menos un checkbox marcado ---
function validarNiveles() {
    // :checked selecciona solo los checkbox que están marcados
    const nivelesMarcados = document.querySelectorAll('input[name="niveles"]:checked');
    const divError = document.getElementById("error-niveles");

    if (nivelesMarcados.length === 0) {
        // Se recorren todos los checkbox para marcarlos en rojo
        for (const checkbox of checkboxesNiveles) {
            checkbox.classList.add("is-invalid");
        }
        divError.textContent = "Marque al menos un nivel que atiende el centro.";
        divError.classList.add("d-block");
        listaErrores.push({ campo: checkboxesNiveles[0], etiqueta: "Niveles que atiende", mensaje: "Marque al menos un nivel." });
    } else {
        for (const checkbox of checkboxesNiveles) {
            checkbox.classList.remove("is-invalid");
        }
        divError.textContent = "";
        divError.classList.remove("d-block");
    }
}

// --- Fechas: la apertura desde hoy y el cierre después de la apertura ---
function validarFechas() {
    const hoy = obtenerFechaHoy();                 // texto con formato "2026-10-13"
    const apertura = inputFechaApertura.value;     // los input date también usan "AAAA-MM-DD"
    const cierre = inputFechaCierre.value;

    // Con este formato, las fechas se pueden comparar como texto con < y >
    if (apertura === "") {
        marcarError(inputFechaApertura, "Fecha de apertura", "Seleccione la fecha de apertura.");
    } else if (apertura < hoy) {
        marcarError(inputFechaApertura, "Fecha de apertura", "La fecha de apertura no puede ser anterior a hoy.");
    } else {
        marcarCorrecto(inputFechaApertura);
    }

    if (cierre === "") {
        marcarError(inputFechaCierre, "Fecha de cierre", "Seleccione la fecha de cierre.");
    } else if (apertura !== "" && cierre <= apertura) {
        marcarError(inputFechaCierre, "Fecha de cierre", "La fecha de cierre debe ser posterior a la de apertura.");
    } else {
        marcarCorrecto(inputFechaCierre);
    }
}

// --- Formularios del censo: al menos una opción seleccionada ---
function validarFormularios() {
    // En un select, :checked selecciona las opciones elegidas
    const opcionesElegidas = document.querySelectorAll("#formularios option:checked");

    if (opcionesElegidas.length === 0) {
        marcarError(selectFormularios, "Formularios del censo", "Seleccione al menos un formulario para el censo.");
    } else {
        marcarCorrecto(selectFormularios);
    }
}

// --- Responsables: se validan solo las filas que existan ---
function validarResponsables() {
    // Estos inputs se crean con JS; por eso se buscan cada vez que se valida
    const inputsNombre = document.querySelectorAll(".responsable-nombre");
    const inputsCorreo = document.querySelectorAll(".responsable-correo");

    for (const input of inputsNombre) {
        validarConRegex(input, "Nombre del responsable", regexNombre,
            "Escriba el nombre del responsable o quite la fila.",
            "El nombre solo puede tener letras y espacios.");
    }

    for (const input of inputsCorreo) {
        validarConRegex(input, "Correo del responsable", regexCorreo,
            "Escriba el correo del responsable o quite la fila.",
            "Revise el correo: debe tener el formato nombre@dominio.com.");
    }
}

// --- Términos: el checkbox debe estar marcado ---
function validarTerminos() {
    if (checkTerminos.checked) {
        marcarCorrecto(checkTerminos);
    } else {
        marcarError(checkTerminos, "Confirmación", "Debe confirmar que la información es correcta.");
    }
}

// --- Valida TODO el formulario. Devuelve true si no hay errores ---
function validarFormulario() {
    listaErrores = [];     // se vacía la lista antes de validar otra vez

    // Sección 1
    validarConRegex(inputNombre, "Nombre", regexNombre,
        "Escriba su nombre.", "El nombre solo puede tener letras y espacios (mínimo 2).");
    validarConRegex(inputApellidos, "Apellidos", regexNombre,
        "Escriba sus apellidos.", "Los apellidos solo pueden tener letras y espacios.");
    validarIdentificacion();
    validarSeleccion(selectTipoUsuario, "Tipo de usuario", "Seleccione su tipo de usuario.");

    // Este campo solo existe si se eligió "Otro" (se crea con JS)
    const inputOtro = document.getElementById("otroTipoUsuario");
    if (inputOtro !== null) {
        validarLargo(inputOtro, "Especifique su tipo de usuario", 3, "Indique su tipo de usuario.");
    }

    // Sección 2
    validarConRegex(inputCorreo, "Correo", regexCorreo,
        "Escriba su correo electrónico.", "Revise el correo: debe tener el formato nombre@dominio.com.");
    validarConRegex(inputTelefono, "Teléfono", regexTelefono,
        "Escriba un número de teléfono.", "El teléfono tiene 8 dígitos e inicia con 2, 4, 5, 6, 7 u 8. Ej.: 8888-1234.");
    validarSeleccion(selectProvincia, "Provincia", "Seleccione la provincia.");

    // Sección 3
    validarLargo(inputNombreCentro, "Centro educativo", 3, "Escriba el nombre del centro educativo.");
    validarConRegex(inputCodigo, "Código institucional", regexCodigo,
        "Escriba el código institucional.", "El código institucional tiene 4 o 5 dígitos. Ej.: 4021.");
    validarCantidad();
    validarNiveles();

    // Sección 4
    validarLargo(inputNombreCenso, "Nombre del censo", 5, "Escriba el nombre del censo.");
    validarFechas();
    validarFormularios();
    validarLargo(inputDescripcion, "Justificación", 20, "Escriba la justificación de la solicitud.");

    // Sección 5
    validarResponsables();

    // Sección 6
    if (switchPlantilla.checked) {
        validarLargo(inputNombrePlantilla, "Nombre de la plantilla", 3, "Escriba un nombre para la plantilla.");
    }
    validarTerminos();

    // Si la lista quedó vacía, el formulario es válido
    return listaErrores.length === 0;
}


// =====================================================================
// 5. ELEMENTOS QUE CAMBIAN CON JS
// =====================================================================

// --- Cambia el placeholder y la ayuda según el tipo de identificación ---
function cambiarTipoIdentificacion() {
    const tipo = selectTipoIdentificacion.value;

    if (tipo === "fisica") {
        inputIdentificacion.placeholder = "Ej. 1-2345-6789";
        textoAyudaIdentificacion.textContent = "9 dígitos, con o sin guiones.";
    } else if (tipo === "dimex") {
        inputIdentificacion.placeholder = "Ej. 155812345678";
        textoAyudaIdentificacion.textContent = "11 o 12 dígitos, sin guiones.";
    } else {
        inputIdentificacion.placeholder = "Ej. A12345678";
        textoAyudaIdentificacion.textContent = "De 6 a 12 letras o números.";
    }

    inputIdentificacion.value = "";     // se borra porque el formato cambió
}

// --- Si el tipo de usuario es "Otro", se CREA un campo nuevo; si no, se ELIMINA ---
function mostrarCampoOtro() {
    // Si no existe, getElementById devuelve null
    const contenedorOtro = document.getElementById("contenedorOtro");

    if (selectTipoUsuario.value === "otro") {
        if (contenedorOtro === null) {       // solo se crea si todavía no existe
            const nuevoContenedor = document.createElement("div");
            nuevoContenedor.id = "contenedorOtro";
            nuevoContenedor.className = "col-12 col-lg-4 aparecer";

            // innerHTML solo con texto escrito por nosotros, nunca con datos del usuario
            nuevoContenedor.innerHTML = `
                <label for="otroTipoUsuario" class="form-label">
                    Especifique su tipo de usuario <span class="obligatorio" aria-hidden="true">*</span>
                </label>
                <input type="text" id="otroTipoUsuario" class="form-control" placeholder="Ej. Orientador(a)"
                    required aria-describedby="error-otroTipoUsuario">
                <div class="invalid-feedback" id="error-otroTipoUsuario"></div>`;

            // after() inserta el elemento nuevo justo después del contenedor del select
            contenedorTipoUsuario.after(nuevoContenedor);
            document.getElementById("otroTipoUsuario").focus();
        }
    } else if (contenedorOtro !== null) {
        contenedorOtro.remove();             // se elimina del DOM
    }
}

// --- Teléfono: deja solo números y agrega el guion: 88881234 → 8888-1234 ---
function formatearTelefono() {
    // /\D/g = todo lo que NO es dígito; se reemplaza por "" (se elimina)
    let numeros = inputTelefono.value.replace(/\D/g, "");
    numeros = numeros.slice(0, 8);           // máximo 8 dígitos

    if (numeros.length > 4) {
        inputTelefono.value = numeros.slice(0, 4) + "-" + numeros.slice(4);
    } else {
        inputTelefono.value = numeros;
    }
}

// --- Código institucional: solo permite números ---
function permitirSoloNumeros() {
    inputCodigo.value = inputCodigo.value.replace(/\D/g, "");
}

// --- La fecha de cierre no puede ser anterior a la de apertura ---
function actualizarFechaMinima() {
    inputFechaCierre.min = inputFechaApertura.value;
}

// --- Contador de caracteres que cambia de color con clases ---
function actualizarContador() {
    const largo = inputDescripcion.value.length;
    textoContador.textContent = largo + " / 500";

    // Primero se quitan las tres clases y luego se agrega la que corresponda
    textoContador.classList.remove("text-success", "text-warning", "text-danger");

    if (largo >= 480) {
        textoContador.classList.add("text-danger");      // casi lleno
    } else if (largo >= 400) {
        textoContador.classList.add("text-warning");
    } else if (largo >= 20) {
        textoContador.classList.add("text-success");     // ya cumple el mínimo
    }
}

// --- Crea una insignia (badge) por cada formulario seleccionado ---
function mostrarBadges() {
    const opcionesElegidas = document.querySelectorAll("#formularios option:checked");

    contenedorBadges.innerHTML = "";         // se borran las insignias anteriores

    if (opcionesElegidas.length === 0) {
        const mensaje = document.createElement("span");
        mensaje.className = "text-secondary small";
        mensaje.textContent = "Ningún formulario seleccionado.";
        contenedorBadges.appendChild(mensaje);
    } else {
        for (const opcion of opcionesElegidas) {
            const badge = document.createElement("span");      // 1. crear
            badge.classList.add("badge", "badge-formulario");  // 2. dar clases
            badge.textContent = opcion.textContent;            // 3. dar texto
            contenedorBadges.appendChild(badge);               // 4. agregar a la página
        }
    }
}

// --- Agrega una fila con nombre y correo de un responsable ---
function agregarResponsable() {
    numeroResponsable++;                     // número único para los id de esta fila
    const n = numeroResponsable;

    const fila = document.createElement("div");
    fila.classList.add("fila-responsable", "row", "g-2", "align-items-start", "aparecer");

    fila.innerHTML = `
        <div class="col-12 col-md-5">
            <label for="responsable${n}Nombre" class="form-label small">
                Nombre completo <span class="obligatorio" aria-hidden="true">*</span>
            </label>
            <input type="text" id="responsable${n}Nombre" class="form-control form-control-sm responsable-nombre"
                required aria-describedby="error-responsable${n}Nombre">
            <div class="invalid-feedback" id="error-responsable${n}Nombre"></div>
        </div>
        <div class="col-12 col-md-5">
            <label for="responsable${n}Correo" class="form-label small">
                Correo <span class="obligatorio" aria-hidden="true">*</span>
            </label>
            <input type="email" id="responsable${n}Correo" class="form-control form-control-sm responsable-correo"
                required aria-describedby="error-responsable${n}Correo">
            <div class="invalid-feedback" id="error-responsable${n}Correo"></div>
        </div>
        <div class="col-12 col-md-2 d-grid">
            <button type="button" class="btn btn-sm btn-outline-danger mt-md-4">
                <i class="fa-solid fa-trash" aria-hidden="true"></i> Quitar
            </button>
        </div>`;

    listaResponsables.appendChild(fila);

    // El botón "Quitar" se busca DENTRO de esta fila (fila.querySelector)
    const btnQuitar = fila.querySelector("button");
    btnQuitar.addEventListener("click", function () {
        fila.remove();                       // elimina la fila completa
        actualizarBotonResponsables();
        actualizarProgreso();
    });

    actualizarBotonResponsables();
    actualizarProgreso();
    document.getElementById("responsable" + n + "Nombre").focus();
}

// --- Desactiva el botón "Agregar" cuando se llega al máximo ---
function actualizarBotonResponsables() {
    const cantidadFilas = document.querySelectorAll(".fila-responsable").length;

    if (cantidadFilas >= MAX_RESPONSABLES) {
        btnAgregarResponsable.disabled = true;
    } else {
        btnAgregarResponsable.disabled = false;
    }
}

// --- Muestra u oculta el campo "Nombre de la plantilla" ---
function mostrarCampoPlantilla() {
    if (switchPlantilla.checked) {
        contenedorPlantilla.classList.remove("d-none");   // d-none oculta el elemento
        inputNombrePlantilla.required = true;
        switchPlantilla.setAttribute("aria-expanded", "true");
        inputNombrePlantilla.focus();
    } else {
        contenedorPlantilla.classList.add("d-none");
        inputNombrePlantilla.required = false;
        inputNombrePlantilla.value = "";
        inputNombrePlantilla.classList.remove("is-invalid", "is-valid");
        document.getElementById("error-nombrePlantilla").textContent = "";
        switchPlantilla.setAttribute("aria-expanded", "false");
    }
}

// --- Barra de progreso: porcentaje de campos obligatorios completos ---
function actualizarProgreso() {
    // [required] selecciona los elementos que tienen el atributo required
    const camposObligatorios = document.querySelectorAll("#formSolicitud [required]");
    let completos = 0;

    for (const campo of camposObligatorios) {
        if (campo.type === "checkbox") {
            if (campo.checked) {
                completos++;
            }
        } else if (campo.value.trim() !== "") {
            completos++;
        }
    }

    const porcentaje = Math.round(completos / camposObligatorios.length * 100);

    barraProgreso.style.width = porcentaje + "%";
    textoPorcentaje.textContent = porcentaje + " %";
    contenedorProgreso.setAttribute("aria-valuenow", porcentaje);

    // Color según el avance
    barraProgreso.classList.remove("bg-danger", "bg-warning", "bg-success");
    if (porcentaje === 100) {
        barraProgreso.classList.add("bg-success");
    } else if (porcentaje >= 50) {
        barraProgreso.classList.add("bg-warning");
    } else {
        barraProgreso.classList.add("bg-danger");
    }
}

// --- Devuelve la fecha de hoy con el formato "AAAA-MM-DD" ---
function obtenerFechaHoy() {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");   // los meses empiezan en 0
    const dia = String(hoy.getDate()).padStart(2, "0");
    return anio + "-" + mes + "-" + dia;
}


// =====================================================================
// 6. LISTAS PARA LOS MENSAJES (se usan en el modal y en SweetAlert)
// =====================================================================

// Crea una lista <ul> con los errores encontrados
function crearListaErrores() {
    const lista = document.createElement("ul");
    lista.className = "text-start mb-0";

    for (const error of listaErrores) {
        const item = document.createElement("li");
        const negrita = document.createElement("strong");
        negrita.textContent = error.etiqueta + ": ";

        item.appendChild(negrita);
        item.append(error.mensaje);          // agrega el texto después de la negrita
        lista.appendChild(item);
    }
    return lista;
}

// Crea una lista con el resumen de los datos escritos
function crearResumen() {
    // Tipo de usuario: si eligió "Otro", se toma lo que escribió
    let tipoUsuario = selectTipoUsuario.value;
    if (tipoUsuario === "otro") {
        tipoUsuario = document.getElementById("otroTipoUsuario").value;
    }

    // Niveles marcados, separados por coma
    const nivelesMarcados = document.querySelectorAll('input[name="niveles"]:checked');
    const niveles = [];
    for (const nivel of nivelesMarcados) {
        niveles.push(nivel.value);
    }

    // Formularios elegidos, separados por coma
    const opcionesElegidas = document.querySelectorAll("#formularios option:checked");
    const formularios = [];
    for (const opcion of opcionesElegidas) {
        formularios.push(opcion.textContent);
    }

    // Cada dato es un arreglo: [título, valor]
    const datos = [
        ["Solicitante", inputNombre.value + " " + inputApellidos.value],
        ["Identificación", inputIdentificacion.value],
        ["Tipo de usuario", tipoUsuario],
        ["Correo", inputCorreo.value],
        ["Teléfono", "+506 " + inputTelefono.value],
        ["Provincia", selectProvincia.value],
        ["Centro educativo", inputNombreCentro.value + " (#" + inputCodigo.value + ")"],
        ["Estudiantes", inputCantidad.value],
        ["Niveles", niveles.join(", ")],
        ["Censo", inputNombreCenso.value],
        ["Período", inputFechaApertura.value + " al " + inputFechaCierre.value],
        ["Formularios", formularios.join(", ")],
        ["Responsables adicionales", document.querySelectorAll(".fila-responsable").length]
    ];

    const lista = document.createElement("ul");
    lista.className = "list-group";

    for (const dato of datos) {
        const item = document.createElement("li");
        item.className = "list-group-item";

        const titulo = document.createElement("strong");
        titulo.textContent = dato[0] + ": ";

        item.appendChild(titulo);
        item.append(dato[1]);
        lista.appendChild(item);
    }
    return lista;
}


// =====================================================================
// 7. MODAL DE BOOTSTRAP: botón "Revisar datos"
// =====================================================================
function revisarDatos() {
    seIntentoEnviar = true;
    const esValido = validarFormulario();

    cuerpoModal.innerHTML = "";              // se borra el contenido anterior del modal

    const aviso = document.createElement("div");

    if (esValido) {
        aviso.className = "alert alert-success";
        aviso.textContent = "Todos los datos son correctos. Revíselos antes de enviar.";
        cuerpoModal.appendChild(aviso);
        cuerpoModal.appendChild(crearResumen());

        btnConfirmarEnvio.classList.remove("d-none");   // se muestra el botón "Confirmar"
    } else {
        aviso.className = "alert alert-danger";
        aviso.textContent = "Hay " + listaErrores.length + " errores en el formulario:";
        cuerpoModal.appendChild(aviso);
        cuerpoModal.appendChild(crearListaErrores());

        btnConfirmarEnvio.classList.add("d-none");      // se oculta el botón "Confirmar"
    }

    modalRevision.show();                    // abre el modal
}

function confirmarDesdeModal() {
    modalRevision.hide();                    // cierra el modal
    registrarSolicitud();
}


// =====================================================================
// 8. SWEETALERT2: botones "Enviar" y "Limpiar"
// =====================================================================
function enviarSolicitud() {
    seIntentoEnviar = true;
    const esValido = validarFormulario();

    if (esValido === false) {
        Swal.fire({
            icon: "error",
            title: "Hay " + listaErrores.length + " campo(s) por corregir",
            html: crearListaErrores(),       // SweetAlert acepta un elemento creado con JS
            confirmButtonText: "Ir al primer error",
            confirmButtonColor: "#164a98",
            returnFocus: false               // el foco lo movemos nosotros (ver abajo)
        }).then(function () {
            // .then se ejecuta cuando la persona cierra el mensaje.
            // Se busca el primer campo marcado con error y se le da el foco.
            const primerError = document.querySelector("#formSolicitud .is-invalid");
            primerError.focus();
        });
    } else {
        registrarSolicitud();
    }
}

function registrarSolicitud() {
    // Más adelante, aquí se enviarán los datos al servidor con fetch
    Swal.fire({
        icon: "success",
        title: "Solicitud enviada",
        text: "Recibirá un correo de confirmación con el número de trámite.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#00734a"
    }).then(function () {
        limpiarFormulario();
    });
}

// Pide confirmación antes de borrar todo
function confirmarLimpiar(evento) {
    evento.preventDefault();                 // evita que el botón reset borre de inmediato

    Swal.fire({
        icon: "warning",
        title: "¿Limpiar el formulario?",
        text: "Se borrarán todos los datos que ha escrito.",
        showCancelButton: true,
        confirmButtonText: "Sí, limpiar",
        cancelButtonText: "No, conservar",
        confirmButtonColor: "#d2232a",
        focusCancel: true                    // la opción segura queda seleccionada
    }).then(function (resultado) {
        if (resultado.isConfirmed) {
            limpiarFormulario();
        }
    });
}

// Deja el formulario como al inicio
function limpiarFormulario() {
    formSolicitud.reset();                   // borra los valores de todos los campos
    seIntentoEnviar = false;
    listaErrores = [];

    // Quitar los bordes rojos y verdes
    const camposMarcados = document.querySelectorAll(".is-invalid, .is-valid");
    for (const campo of camposMarcados) {
        campo.classList.remove("is-invalid", "is-valid");
    }

    // Borrar los mensajes de error
    const mensajes = document.querySelectorAll(".invalid-feedback");
    for (const mensaje of mensajes) {
        mensaje.textContent = "";
        mensaje.classList.remove("d-block");
    }

    // Eliminar lo que se creó con JS
    const contenedorOtro = document.getElementById("contenedorOtro");
    if (contenedorOtro !== null) {
        contenedorOtro.remove();
    }
    listaResponsables.innerHTML = "";

    // Volver a dejar todo en su estado inicial
    mostrarCampoPlantilla();
    cambiarTipoIdentificacion();
    mostrarBadges();
    actualizarContador();
    actualizarBotonResponsables();
    actualizarProgreso();
    inputNombre.focus();
}


// =====================================================================
// 9. VALIDACIÓN MIENTRAS SE ESCRIBE
// =====================================================================
// Al inicio no se muestran errores (sería molesto). Después del primer
// intento de enviar o revisar, cada cambio vuelve a validar, así el
// mensaje de error desaparece en cuanto la persona corrige el campo.
function revalidar() {
    if (seIntentoEnviar === true) {
        validarFormulario();
    }
    actualizarProgreso();
}


// =====================================================================
// 10. EVENTOS: se conecta cada elemento con su función
// =====================================================================
btnRevisar.addEventListener("click", revisarDatos);
btnEnviar.addEventListener("click", enviarSolicitud);
btnConfirmarEnvio.addEventListener("click", confirmarDesdeModal);
btnLimpiar.addEventListener("click", confirmarLimpiar);

selectTipoIdentificacion.addEventListener("change", cambiarTipoIdentificacion);
selectTipoUsuario.addEventListener("change", mostrarCampoOtro);
inputTelefono.addEventListener("input", formatearTelefono);
inputCodigo.addEventListener("input", permitirSoloNumeros);
inputFechaApertura.addEventListener("change", actualizarFechaMinima);
inputDescripcion.addEventListener("input", actualizarContador);
selectFormularios.addEventListener("change", mostrarBadges);
btnAgregarResponsable.addEventListener("click", agregarResponsable);
switchPlantilla.addEventListener("change", mostrarCampoPlantilla);

// "input" ocurre al escribir y "change" al elegir una opción o marcar un checkbox.
// Se escuchan en el formulario completo: cualquier cambio en un campo llega hasta aquí.
formSolicitud.addEventListener("input", revalidar);
formSolicitud.addEventListener("change", revalidar);


// =====================================================================
// 11. ESTADO INICIAL
// =====================================================================
inputFechaApertura.min = obtenerFechaHoy();   // no se pueden elegir fechas pasadas
actualizarContador();
actualizarBotonResponsables();
actualizarProgreso();


/* =====================================================================
   ¿POR QUÉ NO USAR alert() PARA LOS ERRORES?
   =====================================================================
   1. Bloquea la página: no se puede hacer nada hasta cerrarlo.
   2. No se puede personalizar: sin colores, íconos, listas ni botones propios.
   3. Solo muestra texto plano: no puede listar varios errores con orden.
   4. Muestra el dominio ("127.0.0.1 dice:"), lo que confunde al usuario
      y puede parecer un mensaje falso.
   5. Se ve diferente en cada navegador.
   6. El usuario puede marcar "No permitir más diálogos" y desde ese
      momento ya no ve los errores.
   7. Algunos navegadores lo bloquean dentro de iframes (por ejemplo, Moodle).
   8. Al cerrarlo, el mensaje desaparece: la persona debe recordar qué
      decía mientras corrige.

   Mejor práctica:
   - Mensaje junto a cada campo (invalid-feedback) que se queda visible.
   - Un resumen de errores (modal de Bootstrap o SweetAlert2).
   - Llevar el foco al primer campo con error.
   ===================================================================== */