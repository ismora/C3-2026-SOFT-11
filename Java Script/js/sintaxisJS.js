/**
 * INTRODUCCIÓN A LA SINTAXIS DE JAVASCRIPT (ES6+)
 * Contenido
 *   1.  Comentarios
 *   2.  Reglas básicas de sintaxis
 *   3.  Variables, constantes y alcance (scope)
 *   4.  Tipos de datos
 *   5.  Conversión de tipos y valores truthy / falsy
 *   6.  Operadores
 *   7.  Cadenas de texto (String)
 *   8.  Números y el objeto Math
 *   9.  Condicionales
 *   10. Ciclos
 *   11. Funciones
 *   12. Objetos
 *   13. Arreglos (Array)
 *   14. Plantillas de cadena (template literals)
 *   15. Desestructuración avanzada
 *   16. Fechas (Date)
 *   17. JSON
 *   18. Excepciones
 *   19. Map y Set
 *   20. Clases   
 *   21. Almacenamiento en el navegador (localStorage y sessionStorage)
 *   22. Expresiones regulares (RegExp)
 *   23. Programación asíncrona
 *   24. Módulos
 *   25. Buenas prácticas
 */


// =====================================================================
// 1. COMENTARIOS
// =====================================================================

// Comentario de una línea

/*
   Comentario multilínea
*/

/**
 * Comentario de documentación (JSDoc): describe qué hace una función,
 * sus parámetros y lo que retorna. VS Code lo muestra al usar la función.
 * @param {number} precio - Precio unitario
 * @param {number} cantidad - Cantidad de unidades
 * @returns {number} El subtotal
 */
function calcularSubtotal(precio, cantidad) {
    return precio * cantidad;
}
console.log("Subtotal:", calcularSubtotal(1500, 3));   // 4500


// =====================================================================
// 2. REGLAS BÁSICAS DE SINTAXIS
// =====================================================================
/*
- JavaScript distingue mayúsculas de minúsculas: 'edad', 'Edad' y 'EDAD' son tres variables distintas.
- Cada instrucción termina en punto y coma (;). JS a veces lo agrega solo, pero en el curso se escribe siempre para evitar errores.
- Los bloques de código se delimitan con llaves { }.
- Identificadores (nombres de variables y funciones):
    * Pueden contener letras, números, _ y $.
    * No pueden empezar con número:  1nombre
    * No pueden ser palabras reservadas: let, const, if, for, function, return, class, new, this, true, false, null...
- Convenciones de nombres:
    * camelCase para variables y funciones:   nombreCompleto, calcularTotal()
    * PascalCase para clases: class Estudiante
    * MAYÚSCULAS_CON_GUION para constantes fijas: MAXIMO_USUARIOS
    * Nombres descriptivos: 'precioTotal' en lugar de 'pt' o 'x'.
- console.log() muestra información en la consola; 
- console.error() muestra errores 
- console.table() muestra arreglos y objetos como tabla.
*/
console.log("Mensaje en consola")
console.error("Mensaje de error")
console.table([{ curso: "SOFT-11", creditos: 4 }, { curso: "SOFT-01", creditos: 3 }]);


// =====================================================================
// 3. VARIABLES, CONSTANTES Y ALCANCE (SCOPE)
// =====================================================================
/*
- let: para variables que pueden reasignarse.
- const: para valores que NO se reasignan (constantes).
- var: no recomendado en código moderno (no se permite en el curso).
*/

/* Forma incorrecta
var nombreGato = "Stella";
*/

let nombrePerro = "Mia";
console.log("Nombre del perro:", nombrePerro);

let nombreCabra;                 // Declaración sin valor: undefined
nombreCabra = "Amber";           // Primera asignación
nombreCabra = "Amatista";        // Reasignación (cambia el valor)
console.log("Nombre de la cabra:", nombreCabra);   // "Amatista"

// --- Ejemplo con const ---
const PI = 3.14;
console.log("Valor de PI:", PI);
// PI = 3.1416;   // TypeError: no se puede reasignar una constante
// const IVA;     // SyntaxError: una constante debe inicializarse al declararse

const MAXIMO_USUARIOS = 1000;   // Convención: mayúsculas para constantes fijas
console.log("Máximo de usuarios:", MAXIMO_USUARIOS);

// Nota: 'const' no hace inmutable el objeto, solo la referencia.
// Se pueden cambiar sus propiedades, pero no asignarle otro objeto.
const configuracion = { tema: "claro" };   // Convención: camelCase, porque aunque la referencia es constante, el contenido puede modificarse 
configuracion.tema = "oscuro";            // ✔ permitido: se modifica el contenido
// configuracion = { tema: "azul" };      // ✘ TypeError: se intenta reasignar
console.log("Configuración:", configuracion);

const colores = ["rojo"];
colores.push("verde");                    // ✔ permitido
console.log("Colores:", colores);

// --- Alcance (scope) ---
// let y const tienen alcance de BLOQUE: solo existen dentro de las { } donde se declararon.
let mensajeGlobal = "Soy global";         // alcance global: visible en todo el archivo

if (true) {
    let mensajeBloque = "Solo existo dentro del if";
    console.log(mensajeGlobal);           // ✔ se puede leer la global
    console.log(mensajeBloque);           // ✔
}
// console.log(mensajeBloque);            // ✘ ReferenceError: no existe fuera del bloque

// Por qué no usar var: no respeta el bloque y permite redeclarar
/*
if (true) {
    var fuga = "se escapa del bloque";
}
console.log(fuga);        // "se escapa del bloque" → comportamiento inesperado
var fuga = "otra vez";    // var permite declarar dos veces la misma variable
*/

// Sombra (shadowing): una variable interna con el mismo nombre oculta a la externa
let nivel = "externo";
{
    let nivel = "interno";
    console.log("Dentro del bloque:", nivel);   // interno
}
console.log("Fuera del bloque:", nivel);        // externo


// =====================================================================
// 4. TIPOS DE DATOS
// =====================================================================
/*
JavaScript es de TIPADO DINÁMICO: el tipo lo determina el valor,
no la declaración, y una variable puede cambiar de tipo.

Tipos PRIMITIVOS (se copian por valor):
  string, number, boolean, undefined, null, symbol, bigint
Tipos por REFERENCIA (se copia la dirección en memoria):
  object (incluye arreglos, funciones, fechas, Map, Set...)
*/

let texto = "Hola mundo";            // String (cadena) — comillas "", '' o ``
let numero = 42;                     // Number (entero o decimal)
let decimal = 3.75;                  // También es Number
let booleano = true;                 // Boolean (true/false)
let indefinido;                      // undefined (declarada pero sin valor)
let nulo = null;                     // null (ausencia de valor intencional)
let simbolo = Symbol("único");       // Symbol (identificador único, ES6)
let bigInt = 9007199254740991n;      // BigInt (enteros muy grandes, termina en n)
let objeto = { clave: "valor" };     // Object
let arreglo = [1, 2, 3];             // Array (es un tipo de objeto)

console.log("String:", texto);
console.log("Number:", numero, decimal);
console.log("Boolean:", booleano);
console.log("Undefined:", indefinido);
console.log("Null:", nulo);
console.log("Symbol:", simbolo);
console.log("BigInt:", bigInt);

// Para conocer el tipo de una variable se usa typeof
console.log("Tipo de texto:", typeof texto);       // "string"
console.log("Tipo de numero:", typeof numero);     // "number"
console.log("Tipo de booleano:", typeof booleano); // "boolean"
console.log("Tipo de indefinido:", typeof indefinido); // "undefined"
console.log("Tipo de objeto:", typeof objeto);     // "object"
console.log("Tipo de arreglo:", typeof arreglo);   // "object" (!)
console.log("¿Es arreglo?", Array.isArray(arreglo)); // true → forma correcta
console.log("Tipo de null:", typeof nulo);         // "object" (error histórico de JS)
console.log("Tipo de función:", typeof calcularSubtotal); // "function"

// Tipado dinámico: la misma variable cambia de tipo
let dato = 10;
console.log(typeof dato);   // number
dato = "diez";
console.log(typeof dato);   // string  (posible, pero mala práctica)

// Valores numéricos especiales
console.log("10 / 0 =", 10 / 0);                  // Infinity
console.log("'abc' * 2 =", "abc" * 2);            // NaN (Not a Number)
console.log("Tipo de NaN:", typeof NaN);          // "number" (!)
console.log("0.1 + 0.2 =", 0.1 + 0.2);            // 0.30000000000000004 (precisión decimal)

// Primitivo vs referencia
let original = 5;
let copia = original;
copia = 10;
console.log("Primitivos → original:", original, "copia:", copia); // 5, 10 (independientes)

const objetoA = { valor: 5 };
const objetoB = objetoA;           // NO copia el objeto: ambos apuntan al mismo
objetoB.valor = 10;
console.log("Referencia → objetoA:", objetoA.valor);  // 10 (¡también cambió!)


// =====================================================================
// 5. CONVERSIÓN DE TIPOS Y VALORES TRUTHY / FALSY
// =====================================================================

// --- Conversión explícita (recomendada) ---
console.log(Number("25"));         // 25
console.log(Number("25.5"));       // 25.5
console.log(Number("abc"));        // NaN
console.log(Number(""));           // 0   (cuidado)
console.log(parseInt("25.9"));     // 25  (toma solo la parte entera)
console.log(parseInt("42px"));     // 42  (lee hasta encontrar un no-número)
console.log(parseFloat("3.14m"));  // 3.14
console.log(String(100));          // "100"
console.log((100).toString());     // "100"
console.log(Boolean(1));           // true
console.log(Boolean(""));          // false

