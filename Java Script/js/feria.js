/*
Un puesto de la feria del agricultor quiere una caja sencilla. Los precios son por kilo. A veces el cliente pide un producto que ese día no se vende, y quienes traen su propia bolsa reciben ₡100 de descuento.

Lo que debe hacer su programa

Muestre una línea por producto con su subtotal. Si el producto no está en preciosPorKilo, muestre no disponible y no lo sume.
Use ?? para obtener el precio o null si no existe.
Si el cliente trae bolsa propia, reste ₡100 al total. Use un ternario y cuide la precedencia.
Muestre el total a pagar.
*/

const preciosPorKilo = { tomate: 1200, papa: 850, culantro: 300, aguacate: 1500 };

const compra = [
    { producto: "tomate", kilos: 2 },
    { producto: "papa", kilos: 1.5 },
    { producto: "mango", kilos: 3 },
    { producto: "aguacate", kilos: 1 }
];

const cliente = { nombre: "Doña Rosa", bolsaPropia: true };

let suma = 0;

for (const item of compra) {
    // Si el producto no existe en el objeto, el acceso devuelve undefined;
    // con ?? lo convertimos en null para indicar "sin precio"
    const precio = preciosPorKilo[item.producto] ?? null;

    if (precio === null) {
        console.log(`${item.producto}: no disponible`);
        continue;                       // pasa al siguiente producto sin sumar
    }

    const subtotal = precio * item.kilos;
    suma += subtotal;
    console.log(`${item.producto}: ${item.kilos} kg × ₡${precio} = ₡${subtotal}`);
}

// ⚠ Precedencia: el ternario tiene MENOR prioridad que la resta.
// Sin paréntesis, "suma - cliente.bolsaPropia ? 100 : 0" se evalúa como
// "(suma - true) ? 100 : 0" y el total sería ₡100.
const total = suma - (cliente.bolsaPropia ? 100 : 0);

console.log(`Cliente: ${cliente.nombre}`);
console.log(`Total a pagar: ₡${total}`);