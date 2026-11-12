// =====================================================================
// Registrar empleado (empleado-registrar.html)
// Endpoint: POST /empleados
// =====================================================================

// ---------- Elementos del HTML ----------
const formulario = document.getElementById("frmEmpleado");
const inputNombre = document.getElementById("txtNombre");
const inputCorreo = document.getElementById("txtCorreo");
const inputContrasenna = document.getElementById("txtContrasenna");
const selectProvincia = document.querySelector("#sltProvincia");
const inputCanton = document.querySelector("#txtCanton");
const inputDistrito = document.querySelector("#txtDistrito");
const inputUbicacion = document.querySelector("#txtUbicacion");

// Todos los campos que tienen el atributo required dentro de este formulario
const camposRequeridos = document.querySelectorAll("#frmEmpleado [required]");

// Expresión regular para el correo: texto@texto.texto
const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


// ---------------------------------------------------------------------
// Validar los datos antes de enviarlos. Devuelve true si todo está bien.
// ---------------------------------------------------------------------
function validar() {
    let hayError = false;

    // 1. Campos obligatorios vacíos
    camposRequeridos.forEach(campo => {
        const estaVacio = campo.value.trim() === "";
        marcarCampo(campo, estaVacio);
        if (estaVacio) {
            hayError = true;
        }
    });

    // 2. Formato del correo
    if (inputCorreo.value.trim() !== "" && !expresionCorreo.test(inputCorreo.value.trim())) {
        marcarCampo(inputCorreo, true);
        hayError = true;
    }

    // 3. Largo de la contraseña (la misma regla que el DTO del back-end)
    if (inputContrasenna.value !== "" && inputContrasenna.value.length < 8) {
        marcarCampo(inputContrasenna, true);
        hayError = true;
    }

    return !hayError;
}


// ---------------------------------------------------------------------
// Enviar los datos al servidor
// ---------------------------------------------------------------------
async function registrarEmpleado() {
    // El objeto debe tener los mismos nombres que CrearEmpleadoDto
    const datosEmpleado = {
        nombre: inputNombre.value.trim(),
        correo: inputCorreo.value.trim(),
        contrasenna: inputContrasenna.value,
        direccion: {
            provincia: selectProvincia.value,
            canton: inputCanton.value.trim(),
            distrito: inputDistrito.value.trim()
        }
    };

    // Las otras señas son opcionales: solo se envían si se escribieron
    if (inputUbicacion.value.trim() !== "") {
        datosEmpleado.direccion.ubicacion = inputUbicacion.value.trim();
    }

    try {
        const respuesta = await fetch(`${API_URL}/empleados`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"   // avisa que el body es JSON
            },
            body: JSON.stringify(datosEmpleado)       // objeto → texto JSON
        });
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            // Por ejemplo: 409 "Ya existe un empleado con ese correo."
            mostrarErrorServidor(datos);
            return;
        }

        mostrarExito("Empleado registrado", `${datos.nombre} se registró correctamente.`);
        formulario.reset();
    } catch (error) {
        console.log(error);
        mostrarErrorConexion();
    }
}


// ---------- Eventos ----------

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();   // evita que la página se recargue

    if (validar()) {
        registrarEmpleado();
    } else {
        // Llevar el cursor al primer campo con error
        formulario.querySelector(".invalido").focus();
    }
});

// Al presionar "Limpiar" también se quitan las marcas de error
formulario.addEventListener("reset", () => limpiarErrores(formulario));
