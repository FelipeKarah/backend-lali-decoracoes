import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetChartsService } from './get-charts.service';
import { DashboardFiltersDto } from '../../dto/dashboard-filters.dto';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GetChartsController {
  constructor(private readonly getChartsService: GetChartsService) {}

  @Get('charts')
  @Roles(UserRole.ADMIN)
  handle(@Query() filters: DashboardFiltersDto) {
    return this.getChartsService.execute(filters);
  }
}
