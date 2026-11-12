import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Proyecto, ProyectoSchema } from './schemas/proyecto.schema';
import { ProyectosController } from './proyectos.controller';
import { ProyectosService } from './proyectos.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Proyecto.name, schema: ProyectoSchema }])],
  controllers: [ProyectosController],
  providers: [ProyectosService],
})
export class ProyectosModule {}
