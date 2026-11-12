// Controlador: define las RUTAS (antes: routes/certificacion.route.js)
import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CertificacionesService } from './certificaciones.service';
import { CrearCertificacionDto } from './dto/crear-certificacion.dto';

@Controller('certificaciones')        // prefijo: /certificaciones
export class CertificacionesController {
  constructor(private readonly certificacionesService: CertificacionesService) {}

  // POST /certificaciones
  @Post()
  crear(@Body() datos: CrearCertificacionDto) {
    return this.certificacionesService.crear(datos);
  }

  // GET /certificaciones  →  todas las certificaciones (pantalla "Listados")
  @Get()
  todas() {
    return this.certificacionesService.todas();
  }

  // GET /certificaciones/opciones  →  [{ _id, nombre, institucion }, ...]
  @Get('opciones')
  opciones() {
    return this.certificacionesService.opciones();
  }

  // GET /certificaciones/primeras/3
  // ParseIntPipe convierte "3" en número y responde 400 si no es un número
  @Get('primeras/:cantidad')
  primeras(@Param('cantidad', ParseIntPipe) cantidad: number) {
    return this.certificacionesService.primeras(cantidad);
  }

  // GET /certificaciones/top-instituciones/5
  @Get('top-instituciones/:top')
  topInstituciones(@Param('top', ParseIntPipe) top: number) {
    return this.certificacionesService.topInstituciones(top);
  }

  // GET /certificaciones/por-vencer?dias=30
  @Get('por-vencer')
  porVencer(@Query('dias', ParseIntPipe) dias: number) {
    return this.certificacionesService.porVencer(dias);
  }
}
