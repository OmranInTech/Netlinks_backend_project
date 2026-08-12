import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';

import { User } from './user.entity';

@Entity({ tableName: 'user_session' })
export class UserSession {
  @PrimaryKey()
  id!: string;

  @ManyToOne(() => User, {
    fieldName: 'user_id',
  })
  user!: User;

  @Property({ length: 255, unique: true })
  refreshTokenHash!: string;

  @Property()
  expiresAt!: Date;

  @Property({ nullable: true })
  revokedAt?: Date;

  @Property({ length: 45, nullable: true })
  ipAddress?: string;

  @Property({ type: 'text', nullable: true })
  userAgent?: string;

  @Property()
  createdAt: Date = new Date();
}