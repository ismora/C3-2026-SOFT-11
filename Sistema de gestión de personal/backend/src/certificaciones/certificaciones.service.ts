// Servicio: contiene la LÓGICA y las consultas a la base de datos.
// El controlador solo recibe la solicitud y llama a estos métodos.
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Certificacion } from './schemas/certificacion.schema';
import { CrearCertificacionDto } from './dto/crear-certificacion.dto';
 
@Injectable()
export class CertificacionesService{
  constructor(@InjectModel(Certificacion.name) private readonly certificacionModel: Model<Certificacion>,) {}

  // C - Create: Registrar una certificación 
  crear(datos: CrearCertificacionDto){
    return this.certificacionModel.create(datos);
  }

  // R - Read: Obtener todas las certificaciones
  obtenerTodas(){
    return this.certificacionModel.find().sort({nombre: 1})
  }

}