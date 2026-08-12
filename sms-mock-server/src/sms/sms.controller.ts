import { Body, Controller, Post } from '@nestjs/common';
import { SendSmsDto } from './dto/send-sms.dto';
import { VerifySmsDto } from './dto/verify-sms.dto';
import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  sendSms(@Body() body: SendSmsDto) {
    return this.smsService.sendSms(body);
  }

  @Post('verify')
  verifySms(@Body() body: VerifySmsDto) {
    return this.smsService.verifySms(body);
  }
}