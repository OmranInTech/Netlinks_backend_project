
import {
  Body,
  Controller,
  Get,
  Header,
  Post,
} from '@nestjs/common';

import { SendSmsDto } from './dto/send-sms.dto';
import { VerifySmsDto } from './dto/verify-sms.dto';
import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {
  constructor(
    private readonly smsService: SmsService,
  ) {}

  @Post('send')
  sendSms(@Body() body: SendSmsDto) {
    return this.smsService.sendSms(body);
  }

  @Post('verify')
  verifySms(@Body() body: VerifySmsDto) {
    return this.smsService.verifySms(body);
  }

  @Get()
  @Header('Content-Type', 'text/html')
  getSmsDashboard() {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >

        <title>Mock SMS Dashboard</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #0f172a;
            color: #f8fafc;
          }

          .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
          }

          h1 {
            margin-bottom: 8px;
          }

          .subtitle {
            color: #94a3b8;
            margin-bottom: 15px;
          }

          .status {
            color: #4ade80;
            margin-bottom: 30px;
          }

          .dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            margin-right: 6px;
            background: #4ade80;
            border-radius: 50%;
          }

          .sms-card {
            padding: 24px;
            margin-bottom: 16px;
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 16px;
          }

          .sms-top {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }

          .phone {
            font-size: 18px;
            font-weight: bold;
          }

          .time {
            color: #94a3b8;
            font-size: 13px;
          }

          .otp {
            padding: 18px;
            background: #0f172a;
            border: 1px solid #475569;
            border-radius: 12px;
            text-align: center;
            color: #38bdf8;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
          }

          .empty {
            padding: 60px 20px;
            text-align: center;
            color: #64748b;
          }

          .error {
            padding: 20px;
            background: #450a0a;
            border: 1px solid #7f1d1d;
            border-radius: 12px;
            color: #fca5a5;
          }
        </style>
      </head>

      <body>
        <div class="container">

          <h1>📱 Mock SMS Dashboard</h1>

          <div class="subtitle">
            OTP messages received by the backend
          </div>

          <div class="status">
            <span class="dot"></span>
            Server connected
          </div>

          <div id="messages">
            <div class="empty">
              Waiting for SMS...
            </div>
          </div>

        </div>

        <script>
          async function loadMessages() {
            try {
              const response = await fetch('/api/sms/messages');

              if (!response.ok) {
                throw new Error(
                  'Failed to load messages: ' + response.status
                );
              }

              const messages = await response.json();

              const container =
                document.getElementById('messages');

              if (!messages.length) {
                container.innerHTML = \`
                  <div class="empty">
                    No SMS messages yet.
                  </div>
                \`;

                return;
              }

              container.innerHTML = messages
                .map(message => \`
                  <div class="sms-card">

                    <div class="sms-top">

                      <div class="phone">
                        📞 \${message.phoneNumber}
                      </div>

                      <div class="time">
                        \${new Date(
                          message.createdAt
                        ).toLocaleString()}
                      </div>

                    </div>

                    <div class="otp">
                      \${message.otp}
                    </div>

                  </div>
                \`)
                .join('');

            } catch (error) {
              console.error(
                'Failed to load SMS:',
                error
              );

              document.getElementById('messages').innerHTML = \`
                <div class="error">
                  Failed to load SMS messages.
                </div>
              \`;
            }
          }

          loadMessages();

          setInterval(loadMessages, 2000);
        </script>

      </body>
      </html>
    `;
  }

  @Get('messages')
  getMessages() {
    return this.smsService.getMessages();
  }
}
