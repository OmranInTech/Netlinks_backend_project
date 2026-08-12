import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';

import { SmsService } from '../../auth/sms.service';

import { User } from '../../shared/entities/user/user.entity';
import { Otp } from '../../shared/entities/user/otp.entity';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { OtpService } from './otp.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      User,
      Otp,
    ]),
    HttpModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    OtpService,
    SmsService,
  ],
})
export class UsersModule {}