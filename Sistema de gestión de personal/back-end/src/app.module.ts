// Módulo raíz: reúne la configuración y los módulos de la aplicación
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificacionesModule } from './certificaciones/certificaciones.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { EstadisticasModule } from './estadisticas/estadisticas.module';

@Module({
  imports: [
    // Lee el archivo .env (antes: require('dotenv').config())
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión a MongoDB Atlas (antes: mongoose.connect(...)).
    // forRootAsync espera a que ConfigModule cargue el .env antes de leer la variable.
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),

    // Cada módulo agrupa todo lo de una entidad: esquema, servicio y controlador
    CertificacionesModule,
    EmpleadosModule,
    ProyectosModule,
    EstadisticasModule,   // resumen para el panel principal (consulta las otras colecciones)
  ],
})
export class AppModule {}