// Los valores de los formularios HTML (input.value) SIEMPRE son texto:
const valorInput = "5";            // simula lo que llega de un <input>
console.log(valorInput + 1);           // "51"  ✘ concatena
console.log(Number(valorInput) + 1);   // 6     ✔ suma

// Validar que un texto sea un número
const entrada = "12a";
if (Number.isNaN(Number(entrada))) {
    console.log(`"${entrada}" no es un número válido`);
}

// --- Conversión implícita (coerción) — conocerla para evitarla ---
console.log("5" + 2);     // "52"  (+ con texto concatena)
console.log("5" - 2);     // 3     (- convierte a número)
console.log("5" * "2");   // 10
console.log(true + 1);    // 2

// --- Truthy y falsy ---
// En una condición, todo valor se interpreta como verdadero o falso.
// Valores FALSY (se comportan como false):
//   false, 0, -0, 0n, "" (texto vacío), null, undefined, NaN
// Todo lo demás es TRUTHY, incluso "0", "false", [] y {}.
const valoresPrueba = [false, 0, "", null, undefined, NaN, "0", "false", [], {}];
for (const valor of valoresPrueba) {
    console.log(valor, "→", valor ? "truthy" : "falsy");
}

// Uso práctico: validar que un campo no esté vacío
const correoUsuario = "";
if (!correoUsuario) {
    console.log("El correo es obligatorio");
}


// =====================================================================
// 6. OPERADORES
// =====================================================================

// --- Aritméticos ---
let a = 10;
let b = 3;
console.log("Suma:", a + b);             // 13
console.log("Resta:", a - b);            // 7
console.log("Multiplicación:", a * b);   // 30
console.log("División:", a / b);         // 3.333...
console.log("Módulo (resto):", a % b);   // 1
console.log("Potencia:", a ** b);        // 10^3 = 1000

// Uso típico del módulo: saber si un número es par
console.log("¿10 es par?", a % 2 === 0); // true

// --- Incremento / decremento ---
let contador = 5;
contador++;   // suma 1 (ahora 6)
contador--;   // resta 1 (vuelve a 5)
console.log("Contador final:", contador);

// Prefijo vs sufijo
let n1 = 5;
console.log(n1++);   // 5 → muestra y DESPUÉS incrementa (n1 queda en 6)
console.log(++n1);   // 7 → incrementa y DESPUÉS muestra

// --- Asignación compuesta ---
let x = 10;
x += 5;   // x = x + 5  -> 15
x -= 3;   // x = x - 3  -> 12
x *= 2;   // x = x * 2  -> 24
x /= 4;   // x = x / 4  -> 6
x %= 4;   // x = x % 4  -> 2
x **= 3;  // x = x ** 3 -> 8
console.log("x después de operaciones:", x);

let saludo = "Hola";
saludo += ", mundo";      // también concatena texto
console.log(saludo);

// --- Comparación ---
console.log("10 > 3:", 10 > 3);              // true
console.log("10 >= 10:", 10 >= 10);          // true
console.log("10 == '10':", 10 == "10");      // true  (igualdad débil, convierte tipos)
console.log("10 === '10':", 10 === "10");    // false (igualdad estricta, mismo tipo)
console.log("10 != '10':", 10 != "10");      // false (desigualdad débil)
console.log("10 !== '10':", 10 !== "10");    // true  (desigualdad estricta)
// En el curso se usa SIEMPRE === y !==

// Casos curiosos de la igualdad débil (por eso se evita):
console.log(0 == "");            // true
console.log(null == undefined);  // true
console.log(null === undefined); // false
console.log(NaN === NaN);        // false → use Number.isNaN()

// Comparar texto: compara en orden alfabético (según código Unicode)
console.log("ana" < "beto");     // true
console.log("Zeta" < "ana");     // true (las mayúsculas van antes)

// Los objetos se comparan por REFERENCIA, no por contenido
console.log([1, 2] === [1, 2]);  // false (son dos arreglos distintos). Aunque los dos arreglos tienen exactamente el mismo contenido, JavaScript está comparando si son el mismo arreglo, no si contienen los mismos valores.

// --- Lógicos: && (AND), || (OR), ! (NOT) ---
let esMayor = true;
let esMenor = false;
console.log("AND:", esMayor && esMenor);  // false
console.log("OR:", esMayor || esMenor);   // true
console.log("NOT:", !esMayor);            // false

// Tabla de verdad:
//  A      B      A && B   A || B
//  true   true   true     true
//  true   false  false    true
//  false  true   false    true
//  false  false  false    false

const edadCliente = 25;
const tieneCarnet = true;
if (edadCliente >= 18 && tieneCarnet) {
    console.log("Puede ingresar");
}

// Evaluación en cortocircuito: && y || devuelven uno de sus operandos
const usuarioActual = null;
const nombreMostrado = usuarioActual || "Invitado";   // si es falsy usa el segundo
console.log("Nombre mostrado:", nombreMostrado);       // Invitado

const estaLogueado = true;
estaLogueado && console.log("Bienvenido de nuevo");   // solo se ejecuta si es true

// --- Operador ternario: condición ? siVerdadero : siFalso ---
const nota = 75;
const estadoCurso = nota >= 70 ? "Aprobado" : "Reprobado";

console.log("Estado:", estadoCurso);

// --- Coalescencia nula (??): usa el valor de la derecha solo si la izquierda es null o undefined (a diferencia de ||, respeta 0 y "")
const cantidadIngresada = 0;
console.log("Con ||:", cantidadIngresada || 10);  // 10 ✘ (0 se considera falsy)
console.log("Con ??:", cantidadIngresada ?? 10);  // 0  ✔

// --- Encadenamiento opcional (?.): accede a propiedades sin error si algo en el camino es null o undefined
const estudiante = { nombre: "Luis", direccion: null };
console.log(estudiante.direccion?.provincia);          // undefined (sin error)
// console.log(estudiante.direccion.provincia);        // ✘ TypeError
console.log(estudiante.direccion?.provincia ?? "Sin provincia");

// --- Asignación lógica (ES2021) ---
let opciones = { idioma: null, tema: "" };
opciones.idioma ??= "es";       // asigna solo si es null/undefined
opciones.tema ||= "claro";      // asigna si es falsy
console.log("Opciones:", opciones);

// --- Precedencia: * y / se evalúan antes que + y -; use paréntesis ---
console.log(2 + 3 * 4);     // 14
console.log((2 + 3) * 4);   // 20


// =====================================================================
// 7. CADENAS DE TEXTO (STRING)
// =====================================================================
// Las cadenas son INMUTABLES: los métodos devuelven una cadena nueva.

const frase = "  JavaScript es Divertido  ";

console.log(frase.length);                   // 27 (cuenta los espacios)
console.log(frase.trim());                   // "JavaScript es Divertido"
console.log(frase.toUpperCase());            // mayúsculas
console.log(frase.toLowerCase());            // minúsculas
console.log(frase.trim()[0]);                // "J" (acceso por índice)
console.log(frase.trim().at(-1));            // "o" (último carácter)

const curso = "Proyecto integrador";
console.log(curso.includes("integrador"));   // true
console.log(curso.startsWith("Pro"));        // true
console.log(curso.endsWith("dor"));          // true
console.log(curso.indexOf("integrador"));    // 9 (posición; -1 si no existe)
console.log(curso.slice(0, 8));              // "Proyecto"
console.log(curso.slice(-10));               // "integrador"
console.log(curso.replace("Proyecto", "Taller"));   // "Taller integrador"
console.log("a-b-a".replaceAll("a", "x"));   // "x-b-x"
console.log("ana,luis,eva".split(","));      // ["ana", "luis", "eva"]
console.log("ja".repeat(3));                 // "jajaja"
console.log("7".padStart(3, "0"));           // "007" (útil para códigos)

// Caracteres de escape
console.log("Línea 1\nLínea 2");             // \n salto de línea
console.log("Columna\tColumna");             // \t tabulación
console.log("Ella dijo \"hola\"");           // \" comillas dentro del texto
console.log('It\'s');                        // \' apóstrofo

// Ejemplo: normalizar un correo antes de guardarlo
const correoCrudo = "  Ana.Perez@CENFOTEC.ac.cr ";
const correoLimpio = correoCrudo.trim().toLowerCase();
console.log("Correo normalizado:", correoLimpio);

// Ejemplo: búsqueda sin importar mayúsculas
const buscar = "SCRIPT";
console.log("¿Contiene?", "JavaScript".toLowerCase().includes(buscar.toLowerCase()));


// =====================================================================
// 8. NÚMEROS Y EL OBJETO MATH
// =====================================================================

const precio = 1234.5678;
console.log(precio.toFixed(2));               // "1234.57" (texto con 2 decimales)
console.log(Number.isInteger(5));             // true
console.log(Number.isInteger(5.5));           // false
console.log(Number.MAX_SAFE_INTEGER);         // 9007199254740991

