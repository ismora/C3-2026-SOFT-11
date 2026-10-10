/*
El departamento de registro genera el correo institucional de cada estudiante de nuevo ingreso. Los nombres llegan del formulario de matrícula con espacios de más, tildes y mayúsculas mezcladas, y algunos correos ya están ocupados por otras personas.

Lo que debe hacer su programa

Cree capitalizar(texto): quita espacios sobrantes y deja cada palabra con mayúscula inicial (trim, split(/\s+/), map, join).
Cree sinTildes(texto): quita tildes y cambia la ñ por n (normalize("NFD") y replace).
Usuario = inicial del primer nombre + primer apellido, en minúsculas y sin tildes. Dominio: @ucenfotec.ac.cr.
Si el correo ya está en correosUsados, agregue la inicial del segundo apellido; si aún está ocupado (o no tiene segundo apellido), agregue un número 2, 3… con un while.
Agregue cada correo nuevo a correosUsados y muestre: nombre completo formateado → correo.
*/

const ingresos = [
    { nombres: "  maría josé ", apellidos: "RODRÍGUEZ solano" },
    { nombres: "Luis Ángel", apellidos: "Mora" },
    { nombres: "ana", apellidos: "peña  ruiz" },
    { nombres: "Marco", apellidos: "Rodríguez Vega" }
];

const correosUsados = ["mrodriguez@ucenfotec.ac.cr", "lmora@ucenfotec.ac.cr"];

const DOMINIO = "@ucenfotec.ac.cr";

// "  maría josé " → "María José"
function capitalizar(texto) {
    return texto
        .trim()                                   // quita espacios al inicio y al final
        .split(/\s+/)                             // separa por uno o más espacios
        .map(p => p[0].toUpperCase() + p.slice(1).toLowerCase())
        .join(" ");
}

// "Peña" → "Pena", "Rodríguez" → "Rodriguez"
function sinTildes(texto) {
    // NFD separa la letra de su tilde ("í" → "i" + "´"); la regex borra las tildes
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function generarCorreo(persona) {
    const nombres = capitalizar(persona.nombres).split(" ");
    const apellidos = capitalizar(persona.apellidos).split(" ");

    // Usuario base: inicial + primer apellido
    let usuario = sinTildes(nombres[0][0] + apellidos[0]).toLowerCase();

    // 1er intento de desempate: inicial del segundo apellido (si existe)
    if (correosUsados.includes(usuario + DOMINIO) && apellidos[1]) {
        usuario += sinTildes(apellidos[1][0]).toLowerCase();
    }

    // 2do intento: agregar un número hasta encontrar uno libre
    let correo = usuario + DOMINIO;
    let consecutivo = 2;
    while (correosUsados.includes(correo)) {
        correo = usuario + consecutivo + DOMINIO;
        consecutivo++;
    }

    correosUsados.push(correo);                  // queda reservado para los siguientes
    return { nombreCompleto: [...nombres, ...apellidos].join(" "), correo };
}

for (const persona of ingresos) {
    const { nombreCompleto, correo } = generarCorreo(persona);   // desestructuración
    console.log(`${nombreCompleto.padEnd(28)} → ${correo}`);
}
console.log(`Correos registrados: ${correosUsados.length}`);