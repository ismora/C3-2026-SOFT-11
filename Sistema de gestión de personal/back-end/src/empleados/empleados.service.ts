import {
  BadRequestException, ConflictException, Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Empleado } from './schemas/empleado.schema';
import { Certificacion } from '../certificaciones/schemas/certificacion.schema';
import { Proyecto } from '../proyectos/schemas/proyecto.schema';
import { CrearEmpleadoDto } from './dto/crear-empleado.dto';
import { BuscarEmpleadosDto } from './dto/buscar-empleados.dto';
import { ListarEmpleadosDto } from './dto/listar-empleados.dto';
import { escaparRegex } from '../common/utilidades';

@Injectable()
export class EmpleadosService {
  // Este servicio consulta tres colecciones, así que recibe los tres modelos
  constructor(
    @InjectModel(Empleado.name) private readonly empleadoModel: Model<Empleado>,
    @InjectModel(Certificacion.name) private readonly certificacionModel: Model<Certificacion>,
    @InjectModel(Proyecto.name) private readonly proyectoModel: Model<Proyecto>,
  ) {}

  // ===================================================================
  // RF-01: registrar un empleado
  // ===================================================================
  async crear(datos: CrearEmpleadoDto) {
    try {
      // La contraseña se guarda cifrada (hash), nunca en texto plano
      const contrasenna = await bcrypt.hash(datos.contrasenna, 10);
      const empleado = await this.empleadoModel.create({ ...datos, contrasenna });

      // Se devuelve el empleado SIN la contraseña
      const { contrasenna: _omitida, ...empleadoSinClave } = empleado.toObject();
      return empleadoSinClave;
    } catch (error: any) {
      // 11000 = valor duplicado en un campo unique (el correo)
      if (error.code === 11000) {
        throw new ConflictException('Ya existe un empleado con ese correo.');
      }
      throw error;
    }
  }

  // ===================================================================
  // RF-02: directorio de empleados, por páginas y con búsqueda.
  //
  // GET /empleados/listado?pagina=2&limite=10&buscar=ana
  //
  // No devuelve TODOS los empleados: devuelve solo una página. Con miles
  // de empleados, la base de datos hace el trabajo y el frontend recibe 10.
  // ===================================================================
  async listar({ pagina, limite, buscar }: ListarEmpleadosDto) {
    // Si hay texto de búsqueda, se filtra por nombre O por correo.
    // La bandera 'i' hace que no importen las mayúsculas.
    const texto = buscar?.trim();
    const filtro = texto
      ? {
          $or: [
            { nombre: new RegExp(escaparRegex(texto), 'i') },
            { correo: new RegExp(escaparRegex(texto), 'i') },
          ],
        }
      : {};

    // 1. Cuántos empleados cumplen el filtro (para armar la paginación)
    const total = await this.empleadoModel.countDocuments(filtro);

    // 2. Solo los empleados de la página pedida
    //    skip: salta los de las páginas anteriores | limit: toma solo "limite"
    const empleados = await this.empleadoModel
      .find(filtro)
      .sort({ nombre: 1 })
      .skip((pagina - 1) * limite)
      .limit(limite)
      .populate('certificaciones', 'nombre institucion vigencia')
      .populate('proyectos', 'nombre estado');

    return {
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
      empleados,
    };
  }

  // ===================================================================
  // RF-03 y RF-04: lista corta de empleados para llenar un <select>
  // (al asignar una certificación o un proyecto). Solo nombre y correo.
  // ===================================================================
  opciones() {
    return this.empleadoModel.find().select('nombre correo').sort({ nombre: 1 });
  }

  // ===================================================================
  // Listado completo de empleados (pantalla "Listados").
  // No responde a un requerimiento: se usa para revisar los datos.
  // Con miles de empleados conviene usar el directorio por páginas.
  // ===================================================================
  todos() {
    return this.empleadoModel
      .find()
      .sort({ nombre: 1 })
      .populate('certificaciones', 'nombre institucion')
      .populate('proyectos', 'nombre estado');
  }

