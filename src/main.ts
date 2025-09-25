import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { MyLogger } from './logger/my.logger';

async function bootstrap() {
  const logger = MyLogger.withContext('Bootstrap');
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: logger,
  });

  const config = new DocumentBuilder()
    .setTitle('Nestjs Crash API')
    .setDescription('API documentation for Nest crash project')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  // Static assets
  app.useStaticAssets(join(__dirname, '../upload'), {
    prefix: '/upload',
  });

  await app.listen(8000);
  logger.log('Application is running on: http://localhost:8000');
  logger.log('API Documentation is available at: http://localhost:8000/api');
}
bootstrap().catch((error) => {
  const logger = MyLogger.withContext('Bootstrap');
  logger.error('Error starting application', error.stack);
});
