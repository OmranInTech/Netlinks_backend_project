import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';

import { AuthModule } from '../../auth/auth.module';

import { User } from '../../shared/entities/user/user.entity';
import { Otp } from '../../shared/entities/user/otp.entity';
import { UserTwoFactor } from '../../shared/entities/user/user-two-factor.entity';
import { UserSession } from '../../shared/entities/user/user-session.entity';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { OtpService } from './otp.service';

import { UserTwoFactorService } from './user-two-factor/user-two-factor.service';
import { UserTwoFactorController } from './user-two-factor/user-two-factor.controller';

import { UserSessionService } from './user-session/user-session.service';

@Module({
  imports: [
    AuthModule,

    MikroOrmModule.forFeature([
      User,
      Otp,
      UserTwoFactor,
      UserSession,
    ]),

    HttpModule,
  ],

  controllers: [
    UserController,
    UserTwoFactorController,
  ],

  providers: [
    UserService,
    OtpService,
    UserTwoFactorService,
    UserSessionService,
  ],

  exports: [
    UserTwoFactorService,
    UserSessionService,
  ],
})
export class UsersModule {}