console.log(Math.round(4.5));     // 5  (redondeo normal)
console.log(Math.floor(4.9));     // 4  (hacia abajo)
console.log(Math.ceil(4.1));      // 5  (hacia arriba)
console.log(Math.trunc(-4.9));    // -4 (quita los decimales)
console.log(Math.abs(-7));        // 7  (valor absoluto)
console.log(Math.max(3, 9, 1));   // 9
console.log(Math.min(3, 9, 1));   // 1
console.log(Math.sqrt(16));       // 4
console.log(Math.PI);             // 3.141592653589793

// Número aleatorio entero entre min y max (incluidos)
function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log("Dado:", aleatorio(1, 6));

// Formato de moneda local
const montoColones = 1500000;
console.log(montoColones.toLocaleString("es-CR", { style: "currency", currency: "CRC" }));


// =====================================================================
// 9. CONDICIONALES
// =====================================================================

// --- if / else if / else ---
let edad = 20;
if (edad >= 18) {
    console.log("Eres mayor de edad.");
} else if (edad >= 13) {
    console.log("Eres adolescente.");
} else {
    console.log("Eres niño o niña.");
}
// Se evalúan en orden y solo se ejecuta el PRIMER bloque verdadero.

// Condiciones compuestas
const promedio = 85;
const asistencia = 90;
if (promedio >= 70 && asistencia >= 80) {
    console.log("Aprueba el curso");
} else if (promedio >= 60) {
    console.log("Va a extraordinario");
} else {
    console.log("Reprueba");
}

// Validación con retorno temprano (guard clause): evita anidar muchos if
function validarEdad(valor) {
    if (valor === undefined) return "Dato requerido";
    if (typeof valor !== "number") return "Debe ser un número";
    if (valor < 0) return "No puede ser negativa";
    return "Edad válida";
}
console.log(validarEdad(-3));

// --- switch: compara con === contra varios casos ---
let dia = 3;  // 1=lunes, 2=martes, ...
switch (dia) {
    case 1:
        console.log("Lunes");
        break;            // sin break, continúa ejecutando el siguiente case
    case 2:
        console.log("Martes");
        break;
    case 3:
        console.log("Miércoles");
        break;
    default:              // se ejecuta si ningún case coincide
        console.log("Otro día");
}

// Casos agrupados
const diaTexto = "sábado";
switch (diaTexto) {
    case "sábado":
    case "domingo":
        console.log("Fin de semana");
        break;
    default:
        console.log("Día hábil");
}

// Alternativa al switch: un objeto como tabla de búsqueda
const nombresDias = { 1: "Lunes", 2: "Martes", 3: "Miércoles" };
console.log("Con objeto:", nombresDias[dia] ?? "Otro día");


// =====================================================================
// 10. CICLOS
// =====================================================================

// --- Bucle for: cuando se conoce la cantidad de repeticiones ---
//     for (inicialización; condición; actualización)
console.log("Bucle for (0 a 4):");
for (let i = 0; i < 5; i++) {
    console.log(i);
}

// Recorrer hacia atrás y de 2 en 2
for (let i = 10; i >= 0; i -= 2) {
    console.log("Cuenta regresiva:", i);
}

// Acumulador: sumar del 1 al 100
let suma100 = 0;
for (let i = 1; i <= 100; i++) {
    suma100 += i;
}
console.log("Suma del 1 al 100:", suma100);   // 5050

// --- Bucle while: cuando NO se sabe cuántas veces se repetirá ---
let j = 0;
console.log("Bucle while (0 a 2):");
while (j < 3) {
    console.log(j);
    j++;               // ¡no olvidar! si no cambia, es un ciclo infinito
}

// --- Bucle do-while (se ejecuta al menos una vez) ---
let k = 5;
console.log("Bucle do-while (solo una vez):");
do {
    console.log("k =", k);
    k++;
} while (k < 3);  // condición falsa, pero ya se ejecutó una vez

// --- for...of (iterar sobre VALORES de arreglos, cadenas, Map, Set) ---
const frutas = ["manzana", "pera", "uva"];
console.log("for...of sobre array:");
for (const fruta of frutas) {
    console.log(fruta);
}
for (const letra of "Hola") {
    console.log("Letra:", letra);
}
// Con índice
for (const [indice, fruta] of frutas.entries()) {
    console.log(indice, fruta);
}

// --- for...in (iterar sobre las CLAVES de un objeto) ---
const persona = { nombre: "Ana", edad: 30, ciudad: "San José" };
console.log("for...in sobre objeto:");
for (const propiedad in persona) {
    console.log(propiedad + ":", persona[propiedad]);
}
// Nota: no use for...in con arreglos (recorre claves en texto); use for...of.

// --- break y continue ---
const numerosPrueba = [4, 7, -1, 12, 99, 3];
for (const num of numerosPrueba) {
    if (num < 0) continue;     // salta este valor y sigue con el siguiente
    if (num === 99) break;     // termina el ciclo por completo
    console.log("Procesando:", num);
}

// --- Ciclos anidados: tabla de multiplicar del 1 al 3 ---
for (let fila = 1; fila <= 3; fila++) {
    let linea = "";
    for (let col = 1; col <= 3; col++) {
        linea += `${fila * col}\t`;
    }
    console.log(linea);
}


// =====================================================================
// 11. FUNCIONES
// =====================================================================
// Una función es un bloque de código reutilizable que recibe datos
// (parámetros), realiza una tarea y puede devolver un resultado (return).
// Parámetro: la variable en la definición. Argumento: el valor al llamarla.

// --- Declaración de función (function declaration) ---
function sumar(a, b) {
    return a + b;
}
console.log("Sumar 3 + 4 =", sumar(3, 4));

// Las declaraciones se "elevan" (hoisting): se pueden llamar antes de definirlas
console.log("Elevada:", cuadrado(4));   // 16
function cuadrado(n) {
    return n * n;
}

// --- Expresión de función (function expression) ---
const restar = function (a, b) {
    return a - b;
};
console.log("Restar 10 - 4 =", restar(10, 4));
// Las expresiones NO se elevan: deben definirse antes de usarlas.

// --- Función flecha (arrow function) - más moderna y concisa ---
const multiplicar = (a, b) => a * b;          // return implícito en una línea
console.log("Multiplicar 5 * 6 =", multiplicar(5, 6));

const doble = n => n * 2;                      // un parámetro: paréntesis opcionales
const saludarTodos = () => "Hola a todos";     // sin parámetros: () obligatorios
const crearPunto = (x, y) => ({ x, y });       // para devolver un objeto: envolver en ( )
console.log(doble(4), saludarTodos(), crearPunto(1, 2));

// Con bloque y múltiples instrucciones (requiere return explícito):
const dividir = (a, b) => {
    if (b === 0) {
        return "No se puede dividir por cero";
    }
    return a / b;
};
console.log("Dividir 10 / 2 =", dividir(10, 2));
console.log("Dividir 10 / 0 =", dividir(10, 0));

// Sin return, una función devuelve undefined
function sinRetorno() {
    console.log("Hago algo pero no devuelvo nada");
}
console.log("Resultado:", sinRetorno());   // undefined

// --- Parámetros por defecto ---
function saludar(nombre = "Invitado") {
    return "Hola, " + nombre + "!";
}
console.log(saludar());          // Hola, Invitado!
console.log(saludar("Carlos"));  // Hola, Carlos!

// --- Parámetros rest (...): reciben una cantidad variable de argumentos ---
function sumarTodos(...valores) {
    return valores.reduce((total, v) => total + v, 0);
}
console.log("Sumar todos:", sumarTodos(1, 2, 3, 4, 5));   // 15

// --- Devolver varios valores (con un objeto o arreglo) ---
function estadisticas(lista) {
    return {
        minimo: Math.min(...lista),
        maximo: Math.max(...lista),
        promedio: lista.reduce((s, v) => s + v, 0) / lista.length
    };
}
const { minimo, maximo, promedio: prom } = estadisticas([80, 95, 60, 72]);
console.log("Mín:", minimo, "Máx:", maximo, "Prom:", prom);

// --- Funciones como argumentos (callbacks) ---
function procesar(valor, callback) {
    return callback(valor);
}
const duplicar = (n) => n * 2;
console.log("Procesar duplicando 7:", procesar(7, duplicar));
console.log("Procesar con función anónima:", procesar(7, n => n + 100));

// --- Funciones que devuelven funciones y closures ---
// Un closure es una función que "recuerda" las variables del lugar
// donde fue creada, aunque ese lugar ya haya terminado de ejecutarse.
function crearContador() {
    let cuenta = 0;              // variable privada
    return () => {
        cuenta++;
        return cuenta;
    };
}
const siguienteTurno = crearContador();
console.log("Turno:", siguienteTurno());   // 1
console.log("Turno:", siguienteTurno());   // 2

function crearMultiplicador(factor) {
    return n => n * factor;
}
const triple = crearMultiplicador(3);
console.log("Triple de 5:", triple(5));    // 15

// --- Recursión: una función que se llama a sí misma ---
function factorial(n) {
    if (n <= 1) return 1;          // caso base: detiene la recursión
    return n * factorial(n - 1);   // caso recursivo
}
console.log("5! =", factorial(5));   // 120

// --- Funciones puras: mismo resultado para los mismos argumentos
//     y no modifican nada fuera de ellas (más fáciles de probar) ---
const aplicarIVA = (monto, tasa = 0.13) => monto * (1 + tasa);
console.log("Con IVA:", aplicarIVA(1000));


// =====================================================================
// 12. OBJETOS
// =====================================================================
// Los objetos son colecciones de pares clave-valor (propiedades).
// Los valores pueden ser de cualquier tipo, incluso funciones (métodos).

