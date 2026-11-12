// Controlador de empleados: cada ruta responde a un requerimiento.
// GET /empleados (todos) se agregó solo para la pantalla "Listados";
// para el uso diario está el directorio por páginas (GET /empleados/listado).
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CrearEmpleadoDto } from './dto/crear-empleado.dto';
import { BuscarEmpleadosDto } from './dto/buscar-empleados.dto';
import { ListarEmpleadosDto } from './dto/listar-empleados.dto';
import { AsignarCertificacionDto, AsignarProyectoDto } from './dto/asignar.dto';

@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  // POST /empleados
  @Post()
  crear(@Body() datos: CrearEmpleadoDto) {
    return this.empleadosService.crear(datos);
  }

  // GET /empleados  →  todos los empleados (pantalla "Listados")
  @Get()
  todos() {
    return this.empleadosService.todos();
  }

  // GET /empleados/listado?pagina=1&limite=10&buscar=ana
  // Directorio por páginas (pantalla empleados.html)
  @Get('listado')
  listar(@Query() filtros: ListarEmpleadosDto) {
    return this.empleadosService.listar(filtros);
  }

  // GET /empleados/opciones  →  [{ _id, nombre, correo }, ...]
  // Lista corta para llenar el <select> de empleados
  @Get('opciones')
  opciones() {
    return this.empleadosService.opciones();
  }

  // GET /empleados/busqueda?tecnologias=react,node.js&certificaciones=scrum master,aws cloud practitioner
  // Se puede enviar solo tecnologias, solo certificaciones o ambos
  // @Query() toma los parámetros de la URL y los valida con BuscarEmpleadosDto
  @Get('busqueda')
  buscar(@Query() filtros: BuscarEmpleadosDto) {
    return this.empleadosService.buscarPorTecnologiasYCertificaciones(filtros);
  }

  // PATCH /empleados/bryan@empresax.net/certificaciones
  // { "certificacionId": "6a3dedfb4ee85c9ab15b3883" }
  @Patch(':correo/certificaciones')
  agregarCertificacion(@Param('correo') correo: string, @Body() datos: AsignarCertificacionDto) {
    return this.empleadosService.agregarCertificacion(correo, datos.certificacionId);
  }

  // PATCH /empleados/bryan@empresax.net/proyectos
  // { "proyectoId": "6a5b..." }
  @Patch(':correo/proyectos')
  asignarProyecto(@Param('correo') correo: string, @Body() datos: AsignarProyectoDto) {
    return this.empleadosService.asignarProyecto(correo, datos.proyectoId);
  }

  // DELETE /empleados/6a446e4aae227c178c5bb8d6
  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.empleadosService.eliminar(id);
  }
}
