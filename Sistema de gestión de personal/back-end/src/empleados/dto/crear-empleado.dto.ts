import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';

export class DireccionDto {
  @IsString()
  @IsNotEmpty({ message: 'La provincia es obligatoria.' })
  provincia: string;

  @IsString()
  @IsNotEmpty({ message: 'El cantón es obligatorio.' })
  canton: string;

  @IsString()
  @IsNotEmpty({ message: 'El distrito es obligatorio.' })
  distrito: string;

  @IsOptional()
  @IsString()
  ubicacion?: string;
}

export class CrearEmpleadoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  nombre: string;

  @IsEmail({}, { message: 'Revise el correo: debe tener el formato nombre@dominio.com.' })
  correo: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  contrasenna: string;

  @ValidateNested()
  @Type(() => DireccionDto)
  direccion: DireccionDto;
}

/*
POST http://localhost:3000/empleados
{
  "nombre": "Bryan",
  "correo": "bryan@empresax.net",
  "contrasenna": "Cenfo2026!",
  "direccion": { "provincia": "Cartago", "canton": "Central", "distrito": "Oriental" }
}
*/
