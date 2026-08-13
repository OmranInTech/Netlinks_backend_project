import {Body,Controller,Post,} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { VerifySignupDto } from './dto/verify-signup.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { VerifyLoginDto } from './dto/verify-login.dto.js';


@Controller()
export class UserController {
  constructor(
    private readonly userService: AuthService,
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