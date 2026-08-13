import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';

import { User } from './user.entity';

@Entity({ tableName: 'user_session' })
export class UserSession {
  @PrimaryKey({
    type: 'uuid',
    defaultRaw: 'gen_random_uuid()',
  })
  id!: string;

  @ManyToOne(() => User, {
    fieldName: 'user_id',
  })
  user!: User;

  @Property({
    type: 'string',
    length: 255,
    unique: true,
  })
  refreshTokenHash!: string;

  @Property({
    type: 'datetime',
  })
  expiresAt!: Date;

  @Property({
    type: 'datetime',
    nullable: true,
  })
  revokedAt?: Date;

  @Property({
    type: 'string',
    length: 45,
    nullable: true,
  })
  ipAddress?: string;

  @Property({
    type: 'text',
    nullable: true,
  })
  userAgent?: string;

  @Property({
    type: 'datetime',
  })
  createdAt: Date = new Date();
}