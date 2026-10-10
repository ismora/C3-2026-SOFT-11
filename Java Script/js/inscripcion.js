/*
Antes de guardar las solicitudes de inscripción en la base de datos, el sistema debe revisarlas y explicar a cada aspirante qué datos están mal. Una solicitud se aprueba solo si no tiene ningún error.

Lo que debe hacer su programa

Cree la función validarSolicitud(s) que retorne un arreglo con los mensajes de error (vacío si todo está bien).
Nombre: solo letras (con tildes y ñ) y espacios, mínimo 3 caracteres. Cédula: 9 dígitos con o sin guiones, sin empezar en 0. Teléfono: 8 dígitos que empiezan en 2, 4, 5, 6, 7 u 8, con guion o espacio opcional. Correo: formato algo@algo.algo.
Edad mínima: 17 años.
La carrera debe existir en CARRERAS (use includes). Si no viene, también es un error.
Muestre ✔ Aprobada o ✘ Rechazada con la lista de errores, y al final cuántas se aprobaron.
*/

const CARRERAS = ["Software", "Ciberseguridad", "Ciencia de datos"];

const solicitudes = [
    { nombre: "Valeria Castro", cedula: "1-1234-0567", telefono: "8888-1234",
      correo: "vale@correo.com", edad: 19, carrera: "Software" },
    { nombre: "R2", cedula: "12345", telefono: "1234-5678",
      correo: "rob@", edad: 16 },
    { nombre: "Daniel Quesada", cedula: "204560789", telefono: "7012 3456",
      correo: "dani@correo.cr", edad: 22, carrera: "Ciberseguridad" },
    { nombre: "Elena Mora", cedula: "3-0456-0789", telefono: "6123-4567",
      correo: "elena@correo.com", edad: 17, carrera: "Diseño" }
];

// Patrones guardados en un objeto: un solo lugar para mantenerlos
const PATRONES = {
    nombre: /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ ]{3,}$/,
    cedula: /^[1-9]-?\d{4}-?\d{4}$/,
    telefono: /^[245678]\d{3}[-\s]?\d{4}$/,
    correo: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
};
const EDAD_MINIMA = 17;

function validarSolicitud(s) {
    const errores = [];                  // se llena solo con lo que esté mal

    // test() devuelve true/false; con ! se detecta cuando NO cumple
    if (!PATRONES.nombre.test(s.nombre)) errores.push("Nombre inválido");
    if (!PATRONES.cedula.test(s.cedula)) errores.push("Cédula inválida");
    if (!PATRONES.telefono.test(s.telefono)) errores.push("Teléfono inválido");
    if (!PATRONES.correo.test(s.correo)) errores.push("Correo inválido");

    if (s.edad < EDAD_MINIMA) {
        errores.push(`Debe tener al menos ${EDAD_MINIMA} años`);
    }

    // ?? evita pasar undefined a includes cuando la carrera no viene
    if (!CARRERAS.includes(s.carrera ?? "")) {
        errores.push("Carrera no válida o no indicada");
    }

    return errores;
}

let aprobadas = 0;

for (const s of solicitudes) {
    const errores = validarSolicitud(s);

    // Un arreglo vacío (length 0) significa que no hubo errores
    if (errores.length === 0) {
        aprobadas++;
        console.log(`✔ ${s.nombre}: Aprobada (${s.carrera})`);
    } else {
        console.log(`✘ ${s.nombre}: Rechazada`);
        errores.forEach(e => console.log(`    - ${e}`));
    }
}

console.log(`Aprobadas: ${aprobadas} de ${solicitudes.length}`);