// Esquema "Certificación": Define cómo se guarda el documento en MongoDB 
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; // Decoradores para definir el esquema (@Schema, @Prop) y SchemaFactory para convertir la clase en un esquema de Mongoose
import { HydratedDocument } from 'mongoose';  // Tipo de TypeScript. Representa un documento ya leído de la BD

@Schema({_id: false})
export class Vigencia{
    @Prop({default: false})
    expira: boolean;

    @Prop({type: Date, default: null})
    fechaExpiracion: Date | null;
}

export const VigenciaSchema = SchemaFactory.createForClass(Vigencia);


/*
@Schema() indica que la clase es un esquema
@Prop() indica que la propiedad es un campo de la colección

*/
@Schema()
export class Certificacion{

    @Prop({required: true, trim: true})
    nombre: string;

    @Prop({required: true, trim: true})
    institucion: string;

    @Prop({trim: true})
    descripcion?: string;

    @Prop({type: VigenciaSchema, default: () => ({}) })
    vigencia: Vigencia;
}

export type CertificacionDocument = HydratedDocument<Certificacion>; // Tipo de un documento de Certificacion leído de la BD
export const CertificacionSchema = SchemaFactory.createForClass(Certificacion); // Convierte la clase decorada en un esquema de Mongoose

