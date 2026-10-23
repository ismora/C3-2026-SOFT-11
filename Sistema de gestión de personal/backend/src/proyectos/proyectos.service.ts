import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proyecto } from './schemas/proyecto.schema';
import { CrearProyectoDto } from './dto/crear-proyecto.dto';
 
@Injectable()
export class ProyectosService {
  constructor(@InjectModel(Proyecto.name) private readonly proyectoModel: Model<Proyecto>) {}
 
  crear(datos: CrearProyectoDto) {
    // La fecha de fin no puede ser anterior a la de inicio
    if (datos.fechaFin && datos.fechaFin < datos.fechaInicio) {
      throw new BadRequestException('La fecha de fin no puede ser anterior a la fecha de inicio.');
    }
    return this.proyectoModel.create(datos);
  }
 
  // Listar las tecnologías registradas. 
  // distinct() devuelve los valores sin repetir de un campo.
  async tecnologias() {
    const lista = await this.proyectoModel.distinct('tecnologias');
    return lista.sort();
  }
}