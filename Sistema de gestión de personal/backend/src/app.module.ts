import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificacionesModule } from './certificaciones/certificaciones.module';
import { ProyectosModule } from './proyectos/proyectos.module';
 
@Module({
  imports: [
    // Lee el archivo .env 
    ConfigModule.forRoot({ isGlobal: true }),
 
    // Conexión a MongoDB Atlas 
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
 
    CertificacionesModule,
 
    ProyectosModule,
  ],
})
export class AppModule {} 