// Creación con notación literal (recomendada)
const vehiculo = {
    marca: "Mitsubishi",
    modelo: "L200",
    año: 2022,
    // Método (función dentro del objeto)
    descripcion: function () {
        return this.marca + " " + this.modelo + " (" + this.año + ")";
    },
    // Método con sintaxis abreviada (ES6)
    arrancar() {
        console.log("El vehiculo ha arrancado.");
    }
};
// 'this' dentro de un método hace referencia al objeto que lo contiene.
// Ojo: las funciones flecha NO tienen su propio 'this'; no las use como métodos.

console.log("Marca:", vehiculo.marca);           // notación de punto
console.log("Modelo:", vehiculo["modelo"]);      // notación de corchetes
console.log("Descripción:", vehiculo.descripcion());
vehiculo.arrancar();

// Los corchetes permiten usar una clave guardada en una variable
const campo = "marca";
console.log("Acceso dinámico:", vehiculo[campo]);

// Agregar nuevas propiedades dinámicamente
vehiculo.color = "rojo";
console.log("Color añadido:", vehiculo.color);

// Modificar una propiedad
vehiculo.modelo = "L200 4x4";

// Eliminar propiedades
delete vehiculo.año;
console.log("Después de eliminar año:", vehiculo);

// Acceder a una propiedad inexistente devuelve undefined (no error)
console.log("Propiedad inexistente:", vehiculo.precio);

// Verificar si existe una propiedad
console.log("¿Tiene color?", "color" in vehiculo);          // true
console.log("¿Tiene año?", Object.hasOwn(vehiculo, "año")); // false

// --- Propiedades abreviadas y claves calculadas (ES6) ---
const nombreProducto = "Café";
const precioProducto = 1500;
const producto = { nombreProducto, precioProducto };    // = { nombreProducto: nombreProducto, ... }
console.log("Abreviado:", producto);

const claveDinamica = "stock";
const inventario = { [claveDinamica]: 25 };             // la clave sale de una variable
console.log("Clave calculada:", inventario);

// --- Objetos anidados ---
const usuario = {
    nombre: "Ana",
    contacto: {
        correo: "ana@cenfotec.ac.cr",
        telefonos: ["8888-1111", "2222-3333"]
    },
    roles: ["estudiante", "asistente"]
};
console.log("Correo:", usuario.contacto.correo);
console.log("Primer teléfono:", usuario.contacto.telefonos[0]);

// --- Recorrer un objeto con Object.keys / values / entries ---
console.log("Claves:", Object.keys(persona));      // ["nombre", "edad", "ciudad"]
console.log("Valores:", Object.values(persona));   // ["Ana", 30, "San José"]
for (const [clave, valor] of Object.entries(persona)) {
    console.log(`${clave} = ${valor}`);
}

// --- Destructuring de objetos (extraer propiedades) ---
const { marca, modelo } = vehiculo;
console.log("Destructuring: marca=", marca, "modelo=", modelo);

// --- Spread operator (...) para clonar o combinar objetos ---
const copiavehiculo = { ...vehiculo };
console.log("Copia del vehiculo:", copiavehiculo);

const vehiculoActualizado = { ...vehiculo, color: "azul", puertas: 4 };  // sobrescribe y agrega
console.log("Combinado:", vehiculoActualizado);

// Copia superficial vs profunda
const copiaSuperficial = { ...usuario };
copiaSuperficial.contacto.correo = "otro@correo.com";   // ✘ también cambia en 'usuario'
console.log("Original afectado:", usuario.contacto.correo);

const copiaProfunda = structuredClone(usuario);         // copia todo, incluidos los anidados
copiaProfunda.contacto.correo = "independiente@correo.com";
console.log("Original intacto:", usuario.contacto.correo);

// --- Object.freeze: impide modificar el objeto ---
const ESTADOS = Object.freeze({ PENDIENTE: "pendiente", PAGADO: "pagado" });
// ESTADOS.PAGADO = "x";   // se ignora (o lanza error en modo estricto)
console.log("Estados:", ESTADOS);


// =====================================================================
// 13. ARREGLOS (ARRAY)
// =====================================================================
// Los arrays son listas ORDENADAS de valores (pueden ser de diferentes tipos).

// Creación
const numeros = [1, 2, 3, 4, 5];
const mezclado = [1, "hola", true, null, { nombre: "objeto" }];
const vacio = [];
console.log("Mezclado:", mezclado, "Vacío:", vacio);

// Acceso por índice (empieza en 0)
console.log("Primer número:", numeros[0]);                     // 1
console.log("Último número:", numeros[numeros.length - 1]);    // 5
console.log("Último con at():", numeros.at(-1));               // 5
console.log("Índice fuera de rango:", numeros[10]);            // undefined
console.log("Largo:", numeros.length);                         // 5

// Modificar por índice
const letras = ["a", "b", "c"];
letras[1] = "B";
console.log("Letras:", letras);

// --- Métodos que MODIFICAN el arreglo original ---
numeros.push(6);        // añade al final
numeros.pop();          // elimina el último (devuelve el eliminado)
numeros.unshift(0);     // añade al principio
numeros.shift();        // elimina el primero
console.log("Array después de operaciones:", numeros); // [1,2,3,4,5]

// splice(inicio, cantidadAEliminar, ...elementosANuevos)
const meses = ["ene", "feb", "abr"];
meses.splice(2, 0, "mar");          // inserta "mar" en la posición 2
console.log("Meses:", meses);       // ["ene", "feb", "mar", "abr"]
meses.splice(0, 1);                 // elimina 1 elemento desde la posición 0
console.log("Meses:", meses);       // ["feb", "mar", "abr"]

// reverse y sort también modifican el original
const desordenados = [10, 1, 25, 3];
desordenados.sort();                       // ✘ ordena como texto: [1, 10, 25, 3]
console.log("sort() sin función:", desordenados);
desordenados.sort((x, y) => x - y);        // ✔ numérico ascendente
console.log("Ascendente:", desordenados);
desordenados.sort((x, y) => y - x);        // descendente
console.log("Descendente:", desordenados);

// --- Métodos que NO modifican (devuelven un valor o arreglo nuevo) ---
console.log("slice(1, 3):", numeros.slice(1, 3));    // [2, 3] (copia parcial)
console.log("includes(3):", numeros.includes(3));    // true
console.log("indexOf(4):", numeros.indexOf(4));      // 3 (-1 si no existe)
console.log("join:", numeros.join(" - "));           // "1 - 2 - 3 - 4 - 5"
console.log("concat:", numeros.concat([6, 7]));      // [1..7]
console.log("toSorted:", [3, 1, 2].toSorted());      // [1, 2, 3] sin modificar el original

// Recorrer con forEach (función callback)
console.log("forEach:");
numeros.forEach((num, indice) => {
    console.log("Índice", indice, ":", num);
});

// --- Métodos funcionales: map, filter, reduce ---
// map: transforma cada elemento → arreglo del mismo tamaño
const dobles = numeros.map(n => n * 2);
console.log("Dobles:", dobles);  // [2,4,6,8,10]

// filter: conserva los que cumplen la condición
const pares = numeros.filter(n => n % 2 === 0);
console.log("Pares:", pares);    // [2,4]

// reduce: combina todos en un solo valor (acumulador, valor inicial)
const sumaTotal = numeros.reduce((acum, actual) => acum + actual, 0);
console.log("Suma total:", sumaTotal); // 15

// --- Búsqueda y verificación ---
console.log("find:", numeros.find(n => n > 2));          // 3 (primer elemento que cumple)
console.log("findIndex:", numeros.findIndex(n => n > 2)); // 2 (su posición)
console.log("some:", numeros.some(n => n > 4));          // true (¿alguno cumple?)
console.log("every:", numeros.every(n => n > 0));        // true (¿todos cumplen?)

// --- Arreglos de objetos (forma típica de los datos de una aplicación) ---
const productos = [
    { nombre: "Café",   precio: 1500, stock: 10, categoria: "bebida" },
    { nombre: "Té",     precio: 1200, stock: 0,  categoria: "bebida" },
    { nombre: "Queque", precio: 2000, stock: 5,  categoria: "postre" }
];

const disponibles = productos.filter(p => p.stock > 0);
const nombres = productos.map(p => p.nombre);
const valorInventario = productos.reduce((t, p) => t + p.precio * p.stock, 0);
const masCaro = productos.reduce((mayor, p) => (p.precio > mayor.precio ? p : mayor));
const porNombre = productos.toSorted((p1, p2) => p1.nombre.localeCompare(p2.nombre));

console.log("Disponibles:", disponibles.length);
console.log("Nombres:", nombres);
console.log("Valor del inventario:", valorInventario);
console.log("Más caro:", masCaro.nombre);
console.log("Ordenados por nombre:", porNombre.map(p => p.nombre));

// Encadenar métodos
const nombresBebidasDisponibles = productos
    .filter(p => p.categoria === "bebida")
    .filter(p => p.stock > 0)
    .map(p => p.nombre.toUpperCase());
console.log("Bebidas disponibles:", nombresBebidasDisponibles);

// Agrupar por categoría con reduce
const porCategoria = productos.reduce((grupos, p) => {
    grupos[p.categoria] = grupos[p.categoria] || [];
    grupos[p.categoria].push(p.nombre);
    return grupos;
}, {});
console.log("Por categoría:", porCategoria);

