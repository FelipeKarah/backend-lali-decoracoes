import { Controller, Get, Param } from '@nestjs/common';
import { FindItemAvulsoByIdService } from '../find-item-by-id/find-item-by-id.service';

@Controller('itens-avulsos')
export class PublicFindItemAvulsoByIdController {
  constructor(private readonly findItemService: FindItemAvulsoByIdService) {}

  @Get(':id')
  async handle(@Param('id') id: string) {
    return this.findItemService.execute(id);
  }
}
