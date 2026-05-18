import { Controller, Get, Query } from '@nestjs/common';
import { FindAllComplementosService } from './find-all-complementos.service';
import { FilterComplementosDto } from '../../dto/filter-complementos.dto';

@Controller('complementos')
export class FindAllComplementosController {
  constructor(private readonly findAllComplementosService: FindAllComplementosService) {}

  @Get()
  handle(@Query() filters: FilterComplementosDto) {
    return this.findAllComplementosService.execute(filters);
  }
}
