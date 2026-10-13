/* 
Un cine de barrio tiene tres formatos de sala y promociones según el día de la semana. Además, los menores de 3 años entran gratis y las personas adultas mayores tienen su propio descuento. Las promociones no se acumulan: se aplica la mayor.

Lo que debe hacer su programa

Cree la función calcularEntrada(venta) que retorne el precio, o null si el formato no existe.
Precio por formato con switch: 2D ₡3500, 3D ₡5000, VIP ₡7500. Cualquier otro formato no es válido.
Descuento por día con switch (agrupe casos): martes 50 %, miércoles 20 %, el resto 0 %.
Por edad con if / else if: menor de 3 años entra gratis; 65 años o más tiene 50 % de descuento.
Si aplica más de un descuento, use el mayor (Math.max). Muestre cada venta y el total recaudado.
*/

const ventas = [
    { cliente: "Mateo", edad: 2, formato: "2D", dia: "sábado" },
    { cliente: "Carmen", edad: 70, formato: "3D", dia: "miércoles" },
    { cliente: "Andrés", edad: 25, formato: "VIP", dia: "martes" },
    { cliente: "Lucía", edad: 34, formato: "4D", dia: "viernes" },
    { cliente: "Diego", edad: 19, formato: "2D", dia: "domingo" }
];

function calcularEntrada(venta) {
    // 1. Precio base: switch compara el formato con cada case usando ===
    let precio;
    switch (venta.formato) {
        case "2D":
            precio = 3500;
            break;                    // sin break se ejecutarían los siguientes case
        case "3D":
            precio = 5000;
            break;
        case "VIP":
            precio = 7500;
            break;
        default:
            return null;              // formato desconocido: se detiene la función
    }

    // 2. Descuento por día: los case vacíos se agrupan con el siguiente
    let descuentoDia;
    switch (venta.dia) {
        case "martes":
            descuentoDia = 0.5;
            break;
        case "miércoles":
            descuentoDia = 0.2;
            break;
        case "sábado":
        case "domingo":               // fin de semana: sin promoción
        default:
            descuentoDia = 0;
    }

    // 3. Edad: los rangos se resuelven mejor con if / else if que con switch
    let descuentoEdad = 0;
    if (venta.edad < 3) {
        return 0;                     // entra gratis, no hace falta seguir
    } else if (venta.edad >= 65) {
        descuentoEdad = 0.5;
    }

    // 4. Los descuentos no se acumulan: se usa el mayor
    const descuento = Math.max(descuentoDia, descuentoEdad);
    return precio * (1 - descuento);
}

let recaudado = 0;
for (const venta of ventas) {
    const total = calcularEntrada(venta);

    if (total === null) {
        console.log(`${venta.cliente}: formato "${venta.formato}" no válido`);
    } else {
        recaudado += total;
        console.log(`${venta.cliente} | ${venta.formato} | ${venta.dia} | ${total === 0 ? "Gratis" : "₡" + total}`);
    }
}
console.log(`Total recaudado: ₡${recaudado}`);