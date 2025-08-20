class PaystackWebhookDto {
  event: string;
  data: {
    reference: string;
    amount: number;
    status: string;
    customer: {
      email: string;
    };
    metadata?: any;
  };
}

import * as crypto from 'crypto';
import { PaymentsService } from './payments.service';
import {
  BadRequestException,
  Controller,
  Headers,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { paystackConfig } from 'db/config/paystackConfig';
import type { ConfigType } from '@nestjs/config';

@Controller('webhook/paystack')
export class WebhookController {
  constructor(
    private readonly paymentService: PaymentsService,

    @Inject(paystackConfig.KEY)
    private readonly paystackWebhookSecret: ConfigType<typeof paystackConfig>,
  ) {}

  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    try {
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
