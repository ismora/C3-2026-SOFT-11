/* 
La universidad quiere automatizar el cobro del parqueo. La caseta registra la placa, el tipo de vehículo y las horas que estuvo dentro. Algunos visitantes entran sin que se registre la placa.

- Cree la función calcularParqueo(v) que retorne un texto con la placa, el tipo, las horas y el total.
- Si la placa es null o no existe, muestre SIN PLACA.
- Tarifa por hora: carro ₡700 y moto ₡400. Las fracciones se cobran como hora completa (Math.ceil).
- La primera media hora es gratis (0.5 h o menos paga ₡0).
- Los estudiantes tienen 50 % de descuento. Si esEstudiante no viene en el objeto, se asume false.
*/
const vehiculo = { placa: "BCD-123", horas: 3.5, tipo: "moto", esEstudiante: true };
const visitante = { placa: null, horas: 0.5, tipo: "carro" };
const funcionario = { placa: "ABC-777", horas: 2, tipo: "carro", esEstudiante: false };

// Tarifas por hora (constantes en mayúscula porque no cambian)
const TARIFA_CARRO = 700;
const TARIFA_MOTO = 400;

function calcularParqueo(v) {
    // ?? : si la placa es null o undefined se usa un texto por defecto
    const placa = v.placa ?? "SIN PLACA";

    // Ternario: elige la tarifa según el tipo de vehículo
    const tarifa = v.tipo === "moto" ? TARIFA_MOTO : TARIFA_CARRO;

    // ?? : el visitante no trae la propiedad esEstudiante → se asume false
    const esEstudiante = v.esEstudiante ?? false;
    const descuento = esEstudiante ? 0.5 : 0;

    // Math.ceil cobra la fracción como hora completa (3.5 h → 4 h)
    const horasCobradas = Math.ceil(v.horas);

    // Ternario: la primera media hora es gratis.
    // Precedencia: los paréntesis obligan a calcular (1 - descuento)
    // antes de multiplicar; sin ellos se restaría al final.
    const total = v.horas <= 0.5 ? 0 : horasCobradas * tarifa * (1 - descuento);

    return `${placa} | ${v.tipo} | ${v.horas} h → ₡${total}`;
}

console.log( "---------- Contexto 1: Parqueo ---------- ")
console.log(calcularParqueo(vehiculo));
console.log(calcularParqueo(visitante));
console.log(calcularParqueo(funcionario));