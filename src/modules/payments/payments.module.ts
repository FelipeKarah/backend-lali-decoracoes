import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';

// Controllers
import { CreatePixPaymentController } from './use-cases/create-pix-payment/create-pix-payment.controller';
import { CreateCardPaymentController } from './use-cases/create-card-payment/create-card-payment.controller';
import { CheckPaymentStatusController } from './use-cases/check-payment-status/check-payment-status.controller';
import { WebhookController } from './use-cases/webhook/webhook.controller';

// Services
import { CreatePixPaymentService } from './use-cases/create-pix-payment/create-pix-payment.service';
import { CreateCardPaymentService } from './use-cases/create-card-payment/create-card-payment.service';
import { CheckPaymentStatusService } from './use-cases/check-payment-status/check-payment-status.service';
import { WebhookService } from './use-cases/webhook/webhook.service';

@Module({
  controllers: [
    CreatePixPaymentController,
    CreateCardPaymentController,
    CheckPaymentStatusController,
    WebhookController,
  ],
  providers: [
    PrismaService,
    CreatePixPaymentService,
    CreateCardPaymentService,
    CheckPaymentStatusService,
    WebhookService,
  ],
  exports: [
    CreatePixPaymentService,
    CreateCardPaymentService,
    CheckPaymentStatusService,
    WebhookService,
  ],
})
export class PaymentsModule {}
