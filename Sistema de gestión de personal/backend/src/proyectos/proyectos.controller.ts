import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CrearProyectoDto } from './dto/crear-proyecto.dto';
 
@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}
 
  // POST /proyectos
  @Post()
  crear(@Body() datos: CrearProyectoDto) {
    return this.proyectosService.crear(datos);
  }
 
  // GET /proyectos/tecnologias  →  ["mongodb", "node.js", "react"]
  @Get('tecnologias')
  tecnologias() {
    return this.proyectosService.tecnologias();
  }
}
