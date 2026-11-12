// Servicio: contiene la LÓGICA y las consultas a la base de datos.
// El controlador solo recibe la solicitud y llama a estos métodos.
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Certificacion } from './schemas/certificacion.schema';
import { CrearCertificacionDto } from './dto/crear-certificacion.dto';

@Injectable()
export class CertificacionesService {
  // Nest "inyecta" el modelo de Mongoose: no hay que hacer require del modelo
  constructor(
    @InjectModel(Certificacion.name) private readonly certificacionModel: Model<Certificacion>,
  ) {}

  crear(datos: CrearCertificacionDto) {
    return this.certificacionModel.create(datos);
  }

  // Listado completo (pantalla "Listados"). El catálogo de certificaciones es pequeño.
  todas() {
    return this.certificacionModel.find().sort({ nombre: 1 });
  }

  // RF: lista corta para llenar un <select> (asignar certificación, búsqueda).
  // select() devuelve solo los campos necesarios, no el documento completo.
  opciones() {
    return this.certificacionModel.find().select('nombre institucion').sort({ nombre: 1 });
  }

  // RF: ver las primeras N certificaciones registradas
  primeras(cantidad: number) {
    this.validarPositivo(cantidad, 'La cantidad');
    return this.certificacionModel.find().sort({ _id: 1 }).limit(cantidad);
  }

  // RF: conocer las instituciones que más certificaciones otorgan
  topInstituciones(top: number) {
    this.validarPositivo(top, 'El parámetro top');

    return this.certificacionModel.aggregate([
      { $group: { _id: '$institucion', cantidadCertificaciones: { $sum: 1 } } },
      { $sort: { cantidadCertificaciones: -1 } },
      { $limit: top },
    ]);
  }

  // RF: certificaciones que vencen en los próximos N días (para avisar a RR. HH.)
  porVencer(dias: number) {
    this.validarPositivo(dias, 'La cantidad de días');

    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + dias);

    return this.certificacionModel
      .find({
        'vigencia.expira': true,
        'vigencia.fechaExpiracion': { $gte: hoy, $lte: limite },
      })
      .sort({ 'vigencia.fechaExpiracion': 1 });
  }

  private validarPositivo(valor: number, nombre: string) {
    if (valor <= 0) {
      throw new BadRequestException(`${nombre} debe ser mayor a 0.`);
    }
  }
}
