import { HttpException, Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { Kit } from '../../entities/kit.entity'

@Injectable()
export class FindKitByIdService {
  constructor(private prismaService: PrismaService) {}

  async execute(id: string, userId?: string): Promise<any> {
    const kit = await this.prismaService.kit.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            itemAvulso: true,
          },
        },
        favorites: {
          where: { userId },
          select: { userId: true },
        },
      },
    })

    if (!kit) {
      throw new HttpException('Kit não encontrado', 404)
    }

    // Converter para objeto e adicionar isFavorite
    const kitObj = new Kit(kit)
    return {
      ...kitObj,
      isFavorite: kit.favorites.length > 0,
      favorites: undefined, // Remover para não expor
    }
  }
}
