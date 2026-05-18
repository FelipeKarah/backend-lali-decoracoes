import { HttpException, Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { CreateComplementoDto } from '../../dto/create-complemento.dto'
import { Complemento } from '../../entities/complemento.entity'

@Injectable()
export class CreateComplementoService {
  constructor(private prismaService: PrismaService) {}

  async execute(
    createComplementoDto: CreateComplementoDto,
  ): Promise<Complemento> {
    try {
      const complemento = await this.prismaService.complemento.create({
        data: {
          name: createComplementoDto.name,
          description: createComplementoDto.description,
          icon: createComplementoDto.icon || '🎈',
          price: createComplementoDto.price,
          category: createComplementoDto.category as any,
          stock: createComplementoDto.stock || 0,
          isActive: true,
          images: createComplementoDto.images || [], // ✅ Adicionar imagens
        },
      })

      return new Complemento(complemento)
    } catch (err) {
      throw new HttpException(err.message, err.status || 400)
    }
  }
}
