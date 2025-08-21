import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';
import { paystackConfig } from 'db/config/paystackConfig';
import { PaystackWebhookPayload } from './types/PaystackWebhook';
import { DataSource } from 'typeorm';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from 'src/entities/transaction.entity';
import { User } from 'src/entities/user.entity';
import { Wallet } from 'src/entities/wallet.entity';
import { TransactionHistories } from 'src/entities/transactionHistories.entity';

type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(paystackConfig.KEY)
    private readonly paystackConfiguration: ConfigType<typeof paystackConfig>,

    private readonly dataSource: DataSource,
  ) {}

  private readonly logger = new Logger(PaymentsService.name);

  async initializePayment(
    email: string,
    amount: number,
  ): Promise<PaystackInitializeResponse> {
    const paystackSecret = this.paystackConfiguration.secretKey;

    const response = await axios.post<PaystackInitializeResponse>(
      'https://api.paystack.co/transaction/initialize',
      { email, amount },
      { headers: { Authorization: `Bearer ${paystackSecret}` } },
    );
    return response.data;
  }

  async handleWebhookEvent(
    payload: PaystackWebhookPayload,
    signature?: string | string[],
  ) {
    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', this.paystackConfiguration.secretKey as string)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (hash !== signature) {
      throw new UnauthorizedException('Invalid Paystack webhook signature');
    }

    // Process the webhook event based on its event type
    switch (payload.event) {
      case 'charge.success':
        await this.dataSource.transaction(async (manager) => {
          const user = await manager.findOne(User, {
            where: { email: payload.data.customer.email },
          });

          if (!user) throw new BadRequestException(`User not found`);

          const hasWallet = await manager.findOne(Wallet, {
            where: { user: { id: user.id } },
            relations: ['user'],
          });

          console.log('user', user);

          console.log(
            'payload.data.customer.email',
            payload.data.customer.email,
          );

          if (!hasWallet?.id) {
            const wallet = manager.create(Wallet, {
              balance: payload.data.amount / 100,
              amount: payload.data.amount / 100,
              user: user,
            });

            await manager.save(wallet);
          } else {
            hasWallet.balance += payload.data.amount / 100;
            hasWallet.amount =
              Number(hasWallet.amount) + payload.data.amount / 100;

            hasWallet.user = user;
            await manager.save(hasWallet);
          }

          const transaction = manager.create(Transaction, {
            status: TransactionStatus.SUCCESS,
            type: TransactionType.FUNDING,
            amount: payload.data.amount / 100,
            currency: 'NGN',
            user: user,
            reference: payload.data.reference,
            providerResponse: JSON.stringify(payload),
          });
          await manager.save(transaction);
          const balanceBefore = hasWallet?.balance;
          const balanceAfter =
            Number(balanceBefore) + payload.data.amount / 100;

          if (transaction.id) {
            const history = manager.create(TransactionHistories, {
              type: TransactionType.FUNDING,
              status: TransactionStatus.SUCCESS,
              amount: payload.data.amount / 100,
              currency: 'NGN',
              transaction: transaction,
              balanceBefore: balanceBefore || 0,
              balanceAfter: balanceAfter || 0,
              transactionId: transaction.id,
            });

            await manager.save(history);
          }
        });
        // 2 create wallet for user with amount
        // 3. update transaction and transactions histories
        // 4. use rabbitmq or bull queue to process messages here i.e emails, sms, notifications

        break;
      case 'transfer.success':
        this.logger.log(`Transfer successful 🍀: ${JSON.stringify(payload)}`);
        break;

      case 'transfer.failed':
        this.logger.log(`Transfer failed ❌: ${JSON.stringify(payload)}`);
        break;
      // Add more cases for other events as needed
      default:
        console.log('Unhandled Paystack event:', payload.event);
    }
  }
}
