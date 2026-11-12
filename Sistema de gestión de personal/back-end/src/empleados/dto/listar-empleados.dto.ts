// Parámetros del directorio de empleados (vienen en la URL, después del ?)
// GET /empleados/listado?pagina=2&limite=10&buscar=ana
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class ListarEmpleadosDto {
  // Número de página que se quiere ver (si no se envía, es la 1)
  @IsOptional()
  @Type(() => Number)   // en la URL todo llega como texto: "2" → 2
  @IsInt({ message: 'La página debe ser un número entero.' })
  @Min(1, { message: 'La página debe ser 1 o mayor.' })
  pagina: number = 1;

  // Cantidad de empleados por página (si no se envía, son 10)
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero.' })
  @Min(1, { message: 'El límite debe ser 1 o mayor.' })
  @Max(50, { message: 'El límite máximo es 50 empleados por página.' })
  limite: number = 10;

  // Texto para buscar por nombre o correo (opcional)
  @IsOptional()
  @IsString()
  @MaxLength(60, { message: 'El texto de búsqueda admite como máximo 60 caracteres.' })
  buscar?: string;
}
