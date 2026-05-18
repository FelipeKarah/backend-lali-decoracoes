// backend/src/modules/upload/upload.controller.ts
// Controller genérico de upload — um endpoint serve kits, itens e complementos.
// POST /upload/kits      → faz upload de até 5 imagens para kits
// POST /upload/itens     → faz upload de até 3 imagens para itens
// POST /upload/complementos → faz upload de até 2 imagens

import {
  Controller,
  Post,
  Param,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import {
  UploadService,
  UploadEntity,
} from '../../shared/services/upload.service'
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard'

const VALID_ENTITIES: UploadEntity[] = ['kits', 'itens', 'complementos']

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * POST /upload/:entity
   * Body: multipart/form-data com campo "images" (múltiplos arquivos)
   *
   * Retorna: { urls: ["/uploads/kits/abc.webp", ...] }
   */
  @Post(':entity')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: memoryStorage(), // mantém em memória — sharp processa e salva no disco
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB por arquivo
    }),
  )
  async uploadImages(
    @Param('entity') entity: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!VALID_ENTITIES.includes(entity as UploadEntity)) {
      throw new BadRequestException(
        `Entidade inválida. Use: ${VALID_ENTITIES.join(', ')}`,
      )
    }

    const urls = await this.uploadService.uploadImages(
      files,
      entity as UploadEntity,
    )

    return { urls }
  }
}
