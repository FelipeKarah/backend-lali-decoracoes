import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common'
import { FindKitByIdService } from './find-kit-by-id.service'
import { OptionalJwtAuthGuard } from 'src/shared/guards/optional-jwt-auth.guard'

@Controller('kits')
@UseGuards(OptionalJwtAuthGuard)
export class FindKitByIdController {
  constructor(private readonly findKitByIdService: FindKitByIdService) {}

  @Get(':id')
  handle(@Request() req, @Param('id') id: string) {
    return this.findKitByIdService.execute(id, req.user?.id)
  }
}
