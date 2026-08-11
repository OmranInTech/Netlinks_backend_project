import { EntityManager } from '@mikro-orm/postgresql';
import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly i18n: I18nService,
  ) {}

  async signup(dto: CreateUserDto) {
    const fullname = dto.fullname.trim();

    // Normalize phone number
    // 0766 773 758 -> +93766773758
    // +93 766 773 758 -> +93766773758
    const phone = this.normalizePhone(dto.phone);

    // Check if phone already exists
    const existingPhone = await this.em.findOne(User, {
      phone,
    });

    if (existingPhone) {
      throw new ConflictException(
        await this.i18n.translate('errors.phoneAlreadyExists'),
      );
    }

    // Create user
    const user = this.em.create(User, {
      fullname,
      phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save user
   await this.em.persist(user).flush();

    return {
      id: user.id,
      fullname: user.fullname,
      phone: user.phone,
      createdAt: user.createdAt,
    };
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