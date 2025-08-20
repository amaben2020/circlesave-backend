import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { WebhookController } from './payments.webhook';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [WebhookController],
  providers: [PaymentsService],
  imports: [UserModule],
})
export class PaymentsModule {}
