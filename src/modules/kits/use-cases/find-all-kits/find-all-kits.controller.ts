// Controller
import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common'
import { FindAllKitsService } from './find-all-kits.service'
import { FilterKitsDto } from '../../dto/filter-kits.dto'
import { OptionalJwtAuthGuard } from '../../../../shared/guards/optional-jwt-auth.guard'
import { ImageUrlHelper } from 'src/shared/helpers/image-url.helper'

@Controller('kits')
@UseGuards(OptionalJwtAuthGuard)
export class FindAllKitsController {
  constructor(
    private readonly findAllKitsService: FindAllKitsService,
    private imageUrlHelper: ImageUrlHelper,
  ) {}

  @Get()
  async handle(@Request() req, @Query() filters: FilterKitsDto) {
    const userId = req.user?.id
    const baseUrl = `${req.protocol}://${req.get('host')}`

    const result = await this.findAllKitsService.execute(filters, userId)

    // ✅ Processa as imagens antes de retornar
    return {
      ...result,
      data: this.imageUrlHelper.processImagesList(result.data, baseUrl),
    }
  }
}
