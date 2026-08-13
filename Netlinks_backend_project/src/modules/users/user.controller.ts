import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

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

  // =========================
  // SIGNUP
  // =========================

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    return this.userService.signup(dto);
  }

  // =========================
  // VERIFY SIGNUP
  // =========================

  @Post('signup/verify')
  async verifySignup(@Body() dto: VerifySignupDto) {
    return this.userService.verifySignup(dto);
  }

  // =========================
  // LOGIN
  // =========================

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }

  // =========================
  // VERIFY LOGIN OTP
  // =========================

  @Post('login/verify')
  async verifyLogin(@Body() dto: VerifyLoginDto) {
    return this.userService.verifyLogin(dto);
  }
}