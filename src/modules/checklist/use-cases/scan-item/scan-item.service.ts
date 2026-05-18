import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { ScanItemDto } from '../../dto/scan-item.dto';
import { ChecklistItem } from '../../entities/checklist-item.entity';

@Injectable()
export class ScanItemService {
  constructor(private prismaService: PrismaService) {}

  async execute(reservationId: string, scanItemDto: ScanItemDto): Promise<ChecklistItem> {
    try {
      const { code } = scanItemDto;

      // Buscar o item no checklist
      const item = await this.prismaService.checklistItem.findFirst({
        where: {
          reservationId,
          itemCode: code,
        },
      });

      if (!item) {
        throw new HttpException('Item não encontrado nesta reserva', 404);
      }

      if (item.scanned) {
        throw new HttpException('Item já foi escaneado', 400);
      }

      // Atualizar item como escaneado
      const updatedItem = await this.prismaService.checklistItem.update({
        where: { id: item.id },
        data: {
          scanned: true,
          scannedAt: new Date(),
          status: 'OK',
        },
      });

      // Verificar se todos os itens foram escaneados
      const allItems = await this.prismaService.checklistItem.findMany({
        where: { reservationId },
      });

      const allScanned = allItems.every((i) => i.scanned === true);

      // Atualizar status da reserva se todos foram escaneados
      if (allScanned) {
        await this.prismaService.reservation.update({
          where: { id: reservationId },
          data: {
            status: 'WITHDRAWN',
          },
        });
      }

      return new ChecklistItem(updatedItem);
    } catch (err) {
      throw new HttpException(err.message, err.status || 400);
    }
  }
}
