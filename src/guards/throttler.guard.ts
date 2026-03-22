import { Injectable } from '@nestjs/common';
// Guarda padrão para rate limiting (limite de requisições)
import { ThrottlerGuard } from '@nestjs/throttler';

// Guard customizado que identifica requisições por IP + User-Agent
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  // Override: Define como rastrear requisições (por IP + navegador)
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Combina IP do cliente com User-Agent para identificar requisições únicas
    return `${req.ip}-${req.headers['user-agent']}`;
  }
}
