import { Module } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { ProyectosController } from './proyectos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Proyecto, ProyectoSchema } from './schemas/proyecto.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Proyecto.name, schema: ProyectoSchema }])],
  
  controllers: [ProyectosController],
  providers: [ProyectosService],
})
export class ProyectosModule {}
