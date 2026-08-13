import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Otp } from '../../entities/otp/otp.entity.js';



@Injectable()
export class OtpService {
  constructor(
    private readonly em: EntityManager,
  ) {}

  async generateOtp(phone: string): Promise<string> {
    const code = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000,
    );

    const otp = new Otp();

    otp.phone = phone;
    otp.code = code;
    otp.expiresAt = expiresAt;
    otp.verified = false;

    await this.em.persist(otp).flush();

    return code;
  }

  async verifyOtp(
    phone: string,
    code: string,
  ): Promise<boolean> {
    const otp = await this.em.findOne(
      Otp,
      {
        phone,
        code,
        verified: false,
      },
      {
        orderBy: {
          createdAt: 'DESC',
        },
      },
    );

    if (!otp) {
      return false;
    }

    if (otp.expiresAt < new Date()) {
      return false;
    }

    otp.verified = true;

    await this.em.flush();

    return true;
  }
}