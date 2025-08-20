import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { WebhookController } from './payments.webhook';

@Module({
  controllers: [WebhookController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
