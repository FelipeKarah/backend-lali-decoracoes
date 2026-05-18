import { Controller, Get, Param } from '@nestjs/common';
import { KitSugestoesService } from './kit-sugestoes.service';

@Controller('kits')
export class KitSugestoesController {
  constructor(private readonly kitSugestoesService: KitSugestoesService) {}

  @Get(':id/sugestoes')
  handle(@Param('id') id: string) {
    return this.kitSugestoesService.execute(id);
  }
}
