import {
  Entity,
  PrimaryKey,
  Property,
  OneToOne,
  Unique,
} from '@mikro-orm/decorators/legacy';
import { User } from '../users/user.entity.js';



@Entity({ tableName: 'user_two_factor' })
@Unique({ properties: ['user'] })
export class UserTwoFactor {
  @PrimaryKey({
    type: 'uuid',
    defaultRaw: 'gen_random_uuid()',
  })
  id!: string;

  @OneToOne(() => User, {
    fieldName: 'user_id',
  })
  user!: User;

  @Property({
    fieldName: 'enabled',
    type: 'datetime',
    nullable: true,
  })
  enabledAt: Date | null = null;

  @Property({
    type: 'string',
    length: 255,
    nullable: true,
  })
  secret: string | null = null;

  @Property({
    type: 'datetime',
  })
  createdAt: Date = new Date();

  @Property({
    type: 'datetime',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();
}