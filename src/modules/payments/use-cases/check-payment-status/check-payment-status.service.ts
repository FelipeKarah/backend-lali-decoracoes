import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../../../../shared/services/prisma.service';

@Injectable()
export class CheckPaymentStatusService {
  private readonly logger = new Logger(CheckPaymentStatusService.name);
  private readonly mpBase = 'https://api.mercadopago.com';
  private readonly mpToken: string;

  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    this.mpToken = this.configService.get<string>('MP_ACCESS_TOKEN');
  }

  async execute(paymentId: string) {
    try {
      const response = await axios.get(
        `${this.mpBase}/v1/payments/${paymentId}`,
        { headers: { Authorization: `Bearer ${this.mpToken}` } },
      );

      const { data } = response;

      await this.prismaService.payment.updateMany({
        where: { mpPaymentId: paymentId },
        data: { status: data.status },
      });

      return { status: data.status };
    } catch (err) {
      this.logger.error(`Erro ao verificar status: ${err.message}`);
      throw new HttpException(
        'Erro ao verificar pagamento.',
        err.response?.status || 500,
      );
    }
  }
}
