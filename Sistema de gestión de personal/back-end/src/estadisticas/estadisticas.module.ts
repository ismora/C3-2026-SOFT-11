import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Empleado, EmpleadoSchema } from '../empleados/schemas/empleado.schema';
import { Certificacion, CertificacionSchema } from '../certificaciones/schemas/certificacion.schema';
import { Proyecto, ProyectoSchema } from '../proyectos/schemas/proyecto.schema';
import { EstadisticasController } from './estadisticas.controller';
import { EstadisticasService } from './estadisticas.service';

// Módulo SIN esquema propio: solo registra los modelos que necesita consultar
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Empleado.name, schema: EmpleadoSchema },
      { name: Certificacion.name, schema: CertificacionSchema },
      { name: Proyecto.name, schema: ProyectoSchema },
    ]),
  ],
  controllers: [EstadisticasController],
  providers: [EstadisticasService],
})
export class EstadisticasModule {}
