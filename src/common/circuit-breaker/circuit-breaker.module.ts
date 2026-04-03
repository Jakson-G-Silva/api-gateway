import { Module } from '@nestjs/common';
import { CircuitBreakerService } from './circuit-breaker.servcice';

@Module({
  providers: [CircuitBreakerService],
  exports: [CircuitBreakerService],
})
export class CircuitBreakerModule {}
