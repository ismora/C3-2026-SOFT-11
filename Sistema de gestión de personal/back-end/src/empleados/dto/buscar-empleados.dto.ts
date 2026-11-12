// Parámetros de la búsqueda de empleados (vienen en la URL, después del ?)
// Los dos son OPCIONALES, pero el servicio exige que venga al menos uno:
//   ?tecnologias=react,node.js
//   ?certificaciones=scrum master
//   ?tecnologias=react&certificaciones=scrum master
import { IsArray, IsOptional, IsString } from 'class-validator';
import { TextoALista } from '../../common/utilidades';

export class BuscarEmpleadosDto {
  // ?tecnologias=react,node.js
  @IsOptional()
  @TextoALista()
  @IsArray()
  @IsString({ each: true })
  tecnologias?: string[];

  // ?certificaciones=AWS Cloud Practitioner,Scrum Master
  @IsOptional()
  @TextoALista()
  @IsArray()
  @IsString({ each: true })
  certificaciones?: string[];
}
