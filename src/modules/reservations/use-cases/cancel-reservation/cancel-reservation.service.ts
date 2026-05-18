import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { Reservation } from '../../entities/reservation.entity';

@Injectable()
export class CancelReservationService {
  constructor(private prismaService: PrismaService) {}

  async execute(id: string, userId: string, isAdmin: boolean = false): Promise<Reservation> {
    try {
      const where: any = { id };
      
      if (!isAdmin) {
        where.userId = userId;
      }

      const existingReservation = await this.prismaService.reservation.findFirst({
        where,
      });

      if (!existingReservation) {
        throw new HttpException('Reserva não encontrada', 404);
      }

      if (existingReservation.status !== 'PENDING' && existingReservation.status !== 'CONFIRMED') {
        throw new HttpException('Esta reserva não pode mais ser cancelada', 400);
      }

      const reservation = await this.prismaService.reservation.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });

      return new Reservation(reservation);
    } catch (err) {
      throw new HttpException(err.message, err.status || 400);
    }
  }
}
