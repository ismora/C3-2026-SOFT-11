import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Certificacion, CertificacionSchema } from './schemas/certificacion.schema';
import { CertificacionesController } from './certificaciones.controller';
import { CertificacionesService } from './certificaciones.service';

@Module({
  // Registra el modelo para poder inyectarlo en el servicio
  imports: [MongooseModule.forFeature([{ name: Certificacion.name, schema: CertificacionSchema }])],
  controllers: [CertificacionesController],
  providers: [CertificacionesService],
})
export class CertificacionesModule {}
