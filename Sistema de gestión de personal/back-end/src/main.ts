// Punto de entrada de la aplicación (equivale al index.js de Express)
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { setServers } from 'node:dns/promises';
import { AppModule } from './app.module';

async function bootstrap() {
  // Para el error querySrv ECONNREFUSED al conectarse a MongoDB Atlas.
  // Debe ejecutarse ANTES de crear la aplicación, porque ahí se abre la conexión.
  setServers(['1.1.1.1', '8.8.8.8']);

  const app = await NestFactory.create(AppModule);

  // Permite la comunicación entre dominios diferentes (antes: app.use(cors()))
  app.enableCors();

  // Valida AUTOMÁTICAMENTE los datos que llegan, usando las reglas de los DTO.
  // Reemplaza los if (!nombre || !correo ...) que se escribían en cada ruta de Express.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // elimina los campos que no están en el DTO
      forbidNonWhitelisted: true, // y responde 400 si alguien envía campos de más
      transform: true,            // convierte los datos a los tipos del DTO
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log('Servidor corriendo en http://localhost:' + port);
}

bootstrap();
