// Controlador: define las RUTAS (antes: routes/certificacion.route.js)
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CertificacionesService } from './certificaciones.service';
import { CrearCertificacionDto } from './dto/crear-certificacion.dto';
 

@Controller('certificaciones')
export class CertificacionesController {
  constructor(private readonly certificacionesService: CertificacionesService) {}

  // POST: /certificaciones  
  @Post()
  crear(@Body() datos: CrearCertificacionDto){
    return this.certificacionesService.crear(datos); // Envía los datos al servicio y devuelve la certificación creada
  }


  // GET: /certificaciones 
  @Get()
  obtenerTodas(){
    return this.certificacionesService.obtenerTodas();
  }

}
