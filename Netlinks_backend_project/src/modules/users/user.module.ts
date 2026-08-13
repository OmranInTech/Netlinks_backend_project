import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';

import { SmsService } from '../../auth/sms.service';

import { User } from '../../shared/entities/user/user.entity';
import { Otp } from '../../shared/entities/user/otp.entity';
import { UserTwoFactor } from '../../shared/entities/user/user-two-factor.entity';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { OtpService } from './otp.service';
import { UserTwoFactorService } from './user-two-factor/user-two-factor.service';
import { UserTwoFactorController } from './user-two-factor/user-two-factor.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      User,
      Otp,
      UserTwoFactor,
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
    SmsService,
    UserTwoFactorService,
  ],

  exports: [
    UserTwoFactorService,
  ],
})
export class UsersModule {}