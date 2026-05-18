import { Controller, Get, Param } from '@nestjs/common';
import { FindComplementoByIdService } from './find-complemento-by-id.service';

@Controller('complementos')
export class FindComplementoByIdController {
  constructor(private readonly findComplementoByIdService: FindComplementoByIdService) {}

  @Get(':id')
  handle(@Param('id') id: string) {
    return this.findComplementoByIdService.execute(id);
  }
}
