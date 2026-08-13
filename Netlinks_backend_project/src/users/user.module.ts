import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module.js';
import { User } from '../entities/users/user.entity.js';
import { Otp } from '../entities/otp/otp.entity.js';
import { UserTwoFactor } from '../entities/two-factor/user-two-factor.entity.js';
import { UserSession } from '../entities/user-session/user-session.entity.js';
import { UserController } from '../auth/auth.controller.js';
import { UserTwoFactorController } from '../user-two-factor/user-two-factor.controller.js';
import { AuthService } from '../auth/auth.service.js';
import { OtpService } from '../shared/services/otp.service.js';
import { UserTwoFactorService } from '../user-two-factor/user-two-factor.service.js';
import { UserSessionService } from '../shared/services/user-session.service.js';



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
    AuthService,
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