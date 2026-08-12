import { EntityManager } from '@mikro-orm/postgresql';
import {
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { SmsService } from '../../auth/sms.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifySignupDto } from './dto/verify-signup.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly i18n: I18nService,
    private readonly smsService: SmsService,
  ) {}

  async signup(dto: CreateUserDto) {
    const fullname = dto.fullname.trim();
    const phone = dto.phone;

    const existingPhone = await this.em.findOne(User, {
      phone,
    });

    if (existingPhone) {
      throw new ConflictException(
        await this.i18n.translate('errors.phoneAlreadyExists'),
      );
    }

    const user = this.em.create(User, {
      fullname,
      phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.em.persist(user).flush();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.smsService.sendOtp(phone, otp);

    return {
      id: user.id,
      fullname: user.fullname,
      phone: user.phone,
      createdAt: user.createdAt,
    };
  }

  async verifySignup(dto: VerifySignupDto) {
    const phone = dto.phone;

    const response = await this.smsService.verifyOtp(
      phone,
      dto.otp,
    );

    this.logger.log(
      'Mock verification response:',
      response,
    );

    return response;
  }
}