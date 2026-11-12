import { IsMongoId } from 'class-validator';

// PATCH /empleados/:correo/certificaciones
export class AsignarCertificacionDto {
  @IsMongoId({ message: 'certificacionId no es un identificador válido.' })
  certificacionId: string;
}

// PATCH /empleados/:correo/proyectos
export class AsignarProyectoDto {
  @IsMongoId({ message: 'proyectoId no es un identificador válido.' })
  proyectoId: string;
}
