/*
La biblioteca necesita un reporte de los préstamos activos. Algunos libros no tienen el autor registrado y no todos los préstamos indican los días permitidos ni el monto de la multa, porque en ese caso aplican los valores generales del reglamento.

Lo que debe hacer su programa

Recorra los préstamos con for...of y muestre una línea por préstamo.
Si el autor no existe, muestre Autor desconocido (use ?. y ??).
Si no se indican diasPermitidos, el reglamento da 15 días; si no hay multaDiaria, es ₡250.
Días de atraso = días de préstamo − días permitidos (nunca negativo).
Estado con ternario: Al día o Atrasado (n días), y la multa correspondiente.
*/

const prestamos = [
    {
        libro: { titulo: "Cien años de soledad", autor: { nombre: "Gabriel García Márquez" } },
        diasPrestamo: 18,
        diasPermitidos: 15
    },
    {
        libro: { titulo: "Manual de Node.js", autor: null },
        diasPrestamo: 7
    },
    {
        libro: { titulo: "Introducción a MongoDB", autor: { nombre: "Ana Solís" } },
        diasPrestamo: 25,
        diasPermitidos: 10,
        multaDiaria: 500
    }
];

// Valores generales del reglamento
const DIAS_REGLAMENTO = 15;
const MULTA_REGLAMENTO = 250;

for (const p of prestamos) {
    // ?. evita el error "Cannot read properties of null" cuando autor es null
    // ?? sustituye el undefined resultante por un texto por defecto
    const autor = p.libro?.autor?.nombre ?? "Autor desconocido";

    // ?? usa el valor del reglamento solo si el dato no viene
    const permitidos = p.diasPermitidos ?? DIAS_REGLAMENTO;
    const multaDiaria = p.multaDiaria ?? MULTA_REGLAMENTO;

    // Math.max evita atrasos negativos cuando se devuelve antes de tiempo
    const atraso = Math.max(0, p.diasPrestamo - permitidos);

    // Ternario para el texto del estado
    const estado = atraso > 0 ? `Atrasado (${atraso} días)` : "Al día";
    const multa = atraso * multaDiaria;

    console.log(`${p.libro.titulo} — ${autor} | ${estado} | Multa: ₡${multa}`);
}