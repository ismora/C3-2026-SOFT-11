// Servicio de estadísticas: datos resumen para el panel principal (dashboard).
// No tiene esquema propio: CONSULTA las colecciones de los otros módulos.
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Empleado } from '../empleados/schemas/empleado.schema';
import { Certificacion } from '../certificaciones/schemas/certificacion.schema';
import { Proyecto } from '../proyectos/schemas/proyecto.schema';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel(Empleado.name) private readonly empleadoModel: Model<Empleado>,
    @InjectModel(Certificacion.name) private readonly certificacionModel: Model<Certificacion>,
    @InjectModel(Proyecto.name) private readonly proyectoModel: Model<Proyecto>,
  ) {}

  // ===================================================================
  // RF-08: resumen general del sistema
  // GET /estadisticas/resumen?dias=30
  //   dias = periodo para avisar de las certificaciones por vencer
  // ===================================================================
  async resumen(dias: number) {
    if (dias <= 0) {
      throw new BadRequestException('La cantidad de días debe ser mayor a 0.');
    }

    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + dias);

    // ---------- 1. Totales: countDocuments cuenta sin traer los documentos ----------
    const totalEmpleados = await this.empleadoModel.countDocuments();
    const totalCertificaciones = await this.certificacionModel.countDocuments();
    const totalProyectos = await this.proyectoModel.countDocuments();

    // Empleados que todavía no tienen ninguna certificación ($size: tamaño del arreglo)
    const empleadosSinCertificaciones = await this.empleadoModel.countDocuments({
      certificaciones: { $size: 0 },
    });

    // ---------- 2. Vigencia de las certificaciones ----------
    const certificacionesPorVencer = await this.certificacionModel.countDocuments({
      'vigencia.expira': true,
      'vigencia.fechaExpiracion': { $gte: hoy, $lte: limite },
    });

    const certificacionesVencidas = await this.certificacionModel.countDocuments({
      'vigencia.expira': true,
      'vigencia.fechaExpiracion': { $lt: hoy },
    });

    // ---------- 3. Proyectos agrupados por estado ----------
    // $group junta los documentos con el mismo estado y $sum: 1 los cuenta
    // Resultado: [{ _id: "En curso", cantidad: 4 }, { _id: "Finalizado", cantidad: 2 }]
    const proyectosPorEstado = await this.proyectoModel.aggregate([
      { $group: { _id: '$estado', cantidad: { $sum: 1 } } },
      { $sort: { cantidad: -1, _id: 1 } },
    ]);

    // ---------- 4. Las 5 tecnologías que más se usan en los proyectos ----------
    // $unwind "desarma" el arreglo: un proyecto con 3 tecnologías se vuelve 3 documentos
    const tecnologiasMasUsadas = await this.proyectoModel.aggregate([
      { $unwind: '$tecnologias' },
      { $group: { _id: '$tecnologias', cantidad: { $sum: 1 } } },
      { $sort: { cantidad: -1, _id: 1 } },
      { $limit: 5 },
    ]);

    // ---------- 5. Las 5 certificaciones que más empleados tienen ----------
    // $lookup trae los datos de otra colección (como populate, pero dentro de aggregate)
    const certificacionesMasComunes = await this.empleadoModel.aggregate([
      { $unwind: '$certificaciones' },
      { $group: { _id: '$certificaciones', cantidad: { $sum: 1 } } },
      { $sort: { cantidad: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: this.certificacionModel.collection.name,   // nombre real de la colección
          localField: '_id',
          foreignField: '_id',
          as: 'certificacion',
        },
      },
      { $unwind: '$certificacion' },
      // $project elige y renombra los campos de la respuesta
      {
        $project: {
          _id: 0,
          nombre: '$certificacion.nombre',
          institucion: '$certificacion.institucion',
          cantidad: 1,
        },
      },
    ]);

    // ---------- 6. Los últimos 5 empleados registrados ----------
    // createdAt existe porque el esquema tiene timestamps: true
    const ultimosEmpleados = await this.empleadoModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('nombre correo createdAt');

    return {
      totales: {
        empleados: totalEmpleados,
        certificaciones: totalCertificaciones,
        proyectos: totalProyectos,
      },
      empleadosSinCertificaciones,
      vigencia: {
        dias,
        porVencer: certificacionesPorVencer,
        vencidas: certificacionesVencidas,
      },
      proyectosPorEstado,
      tecnologiasMasUsadas,
      certificacionesMasComunes,
      ultimosEmpleados,
    };
  }
}
