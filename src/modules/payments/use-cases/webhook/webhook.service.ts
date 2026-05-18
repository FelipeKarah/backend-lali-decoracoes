import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../../../../shared/services/prisma.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly mpBase = 'https://api.mercadopago.com';
  private readonly mpToken: string;

  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    this.mpToken = this.configService.get<string>('MP_ACCESS_TOKEN');
  }

  async execute(webhookBody: any) {
    try {
      const { type, data } = webhookBody;

      if (type !== 'payment') {
        return { processed: false, type };
      }

      const response = await axios.get(
        `${this.mpBase}/v1/payments/${data.id}`,
        { headers: { Authorization: `Bearer ${this.mpToken}` } },
      );

      const payment = response.data;
      const { status, external_reference } = payment;

      await this.prismaService.payment.updateMany({
        where: { mpPaymentId: String(data.id) },
        data: { status },
      });

      if (status === 'approved' && external_reference) {
        const reserva = await this.prismaService.reservation.findFirst({
          where: {
            id: external_reference.includes('LALI-') 
              ? external_reference.replace('LALI-', '') 
              : external_reference,
          },
        });

        if (reserva) {
          await this.prismaService.reservation.update({
            where: { id: reserva.id },
            data: {
              paymentStatus: 'PAID',
              status: 'CONFIRMED',
            },
          });

          this.logger.log(`Reserva ${reserva.id} confirmada via webhook`);
        }
      }

      return { processed: true, status };
    } catch (err) {
      this.logger.error(`Erro no webhook: ${err.message}`);
      throw err;
    }
  }
}
