import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Generate a short-lived JWT access token.
   */
  async generateAccessToken(userId: number): Promise<string> {
    const payload = {
      sub: userId,
    };

    return this.jwtService.signAsync(payload);
  }

  /**
   * Generate a cryptographically secure refresh token.
   *
   * The raw token is returned to the client.
   * We NEVER store the raw token in the database.
   */
  generateRefreshToken(): string {
    return randomBytes(64).toString('hex');
  }

  /**
   * Hash a refresh token before storing it in the database.
   */
  hashRefreshToken(refreshToken: string): string {
    return createHash('sha256')
      .update(refreshToken)
      .digest('hex');
  }

  /**
   * Generate both tokens after successful authentication.
   */
  async generateTokenPair(userId: number) {
    const accessToken =
      await this.generateAccessToken(userId);

    const refreshToken =
      this.generateRefreshToken();

    const refreshTokenHash =
      this.hashRefreshToken(refreshToken);

    return {
      accessToken,
      refreshToken,
      refreshTokenHash,
    };
  }
}