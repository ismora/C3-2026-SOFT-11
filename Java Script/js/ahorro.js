/*
Un grupo de estudiantes ahorra para una gira académica. Empiezan aportando una cantidad fija cada semana y, cada 4 semanas, aumentan el aporte. Quieren saber en cuántas semanas alcanzan la meta y ver su avance semana a semana. Si en 20 semanas no la alcanzan, la gira se pospone.

Lo que debe hacer su programa

Use un ciclo while que se repita mientras no se alcance la meta y no se superen las semanas máximas.
El aporte sube en las semanas 5, 9, 13… (use el módulo % dentro de un if).
Muestre cada semana: número, aporte, total ahorrado y una barra de avance con "█".repeat(...) (un bloque por cada 10 %).
Al final indique si se alcanzó la meta, en cuántas semanas y cuánto sobró; o cuánto faltó si no se alcanzó.
*/

const META = 450000;
const APORTE_INICIAL = 30000;
const AUMENTO = 5000;          // cuánto sube el aporte
const CADA_SEMANAS = 4;        // cada cuántas semanas sube
const MAX_SEMANAS = 20;

let semana = 0;
let ahorrado = 0;
let aporte = APORTE_INICIAL;

// while: no sabemos de antemano cuántas vueltas dará el ciclo.
// Se detiene con la primera condición que deje de cumplirse.
while (ahorrado < META && semana < MAX_SEMANAS) {
    semana++;

    // Semanas 5, 9, 13... dejan resto 1 al dividirse entre 4 (y no es la semana 1)
    if (semana > 1 && semana % CADA_SEMANAS === 1) {
        aporte += AUMENTO;
    }

    ahorrado += aporte;

    // Barra de avance: un bloque por cada 10 %, sin pasar de 10 bloques
    const porcentaje = ahorrado / META * 100;
    const bloques = Math.min(10, Math.floor(porcentaje / 10));
    const barra = "█".repeat(bloques).padEnd(10, "·");

    console.log(`Semana ${String(semana).padStart(2)} | +₡${aporte} | ₡${ahorrado} | ${barra} ${porcentaje.toFixed(0)} %`);
}

// Después del ciclo se revisa POR QUÉ terminó
if (ahorrado >= META) {
    console.log(`¡Meta alcanzada en ${semana} semanas! Sobran ₡${ahorrado - META}.`);
} else {
    console.log(`Gira pospuesta: faltaron ₡${META - ahorrado}.`);
}