import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserSession } from '../entities/user-session/user-session.entity.js';
import { SmsService } from '../shared/services/sms.service.js';
import { AuthTokenService } from '../shared/services/token.service.js';
import { JwtStrategy } from '../shared/strategies/jwt.strategy.js';

@Module({
  imports: [
    HttpModule,

    ConfigModule,

    PassportModule,

    MikroOrmModule.forFeature([
      UserSession,
    ]),

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => {
        const secret =
          configService.get<string>(
            'JWT_ACCESS_SECRET',
          );

        if (!secret) {
          throw new Error(
            'JWT_ACCESS_SECRET is not configured',
          );
        }

        return {
          secret,

          signOptions: {
            expiresIn: '15m',
          },
        };
      },
    }),
  ],

  providers: [
    SmsService,
    AuthTokenService,
    JwtStrategy,
  ],

  exports: [
    SmsService,
    AuthTokenService,
    JwtModule,
  ],
})
export class AuthModule {}