// --- Matrices (arreglos de arreglos) ---
const matriz = [
    [1, 2, 3],
    [4, 5, 6]
];
console.log("Fila 1, columna 2:", matriz[1][2]);   // 6
console.log("Aplanada:", matriz.flat());           // [1,2,3,4,5,6]

// Crear arreglos
console.log(Array.from({ length: 5 }, (_, i) => i + 1));   // [1,2,3,4,5]
console.log(Array.from("hola"));                           // ["h","o","l","a"]
console.log(new Array(3).fill(0));                         // [0,0,0]

// Destructuring de arrays
const [primero, segundo, ...resto] = numeros;
console.log("Primero:", primero, "Segundo:", segundo, "Resto:", resto);

// Intercambiar dos variables con destructuring
let izquierda = "A", derecha = "B";
[izquierda, derecha] = [derecha, izquierda];
console.log("Intercambio:", izquierda, derecha);   // B A

// Spread con arrays (copiar o concatenar)
const otros = [6, 7, 8];
const todos = [...numeros, ...otros];
console.log("Concatenados:", todos);
const copiaNumeros = [...numeros];                 // copia independiente
console.log("Máximo con spread:", Math.max(...todos));

// Eliminar duplicados con Set (ver sección 19)
console.log("Sin duplicados:", [...new Set([1, 1, 2, 3, 3])]);


// =====================================================================
// 14. PLANTILLAS DE CADENA (TEMPLATE LITERALS)
// =====================================================================
// Permiten insertar variables y expresiones dentro de strings
// usando comillas invertidas (`) y ${...}

const nombre = "María";
const edad2 = 28;
const mensaje = `Hola, me llamo ${nombre} y tengo ${edad2} años.
El año que viene tendré ${edad2 + 1}.`;
console.log(mensaje);

// También permiten saltos de línea sin necesidad de \n
const verso = `Programar es pensar,
probar, fallar y volver a empezar;
cada error es una pista
que nos enseña a mejorar.`;
console.log(verso);

// Dentro de ${} va cualquier expresión: operaciones, llamadas, ternarios
const notaFinal = 82;
console.log(`Resultado: ${notaFinal >= 70 ? "Aprobado ✔" : "Reprobado ✘"}`);
console.log(`Total con IVA: ₡${aplicarIVA(2000).toFixed(2)}`);

// Generar HTML a partir de datos (se usará con el DOM y Bootstrap)
const filasHTML = productos
    .map(p => `<tr><td>${p.nombre}</td><td>₡${p.precio}</td></tr>`)
    .join("\n");
console.log(`<table>\n${filasHTML}\n</table>`);


// =====================================================================
// 15. DESESTRUCTURACIÓN AVANZADA
// =====================================================================

// Renombrar y valores por defecto
const config = { puerto: 3000 };
const { puerto: port, host = "localhost" } = config;
console.log("Servidor:", host, port);

// Desestructurar objetos anidados
const { contacto: { correo } } = usuario;
console.log("Correo extraído:", correo);

// Desestructurar en los parámetros de una función (muy común en Express y React)
function mostrarUsuario({ nombre, roles = [] }) {
    console.log(`${nombre} tiene ${roles.length} rol(es)`);
}
mostrarUsuario(usuario);

// Rest en objetos: separar unas propiedades del resto
const { contacto, ...datosBasicos } = usuario;
console.log("Sin contacto:", datosBasicos);


// =====================================================================
// 16. FECHAS (DATE)
// =====================================================================

const ahora = new Date();                       // fecha y hora actuales
const fechaFija = new Date(2026, 9, 12);        // ¡los meses van de 0 a 11! (9 = octubre)
const desdeTexto = new Date("2026-10-12T08:00:00");

console.log("Ahora:", ahora.toString());
console.log("Año:", fechaFija.getFullYear());
console.log("Mes:", fechaFija.getMonth() + 1);  // +1 para mostrar el mes humano
console.log("Día:", fechaFija.getDate());
console.log("Día de la semana:", fechaFija.getDay());   // 0 = domingo
console.log("Hora:", desdeTexto.getHours());

// Formato local
console.log(fechaFija.toLocaleDateString("es-CR"));     // 12/10/2026
console.log(fechaFija.toLocaleDateString("es-CR", { weekday: "long", day: "numeric", month: "long" }));
console.log("ISO:", fechaFija.toISOString());           // formato estándar para guardar/enviar

// Diferencia entre fechas (en milisegundos)
const inicio = new Date("2026-10-01");
const fin = new Date("2026-10-12");
const dias = (fin - inicio) / (1000 * 60 * 60 * 24);
console.log("Días de diferencia:", dias);   // 11

// Sumar días
const vence = new Date(inicio);
vence.setDate(vence.getDate() + 30);
console.log("Vence:", vence.toLocaleDateString("es-CR"));


// =====================================================================
// 17. JSON
// =====================================================================
// JSON (JavaScript Object Notation) es el formato de texto con el que
// el navegador y el servidor intercambian datos.
// Reglas: claves entre comillas dobles; sin funciones, undefined ni comentarios.

const pedido = { id: 1, cliente: "Ana", items: ["café", "té"], pagado: false };

const textoJSON = JSON.stringify(pedido);              // objeto → texto
console.log("JSON:", textoJSON);
console.log("JSON legible:\n" + JSON.stringify(pedido, null, 2));

const objetoDesdeJSON = JSON.parse(textoJSON);          // texto → objeto
console.log("Cliente:", objetoDesdeJSON.cliente);

// JSON.parse lanza un error si el texto no es válido
try {
    JSON.parse("{ cliente: 'Ana' }");    // ✘ claves sin comillas dobles
} catch (error) {
    console.error("JSON inválido:", error.message);
}


// =====================================================================
// 18. EXCEPCIONES
// =====================================================================
// try: código que podría fallar
// catch: se ejecuta si ocurre un error (recibe el objeto error)
// finally: se ejecuta siempre, haya error o no
// throw: lanza un error propio

try {
    // Código que podría lanzar un error
    let resultado = 10 / 0;  // En JS no lanza error, da Infinity
    if (!isFinite(resultado)) {
        throw new Error("División por cero no permitida");
    }
    console.log("Resultado:", resultado);
} catch (error) {
    console.error("Ocurrió un error:", error.message);
} finally {
    console.log("Esto siempre se ejecuta (finally).");
}

// Tipos de error comunes
try {
    variableQueNoExiste;                   // ReferenceError
} catch (error) {
    console.error(error.name, "-", error.message);
}
try {
    null.propiedad;                        // TypeError
} catch (error) {
    console.error(error.name, "-", error.message);
}

// Lanzar errores en funciones de validación
function retirar(saldo, monto) {
    if (typeof monto !== "number" || Number.isNaN(monto)) {
        throw new TypeError("El monto debe ser un número");
    }
    if (monto <= 0) {
        throw new RangeError("El monto debe ser positivo");
    }
    if (monto > saldo) {
        throw new Error("Saldo insuficiente");
    }
    return saldo - monto;
}

for (const monto of [500, -5, 9000, "abc"]) {
    try {
        console.log(`Retiro de ${monto} → saldo:`, retirar(1000, monto));
    } catch (error) {
        console.error(`Retiro de ${monto} → ${error.name}: ${error.message}`);
    }
}

// Error personalizado
class ErrorValidacion extends Error {
    constructor(campo, mensaje) {
        super(mensaje);
        this.name = "ErrorValidacion";
        this.campo = campo;
    }
}

try {
    throw new ErrorValidacion("correo", "El correo no tiene un formato válido");
} catch (error) {
    if (error instanceof ErrorValidacion) {
        console.error(`Campo "${error.campo}": ${error.message}`);
    } else {
        throw error;   // relanzar los errores que no sabemos manejar
    }
}


// =====================================================================
// 19. MAP Y SET
// =====================================================================

// --- Map: colección de pares clave-valor con claves de cualquier tipo ---
// Diferencias con un objeto: claves de cualquier tipo, conserva el orden
// de inserción y tiene la propiedad size.
const mapa = new Map();
mapa.set("nombre", "Luis");
mapa.set(42, "respuesta");
mapa.set(true, "verdadero");
console.log("Map:", mapa);
console.log("Valor de 'nombre':", mapa.get("nombre"));
console.log("Tamaño del Map:", mapa.size);
console.log("¿Tiene 42?", mapa.has(42));      // true
mapa.delete(true);

for (const [clave, valor] of mapa) {
    console.log("Map →", clave, ":", valor);
}

// Ejemplo: contar cuántas veces aparece cada palabra
const palabras = ["sol", "luna", "sol", "mar", "sol", "luna"];
const conteo = new Map();
for (const palabra of palabras) {
    conteo.set(palabra, (conteo.get(palabra) || 0) + 1);
}
console.log("Conteo:", conteo);   // sol → 3, luna → 2, mar → 1

// --- Set: colección de valores únicos ---
const conjunto = new Set([1, 2, 2, 3, 4, 4, 5]);
console.log("Set (sin duplicados):", conjunto);  // {1,2,3,4,5}
conjunto.add(6);
conjunto.add(6);                                  // se ignora, ya existe
console.log("Set después de añadir 6:", conjunto);
console.log("¿Tiene 3?", conjunto.has(3));
conjunto.delete(1);
console.log("Tamaño:", conjunto.size);

