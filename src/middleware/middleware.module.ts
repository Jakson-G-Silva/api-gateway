import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggingMiddleware } from './logging/logging.middleware';

@Module({
  imports: [
    // Throttler: Middleware de rate limiting que controla o número máximo de requisições
    // permitidas por cliente em um período de tempo específico. Previne abuso e protege
    // o servidor contra ataques de negação de serviço (DoS). Configuração: máximo de 100
    // requisições a cada 60 segundos (1 minuto) por IP.
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
  ],
  controllers: [],
  providers: [LoggingMiddleware],
})
export class MiddlewareModule {}