  // ===================================================================
  // RF-05: buscar empleados por tecnologías, por certificaciones o por ambas.
  //  - tecnologías: colaboró en un proyecto que usó TODAS las tecnologías.
  //  - certificaciones: tiene TODAS las certificaciones, y están vigentes.
  //
  // GET /empleados/busqueda?tecnologias=react,node.js
  // GET /empleados/busqueda?certificaciones=scrum master
  // GET /empleados/busqueda?tecnologias=react,node.js&certificaciones=scrum master
  //
  // En lugar de traer TODOS los empleados y filtrar en el frontend, la
  // base de datos devuelve solo los que cumplen las condiciones.
  // ===================================================================
  async buscarPorTecnologiasYCertificaciones(filtros: BuscarEmpleadosDto) {
    // Si un parámetro no se envió, se usa una lista vacía
    const tecnologias = filtros.tecnologias ?? [];
    const certificaciones = filtros.certificaciones ?? [];

    if (tecnologias.length === 0 && certificaciones.length === 0) {
      throw new BadRequestException(
        'Indique al menos una tecnología o una certificación. Ej.: ?tecnologias=react o ?certificaciones=scrum master',
      );
    }

    const sinResultados = { total: 0, empleados: [] };

    // Aquí se juntan las condiciones que debe cumplir el empleado.
    // Al final se usan todas juntas con $and.
    const condiciones: Record<string, any>[] = [];

    // Ids de los proyectos que cumplen (solo si se buscó por tecnologías)
    let idsProyectos: Types.ObjectId[] = [];

    // ---------- Paso 1 (opcional): proyectos que usaron TODAS las tecnologías ----------
    if (tecnologias.length > 0) {
      // $all: el arreglo "tecnologias" del proyecto debe contener todos los valores
      // (con $in bastaría con que contenga al menos uno)
      const proyectos = await this.proyectoModel
        .find({ tecnologias: { $all: tecnologias } })
        .select('_id');

      if (proyectos.length === 0) {
        return sinResultados;   // ningún proyecto usó esas tecnologías
      }
      idsProyectos = proyectos.map((proyecto) => proyecto._id);

      // El empleado colaboró en al menos uno de esos proyectos
      condiciones.push({ proyectos: { $in: idsProyectos } });
    }

    // ---------- Paso 2 (opcional): certificaciones VIGENTES con esos nombres ----------
    if (certificaciones.length > 0) {
      // La búsqueda por nombre no distingue mayúsculas (bandera i) y es exacta (^ y $)
      const hoy = new Date();
      const certificacionesEncontradas = await this.certificacionModel
        .find({
          nombre: { $in: certificaciones.map((nombre) => new RegExp('^' + escaparRegex(nombre) + '$', 'i')) },
          $or: [
            { 'vigencia.expira': false },                      // no vence
            { 'vigencia.fechaExpiracion': { $gte: hoy } },     // o todavía no ha vencido
          ],
        })
        .select('_id nombre');

      // Puede haber varias certificaciones con el mismo nombre (de distintas
      // instituciones). Por eso se arma una condición por cada nombre pedido:
      // el empleado debe tener AL MENOS UNA de las certificaciones de ese nombre.
      for (const nombre of certificaciones) {
        const ids = certificacionesEncontradas
          .filter((certificacion) => certificacion.nombre.trim().toLowerCase() === nombre)
          .map((certificacion) => certificacion._id);

        // Si una certificación no existe (o está vencida), nadie puede cumplir
        if (ids.length === 0) {
          return sinResultados;
        }
        condiciones.push({ certificaciones: { $in: ids } });
      }
    }

    // ---------- Paso 3: empleados que cumplen TODAS las condiciones ----------
    // Si se buscó por tecnologías, solo se muestran los proyectos que cumplieron
    // el filtro (populate con match). Si no, se muestran todos sus proyectos.
    const populateProyectos =
      tecnologias.length > 0
        ? { path: 'proyectos', match: { _id: { $in: idsProyectos } }, select: 'nombre tecnologias estado' }
        : { path: 'proyectos', select: 'nombre tecnologias estado' };

    const empleados = await this.empleadoModel
      .find({ $and: condiciones })
      .populate(populateProyectos)
      .populate({ path: 'certificaciones', select: 'nombre institucion vigencia' })
      .sort({ nombre: 1 });

    return { total: empleados.length, empleados };
  }

  // ===================================================================
  // RF-03: asignar una certificación a un empleado
  // ===================================================================
  async agregarCertificacion(correo: string, certificacionId: string) {
    const existe = await this.certificacionModel.exists({ _id: certificacionId });
    if (!existe) {
      throw new NotFoundException('Certificación no encontrada.');
    }

    // $addToSet agrega el id solo si no está en el arreglo (evita duplicados)
    const empleado = await this.empleadoModel
      .findOneAndUpdate(
        { correo: correo.toLowerCase() },
        { $addToSet: { certificaciones: certificacionId } },
        { new: true },                         // devuelve el documento ya actualizado
      )
      .populate('certificaciones', 'nombre institucion');

    if (!empleado) {
      throw new NotFoundException('Empleado no encontrado.');
    }
    return empleado;
  }

  // ===================================================================
  // RF-04: asignar un empleado a un proyecto (relación "colaborar")
  // ===================================================================
  async asignarProyecto(correo: string, proyectoId: string) {
    const existe = await this.proyectoModel.exists({ _id: proyectoId });
    if (!existe) {
      throw new NotFoundException('Proyecto no encontrado.');
    }

    const empleado = await this.empleadoModel
      .findOneAndUpdate(
        { correo: correo.toLowerCase() },
        { $addToSet: { proyectos: proyectoId } },
        { new: true },
      )
      .populate('proyectos', 'nombre tecnologias estado');

    if (!empleado) {
      throw new NotFoundException('Empleado no encontrado.');
    }
    return empleado;
  }

  // ===================================================================
  // RF-06: eliminar un empleado
  // ===================================================================
  async eliminar(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('El identificador no es válido.');
    }

    const empleado = await this.empleadoModel.findByIdAndDelete(id);
    if (!empleado) {
      throw new NotFoundException('Empleado no encontrado.');
    }
    return { mensaje: 'Empleado eliminado.' };
  }
}
