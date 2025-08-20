import { PaymentsService } from './payments.service';
import { Controller, Headers, Inject, Post, Req } from '@nestjs/common';
import { paystackConfig } from 'db/config/paystackConfig';
import type { ConfigType } from '@nestjs/config';
import type { Request } from 'express';

@Controller('webhook/paystack')
export class WebhookController {
  constructor(
    private readonly paymentService: PaymentsService,

    @Inject(paystackConfig.KEY)
    private readonly paystackWebhookSecret: ConfigType<typeof paystackConfig>,
  ) {}

  @Post()
  async handleWebhook(@Req() req: Request) {
    try {
      if (req.body)
        await this.paymentService.handleWebhookEvent(
          req.body,
          req.headers['x-paystack-signature'],
        );
      return 'Webhook received successfully';
    } catch (error) {
      console.error('Error handling Paystack webhook:', error);
      return 'Webhook processing failed';
    }
  }
}
