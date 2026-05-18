import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { CheckItemAvailabilityDto } from './check-availability.dto';

@Injectable()
export class CheckItemAvailabilityService {
  constructor(private prismaService: PrismaService) {}

  async execute(checkDto: CheckItemAvailabilityDto) {
    const { itemId, startDate, endDate } = checkDto;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const item = await this.prismaService.itemAvulso.findUnique({
      where: { id: itemId, isActive: true },
    });

    if (!item) {
      return { available: false, message: 'Item não encontrado ou indisponível' };
    }

    if (item.available <= 0) {
      return { available: false, message: 'Item sem estoque disponível' };
    }

    const conflictingReservations = await this.prismaService.reservationItem.findMany({
      where: {
        itemAvulsoId: itemId,
        reservation: {
          status: { in: ['CONFIRMED', 'WITHDRAWN'] },
          OR: [
            {
              AND: [
                { startDate: { lte: end } },
                { endDate: { gte: start } },
              ],
            },
          ],
        },
      },
      include: {
        reservation: true,
      },
    });

    const available = conflictingReservations.length === 0 && item.available > 0;

    return {
      available,
      message: available 
        ? 'Item disponível para o período selecionado' 
        : 'Item já reservado para este período ou sem estoque',
    };
  }
}
