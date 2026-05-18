import { Controller, Get, Query } from '@nestjs/common';
import { FindAllItensAvulsosService } from '../find-all-itens/find-all-itens.service';
import { FilterItensAvulsosDto } from '../../dto/filter-itens-avulsos.dto';

@Controller('itens-avulsos')
export class PublicFindAllItensAvulsosController {
  constructor(private readonly findAllItensService: FindAllItensAvulsosService) {}

  @Get()
  async handle(@Query() filters: FilterItensAvulsosDto) {
    return this.findAllItensService.execute({ ...filters, isActive: true });
  }
}
