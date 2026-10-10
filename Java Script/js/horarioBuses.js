/*
La ruta San José–Cartago sale cada 25 minutos. La empresa quiere imprimir el horario de la mañana y marcar las salidas en hora pico, en las que se agrega un bus de refuerzo. Para facilitar los cálculos, las horas se manejan en minutos desde la medianoche (05:30 = 330).

Lo que debe hacer el programa:
    - Función formatoHora(minutos) que convierta, por ejemplo, 330 en 05:30. Use Math.floor, el módulo % y padStart.
    - Con un ciclo for genere las salidas desde la primera hasta la última (inclusive), avanzando según la frecuencia.
    - Si la salida está dentro de la hora pico (inclusive), muestre + refuerzo (use un ternario).
    - Al final muestre la cantidad de salidas, de refuerzos y el total de buses (salidas + refuerzos).
*/

const PRIMERA_SALIDA = 5 * 60 + 30;   // 05:30
const ULTIMA_SALIDA = 8 * 60;         // 08:00
const FRECUENCIA = 25;                // minutos entre salidas
const INICIO_PICO = 6 * 60;           // 06:00
const FIN_PICO = 7 * 60 + 30;         // 07:30

// Convierte minutos desde medianoche al formato hh:mm
function formatoHora(minutos) {
    const horas = Math.floor(minutos / 60);      // parte entera: 330 / 60 = 5.5 → 5
    const mins = minutos % 60;                   // el resto: 330 % 60 = 30
    // padStart rellena con ceros a la izquierda: "5" → "05"
    return `${String(horas).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

// Contadores: se inicializan en 0 antes del ciclo
let salidas = 0;
let refuerzos = 0;

// El ciclo no avanza de 1 en 1, sino según la frecuencia (t += 25)
for (let t = PRIMERA_SALIDA; t <= ULTIMA_SALIDA; t += FRECUENCIA) {
    const esPico = t >= INICIO_PICO && t <= FIN_PICO;   
    
    salidas++;
    if (esPico) {
        refuerzos++;
    }

    console.log(`${formatoHora(t)}  ${esPico ? "+ refuerzo" : ""}`);
}

console.log(`Salidas: ${salidas} | Refuerzos: ${refuerzos} | Total de buses: ${salidas + refuerzos}`);