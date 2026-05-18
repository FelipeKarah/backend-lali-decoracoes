import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../../shared/services/prisma.service';
import { JwtStrategy } from '../../shared/strategies/jwt.strategy';

// Controllers
import { RegisterController } from './use-cases/register/register.controller';
import { LoginController } from './use-cases/login/login.controller';
import { MeController } from './use-cases/me/me.controller';
import { GoogleController } from './use-cases/google/google.controller';
import { WhatsAppController } from './use-cases/whatsapp/whatsapp.controller';

// Services
import { RegisterService } from './use-cases/register/register.service';
import { LoginService } from './use-cases/login/login.service';
import { MeService } from './use-cases/me/me.service';
import { GoogleService } from './use-cases/google/google.service';
import { WhatsAppService } from './use-cases/whatsapp/whatsapp.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'lali_secret_key_2025',
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    RegisterController,
    LoginController,
    MeController,
    GoogleController,
    WhatsAppController,
  ],
  providers: [
    PrismaService,
    RegisterService,
    LoginService,
    MeService,
    GoogleService,
    WhatsAppService,
    JwtStrategy,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
