// Esquema "Proyecto"
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
 
// Valores permitidos para el estado (enum del diagrama)
export const ESTADOS_PROYECTO = ['En curso', 'Finalizado', 'Detenido', 'Pendiente', 'Cancelado'];
 
@Schema({ timestamps: true })
export class Proyecto {
  @Prop({ required: true, trim: true })
  nombre: string;
 
  @Prop({ trim: true })
  descripcion?: string;
 
  @Prop({
    type: [String],
    default: [],
    set: (lista: string[]) => lista.map((t) => t.trim().toLowerCase()),
  })
  tecnologias: string[];
 
  @Prop({ required: true })
  fechaInicio: Date;
 
  @Prop()
  fechaFin?: Date;
 
  @Prop({ type: String, enum: ESTADOS_PROYECTO, default: 'Pendiente' })
  estado: string;
}
 
export type ProyectoDocument = HydratedDocument<Proyecto>;
export const ProyectoSchema = SchemaFactory.createForClass(Proyecto);
