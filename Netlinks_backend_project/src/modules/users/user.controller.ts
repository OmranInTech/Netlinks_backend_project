import {Body,Controller,Post,} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifySignupDto } from './dto/verify-signup.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyLoginDto } from './dto/verify-login.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    return this.userService.signup(dto);
  }

  @Post('signup/verify')
  async verifySignup(@Body() dto: VerifySignupDto) {
    return this.userService.verifySignup(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }

  @Post('login/verify')
  async verifyLogin(@Body() dto: VerifyLoginDto) {
    return this.userService.verifyLogin(dto);
  }
}