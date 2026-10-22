// DTO (Data Transfer Object): define QUÉ datos se aceptan y sus reglas.
// El ValidationPipe de main.ts lo aplica antes de llegar al controlador.
import { Type } from 'class-transformer';
import {
  IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateIf, ValidateNested,
} from 'class-validator';

export class VigenciaDto{
    @IsBoolean({message: "El dato de expira debe ser true o false"})
    expira: boolean;

    // Solo es obligatorio si la certificación expira
    @ValidateIf((vigencia: VigenciaDto) => vigencia.expira === true)
    @IsDateString({}, {message: "Debe indicar la fecha de expiración"})
    fechaExpiracion?: string;
}

export class CrearCertificacionDto{

    @IsString()
    @IsNotEmpty({message: "El nombre de la certificación es obligatorio"})
    nombre: string;

    @IsString()
    @IsNotEmpty({message: "La instituión es obligatoria"})
    institucion: string

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => VigenciaDto)
    vigencia?: VigenciaDto;
}