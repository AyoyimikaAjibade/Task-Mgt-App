import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: ['http://frontend-service', 'http://localhost:3000'],
    credentials: true,
  });

  // Enable Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription(
      'RESTful API for Task Management application. Features include:\n\n' +
      '* User authentication (register/login)\n' +
      '* Task CRUD operations\n' +
      '* Task filtering and sorting\n' +
      '* Task statistics\n\n' +
      'For authentication endpoints, no token is required. All other endpoints require a valid JWT token.'
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Tasks', 'Task management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Add custom options for Swagger UI
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'list',
      defaultModelsExpandDepth: 3,
      defaultModelExpandDepth: 3,
    },
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const PORT = process.env.PORT;
  const HOST = process.env.HOST;
  console.log("==I AM RNNING THE LATEST CODE==");
  await app.listen(3001, '0.0.0.0');
  console.log(`🚀 Application is running at http://${HOST}:${PORT}`);
}
bootstrap();
