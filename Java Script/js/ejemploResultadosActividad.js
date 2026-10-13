const estudiantes = [
    { nombre: "Ana", nota: 92 },
    { nombre: "Luis", nota: 64 },
    { nombre: "Sofía" },                 // no presentó el actividad
    { nombre: "Diego", nota: 75 }
];

// FUNCIÓN con CONDICIONALES: recibe una nota y devuelve su clasificación
function clasificar(nota) {
    if (nota >= 90) {
        return "Excelente";
    } else if (nota >= 70) {
        return "Aprobado";
    } else {
        return "Reprobado";
    }
}

// ACUMULADOR y CONTADOR: se inicializan antes del ciclo
let suma = 0;
let presentaron = 0;

// CICLO for...of: recorre cada objeto del arreglo
for (const est of estudiantes) {
    const nota = est.nota ?? null;       // ?? : si no hay nota, se usa null

    if (nota === null) {
        console.log(`${est.nombre}: no presentó`);
        continue;                        // salta al siguiente estudiante (no ejecuta las líneas 32, 33 y 34)
    }

    suma += nota;
    presentaron++;
    console.log(`${est.nombre}: ${nota} -> ${clasificar(nota)}`);
}

const promedio = suma / presentaron;

// MÉTODOS DE ARREGLOS: filter elige, map transforma, join une en un texto
const aprobados = estudiantes
    .filter(e => (e.nota ?? 0) >= 70)
    .map(e => e.nombre);

console.log(`Promedio: ${promedio.toFixed(1)}`);
console.log(`Aprobados: ${aprobados.join(", ")}`);

// TERNARIO: elige entre dos mensajes
console.log(promedio >= 70 ? "El grupo aprobó en promedio" : "El grupo necesita repaso");