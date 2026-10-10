/*
Una escuela instaló sensores de humedad en las camas de su huerta. Cada mañana un programa decide cuánto tiempo regar cada cama. Un sensor está dañado (no envía datos) y otro reporta 0 % de humedad, que es un valor real: la tierra está completamente seca.

Lo que debe hacer el programa
    - Obtenga la humedad con ?.. Si el sensor no envía datos, la humedad es null. Ojo: 0 es una lectura válida (¿sirve ||?).
    - Decisión con ternario anidado: humedad null → Revisar sensor; menor que el umbral → Regar; si no → No regar.
    - Minutos de riego = (umbral − humedad) ÷ 5 × 2, más 3 minutos si la temperatura supera 30 °C. Redondee hacia arriba. Cuide la precedencia.
    - Calcule el promedio de humedad solo con los sensores que sí reportaron (un decimal).
*/

const UMBRAL_HUMEDAD = 35;   // por debajo de este % se riega

const lecturas = [
    { cama: "Lechugas", sensor: { humedad: 28, temperatura: 31 } },
    { cama: "Tomates", sensor: { humedad: 55 } },
    { cama: "Culantro", sensor: null },
    { cama: "Chile dulce", sensor: { humedad: 0, temperatura: 24 } }
];

for (const l of lecturas) {
    // ?. evita el error con el sensor dañado (null).
    // Se usa ?? y NO ||: con || la humedad 0 del chile se convertiría en null.
    const humedad = l.sensor?.humedad ?? null;
    const temperatura = l.sensor?.temperatura ?? 0;

    // Ternario anidado: primero se descarta el caso sin datos
    const accion =
        humedad === null         ? "Revisar sensor" :
        humedad < UMBRAL_HUMEDAD ? "Regar" :
                                   "No regar";

    let detalle = "";
    if (accion === "Regar") {
        // Precedencia: (resta) primero; luego / y * de izquierda a derecha;
        // el ternario del calor va entre paréntesis porque tiene la menor prioridad
        const minutos = (UMBRAL_HUMEDAD - humedad) / 5 * 2 + (temperatura > 30 ? 3 : 0);
        detalle = ` durante ${Math.ceil(minutos)} min`;
    }

    // Ternario para mostrar un texto legible cuando no hay lectura
    const textoHumedad = humedad === null ? "sin datos" : `${humedad} %`;
    console.log(`${l.cama}: humedad ${textoHumedad} → ${accion}${detalle}`);
}

// Promedio solo con lecturas válidas: filter elimina los null (el 0 se conserva)
const validas = lecturas
    .map(l => l.sensor?.humedad ?? null)
    .filter(h => h !== null);

const promedio = validas.reduce((suma, h) => suma + h, 0) / validas.length;
console.log(`Promedio de humedad (${validas.length} sensores): ${promedio.toFixed(1)} %`);