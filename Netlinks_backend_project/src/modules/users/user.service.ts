import { HttpService } from '@nestjs/axios';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { firstValueFrom } from 'rxjs';

import { CreateUserDto } from './dto/create-user.dto';
import { VerifySignupDto } from './dto/verify-signup.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly i18n: I18nService,
    private readonly httpService: HttpService,
  ) {}

  async signup(dto: CreateUserDto) {
    
    const fullname = dto.fullname.trim();

    // Normalize phone number
    // 0766 773 758 -> +93766773758
    // +93 766 773 758 -> +93766773758
    const phone = this.normalizePhone(dto.phone);


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
    const response = await firstValueFrom(
      this.httpService.post(
        'http://localhost:4000/api/sms/send',
        {
          phoneNumber: phone,
          otp,
        },
      ),
    );

    return {
      id: user.id,
      fullname: user.fullname,
      phone: user.phone,
      createdAt: user.createdAt,
    };
  }

  async verifySignup(dto: VerifySignupDto) {
    const phone = this.normalizePhone(dto.phone);
    const response = await firstValueFrom(
      this.httpService.post(
        'http://localhost:4000/api/sms/verify',
        {
          phoneNumber: phone,
          otp: dto.otp,
        },
      ),
    );

    console.log('Mock verification response:', response.data);

    return response.data;
  }


  private normalizePhone(phone: string): string {
    const normalized = phone.replace(/\s+/g, '');

    if (normalized.startsWith('0')) {
      return `+93${normalized.substring(1)}`;
    }

    if (normalized.startsWith('+93')) {
      return normalized;
    }

    throw new ConflictException(
      this.i18n.translate('errors.invalidPhone'),
    );
  }
}