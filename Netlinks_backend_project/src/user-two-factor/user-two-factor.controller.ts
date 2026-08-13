import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { UserTwoFactorService } from './user-two-factor.service.js';


@Controller('two-factor')
export class UserTwoFactorController {
  constructor(
    private readonly twoFactorService: UserTwoFactorService,
  ) {}

  @Post('setup')
  async setup(@Body() body: { userId: number }) {
    return this.twoFactorService.setup(body.userId);
  }

  @Post('verify-setup')
  async verifySetup(
    @Body() body: { userId: number; code: string },
  ) {
    return this.twoFactorService.verifySetup(
      body.userId,
      body.code,
    );
  }

  @Post('verify-login')
  async verifyLogin(
    @Body() body: { userId: number; code: string },
  ) {
    return this.twoFactorService.verifyLogin(
      body.userId,
      body.code,
    );
  }
}