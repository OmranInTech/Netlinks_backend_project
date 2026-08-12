
import { Injectable } from '@nestjs/common';

import { SendSmsDto } from './dto/send-sms.dto';
import { VerifySmsDto } from './dto/verify-sms.dto';

export interface MockSms {
  phoneNumber: string;
  otp: string;
  createdAt: Date;
}

@Injectable()
export class SmsService {
  private readonly otpStore = new Map<string, string>();

  private readonly messages: MockSms[] = [];

  sendSms(body: SendSmsDto) {
    this.otpStore.set(body.phoneNumber, body.otp);

    const message: MockSms = {
      phoneNumber: body.phoneNumber,
      otp: body.otp,
      createdAt: new Date(),
    };

    this.messages.unshift(message);

    if (this.messages.length > 50) {
      this.messages.pop();
    }

    console.log('----------------------------');
    console.log('MOCK SMS');
    console.log(`To: ${body.phoneNumber}`);
    console.log(`OTP: ${body.otp}`);
    console.log('----------------------------');

    return {
      success: true,
      message: 'SMS sent successfully',
    };
  }

  verifySms(body: VerifySmsDto) {
    const storedOtp = this.otpStore.get(body.phoneNumber);

    if (!storedOtp) {
      return {
        success: false,
        message: 'OTP not found',
      };
    }

    if (storedOtp !== body.otp) {
      return {
        success: false,
        message: 'Invalid OTP',
      };
    }

    this.otpStore.delete(body.phoneNumber);

    return {
      success: true,
      message: 'OTP verified successfully',
    };
  }

  getMessages(): MockSms[] {
    return this.messages;
  }
}
