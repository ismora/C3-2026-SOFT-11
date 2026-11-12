import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Empleado, EmpleadoSchema } from './schemas/empleado.schema';
import { Certificacion, CertificacionSchema } from '../certificaciones/schemas/certificacion.schema';
import { Proyecto, ProyectoSchema } from '../proyectos/schemas/proyecto.schema';
import { EmpleadosController } from './empleados.controller';
import { EmpleadosService } from './empleados.service';

@Module({
  // El servicio de empleados consulta las tres colecciones, por eso registra los tres modelos
  imports: [
    MongooseModule.forFeature([
      { name: Empleado.name, schema: EmpleadoSchema },
      { name: Certificacion.name, schema: CertificacionSchema },
      { name: Proyecto.name, schema: ProyectoSchema },
    ]),
  ],
  controllers: [EmpleadosController],
  providers: [EmpleadosService],
})
export class EmpleadosModule {}
