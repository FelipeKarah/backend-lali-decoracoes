// backend/src/modules/kits/services/create-kit/create-kit.service.ts
// Atualizado para receber URLs de imagens já processadas pelo UploadService.
// O fluxo é:
//   1. Admin faz POST /upload/kits com os arquivos → recebe as URLs
//   2. Admin faz POST /admin/kits com os dados + as URLs no campo images[]

import { HttpException, Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { UploadService } from '../../../../shared/services/upload.service'
import { CreateKitDto } from '../../dto/create-kit.dto'
import { Kit } from '../../entities/kit.entity'

@Injectable()
export class CreateKitService {
  constructor(
    private prismaService: PrismaService,
    private uploadService: UploadService,
  ) {}

  async execute(createKitDto: CreateKitDto): Promise<Kit> {
    try {
      const kit = await this.prismaService.kit.create({
        data: {
          name:            createKitDto.name,
          description:     createKitDto.description,
          longDescription: createKitDto.longDescription,
          icon:            createKitDto.icon,
          pricePerDay:     createKitDto.pricePerDay,
          category:        createKitDto.category,
          badge:           createKitDto.badge,
          // images é um array de URLs retornadas pelo endpoint /upload/kits
          // Ex: ["/uploads/kits/abc.webp", "/uploads/kits/def.webp"]
          images:          createKitDto.images ?? [],
          imageBg:         createKitDto.imageBg,
          isActive:        true,
          rating:          4.5,
          reviewsCount:    0,
        },
      })

      if (createKitDto.items?.length) {
        await this.prismaService.kitItem.createMany({
          data: createKitDto.items.map(item => ({
            kitId:        kit.id,
            itemAvulsoId: item.itemAvulsoId,
            quantity:     item.quantity ?? 1,
          })),
        })
      }

      const kitComItens = await this.prismaService.kit.findUnique({
        where: { id: kit.id },
        include: { items: { include: { itemAvulso: true } } },
      })

      return new Kit(kitComItens)
    } catch (err) {
      throw new HttpException(err.message, err.status ?? 400)
    }
  }
}