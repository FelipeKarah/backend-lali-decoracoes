import { HttpException, Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { ChecklistItem } from '../../entities/checklist-item.entity'

@Injectable()
export class GetChecklistService {
  constructor(private prismaService: PrismaService) {}

  async execute(reservationId: string) {
    const reservation = await this.prismaService.reservation.findUnique({
      where: { id: reservationId },
      include: {
        complementos: true,
      },
    })

    if (!reservation) {
      throw new HttpException('Reserva não encontrada', 404)
    }

    let checklistItems = await this.prismaService.checklistItem.findMany({
      where: { reservationId },
    })

    if (checklistItems.length === 0) {
      const itemsToCreate = []

      // Itens do kit via KitItem (que tem relacionamento com itemAvulso)
      // for (const kitItem of reservation.kit.items) {
      //   const itemAvulso = kitItem.itemAvulso;
      //   itemsToCreate.push({
      //     reservationId,
      //     itemCode: itemAvulso.code,
      //     itemName: itemAvulso.name,
      //     quantity: kitItem.quantity,
      //     scanned: false,
      //     status: 'PENDING',
      //   });
      // }

      // Itens complementos
      for (const complemento of reservation.complementos) {
        itemsToCreate.push({
          reservationId,
          itemCode: `COMP-${complemento.complementoId}`,
          itemName: complemento.name,
          quantity: complemento.quantity,
          scanned: false,
          status: 'PENDING',
        })
      }

      if (itemsToCreate.length > 0) {
        await this.prismaService.checklistItem.createMany({
          data: itemsToCreate,
        })
      }

      checklistItems = await this.prismaService.checklistItem.findMany({
        where: { reservationId },
      })
    }

    return checklistItems.map((item) => new ChecklistItem(item))
  }
}