// Convertir a arreglo para usar map, filter, etc.
const arregloDesdeSet = [...conjunto];
console.log("Como arreglo:", arregloDesdeSet);

// Ejemplo: correos únicos de una lista de inscripciones
const inscripciones = ["ana@a.com", "luis@a.com", "ana@a.com"];
console.log("Correos únicos:", [...new Set(inscripciones)]);


// =====================================================================
// 20. CLASES
// =====================================================================
// Una clase es una plantilla para crear objetos con la misma estructura
// y comportamiento. Cada objeto creado con 'new' es una instancia.

class CuentaBancaria {
    // Atributo privado (solo accesible dentro de la clase)
    #saldo = 0;

    // Atributo estático: pertenece a la clase, no a cada objeto
    static totalCuentas = 0;

    // El constructor se ejecuta al crear el objeto con new
    constructor(titular, saldoInicial = 0) {
        this.titular = titular;
        this.#saldo = saldoInicial;
        CuentaBancaria.totalCuentas++;
    }

    // Métodos
    depositar(monto) {
        if (monto <= 0) throw new RangeError("Monto inválido");
        this.#saldo += monto;
        return this;           // permite encadenar llamadas
    }

    retirar(monto) {
        if (monto > this.#saldo) throw new Error("Saldo insuficiente");
        this.#saldo -= monto;
        return this;
    }

    // Getter: se usa como propiedad (sin paréntesis)
    get saldo() {
        return this.#saldo;
    }

    toString() {
        return `${this.titular}: ₡${this.#saldo}`;
    }
}

const cuentaAna = new CuentaBancaria("Ana", 10000);
cuentaAna.depositar(5000).retirar(2000);
console.log("Saldo de Ana:", cuentaAna.saldo);       // 13000
console.log(cuentaAna.toString());
// console.log(cuentaAna.#saldo);                    // ✘ SyntaxError: es privado
// cuentaAna.saldo = 999999;                         // no tiene efecto: no hay setter

// --- Herencia con extends y super ---
class CuentaAhorro extends CuentaBancaria {
    constructor(titular, saldoInicial, tasaInteres) {
        super(titular, saldoInicial);    // llama al constructor de la clase padre
        this.tasaInteres = tasaInteres;
    }

    aplicarInteres() {
        return this.depositar(this.saldo * this.tasaInteres);
    }

