
// 1. Elementos del DOM
// Se buscan una sola vez y se guardan en constantes
// Se buscan una sola vez y se guardan en constantes (más eficiente y legible).
// Se usan distintas formas de seleccionar para practicarlas todas:
//
//  Método                              Devuelve                 Ejemplo
//  ----------------------------------  -----------------------  ---------------------------
//  getElementById("id")                1 elemento o null        listaResponsables
//  querySelector("selector CSS")       el PRIMERO o null        .clase, [atributo], etiqueta
//  querySelectorAll("selector CSS")    NodeList (estática)      las dos fechas
//  getElementsByClassName("clase")     HTMLCollection (viva)    contador de caracteres
//  document.forms / form.elements      formularios y campos     por su name
//  closest / nextElementSibling        navegar desde un nodo    padres y hermanos
//
// Recomendación: getElementById para ids (es el más rápido) y querySelector
// para todo lo demás. Un id debe ser único en la página; una clase no.
 
// --- Colección de formularios del documento (por id o name) ---
const form = document.forms["formSolicitud"];
 
// --- form.elements: los campos del formulario por su atributo name ---
const tipoIdentificacion = form.elements.tipoIdentificacion;
const identificacion = form.elements["identificacion"];
 
// --- Navegación entre hermanos: el texto de ayuda está justo después del input ---
const ayudaIdentificacion = identificacion.nextElementSibling;
 
// --- Selector de atributo: etiqueta[atributo="valor"] ---
const tipoUsuario = document.querySelector('select[name="tipoUsuario"]');
 
// --- closest(): sube por los padres hasta el primero que cumpla el selector ---
const contenedorTipoUsuario = tipoUsuario.closest(".col-12");
 
// --- Selector por tipo de input (solo hay un campo de teléfono) ---
const telefono = document.querySelector('input[type="tel"]');
 
// --- querySelector también acepta ids con # ---
const grupoNiveles = document.querySelector("#grupoNiveles");
 
// --- querySelectorAll + desestructuración: los dos campos de fecha en orden ---
const [fechaApertura, fechaCierre] = document.querySelectorAll('input[type="date"]');
 
// --- Selector de atributo sin valor: el select que tiene "multiple" ---
const selectFormularios = document.querySelector("select[multiple]");
 
// --- Selector de clase ---
const contenedorBadges = document.querySelector(".contenedor-badges");
 
// --- Selector de etiqueta, buscando SOLO dentro del formulario ---
const descripcion = form.querySelector("textarea");
 
// --- getElementsByClassName devuelve una colección: se toma la posición 0 ---
const contadorDescripcion = document.getElementsByClassName("contador")[0];
 
// --- getElementById: el más directo cuando el elemento tiene id ---
const listaResponsables = document.getElementById("listaResponsables");
 
// --- Combinador de hermano adyacente (+): el botón inmediatamente después de la lista ---
const btnAgregarResponsable = document.querySelector("#listaResponsables + button");
 
// --- Selector de etiqueta: la única etiqueta <template> de la página ---
const plantillaResponsable = document.querySelector("template");
 
// --- Selector por atributo de accesibilidad (role) ---
const switchPlantilla = document.querySelector('[role="switch"]');
 
// --- Leer un atributo para encontrar otro elemento: aria-controls guarda su id ---
const contenedorPlantilla = document.querySelector(`#${switchPlantilla.getAttribute("aria-controls")}`);
 
// --- Buscar dentro de un elemento ya seleccionado ---
const nombrePlantilla = contenedorPlantilla.querySelector("input");
 
// --- Selector descendiente: un elemento con role dentro de una clase ---
const barraProgreso = document.querySelector('.progreso-formulario [role="progressbar"]');
 
// --- Pseudoclase :last-child: el último <span> de su contenedor ---
const porcentajeProgreso = document.querySelector(".progreso-formulario span:last-child");