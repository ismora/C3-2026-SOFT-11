/*
La asociación estudiantil organiza un torneo de videojuegos y necesita la tabla de posiciones. No todos los equipos reportaron empates ni estadísticas completas de la plataforma.

Lo que debe hacer su programa

Puntos = ganados × 3 + empatados. Si no reportaron empates, cuentan como 0. Revise la precedencia.
Relación bajas/muertes (K/D) con dos decimales. Si faltan las estadísticas, use 0 bajas y 0 muertes. Si las muertes son 0, el K/D es igual a las bajas (evite dividir entre 0 con un ternario).
Ordene por puntos de mayor a menor sin modificar el arreglo original (toSorted).
Los 2 primeros lugares Clasifican; el resto queda Eliminado (ternario usando la posición).
*/

const equipos = [
    { nombre: "Quetzales", ganados: 2, perdidos: 6 },
    { nombre: "Pumas", ganados: 5, empatados: 2, perdidos: 1, estadisticas: { bajas: 120, muertes: 80 } },
    { nombre: "Tucanes", ganados: 4, empatados: 4, perdidos: 0, estadisticas: { bajas: 95 } }
];

// 1. Calcular puntos y K/D de cada equipo (map no modifica el original)
const tabla = equipos.map(e => {
    // Precedencia: * se evalúa antes que +, y el ?? va entre paréntesis
    // porque tiene menor prioridad que +. Sin paréntesis se calcularía
    // (ganados * 3 + empatados) ?? 0 → 6 + undefined = NaN para los Quetzales
    const puntos = e.ganados * 3 + (e.empatados ?? 0);

    // ?. porque "estadisticas" puede no existir
    const bajas = e.estadisticas?.bajas ?? 0;
    const muertes = e.estadisticas?.muertes ?? 0;

    // Ternario para evitar la división entre 0 (daría Infinity o NaN)
    const kd = muertes === 0 ? bajas : bajas / muertes;

    return { nombre: e.nombre, puntos, kd: kd.toFixed(2) };
});

// 2. Ordenar de mayor a menor puntaje: si b tiene más puntos, va primero
const posiciones = tabla.toSorted((a, b) => b.puntos - a.puntos);

// 3. Mostrar la tabla; forEach entrega también el índice (posición - 1)
console.log("Pos | Equipo     | Pts | K/D  | Estado");
posiciones.forEach((e, i) => {
    const estado = i < 2 ? "Clasifica" : "Eliminado";
    console.log(`${i + 1}   | ${e.nombre.padEnd(10)} | ${String(e.puntos).padStart(3)} | ${e.kd.padStart(5)} | ${estado}`);
});