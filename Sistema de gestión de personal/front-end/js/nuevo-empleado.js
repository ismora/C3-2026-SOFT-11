// Endpoint: POST /empleados

// ---------- Elementos del HTML ----------
const formulario = document.getElementById("frmEmpleado"); //Recomendación: Copiar y pegar los id, para evitar nombres diferentes
const inputNombre = document.getElementById("txtNombre");
const inputCorreo = document.getElementById("txtCorreo");
const inputContrasenna = document.getElementById("txtContrasenna");
const selectProvincia = document.querySelector("#sltProvincia"); // querySelector permite seleccionar elementos del DOM usando selectores CSS.
const inputCanton = document.querySelector("#txtCanton");
const inputDistrito = document.querySelector("#txtDistrito");
const inputUbicacion = document.querySelector("#txtUbicacion");

// Todos los campos que tienen el atributo required dentro de este formulario
const camposRequeridos = document.querySelectorAll("#frmEmpleado [required]");

/*
http://localhost:3000/empleados 
{
  "nombre": "Kendall",
  "correo": "kendall@empresax.net",
  "contrasenna": "Cenfo2026!",
  "direccion": 
    {
        "provincia": "Cartago", 
        "canton": "Central", 
        "distrito": "Oriental"
    }
}

headers: {
    "Content-Type": "application/json"   // avisa que el body es JSON
},
body: JSON.stringify(datosEmpleado)   // Pasar el objeto -> texto JSON 
*/
async function registrarEmpleado(){
    // 1. Crear el objeto que espera el servidor 
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
    // Otras señas son opcionales
    if (inputUbicacion.value.trim() !== ""){
        datosEmpleado.direccion.ubicacion = inputUbicacion.value.trim();
    }

    // 2. Enviar los datos al servidor 
    try {
        const respuesta = await fetch("http://localhost:3000/empleados", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"   
            },
            body: JSON.stringify(datosEmpleado)  
        });

        const datos = await respuesta.json(); 

        if (!respuesta.ok){
            Swal.fire({
                icon: "error",
                title: "No se pudo completar la acción",
                text: `Error al registrar empleado: ${datos.message}`,
                confirmButtonColor: "#48589b"
            });
        } else{
            Swal.fire({
                icon: "success",
                title: "Empleado registrado",
                text: `${datos.nombre} se registró correctamente.`,
                confirmButtonColor: "#48589b"
            });
            formulario.reset();
        }

    } catch (error) {
        // ToDo: Mostrar mensaje de error "usable" al usuario
        console.log(error);
    }
}

// ---------- Eventos ----------
formulario.addEventListener("submit", (evento)=> {
    evento.preventDefault(); // Evitar que la página se recargue 

    // ToDo: Validar los datos sntesd de hacer el envío al servidor
    registrarEmpleado();

});