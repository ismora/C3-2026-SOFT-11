// Esquema "Certificación" (antes: models/certificacion.model.js)
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Subdocumento embebido: la vigencia pertenece a la certificación (relación 1 a 1)
@Schema({ _id: false })
export class Vigencia {
  @Prop({ default: false })
  expira: boolean;

  @Prop({ type: Date, default: null })
  fechaExpiracion: Date | null;
}
export const VigenciaSchema = SchemaFactory.createForClass(Vigencia);

@Schema()
export class Certificacion {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, trim: true })
  institucion: string;

  @Prop({ trim: true })
  descripcion?: string;

  @Prop({ type: VigenciaSchema, default: () => ({}) })
  vigencia: Vigencia;
}

export type CertificacionDocument = HydratedDocument<Certificacion>;
export const CertificacionSchema = SchemaFactory.createForClass(Certificacion);
