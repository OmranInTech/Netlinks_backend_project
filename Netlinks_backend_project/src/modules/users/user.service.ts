
import { EntityManager } from '@mikro-orm/postgresql';
import {
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { SmsService } from '../../auth/sms.service';
import { User } from '../../shared/entities/user/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { VerifySignupDto } from './dto/verify-signup.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyLoginDto } from './dto/verify-login.dto';
import { OtpService } from './otp.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly i18n: I18nService,
    private readonly smsService: SmsService,
    private readonly otpService: OtpService,
  ) {}

  // =========================
  // SIGNUP
  // =========================

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

    // Generate OTP and save it in the database
    const otp = await this.otpService.generateOtp(phone);

    // Send OTP to mock SMS server
    await this.smsService.sendOtp(phone, otp);

    this.logger.log(`Signup OTP sent to ${phone}`);

    return {
      id: user.id,
      fullname: user.fullname,
      phone: user.phone,
      createdAt: user.createdAt,
    };
  }

  // =========================
  // VERIFY SIGNUP
  // =========================

  async verifySignup(dto: VerifySignupDto) {
    const phone = dto.phone;

    const verified = await this.otpService.verifyOtp(
      phone,
      dto.otp,
    );

    if (!verified) {
      return {
        success: false,
        message: 'Invalid or expired OTP',
      };
    }

    this.logger.log(
      `Signup OTP verified successfully for ${phone}`,
    );

    return {
      success: true,
      message: 'OTP verified successfully',
    };
  }

  // =========================
  // LOGIN
  // =========================

  async login(dto: LoginDto) {
    const phone = dto.phone;

    const user = await this.em.findOne(User, {
      phone,
    });

    if (!user) {
      throw new ConflictException(
        await this.i18n.translate('errors.phoneNotFound'),
      );
    }

    // Generate a new OTP and save it in the database
    const otp = await this.otpService.generateOtp(phone);

    // Send OTP to mock SMS server
    await this.smsService.sendOtp(phone, otp);

    this.logger.log(`Login OTP sent to ${phone}`);

    return {
      success: true,
      message: 'Login OTP sent successfully',
      phone: user.phone,
    };
  }

  // =========================
  // VERIFY LOGIN
  // =========================

  async verifyLogin(dto: VerifyLoginDto) {
    const phone = dto.phone;

    const verified = await this.otpService.verifyOtp(
      phone,
      dto.otp,
    );

    if (!verified) {
      return {
        success: false,
        message: 'Invalid or expired OTP',
      };
    }

    const user = await this.em.findOne(User, {
      phone,
    });

    if (!user) {
      throw new ConflictException(
        await this.i18n.translate('errors.phoneNotFound'),
      );
    }

    this.logger.log(
      `Login OTP verified successfully for ${phone}`,
    );

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        fullname: user.fullname,
        phone: user.phone,
      },
    };
  }
}
