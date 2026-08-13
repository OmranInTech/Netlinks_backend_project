import {
  Entity,
  PrimaryKey,
  Property,
  OneToOne,
} from '@mikro-orm/decorators/legacy';
import { UserTwoFactor } from '../two-factor/user-two-factor.entity.js';



@Entity()
export class User {
  @PrimaryKey({ type: 'integer' })
  id!: number;

  @Property({ length: 100, type: 'string' })
  fullname!: string;

  @Property({ length: 20, type: 'string' })
  phone!: string;

  @Property({ nullable: true, type: 'datetime' })
  deletedAt?: Date;

  @Property({ type: 'datetime' })
  createdAt: Date = new Date();

  @Property({
    type: 'datetime',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();

  @OneToOne(
    () => UserTwoFactor,
    (userTwoFactor) => userTwoFactor.user,
    {
      nullable: true,
    },
  )
  twoFactor?: UserTwoFactor;
}