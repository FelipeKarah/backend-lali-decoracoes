import { HttpException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { UploadService } from '../../../../shared/services/upload.service'
import { UpdateComplementoDto } from '../../dto/update-complemento.dto'
import { Complemento } from '../../entities/complemento.entity'

@Injectable()
export class UpdateComplementoService {
  constructor(
    private prismaService: PrismaService,
    private uploadService: UploadService, // ✅ Injetar UploadService
  ) {}

  async execute(
    id: string,
    updateComplementoDto: UpdateComplementoDto,
  ): Promise<Complemento> {
    try {
      const existingComplemento =
        await this.prismaService.complemento.findUnique({
          where: { id },
        })

      if (!existingComplemento) {
        throw new NotFoundException('Complemento não encontrado')
      }

      // ✅ Remove do disco as imagens que o admin deletou (mesmo padrão dos itens avulsos)
      if (updateComplementoDto.images) {
        this.uploadService.cleanRemovedImages(
          existingComplemento.images || [],
          updateComplementoDto.images,
        )
      }

      // Preparar dados para atualização
      const updateData: any = {}

      if (updateComplementoDto.name !== undefined)
        updateData.name = updateComplementoDto.name
      if (updateComplementoDto.description !== undefined)
        updateData.description = updateComplementoDto.description
      if (updateComplementoDto.icon !== undefined)
        updateData.icon = updateComplementoDto.icon
      if (updateComplementoDto.price !== undefined)
        updateData.price = updateComplementoDto.price
      if (updateComplementoDto.category !== undefined)
        updateData.category = updateComplementoDto.category
      if (updateComplementoDto.stock !== undefined)
        updateData.stock = updateComplementoDto.stock
      if (updateComplementoDto.isActive !== undefined)
        updateData.isActive = updateComplementoDto.isActive
      if (updateComplementoDto.images !== undefined)
        updateData.images = updateComplementoDto.images

      const complemento = await this.prismaService.complemento.update({
        where: { id },
        data: updateData,
      })

      return new Complemento(complemento)
    } catch (err) {
      throw new HttpException(err.message, err.status || 400)
    }
  }
}
