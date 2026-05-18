import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { UpdateReservationStatusDto } from '../../dto/update-reservation-status.dto';
import { Reservation } from '../../entities/reservation.entity';

@Injectable()
export class UpdateReservationStatusService {
  constructor(private prismaService: PrismaService) {}

  async execute(id: string, updateStatusDto: UpdateReservationStatusDto): Promise<Reservation> {
    try {
      const existingReservation = await this.prismaService.reservation.findUnique({
        where: { id },
      });

      if (!existingReservation) {
        throw new HttpException('Reserva não encontrada', 404);
      }

      const reservation = await this.prismaService.reservation.update({
        where: { id },
        data: {
          status: updateStatusDto.status,
          cauctionReturnValue: updateStatusDto.cauctionReturnValue,
          damageNotes: updateStatusDto.damageNotes,
        },
      });

      return new Reservation(reservation);
    } catch (err) {
      throw new HttpException(err.message, err.status || 400);
    }
  }
}
