import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FindAllItensAvulsosService } from './find-all-itens.service';
import { FilterItensAvulsosDto } from '../../dto/filter-itens-avulsos.dto';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/itens-avulsos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FindAllItensAvulsosController {
  constructor(private readonly findAllItensService: FindAllItensAvulsosService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  handle(@Query() filters: FilterItensAvulsosDto) {
    return this.findAllItensService.execute(filters);
  }
}
