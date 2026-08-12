import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsPhoneNumber,
  Matches,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @IsNotEmpty({
    message: i18nValidationMessage('errors.required'),
  })
  fullname!: string;

  @IsNotEmpty({
    message: i18nValidationMessage('errors.required'),
  })
  @IsPhoneNumber('AF', {
    message: i18nValidationMessage('errors.invalidPhone'),
  })
  @Matches(/^(\+93|0)\s?7\d{2}\s?\d{3}\s?\d{3}$/, {
    message: i18nValidationMessage('errors.invalidPhone'),
  })
  @Transform(({ value }) => {
    const normalized = value.replace(/\s+/g, '');

    if (normalized.startsWith('0')) {
      return `+93${normalized.substring(1)}`;
    }

    return normalized;
  })
  phone!: string;
}