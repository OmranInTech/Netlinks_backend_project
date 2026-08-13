import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  generateSecret,
  generateURI,
  verify,
} from 'otplib';
import * as QRCode from 'qrcode';
import { UserTwoFactor } from '../entities/two-factor/user-two-factor.entity.js';
import { User } from '../entities/users/user.entity.js';


@Injectable()
export class UserTwoFactorService {
  constructor(
    private readonly em: EntityManager,
  ) {}

  // =========================
  // GET OR CREATE
  // =========================

  async getOrCreate(userId: number): Promise<UserTwoFactor> {
    const user = await this.em.findOne(User, {
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let twoFactor = await this.em.findOne(UserTwoFactor, {
      user,
    });

    if (!twoFactor) {
      twoFactor = new UserTwoFactor();

      twoFactor.user = user;
      twoFactor.enabledAt = null;
      twoFactor.secret = null;

      this.em.persist(twoFactor);
      await this.em.flush();
    }

    return twoFactor;
  }

  // =========================
  // SETUP 2FA
  // =========================

  async setup(userId: number) {
    const user = await this.em.findOne(User, {
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let twoFactor = await this.em.findOne(UserTwoFactor, {
      user,
    });

    if (!twoFactor) {
      twoFactor = new UserTwoFactor();

      twoFactor.user = user;
      twoFactor.enabledAt = null;
      twoFactor.secret = null;

      this.em.persist(twoFactor);
    }

    if (twoFactor.enabledAt) {
      throw new BadRequestException(
        'Two-factor authentication is already enabled',
      );
    }

    // Generate a new secret
    const secret = generateSecret();

    // Generate authenticator URI
    const otpauthUrl = generateURI({
      issuer: 'YOUR_APP_NAME',
      label: user.phone,
      secret,
    });

    // Save secret
    twoFactor.secret = secret;

    await this.em.flush();

    // Generate QR code
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    return {
      success: true,
      message: 'Two-factor authentication setup generated',

      // Use this value to display the QR code
      qrCode,

      // Useful for testing/debugging
      otpauthUrl,
    };
  }

  // =========================
  // VERIFY 2FA SETUP
  // =========================

  async verifySetup(
    userId: number,
    code: string,
  ) {
    const user = await this.em.findOne(User, {
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const twoFactor = await this.em.findOne(UserTwoFactor, {
      user,
    });

    if (!twoFactor) {
      throw new BadRequestException(
        'Two-factor authentication setup has not been started',
      );
    }

    if (!twoFactor.secret) {
      throw new BadRequestException(
        'Two-factor authentication secret is missing',
      );
    }

    if (twoFactor.enabledAt) {
      throw new BadRequestException(
        'Two-factor authentication is already enabled',
      );
    }

    const result = await verify({
      secret: twoFactor.secret,
      token: code,
    });

    if (!result.valid) {
      throw new UnauthorizedException(
        'Invalid two-factor authentication code',
      );
    }

    // Timestamp means 2FA is enabled
    twoFactor.enabledAt = new Date();

    await this.em.flush();

    return {
      success: true,
      message: 'Two-factor authentication enabled successfully',
      enabledAt: twoFactor.enabledAt,
    };
  }

  // =========================
  // VERIFY 2FA DURING LOGIN
  // =========================

  async verifyLogin(
    userId: number,
    code: string,
  ) {
    const user = await this.em.findOne(User, {
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const twoFactor = await this.em.findOne(UserTwoFactor, {
      user,
    });

    if (!twoFactor) {
      throw new BadRequestException(
        'Two-factor authentication is not configured',
      );
    }

    if (!twoFactor.enabledAt) {
      throw new BadRequestException(
        'Two-factor authentication is not enabled',
      );
    }

    if (!twoFactor.secret) {
      throw new BadRequestException(
        'Two-factor authentication secret is missing',
      );
    }

    const result = await verify({
      secret: twoFactor.secret,
      token: code,
    });

    if (!result.valid) {
      throw new UnauthorizedException(
        'Invalid two-factor authentication code',
      );
    }

    return {
      success: true,
      message: 'Two-factor authentication verified successfully',
      user: {
        id: user.id,
        fullname: user.fullname,
        phone: user.phone,
      },
    };
  }
}