    // Sobrescribir un método del padre
    toString() {
        return `[Ahorro ${this.tasaInteres * 100}%] ${super.toString()}`;
    }
}

const ahorroLuis = new CuentaAhorro("Luis", 100000, 0.05);
ahorroLuis.aplicarInteres();
console.log(ahorroLuis.toString());
console.log("¿Es CuentaBancaria?", ahorroLuis instanceof CuentaBancaria);   // true
console.log("Total de cuentas creadas:", CuentaBancaria.totalCuentas);      // 2



 
 
// =====================================================================
// 24. ALMACENAMIENTO EN EL NAVEGADOR: localStorage y sessionStorage
// =====================================================================
/*
La Web Storage API permite guardar datos en el NAVEGADOR del usuario,
como pares clave-valor.
 
- localStorage: los datos permanecen aunque se cierre el navegador.
- sessionStorage: los datos se borran al cerrar la pestaña.
 
Características:
- Solo guarda TEXTO (string). Los números, objetos y arreglos se deben
  convertir con JSON.stringify() y recuperar con JSON.parse().
- Capacidad aproximada de 5 MB por sitio.
- Cada sitio (dominio + protocolo + puerto) tiene su propio espacio:
  una página no puede leer el localStorage de otra.
- Es síncrono y no tiene fecha de expiración.
- Se puede revisar en las herramientas del navegador:
  F12 → pestaña "Aplicación" (Application) → Local Storage.
 
¿Cuándo usarlo?
  ✔ Preferencias: tema claro/oscuro, idioma, tamaño de letra.
  ✔ Un borrador de formulario o un carrito de compras temporal.
  ✔ El último filtro o pestaña que eligió el usuario.
¿Cuándo NO usarlo?
  ✘ Contraseñas, tokens de sesión, datos personales o de pago:
    cualquier script de la página puede leerlos (riesgo XSS).
  ✘ Datos que deben compartirse entre usuarios o dispositivos:
    para eso está la base de datos (MongoDB) en el servidor.
*/
 
// --- Compatibilidad: localStorage existe en el navegador, no en Node.js.
// Para que este archivo también se pueda ejecutar con "node", se crea
// un sustituto en memoria SOLO si no existe. En el navegador no se usa.
if (typeof localStorage === "undefined") {
    globalThis.localStorage = {
        _datos: {},
        setItem(clave, valor) { this._datos[clave] = String(valor); },
        getItem(clave) { return clave in this._datos ? this._datos[clave] : null; },
        removeItem(clave) { delete this._datos[clave]; },
        clear() { this._datos = {}; },
        key(i) { return Object.keys(this._datos)[i] ?? null; },
        get length() { return Object.keys(this._datos).length; }
    };
    console.log("(Node.js: se usa un localStorage simulado en memoria)");
}
 
// --- Métodos básicos ---
localStorage.setItem("tema", "oscuro");              // guardar
localStorage.setItem("idioma", "es");
 
const temaGuardado = localStorage.getItem("tema");    // leer
console.log("Tema:", temaGuardado);                   // "oscuro"
 
console.log("Clave inexistente:", localStorage.getItem("noExiste"));   // null
 
console.log("Cantidad de claves:", localStorage.length);   // 2
console.log("Primera clave:", localStorage.key(0));        // "tema"
 
localStorage.removeItem("idioma");                    // eliminar una clave
console.log("Después de eliminar:", localStorage.length);  // 1
 
// localStorage.clear();   // elimina TODO lo del sitio (usar con cuidado)
 
// --- Todo se guarda como texto ---
localStorage.setItem("visitas", 5);
const visitasTexto = localStorage.getItem("visitas");
console.log(typeof visitasTexto);                     // "string" (!)
console.log(visitasTexto + 1);                        // "51"  ✘
console.log(Number(visitasTexto) + 1);                // 6     ✔
 
// Ejemplo: contador de visitas
// ?? da un valor inicial cuando la clave todavía no existe (getItem → null)
const visitas = Number(localStorage.getItem("contadorVisitas") ?? 0) + 1;
localStorage.setItem("contadorVisitas", visitas);
console.log(`Esta es su visita número ${visitas}`);
 
// --- Guardar objetos y arreglos: JSON.stringify / JSON.parse ---
const preferenciasUsuario = { tema: "oscuro", tamanoLetra: 18, notificaciones: true };
 
// ✘ Sin convertir se guarda el texto "[object Object]"
localStorage.setItem("prefMal", preferenciasUsuario);
console.log("Sin JSON:", localStorage.getItem("prefMal"));
 
// ✔ Convertir a JSON al guardar y de vuelta al leer
localStorage.setItem("preferencias", JSON.stringify(preferenciasUsuario));
const prefLeidas = JSON.parse(localStorage.getItem("preferencias"));
console.log("Con JSON:", prefLeidas.tema, prefLeidas.tamanoLetra);
 
// --- Funciones auxiliares reutilizables ---
// Centralizan la conversión y el manejo de errores en un solo lugar.
function guardarDato(clave, valor) {
    try {
        localStorage.setItem(clave, JSON.stringify(valor));
        return true;
    } catch (error) {
        // Ocurre si se supera el espacio disponible o el navegador lo bloquea
        console.error("No se pudo guardar:", error.message);
        return false;
    }
}
 
function leerDato(clave, valorPorDefecto = null) {
    const textoGuardado = localStorage.getItem(clave);
    if (textoGuardado === null) return valorPorDefecto;    // no existe
    try {
        return JSON.parse(textoGuardado);
    } catch {
        // El texto guardado no es JSON válido (por ejemplo, alguien lo editó)
        return valorPorDefecto;
    }
}
 
guardarDato("ultimaBusqueda", { termino: "laboratorio", pagina: 2 });
console.log("Última búsqueda:", leerDato("ultimaBusqueda"));
console.log("Dato inexistente:", leerDato("carritoViejo", []));     // []
 
localStorage.setItem("corrupto", "{ esto no es JSON");
console.log("Dato corrupto:", leerDato("corrupto", "valor seguro"));  // "valor seguro"
 
// --- Ejemplo práctico: carrito de compras persistente ---
// El carrito sobrevive aunque el usuario recargue la página.
function obtenerCarrito() {
    return leerDato("carrito", []);
}
 
function agregarAlCarrito(producto, precioUnitario, cantidad = 1) {
    const carritoActual = obtenerCarrito();
    const existente = carritoActual.find(item => item.producto === producto);
 
    if (existente) {
        existente.cantidad += cantidad;
    } else {
        carritoActual.push({ producto, precioUnitario, cantidad });
    }
    guardarDato("carrito", carritoActual);     // siempre guardar después de modificar
}
 
function quitarDelCarrito(producto) {
    const carritoFiltrado = obtenerCarrito().filter(item => item.producto !== producto);
    guardarDato("carrito", carritoFiltrado);
}
 
function totalCarrito() {
    return obtenerCarrito().reduce((suma, item) => suma + item.precioUnitario * item.cantidad, 0);
}
 
agregarAlCarrito("Café", 1500, 2);
agregarAlCarrito("Queque", 2000);
agregarAlCarrito("Café", 1500);
quitarDelCarrito("Queque");
console.log("Carrito:", obtenerCarrito());          // Café x3
console.log("Total del carrito: ₡" + totalCarrito()); // 4500
 
// --- Recorrer todo lo guardado ---
for (let i = 0; i < localStorage.length; i++) {
    const claveActual = localStorage.key(i);
    console.log(`  ${claveActual} = ${localStorage.getItem(claveActual)}`);
}
 
// --- Uso en una página: recordar el tema (con Bootstrap) ---
/*
<button id="btnTema" class="btn btn-outline-secondary">Cambiar tema</button>
 
// Al cargar la página se aplica el tema guardado (o "light" por defecto)
const temaInicial = localStorage.getItem("tema") ?? "light";
document.documentElement.setAttribute("data-bs-theme", temaInicial);
 
document.getElementById("btnTema").addEventListener("click", () => {
    const actual = document.documentElement.getAttribute("data-bs-theme");
    const nuevo = actual === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", nuevo);
    localStorage.setItem("tema", nuevo);
});
*/
 
// --- Uso en una página: guardar el borrador de un formulario ---
/*
const txtComentario = document.getElementById("txtComentario");
 
// Restaurar el borrador al cargar la página
txtComentario.value = localStorage.getItem("borradorComentario") ?? "";
 
// Guardar cada vez que el usuario escribe
txtComentario.addEventListener("input", () => {
    localStorage.setItem("borradorComentario", txtComentario.value);
});
 
// Borrar el borrador cuando el formulario se envía con éxito
document.getElementById("frmComentario").addEventListener("submit", () => {
    localStorage.removeItem("borradorComentario");
});
*/
 
// --- sessionStorage: misma API, pero dura solo mientras la pestaña está abierta ---
/*
sessionStorage.setItem("pasoActual", "2");           // paso de un formulario por etapas
const paso = sessionStorage.getItem("pasoActual");
sessionStorage.removeItem("pasoActual");
*/
 
// --- Evento "storage": avisa a OTRAS pestañas del mismo sitio cuando
//     cambia el localStorage (útil para sincronizar un carrito) ---
/*
window.addEventListener("storage", (evento) => {
    console.log(`La clave ${evento.key} cambió de ${evento.oldValue} a ${evento.newValue}`);
});
*/
 
// Limpieza de los datos usados en estos ejemplos
localStorage.clear();
 
 
// =====================================================================
// 22. Expresiones regulares (RegExp)
// =====================================================================
/*
Una expresión regular (regex) es un PATRÓN que describe un conjunto de
cadenas de texto. Se usa para:
  - Validar formatos: correos, teléfonos, cédulas, contraseñas.
  - Buscar y extraer información de un texto.
  - Reemplazar o limpiar texto.
 
Se escribe entre barras, seguida de banderas opcionales:  /patrón/banderas
 
Elementos más usados:
  Caracteres
    .       cualquier carácter (excepto salto de línea)
    \d      un dígito (0-9)            \D  cualquier cosa que NO sea dígito
    \w      letra, dígito o _          \W  lo contrario
    \s      espacio, tab o salto       \S  lo contrario
    \.      un punto literal (la \ "escapa" los caracteres especiales)
  Conjuntos
    [abc]   a, b o c                   [^abc]  cualquiera excepto a, b, c
    [a-z]   rango de minúsculas        [A-Za-zÁÉÍÓÚáéíóúÑñ]  letras en español
  Cuantificadores (se aplican a lo que está justo antes)
    *       0 o más veces              +   1 o más veces
    ?       0 o 1 vez (opcional)       {n} exactamente n veces
    {n,}    n o más veces              {n,m} entre n y m veces
  Anclas
    ^       inicio del texto           $   final del texto
    (Para VALIDAR un dato completo, use ^ y $; si no, basta con que el
     patrón aparezca en cualquier parte)
  Grupos y alternativas
    (abc)   grupo (se puede extraer)   a|b  a o b
    (?<nombre>...)  grupo con nombre
    (?=...) "seguido de" (lookahead): verifica sin consumir caracteres
  Banderas
    g   global: todas las coincidencias, no solo la primera
    i   ignora mayúsculas y minúsculas
    m   multilínea: ^ y $ aplican a cada línea
    u   Unicode (tildes, emojis)
*/
 
// --- Crear una expresión regular ---
const regexLiteral = /hola/i;                       // forma literal (la más común)
const regexConstructor = new RegExp("hola", "i");   // útil si el patrón viene de una variable
console.log(regexLiteral.source, regexConstructor.flags);
 
// Con el constructor se deben escapar los caracteres especiales del texto
function escaparRegex(textoUsuario) {
    return textoUsuario.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const terminoBusqueda = "C++";
const regexBusqueda = new RegExp(escaparRegex(terminoBusqueda), "i");
console.log("¿Menciona C++?", regexBusqueda.test("Curso de c++ básico"));   // true
 
// --- test(): ¿el texto cumple el patrón? → true / false ---
console.log(/\d/.test("abc3"));          // true  (contiene al menos un dígito)
console.log(/^\d+$/.test("12345"));      // true  (SOLO dígitos, de inicio a fin)
console.log(/^\d+$/.test("123a5"));      // false
console.log(/gato/i.test("GATO negro")); // true  (bandera i)
 
// --- match(): devuelve las coincidencias ---
const textoPedido = "Pedido 45: 3 cafés a ₡1500 y 2 queques a ₡2000";
 
console.log(textoPedido.match(/\d+/));    // primera coincidencia (con índice y detalles)
console.log(textoPedido.match(/\d+/g));   // ["45", "3", "1500", "2", "2000"] (todas)
console.log("sin números".match(/\d+/g)); // null → use ?? [] para evitar errores
const numerosEncontrados = ("sin números".match(/\d+/g) ?? []).map(Number);
console.log("Números:", numerosEncontrados);   // []
 
// --- Grupos: extraer partes específicas ---
const fechaTexto = "La entrega es el 15/10/2026.";
const coincidenciaFecha = fechaTexto.match(/(\d{2})\/(\d{2})\/(\d{4})/);
console.log("Día:", coincidenciaFecha[1], "Mes:", coincidenciaFecha[2], "Año:", coincidenciaFecha[3]);
 
// Grupos con nombre: más legibles
const regexFecha = /(?<dia>\d{2})\/(?<mes>\d{2})\/(?<anio>\d{4})/;
const { dia: diaEntrega, mes: mesEntrega, anio: anioEntrega } = fechaTexto.match(regexFecha).groups;
console.log(`Fecha ISO: ${anioEntrega}-${mesEntrega}-${diaEntrega}`);   // 2026-10-15
 
// --- matchAll(): recorrer todas las coincidencias con sus grupos ---
const listaPrecios = "Café ₡1500, Té ₡1200, Queque ₡2000";
for (const m of listaPrecios.matchAll(/(?<producto>[A-Za-zÁÉÍÓÚáéíóúñ]+) ₡(?<precio>\d+)/g)) {
    console.log(`${m.groups.producto} cuesta ${m.groups.precio}`);
}
 
// --- replace() y replaceAll() ---
console.log("Hola    mundo   JS".replace(/\s+/g, " "));            // une espacios repetidos
console.log("  texto con espacios  ".replace(/^\s+|\s+$/g, ""));  // como trim()
console.log("88881234".replace(/(\d{4})(\d{4})/, "$1-$2"));        // "8888-1234" ($1 = grupo 1)
console.log("4111222233334444".replace(/\d(?=\d{4})/g, "*"));      // oculta todo menos los últimos 4
console.log("Precio: 1500 colones".replace(/\d+/, n => `₡${Number(n).toLocaleString("es-CR")}`));
console.log("año-2026-curso-js".replaceAll("-", " "));             // con texto simple no hace falta regex
 
// Quitar tildes para búsquedas (normalize separa la letra de la tilde)
const sinTildes = "Programación en Español".normalize("NFD").replace(/[̀-ͯ]/g, "");
console.log(sinTildes);   // "Programacion en Espanol"
 
// --- split() con regex: separar por varios delimitadores ---
console.log("rojo, verde;azul  amarillo".split(/[,;\s]+/));   // ["rojo","verde","azul","amarillo"]
 
// --- search(): posición de la primera coincidencia (-1 si no hay) ---
console.log("Código: AB-123".search(/\d/));   // 11
 
// --- Validaciones comunes (adaptadas a Costa Rica) ---
const VALIDACIONES = {
    // Cédula física: 9 dígitos, con o sin guiones (1-0234-0567 o 102340567)
    cedula: /^[1-9]-?\d{4}-?\d{4}$/,
 
    // Teléfono: 8 dígitos que empiezan con 2, 4, 5, 6, 7 u 8; guion o espacio opcional
    telefono: /^[245678]\d{3}[-\s]?\d{4}$/,
 
    // Correo: validación básica (algo@algo.algo); la validación definitiva
    // es enviar un correo de confirmación
    correo: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
 
    // Correo institucional
    correoInstitucional: /^[\w.-]+@ucenfotec\.ac\.cr$/i,
 
    // Nombre: solo letras (con tildes y ñ) y espacios, de 2 a 50 caracteres
    nombre: /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ ]{2,50}$/,
 
    // Código postal: 5 dígitos
    codigoPostal: /^\d{5}$/,
 
    // Fecha dd/mm/aaaa (solo el formato; no verifica que el día exista)
    fecha: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
 
    // Hora de 24 horas hh:mm
    hora: /^([01]\d|2[0-3]):[0-5]\d$/,
 
    // Contraseña segura: mínimo 8 caracteres, al menos una minúscula,
    // una mayúscula, un número y un símbolo. Cada (?=...) verifica una regla.
    clave: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
};
 
const casosPrueba = {
    cedula: ["1-0234-0567", "102340567", "0-1234-5678", "12345"],
    telefono: ["8888-1234", "2222 3333", "1234-5678", "8888123"],
    correo: ["ana@ucenfotec.ac.cr", "ana@correo", "ana correo@x.com"],
    correoInstitucional: ["luis.mora@ucenfotec.ac.cr", "luis@gmail.com"],
    nombre: ["María José", "Ñandú", "R2D2"],
    fecha: ["15/10/2026", "32/01/2026", "1/5/2026"],
    hora: ["08:30", "23:59", "24:00"],
    clave: ["Cenfo2026!", "cenfo2026", "Corta1!"]
};
 
for (const [campo, valores] of Object.entries(casosPrueba)) {
    for (const valor of valores) {
        const valido = VALIDACIONES[campo].test(valor);
        console.log(`${campo.padEnd(20)} ${valor.padEnd(28)} ${valido ? "✔ válido" : "✘ inválido"}`);
    }
}
 
// --- Validar una contraseña regla por regla (mensajes claros al usuario) ---
function revisarClave(clave) {
    const reglas = [
        { regex: /.{8,}/,          mensaje: "al menos 8 caracteres" },
        { regex: /[a-z]/,          mensaje: "una minúscula" },
        { regex: /[A-Z]/,          mensaje: "una mayúscula" },
        { regex: /\d/,             mensaje: "un número" },
        { regex: /[^A-Za-z0-9]/,   mensaje: "un símbolo" }
    ];
    const faltantes = reglas.filter(r => !r.regex.test(clave)).map(r => r.mensaje);
    return faltantes.length === 0 ? "Contraseña segura" : `Falta: ${faltantes.join(", ")}`;
}
console.log(revisarClave("hola"));         // Falta: al menos 8 caracteres, una mayúscula, ...
console.log(revisarClave("Cenfo2026!"));   // Contraseña segura
 
// --- Limpiar datos antes de guardarlos ---
function normalizarTelefono(telefonoIngresado) {
    const soloDigitos = telefonoIngresado
        .replace(/\D/g, "")              // quita todo lo que no es dígito
        .replace(/^506(?=\d{8}$)/, "");  // quita el código de país si viene
    return soloDigitos.length === 8 ? soloDigitos.replace(/(\d{4})(\d{4})/, "$1-$2") : null;
}
console.log(normalizarTelefono("(+506) 8888 1234"));            // "8888-1234"
console.log(normalizarTelefono("8888.12.34"));                  // "8888-1234"
console.log(normalizarTelefono("123"));                         // null
 
// --- Cuidado con la bandera g y test(): la regex "recuerda" su posición ---
const regexGlobal = /a/g;
console.log(regexGlobal.test("casa"));   // true
console.log(regexGlobal.test("casa"));   // true  (busca desde la posición anterior)
console.log(regexGlobal.test("casa"));   // false (!) llegó al final
// Solución: no use la bandera g con test(), o reinicie con regexGlobal.lastIndex = 0
 
// --- Uso en formularios ---
/*
// 1) Validación con el atributo pattern de HTML (no lleva / / ni ^ $: se agregan solos)
<input type="text" id="txtTelefono" pattern="[245678]\d{3}-?\d{4}"
       title="8 dígitos, por ejemplo 8888-1234" required>
 
// 2) Validación con JavaScript y estilos de Bootstrap
const txtCorreo = document.getElementById("txtCorreo");
txtCorreo.addEventListener("input", () => {
    const esValido = VALIDACIONES.correo.test(txtCorreo.value.trim());
    txtCorreo.classList.toggle("is-valid", esValido);
    txtCorreo.classList.toggle("is-invalid", !esValido);
});
 
// 3) En el servidor, el mismo patrón en el esquema de Mongoose
correo: {
    type: String,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Correo inválido"]
}
*/
 
/*
Buenas prácticas con expresiones regulares:
✔ Use ^ y $ cuando valide un dato completo.
✔ Guarde las regex en constantes con nombre (VALIDACIONES.correo) y documéntelas.
✔ Pruebe los patrones con casos válidos e inválidos (como casosPrueba) o en regex101.com.
✔ Prefiera varias regex sencillas a una enorme e ilegible.
✔ Valide en el cliente para dar retroalimentación inmediata y SIEMPRE repita
  la validación en el servidor.
✘ No intente validar todo con regex: una fecha como 31/02/2026 cumple el
  formato pero no existe; ese tipo de reglas se verifican con código.
*/


// =====================================================================
// 23. Programación asíncrona
// =====================================================================
// JavaScript ejecuta una instrucción a la vez (un solo hilo). Las tareas
// que tardan (consultar un servidor, leer un archivo, un temporizador)
// se ejecutan de forma ASÍNCRONA: el programa continúa y el resultado
// se procesa cuando está listo.
// Nota: por eso los mensajes de esta sección aparecen al FINAL de la consola.
 
// --- Temporizadores ---
console.log("1. Antes del setTimeout");
setTimeout(() => {
    console.log("3. Dentro del setTimeout (después de 1 segundo)");
}, 1000);
console.log("2. Después del setTimeout (no espera)");
 
// setInterval repite cada cierto tiempo; clearInterval lo detiene
let repeticiones = 0;
const intervalo = setInterval(() => {
    repeticiones++;
    console.log("Intervalo", repeticiones);
    if (repeticiones === 3) clearInterval(intervalo);
}, 300);
 
// --- Promesas ---
// Una promesa representa un valor que estará disponible en el futuro.
// Estados: pendiente → cumplida (resolve) o rechazada (reject).
function buscarEstudiante(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {               // simula la espera de un servidor
            if (id === 1) {
                resolve({ id: 1, nombre: "Ana", carrera: "Software" });
            } else {
                reject(new Error(`No existe el estudiante ${id}`));
            }
        }, 500);
    });
}
 
