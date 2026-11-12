// Esquema "Empleado" (antes: models/empleado.model.js)
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Certificacion } from '../../certificaciones/schemas/certificacion.schema';
import { Proyecto } from '../../proyectos/schemas/proyecto.schema';

// Subdocumento embebido (relación 1 a 1)
@Schema({ _id: false })
export class Direccion {
  @Prop({ required: true, trim: true })
  provincia: string;

  @Prop({ required: true, trim: true })
  canton: string;

  @Prop({ required: true, trim: true })
  distrito: string;

  @Prop({ trim: true })
  ubicacion?: string;
}
export const DireccionSchema = SchemaFactory.createForClass(Direccion);

@Schema({ timestamps: true })
export class Empleado {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  correo: string;

  // select: false → la contraseña NUNCA se devuelve en las consultas
  @Prop({ required: true, select: false })
  contrasenna: string;

  @Prop({ type: DireccionSchema, required: true })
  direccion: Direccion;

  // Muchos a muchos (presentar) → arreglo de referencias
  @Prop({ type: [{ type: Types.ObjectId, ref: Certificacion.name }], default: [] })
  certificaciones: Types.ObjectId[];

  // Muchos a muchos (colaborar) → arreglo de referencias
  @Prop({ type: [{ type: Types.ObjectId, ref: Proyecto.name }], default: [] })
  proyectos: Types.ObjectId[];
}

export type EmpleadoDocument = HydratedDocument<Empleado>;
export const EmpleadoSchema = SchemaFactory.createForClass(Empleado);
