import {
  ArrayNotEmpty, IsArray, IsDateString, IsIn, IsNotEmpty, IsOptional, IsString,
} from 'class-validator';
import { ESTADOS_PROYECTO } from '../schemas/proyecto.schema';
 
export class CrearProyectoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del proyecto es obligatorio.' })
  nombre: string;
 
  @IsOptional()
  @IsString()
  descripcion?: string;
 
  @IsArray()
  @ArrayNotEmpty({ message: 'Indique al menos una tecnología.' })
  @IsString({ each: true })
  tecnologias: string[];
 
  @IsDateString({}, { message: 'La fecha de inicio debe tener el formato AAAA-MM-DD.' })
  fechaInicio: string;
 
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe tener el formato AAAA-MM-DD.' })
  fechaFin?: string;
 
  @IsOptional()
  @IsIn(ESTADOS_PROYECTO, { message: `El estado debe ser: ${ESTADOS_PROYECTO.join(', ')}.` })
  estado?: string;
}
 
/*
POST http://localhost:3000/proyectos
{
  "nombre": "Portal de matrícula",
  "tecnologias": ["React", "Node.js", "MongoDB"],
  "fechaInicio": "2026-02-01",
  "estado": "En curso"
}
*/
