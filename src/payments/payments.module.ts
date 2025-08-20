import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { WebhookController } from './payments.webhook';
import { UserModule } from 'src/user/user.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  controllers: [WebhookController],
  providers: [PaymentsService],
  imports: [UserModule, WalletModule],
})
export class PaymentsModule {}
