import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

// Instância do guard JWT de Passport
const JwtGuard = AuthGuard('jwt');

/**
 * Guard de autenticação JWT que valida tokens.
 * Permite saltar validação para rotas públicas usando o decorador @Public()
 */
@Injectable()
export class JwtAuthGuard extends JwtGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Valida se a rota é pública. Se for, omite autenticação.
   * Caso contrário, executa a validação JWT padrão.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  /**
   * Gerencia o resultado da autenticação.
   * Lança exceção se houver erro ou usuário não existir.
   */
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
