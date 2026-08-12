import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    HttpModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}