// Consumir con then / catch / finally
buscarEstudiante(1)
    .then(est => console.log("then →", est.nombre))
    .catch(error => console.error("catch →", error.message))
    .finally(() => console.log("finally → consulta terminada"));
 
// --- async / await: la forma moderna y más legible ---
async function mostrarEstudiantes() {
    try {
        const est = await buscarEstudiante(1);     // espera sin bloquear el programa
        console.log("await →", est.nombre);
 
        const otro = await buscarEstudiante(99);   // este falla
        console.log(otro.nombre);
    } catch (error) {
        console.error("await (error) →", error.message);
    }
}
mostrarEstudiantes();
 
// --- Varias promesas en paralelo ---
async function cargarTodo() {
    const resultados = await Promise.allSettled([buscarEstudiante(1), buscarEstudiante(2)]);
    resultados.forEach(r =>
        console.log("allSettled →", r.status, r.value?.nombre ?? r.reason.message)
    );
}
cargarTodo();
 
// --- fetch: solicitudes HTTP (se usa con el servidor Express del proyecto) ---
/*
async function cargarProductos() {
    try {
        const respuesta = await fetch("/api/productos");
        if (!respuesta.ok) throw new Error("Error HTTP " + respuesta.status);
        const productos = await respuesta.json();
        console.log(productos);
    } catch (error) {
        console.error("No se pudieron cargar:", error.message);
    }
}
 
// Enviar datos (POST)
await fetch("/api/productos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Café", precio: 1500 })
});
*/
 
 
// =====================================================================
// 24. Módulos
// =====================================================================
// Los módulos permiten dividir el código en varios archivos.
// (Se muestran comentados porque requieren archivos separados.)
 
/*
// ---- CommonJS (Node.js, usado con Express) ----
// utilidades.js
function formatearMoneda(monto) {
    return "₡" + monto.toFixed(2);
}
module.exports = { formatearMoneda };
 
// app.js
const { formatearMoneda } = require("./utilidades");
console.log(formatearMoneda(1500));
 
 
// ---- Módulos ES (navegador y Node moderno) ----
// utilidades.js
export const IVA = 0.13;
export function calcularTotal(monto) { return monto * (1 + IVA); }
export default class Carrito { }        // una exportación por defecto por archivo
 
// main.js
import Carrito, { IVA, calcularTotal } from "./utilidades.js";
 
// En el HTML:
<script type="module" src="js/main.js"></script>
*/
 
 
// =====================================================================
// 25. Buenas prácticas (RESUMEN)
// =====================================================================
/*
✔ Use const por defecto y let solo si el valor cambia. Nunca var.
✔ Use === y !== en lugar de == y !=.
✔ Convierta explícitamente los datos de formularios con Number().
✔ Nombres descriptivos en camelCase; funciones con verbo (calcularTotal).
✔ Funciones cortas que hagan una sola cosa.
✔ Valide los datos al inicio de la función (retorno temprano).
✔ Maneje los errores con try/catch, sobre todo en código asíncrono.
✔ Prefiera map / filter / reduce sobre ciclos manuales cuando sea más claro.
✔ No modifique los datos recibidos: cree copias con spread o structuredClone.
✔ Use template literals en lugar de concatenar con +.
✔ Comente el "por qué", no el "qué" que el código ya dice.
✔ Mantenga la sangría consistente (4 espacios) y formatee con Prettier.
*/