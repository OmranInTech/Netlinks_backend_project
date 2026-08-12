import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';
import {
  I18nValidationExceptionFilter,
  I18nValidationPipe,
} from 'nestjs-i18n';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(
    new I18nValidationPipe(),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter(),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Taxi Backend API')
    .setDescription(
      'API documentation for the Taxi Backend application',
    )
    .setVersion('1.0')
    .addTag('Signup')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(3000);
}

bootstrap();