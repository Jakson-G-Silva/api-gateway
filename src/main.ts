import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // helmet: Middleware que define headers HTTP de segurança
  app.use(
    helmet({
      // contentSecurityPolicy: Define fontes permitidas para recursos
      contentSecurityPolicy: {
        directives: {
          // defaultSrc: Fonte padrão (fallback) para todos os recursos
          defaultSrc: ["'self'"],
          // scriptSrc: Permite apenas scripts do próprio site
          scriptSrc: ["'self'"],
          // styleSrc: Estilos do site + inline (CSS necessário)
          styleSrc: ["'self'", "'unsafe-inline'"],
          // imgSrc: Site + data URIs + HTTPS
          imgSrc: ["'self'", "'data:'", "'https:'"],
        },
      },
      // crossOriginEmbedderPolicy: false permite iframes de outros domínios
      crossOriginEmbedderPolicy: false,
      // hsts: Força HTTPS (31536000s = 1 ano)
      hsts: {
        maxAge: 31536000,
        // includeSubDomains: HSTS aplica-se a subdomínios também
        includeSubDomains: true,
        // preload: Habilita pré-carregamento HSTS em navegadores
        preload: true,
      },
    }),
  );

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['*'];

      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
    ],
    credentials: true,
    maxAge: 86400, // 24 hours
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Marketplace API Gateway')
    .setDescription('API Gateway for Marketplace Microservices')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3005;
  await app.listen(port);

  console.log(`🚀 API Gateway running on port ${port}`);
  console.log(`📚 Swagger documentation: <http://localhost>:${port}/api`);
}

bootstrap();
