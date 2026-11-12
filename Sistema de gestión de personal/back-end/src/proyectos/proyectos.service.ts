import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proyecto } from './schemas/proyecto.schema';
import { CrearProyectoDto } from './dto/crear-proyecto.dto';

@Injectable()
export class ProyectosService {
  constructor(@InjectModel(Proyecto.name) private readonly proyectoModel: Model<Proyecto>) {}

  crear(datos: CrearProyectoDto) {
    // Regla de negocio que no se puede expresar con un decorador:
    // la fecha de fin no puede ser anterior a la de inicio
    if (datos.fechaFin && datos.fechaFin < datos.fechaInicio) {
      throw new BadRequestException('La fecha de fin no puede ser anterior a la fecha de inicio.');
    }
    return this.proyectoModel.create(datos);
  }

  // Listado completo (pantalla "Listados")
  todos() {
    return this.proyectoModel.find().sort({ nombre: 1 });
  }

  // RF: lista corta de proyectos para llenar un <select> (asignar proyecto)
  opciones() {
    return this.proyectoModel.find().select('nombre estado').sort({ nombre: 1 });
  }

  // RF: listar las tecnologías registradas (para llenar un filtro en el frontend).
  // distinct() devuelve los valores sin repetir de un campo.
  async tecnologias() {
    const lista = await this.proyectoModel.distinct('tecnologias');
    return lista.sort();
  }
}
