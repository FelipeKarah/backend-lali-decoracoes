// backend/src/modules/itens-avulsos/services/create-item-avulso/create-item-avulso.service.ts
// Atualizado: recebe images[] (URLs já processadas pelo endpoint POST /upload/itens)
// e salva no banco. Mesmo padrão adotado nos kits.

import { HttpException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { CreateItemAvulsoDto } from '../../dto/create-item-avulso.dto'
import { ItemAvulso } from '../../entities/item-avulso.entity'

@Injectable()
export class CreateItemAvulsoService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async execute(createDto: CreateItemAvulsoDto): Promise<ItemAvulso> {
    try {
      // Gera código único: LALI-XXXX
      const prefix = this.configService.get('BARCODE_PREFIX', 'LALI')
      const randomNum = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')
      const code = `${prefix}-${randomNum}`

      const item = await this.prismaService.itemAvulso.create({
        data: {
          code,
          name: createDto.name,
          description: createDto.description,
          icon: createDto.icon ?? '',
          category: createDto.category,
          pricePerDay: createDto.pricePerDay,
          replacementPrice: createDto.replacementPrice ?? 0,
          quantity: createDto.quantity ?? 1,
          available: createDto.quantity ?? 1,
          rentalType: createDto.rentalType ?? 'ALUGUEL',
          isActive: true,
          // URLs retornadas pelo endpoint POST /upload/itens
          // Ex: ["/uploads/itens/abc123.webp"]
          // A primeira é considerada a imagem principal
          images: createDto.images ?? [],
        },
      })

      return new ItemAvulso(item)
    } catch (err) {
      throw new HttpException(err.message, err.status ?? 400)
    }
  }
}
