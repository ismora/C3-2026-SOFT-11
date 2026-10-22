import { Module } from '@nestjs/common';
import { CertificacionesService } from './certificaciones.service';
import { CertificacionesController } from './certificaciones.controller';

import { MongooseModule } from '@nestjs/mongoose'; // Importar MongooseModule que permite conectarse a la BD de mongoDB
import { Certificacion, CertificacionSchema } from './schemas/certificacion.schema'; // Importar esquema de Mongoose creado a partir de esa clase

@Module({

  imports: [MongooseModule.forFeature([{ name: Certificacion.name, schema: CertificacionSchema }])], // Registra el modelo

  controllers: [CertificacionesController],
  providers: [CertificacionesService],
})
export class CertificacionesModule {}
