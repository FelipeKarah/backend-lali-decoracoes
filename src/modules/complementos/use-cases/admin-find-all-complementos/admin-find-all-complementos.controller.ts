import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FindAllComplementosService } from '../find-all-complementos/find-all-complementos.service';
import { FilterComplementosDto } from '../../dto/filter-complementos.dto';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/complementos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminFindAllComplementosController {
  constructor(private readonly findAllComplementosService: FindAllComplementosService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async handle(@Query() filters: FilterComplementosDto) {
    // Para admin, buscar todos (incluindo inativos)
    const result = await this.findAllComplementosService.execute(filters, true);
    return result;
  }
}
