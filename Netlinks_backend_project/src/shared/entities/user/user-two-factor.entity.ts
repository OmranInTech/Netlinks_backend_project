
import {
  Entity,
  PrimaryKey,
  Property,
  OneToOne,
  Unique,
} from '@mikro-orm/decorators/legacy';

import { User } from './user.entity';

@Entity({ tableName: 'user_two_factor' })
@Unique({ properties: ['user'] })
export class UserTwoFactor {
  @PrimaryKey()
  id!: number;

  @OneToOne(() => User)
  user!: User;

  @Property()
  enabled!: Date;

  @Property({ length: 255 })
  secret!: string;

  @Property()
  createdAt!: Date;

  @Property()
  updatedAt!: Date;
}
