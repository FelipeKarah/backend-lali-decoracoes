// backend/src/modules/kits/services/update-kit/update-kit.service.ts
// Ao editar um kit, remove do disco as imagens que foram deletadas pelo admin.

import { HttpException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { UploadService } from '../../../../shared/services/upload.service'
import { UpdateKitDto } from '../../dto/update-kit.dto'
import { Kit } from '../../entities/kit.entity'

@Injectable()
export class UpdateKitService {
  constructor(
    private prismaService: PrismaService,
    private uploadService: UploadService,
  ) {}

  async execute(id: string, updateKitDto: UpdateKitDto): Promise<Kit> {
    try {
      const existing = await this.prismaService.kit.findUnique({
        where: { id },
      })
      if (!existing) throw new NotFoundException('Kit não encontrado.')

      // Remove do disco as imagens que o admin excluiu
      if (updateKitDto.images) {
        this.uploadService.cleanRemovedImages(
          existing.images,
          updateKitDto.images,
        )
      }

      const updated = await this.prismaService.kit.update({
        where: { id },
        data: {
          ...(updateKitDto.name && { name: updateKitDto.name }),
          ...(updateKitDto.description && {
            description: updateKitDto.description,
          }),
          ...(updateKitDto.longDescription !== undefined && {
            longDescription: updateKitDto.longDescription,
          }),
          ...(updateKitDto.icon && { icon: updateKitDto.icon }),
          ...(updateKitDto.pricePerDay && {
            pricePerDay: updateKitDto.pricePerDay,
          }),
          ...(updateKitDto.category && { category: updateKitDto.category }),
          ...(updateKitDto.badge !== undefined && {
            badge: updateKitDto.badge,
          }),
          ...(updateKitDto.images && { images: updateKitDto.images }),
          ...(updateKitDto.imageBg !== undefined && {
            imageBg: updateKitDto.imageBg,
          }),
          ...(updateKitDto.isActive !== undefined && {
            isActive: updateKitDto.isActive,
          }),
        },
      })

      // Atualiza os itens do kit se enviados
      if (updateKitDto.items) {
        await this.prismaService.kitItem.deleteMany({ where: { kitId: id } })
        if (updateKitDto.items.length > 0) {
          await this.prismaService.kitItem.createMany({
            data: updateKitDto.items.map((item) => ({
              kitId: id,
              itemAvulsoId: item.itemAvulsoId,
              quantity: item.quantity ?? 1,
            })),
          })
        }
      }

      const kitComItens = await this.prismaService.kit.findUnique({
        where: { id },
        include: { items: { include: { itemAvulso: true } } },
      })

      return new Kit(kitComItens)
    } catch (err) {
      throw new HttpException(err.message, err.status ?? 400)
    }
  }
}
