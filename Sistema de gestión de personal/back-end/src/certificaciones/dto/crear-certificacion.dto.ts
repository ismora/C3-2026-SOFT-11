// DTO (Data Transfer Object): define QUÉ datos se aceptan y sus reglas.
// El ValidationPipe de main.ts lo aplica antes de llegar al controlador.
import { Type } from 'class-transformer';
import {
  IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateIf, ValidateNested,
} from 'class-validator';

export class VigenciaDto {
  @IsBoolean({ message: 'expira debe ser true o false.' })
  expira: boolean;

  // Solo es obligatoria si la certificación expira
  @ValidateIf((vigencia: VigenciaDto) => vigencia.expira === true)
  @IsDateString({}, { message: 'Debe indicar la fecha de expiración (AAAA-MM-DD).' })
  fechaExpiracion?: string;
}

export class CrearCertificacionDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la certificación es obligatorio.' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'La institución es obligatoria.' })
  institucion: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @ValidateNested()          // valida también las reglas de VigenciaDto
  @Type(() => VigenciaDto)
  vigencia?: VigenciaDto;
}

/*
POST http://localhost:3000/certificaciones
{
  "nombre": "AWS Cloud Practitioner",
  "institucion": "Amazon",
  "vigencia": { "expira": true, "fechaExpiracion": "2027-06-25" }
}
*/
