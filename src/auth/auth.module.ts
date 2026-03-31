// Autenticação e estratégias
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
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
  exports: [AuthService],
  // Provedores do módulo (serviços)
  providers: [AuthService],
})
export class AuthModule {}
