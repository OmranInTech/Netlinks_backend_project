import {
  Entity,
  PrimaryKey,
  Property,
  Index,
} from '@mikro-orm/decorators/legacy';

@Entity()
export class Otp {
  @PrimaryKey({ type: 'integer' })
  id!: number;

  @Index()
  @Property({ type: 'string' })
  phone!: string;

  @Property({ type: 'string' })
  code!: string;

  @Property({ type: 'datetime' })
  expiresAt!: Date;

  @Property({ type: 'datetime' })
  createdAt: Date = new Date();

  @Property({ type: 'boolean' })
  verified: boolean = false;
}