import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { FinalizeChecklistDto } from '../../dto/finalize-checklist.dto';

@Injectable()
export class FinalizeChecklistService {
  constructor(private prismaService: PrismaService) {}

  async execute(reservationId: string, finalizeDto: FinalizeChecklistDto) {
    try {
      const reservation = await this.prismaService.reservation.findUnique({
        where: { id: reservationId },
      });

      if (!reservation) {
        throw new HttpException('Reserva não encontrada', 404);
      }

      // Verificar se todos os itens foram escaneados
      const allItems = await this.prismaService.checklistItem.findMany({
        where: { reservationId },
      });

      const allScanned = allItems.every((item) => item.scanned === true);

      if (!allScanned) {
        const missingCount = allItems.filter((item) => !item.scanned).length;
        throw new HttpException(`Ainda faltam ${missingCount} itens para escanear`, 400);
      }

      // Calcular devolução do caução
      let cauctionReturnValue = reservation.cauction;
      let damages = [];

      if (finalizeDto.damages && finalizeDto.damages.length > 0) {
        let totalDiscount = 0;
        damages = finalizeDto.damages;

        for (const damage of finalizeDto.damages) {
          totalDiscount += damage.discount;

          // Atualizar status do item
          await this.prismaService.checklistItem.updateMany({
            where: {
              reservationId,
              itemCode: damage.itemCode,
            },
            data: {
              status: 'DAMAGED',
              damageNote: damage.description,
            },
          });
        }

        cauctionReturnValue = Math.max(0, reservation.cauction - totalDiscount);
      }

      // Atualizar reserva
      const updatedReservation = await this.prismaService.reservation.update({
        where: { id: reservationId },
        data: {
          status: 'COMPLETED',
          cauctionReturnValue,
          damageNotes: finalizeDto.notes,
        },
      });

      return {
        message: 'Conferência finalizada com sucesso',
        cauctionReturnValue,
        hasDamages: damages.length > 0,
        damages: damages.length > 0 ? damages : null,
        reservation: updatedReservation,
      };
    } catch (err) {
      throw new HttpException(err.message, err.status || 400);
    }
  }
}
