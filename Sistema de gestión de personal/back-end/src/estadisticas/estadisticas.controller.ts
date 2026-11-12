import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';

@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  // GET /estadisticas/resumen         → avisa de las certificaciones que vencen en 30 días
  // GET /estadisticas/resumen?dias=90 → en 90 días
  // DefaultValuePipe: si no se envía ?dias, usa 30
  @Get('resumen')
  resumen(@Query('dias', new DefaultValuePipe(30), ParseIntPipe) dias: number) {
    return this.estadisticasService.resumen(dias);
  }
}
