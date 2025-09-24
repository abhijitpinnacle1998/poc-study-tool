import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './core/common/filters/global-exception.filter';
import { LoggerService } from './core/common/services/logger.service';
import { ResponseInterceptor } from '@/core/common/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new LoggerService();
  logger.setContext('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule, {
      logger,
    });

    const configService = app.get(ConfigService);
    const port = configService.get<number>('app.port') || 8000;
    const apiPrefix = configService.get<string>('app.apiPrefix') || 'api/v1';
    //const corsOrigins = configService.get<string[]>('app.corsOrigins') || ['*'];
    const config = new DocumentBuilder()
      .setTitle('Pyramid 2.0 API')
      .setDescription('CPaaS Platform API Documentation')
      .setVersion('1.0')
      // Add the servers configuration to show the correct base URL
      .addServer(`http://localhost:${port}/${apiPrefix}`, 'Local Development')
      .addBearerAuth()
      //.addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' })
      .addTag('auth', 'Authentication endpoints')
      .addTag('app', 'Application endpoints')
      .addTag('health', 'Health check endpoints')
      .addTag('organizations', 'Organization management')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // Setup Swagger BEFORE setting the global prefix
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });

    // Security middleware
    app.use(
      helmet({
        contentSecurityPolicy:
          process.env.NODE_ENV === 'production' ? undefined : false,
        crossOriginEmbedderPolicy: false,
      })
    );

    // CORS configuration
    app.enableCors({
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-api-key',
        'x-request-id',
      ],
      exposedHeaders: ['x-request-id'],
    });

    // Global pipes
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        validationError: {
          target: false,
          value: false,
        },
      })
    );

    // Global interceptors
    app.useGlobalInterceptors(new ResponseInterceptor());

    // Global exception filter
    app.useGlobalFilters(new GlobalExceptionFilter());

    // API versioning
    app.setGlobalPrefix(apiPrefix);

    // Graceful shutdown
    app.enableShutdownHooks();

    await app.listen(port);
    logger.log(
      `Application is running on: http://localhost:${port}/${apiPrefix}`
    );
    Logger.log(
      `API documentation is available at: http://localhost:8000/api/docs`
    );
  } catch (error) {
    logger.error(
      'Failed to start the application',
      error instanceof Error ? error.stack : String(error)
    );
    process.exit(1);
  }
}

void bootstrap();
