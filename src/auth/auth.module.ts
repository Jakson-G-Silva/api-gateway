// Autenticação e estratégias
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// JWT para autenticação baseada em tokens
import { JwtModule } from '@nestjs/jwt';
// Passport para estratégias de autenticação (JWT, OAuth, etc)
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './service/auth.service';

@Module({
  imports: [
    // Middleware de autenticação
    PassportModule,
    // Cliente HTTP para requisições externas
    HttpModule,
    // Configuração dinâmica de JWT com variáveis de ambiente
    JwtModule.registerAsync({
      imports: [ConfigModule],
      // Factory pattern: Carrega secret do .env em tempo de execução
      useFactory: async (configService: ConfigService) => ({
        // Chave secreta para assinar tokens (do arquivo .env)
        secret: configService.get<string>('JWT_SECRET'),
        // Opções de assinatura: token expira em 24 horas
        signOptions: { expiresIn: '24h' },
      }),
      // Injeta ConfigService na factory
      inject: [ConfigService],
    }),
  ],
  // Módulos exportados para outros módulos (vazio = apenas uso interno)
  exports: [],
  // Provedores do módulo (serviços)
  providers: [AuthService],
})
export class AuthModule {}
