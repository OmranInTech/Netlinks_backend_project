import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { EntityManager } from '@mikro-orm/postgresql';

import { User } from '../../shared/entities/user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly em: EntityManager,
  ) {
    const secret =
      configService.get<string>(
        'JWT_ACCESS_SECRET',
      );

    if (!secret) {
      throw new Error(
        'JWT_ACCESS_SECRET is not configured',
      );
    }

    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: secret,
    });
  }

  /**
   * Called automatically after Passport
   * successfully verifies the JWT signature.
   */
  async validate(payload: {
    sub: number;
  }) {
    if (!payload?.sub) {
      throw new UnauthorizedException(
        'Invalid access token',
      );
    }

    const user =
      await this.em.findOne(User, {
        id: payload.sub,
      });

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    /*
     * Whatever we return here becomes:
     *
     * request.user
     */
    return {
      id: user.id,
      fullname: user.fullname,
      phone: user.phone,
    };
  }
}