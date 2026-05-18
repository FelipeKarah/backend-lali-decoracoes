import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { Reservation } from '../../entities/reservation.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class CheckoutService {
  constructor(private prismaService: PrismaService) {}

  async execute(reservationId: string): Promise<any> {
    try {
      const reservation = await this.prismaService.reservation.findUnique({
        where: { id: reservationId },
      });

      if (!reservation) {
        throw new HttpException('Reserva não encontrada', 404);
      }

      // Mock de pagamento - em produção integrar com gateway real
      const paymentId = `PAY-${randomUUID()}`;
      const qrCode = `0002010102122685br.gov.bcb.pix2562pix-h.gerencianet.com.br/v2/${randomUUID()}`;
      const copiarCola = `0002010102122685br.gov.bcb.pix2562pix-h.gerencianet.com.br/v2/${randomUUID()}`;

      await this.prismaService.reservation.update({
        where: { id: reservationId },
        data: {
          paymentId,
          paymentQrCode: qrCode,
          paymentCopiarCola: copiarCola,
          paymentStatus: 'PENDING',
        },
      });

      return {
        qrCode,
        copiarCola,
        paymentId,
        amount: reservation.total,
      };
    } catch (err) {
      throw new HttpException(err.message, err.status || 400);
    }
  }
}
