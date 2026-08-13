import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  createHash,
  randomBytes,
  randomUUID,
} from 'crypto';

import { User } from '../../../shared/entities/user/user.entity';
import { UserSession } from '../../../shared/entities/user/user-session.entity';

@Injectable()
export class UserSessionService {
  constructor(
    private readonly em: EntityManager,
  ) {}

  /**
   * Create a new user session.
   *
   * The raw refresh token is returned to the client.
   * Only the SHA-256 hash is stored in the database.
   */
  async createSession(
    user: User,
    ipAddress?: string,
    userAgent?: string,
  ) {
    // Generate a cryptographically secure
    // random refresh token.
    const refreshToken =
      this.generateRefreshToken();

    // Never store the raw refresh token.
    const refreshTokenHash =
      this.hashToken(refreshToken);

    // Refresh token expires after 30 days.
    const expiresAt = new Date();

    expiresAt.setDate(
      expiresAt.getDate() + 30,
    );

    const session = new UserSession();

    // user_session.id is UUID.
    session.id = randomUUID();

    // Connect session to the user.
    session.user = user;

    // Store only the hash.
    session.refreshTokenHash =
      refreshTokenHash;

    session.expiresAt = expiresAt;

    // New session is not revoked.
    session.revokedAt = null;

    // Optional security information.
    session.ipAddress =
      ipAddress ?? null;

    session.userAgent =
      userAgent ?? null;

    session.createdAt = new Date();

    // Tell MikroORM to persist the entity.
    this.em.persist(session);

    // Write the entity to the database.
    await this.em.flush();

    return {
      session,
      refreshToken,
    };
  }

  /**
   * Generate a secure refresh token.
   */
  private generateRefreshToken(): string {
    return randomBytes(64).toString('hex');
  }

  /**
   * Hash refresh token using SHA-256.
   *
   * The raw refresh token is never stored
   * in the database.
   */
  private hashToken(
    token: string,
  ): string {
    return createHash('sha256')
      .update(token)
      .digest('hex');
  }

  /**
   * Find a valid session using a refresh token.
   */
  async findValidSession(
    refreshToken: string,
  ): Promise<UserSession> {
    // Convert the raw token into the
    // same hash stored in the database.
    const refreshTokenHash =
      this.hashToken(refreshToken);

    const session =
      await this.em.findOne(
        UserSession,
        {
          refreshTokenHash,

          // Only active sessions.
          revokedAt: null,
        },
        {
          // We need the User when refreshing.
          populate: ['user'],
        },
      );

    if (!session) {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    // Check expiration.
    if (
      session.expiresAt <= new Date()
    ) {
      throw new UnauthorizedException(
        'Refresh token has expired',
      );
    }

    return session;
  }

  /**
   * Revoke one session.
   *
   * Used for logout from one device.
   */
  async revokeSession(
    sessionId: string,
  ): Promise<void> {
    const session =
      await this.em.findOne(
        UserSession,
        {
          id: sessionId,
        },
      );

    if (!session) {
      throw new UnauthorizedException(
        'Session not found',
      );
    }

    session.revokedAt = new Date();

    await this.em.flush();
  }

  /**
   * Revoke all active sessions
   * belonging to a user.
   */
  async revokeAllSessions(
    userId: number,
  ): Promise<void> {
    const sessions =
      await this.em.find(
        UserSession,
        {
          user: userId,
          revokedAt: null,
        },
      );

    if (sessions.length === 0) {
      return;
    }

    const revokedAt = new Date();

    for (const session of sessions) {
      session.revokedAt = revokedAt;
    }

    await this.em.flush();
  }
}