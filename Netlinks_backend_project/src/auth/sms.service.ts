import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SmsService {
  constructor(private readonly httpService: HttpService) {}

  async sendOtp(phoneNumber: string, otp: string) {
    const response = await firstValueFrom(
      this.httpService.post('http://localhost:4000/api/sms/send', {
        phoneNumber,
        otp,
      }),
    );

    return response.data;
  }
}