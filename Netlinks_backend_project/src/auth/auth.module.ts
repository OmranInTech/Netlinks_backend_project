import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [
    // your existing controller
  ],
  providers: [
    // your existing providers
  ],
})
export class AuthModule {}