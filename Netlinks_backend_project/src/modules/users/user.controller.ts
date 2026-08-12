import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { VerifySignupDto } from './dto/verify-signup.dto';
import { UserService } from './user.service';

@Controller('signup')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signup(@Body() dto: CreateUserDto) {
    return this.userService.signup(dto);
  }

  @Post('verify')
  async verifySignup(@Body() dto: VerifySignupDto) {
    return this.userService.verifySignup(dto);
  }

}