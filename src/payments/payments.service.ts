import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';
import { paystackConfig } from 'db/config/paystackConfig';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(paystackConfig.KEY)
    private readonly paystackConfiguration: ConfigType<typeof paystackConfig>,
  ) {}

  async initializePayment(email: string, amount: number) {
    const paystackSecret = this.paystackConfiguration.secretKey;

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      { email, amount },
      { headers: { Authorization: `Bearer ${paystackSecret}` } },
    );
    return response.data;
  }

  async handleWebhookEvent(payload: any, signature: string) {
    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', this.paystackConfiguration.secretKey as string)
      .update(JSON.stringify(payload))
      .digest('hex');

    console.log('payload', payload);
    console.log('payload.event', payload.event);

    if (hash !== signature) {
      throw new UnauthorizedException('Invalid Paystack webhook signature');
    }

    // Process the webhook event based on its event type
    switch (payload.event) {
      case 'charge.success':
        // Handle successful payment
        console.log('Charge successful:', payload.data);
        // Update your database, send confirmation emails, etc.
        break;
      case 'transfer.success':
        // Handle successful transfer
        console.log('Transfer successful:', payload.data);
        break;
      // Add more cases for other events as needed
      default:
        console.log('Unhandled Paystack event:', payload.event);
    }
  }
}
