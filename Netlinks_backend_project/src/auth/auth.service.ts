import { EntityManager } from '@mikro-orm/postgresql';
import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { verify as verifyAuthenticatorCode } from 'otplib';
import { SmsService } from '../shared/services/sms.service.js';
import { OtpService } from '../shared/services/otp.service.js';
import { AuthTokenService } from '../shared/services/token.service.js';
import { UserSessionService } from '../shared/services/user-session.service.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { User } from '../entities/users/user.entity.js';
import { VerifySignupDto } from './dto/verify-signup.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { VerifyLoginDto } from './dto/verify-login.dto.js';
import { UserTwoFactor } from '../entities/two-factor/user-two-factor.entity.js';



@Injectable()
export class AuthService {
  private readonly logger = new Logger(
    AuthService.name,
  );

  constructor(
    private readonly em: EntityManager,
    private readonly i18n: I18nService,
    private readonly smsService: SmsService,
    private readonly otpService: OtpService,
    private readonly authTokenService: AuthTokenService,
    private readonly userSessionService: UserSessionService,
  ) {}

  async signup(dto: CreateUserDto) {
    const fullname = dto.fullname.trim();
    const phone = dto.phone;

    const existingPhone =
      await this.em.findOne(User, {
        phone,
      });

    if (existingPhone) {
      throw new ConflictException(
        await this.i18n.translate(
          'errors.phoneAlreadyExists',
        ),
      );
    }

    const user = this.em.create(User, {
      fullname,
      phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.em.persist(user).flush();

    const otp =
      await this.otpService.generateOtp(
        phone,
      );

    await this.smsService.sendOtp(
      phone,
      otp,
    );

    this.logger.log(
      `Signup OTP sent to ${phone}`,
    );

    return {
      id: user.id,
      fullname: user.fullname,
      phone: user.phone,
      createdAt: user.createdAt,
    };
  }

  async verifySignup(
    dto: VerifySignupDto,
  ) {
    const phone = dto.phone;

    const verified =
      await this.otpService.verifyOtp(
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

  async login(dto: LoginDto) {
    const phone = dto.phone;

    const user =
      await this.em.findOne(User, {
        phone,
      });

    if (!user) {
      throw new ConflictException(
        await this.i18n.translate(
          'errors.phoneNotFound',
        ),
      );
    }

    const otp =
      await this.otpService.generateOtp(
        phone,
      );

    await this.smsService.sendOtp(
      phone,
      otp,
    );

    this.logger.log(
      `Login OTP sent to ${phone}`,
    );

    return {
      success: true,
      message: 'Login OTP sent successfully',
      phone: user.phone,
    };
  }

  async verifyLogin(
    dto: VerifyLoginDto,
  ) {
    const phone = dto.phone;

    const verified =
      await this.otpService.verifyOtp(
        phone,
        dto.otp,
      );

    if (!verified) {
      return {
        success: false,
        message: 'Invalid or expired OTP',
      };
    }

    const user =
      await this.em.findOne(User, {
        phone,
      });

    if (!user) {
      throw new ConflictException(
        await this.i18n.translate(
          'errors.phoneNotFound',
        ),
      );
    }

    this.logger.log(
      `Login OTP verified successfully for ${phone}`,
    );

    const twoFactor =
      await this.em.findOne(
        UserTwoFactor,
        {
          user,
        },
      );

    const twoFactorEnabled =
      !!twoFactor?.enabledAt;

    /*
     * OTP is valid.
     *
     * If 2FA is enabled, don't issue tokens yet.
     * The user must verify Google Authenticator.
     */
    if (twoFactorEnabled) {
      this.logger.log(
        `2FA required for user ${user.id}`,
      );

      return {
        success: true,
        requiresTwoFactor: true,
        message:
          'Two-factor authentication required',

        user: {
          id: user.id,
          fullname: user.fullname,
          phone: user.phone,
        },
      };
    }

    /*
     * No 2FA.
     *
     * Authentication is complete.
     */
    const tokens =
      await this.createLoginSession(user);

    return {
      success: true,
      requiresTwoFactor: false,
      message: 'Login successful',

      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,

      user: {
        id: user.id,
        fullname: user.fullname,
        phone: user.phone,
      },
    };
  }

  async verifyLoginTwoFactor(
    userId: number,
    code: string,
  ) {
    const user =
      await this.em.findOne(User, {
        id: userId,
      });

    if (!user) {
      throw new ConflictException(
        await this.i18n.translate(
          'errors.phoneNotFound',
        ),
      );
    }

    const twoFactor =
      await this.em.findOne(
        UserTwoFactor,
        {
          user,
        },
      );

    if (!twoFactor) {
      throw new UnauthorizedException(
        'Two-factor authentication is not configured',
      );
    }

    if (!twoFactor.enabledAt) {
      throw new UnauthorizedException(
        'Two-factor authentication is not enabled',
      );
    }

    if (!twoFactor.secret) {
      throw new UnauthorizedException(
        'Two-factor authentication secret is missing',
      );
    }

    const result =
      await verifyAuthenticatorCode({
        secret: twoFactor.secret,
        token: code,
      });

    if (!result.valid) {
      throw new UnauthorizedException(
        'Invalid two-factor authentication code',
      );
    }

    this.logger.log(
      `2FA login verified successfully for user ${user.id}`,
    );

    /*
     * OTP was already verified.
     *
     * Google Authenticator is now verified.
     *
     * Authentication is completely finished.
     */
    const tokens =
      await this.createLoginSession(user);

    return {
      success: true,
      message: 'Login successful',

      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,

      user: {
        id: user.id,
        fullname: user.fullname,
        phone: user.phone,
      },
    };
  }

  /**
   * Create:
   *
   * 1. Access JWT
   * 2. Refresh token
   * 3. Database session
   */
  private async createLoginSession(
    user: User,
  ) {
    /*
     * Generate short-lived access token.
     */
    const accessToken =
      await this.authTokenService.generateAccessToken(
        user.id,
      );

    /*
     * Generate refresh token and
     * store its hash in user_session.
     */
    const {
      refreshToken,
    } =
      await this.userSessionService.createSession(
        user,
      );

    return {
      accessToken,
      refreshToken,
    };
  }
}