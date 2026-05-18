// backend/src/modules/itens-avulsos/services/update-item-avulso/update-item-avulso.service.ts
// Ao editar, remove do disco as imagens que o admin deletou.
// Mesmo padrão do UpdateKitService.

import { HttpException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { UploadService } from '../../../../shared/services/upload.service'
import { UpdateItemAvulsoDto } from '../../dto/update-item-avulso.dto'
import { ItemAvulso } from '../../entities/item-avulso.entity'

@Injectable()
export class UpdateItemAvulsoService {
  constructor(
    private prismaService: PrismaService,
    private uploadService: UploadService,
  ) {}

  async execute(id: string, dto: UpdateItemAvulsoDto): Promise<ItemAvulso> {
    try {
      const existing = await this.prismaService.itemAvulso.findUnique({
        where: { id },
      })
      if (!existing) throw new NotFoundException('Item não encontrado.')

      // Remove do disco as imagens que o admin excluiu
      if (dto.images) {
        this.uploadService.cleanRemovedImages(existing.images, dto.images)
      }

      const updated = await this.prismaService.itemAvulso.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.description !== undefined && {
            description: dto.description,
          }),
          ...(dto.icon !== undefined && { icon: dto.icon }),
          ...(dto.category !== undefined && { category: dto.category }),
          ...(dto.pricePerDay !== undefined && {
            pricePerDay: dto.pricePerDay,
          }),
          ...(dto.replacementPrice !== undefined && {
            replacementPrice: dto.replacementPrice,
          }),
          ...(dto.quantity !== undefined && { quantity: dto.quantity }),
          ...(dto.rentalType !== undefined && { rentalType: dto.rentalType }),
          ...(dto.isActive !== undefined && { isActive: dto.isActive }),
          ...(dto.images !== undefined && { images: dto.images }),
        },
      })

      return new ItemAvulso(updated)
    } catch (err) {
      throw new HttpException(err.message, err.status ?? 400)
    }
  }
}
