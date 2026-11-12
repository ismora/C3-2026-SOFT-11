import { Transform } from 'class-transformer';

/**
 * Convierte un parámetro de la URL en un arreglo de textos.
 *   ?tecnologias=React, Node.js     →  ['react', 'node.js']
 *   ?tecnologias=React&tecnologias=Node  →  ['react', 'node']
 * Se usa como decorador en los DTO de búsqueda.
 */
export function TextoALista() {
  return Transform(({ value }) => {
    const lista: unknown[] = Array.isArray(value) ? value : String(value ?? '').split(',');
    return lista
      .map((texto) => String(texto).trim().toLowerCase())
      .filter((texto) => texto !== '');
  });
}

/**
 * Escapa los caracteres especiales de un texto para usarlo dentro de una
 * expresión regular. Evita que un usuario envíe ".*" y obtenga todo.
 */
export function escaparRegex(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
