import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { User } from '../../entities/users/user.entity.js';
import { UserSession } from '../../entities/user-session/user-session.entity.js';


@Injectable()
export class AuthSessionService {
  constructor(
    private readonly em: EntityManager,
  ) {}

  /**
   * Create a new user session.
   *
   * The raw refresh token is NEVER stored.
   * Only the hashed refresh token is stored.
   */
  async createSession(params: {
    user: User;
    refreshTokenHash: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<UserSession> {
    const session = this.em.create(UserSession, {
      id: randomUUID(),

      user: params.user,

      refreshTokenHash: params.refreshTokenHash,

      expiresAt: params.expiresAt,

      revokedAt: undefined,

      ipAddress: params.ipAddress,

      userAgent: params.userAgent,

      createdAt: new Date(),
    });

    this.em.persist(session);

    await this.em.flush();

    return session;
  }

  /**
   * Find a refresh-token session that is:
   *
   * 1. Not revoked
   * 2. Not expired
   */
  async findActiveSession(
    refreshTokenHash: string,
  ): Promise<UserSession | null> {
    const session = await this.em.findOne(
      UserSession,
      {
        refreshTokenHash,
        revokedAt: null,
      },
    );

    if (!session) {
      return null;
    }

    if (session.expiresAt <= new Date()) {
      return null;
    }

    return session;
  }

  /**
   * Revoke one session.
   *
   * Used when the user logs out from one device.
   */
  async revokeSession(
    session: UserSession,
  ): Promise<void> {
    session.revokedAt = new Date();

    await this.em.flush();
  }

  /**
   * Revoke all sessions belonging to a user.
   *
   * Used for:
   * - Logout from all devices
   * - Security event
   * - Password/security changes
   */
  async revokeAllUserSessions(
    userId: number,
  ): Promise<void> {
    const sessions = await this.em.find(
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