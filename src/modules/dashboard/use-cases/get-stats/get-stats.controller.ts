import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetStatsService } from './get-stats.service';
import { DashboardFiltersDto } from '../../dto/dashboard-filters.dto';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GetStatsController {
  constructor(private readonly getStatsService: GetStatsService) {}

  @Get('stats')
  @Roles(UserRole.ADMIN)
  handle(@Query() filters: DashboardFiltersDto) {
    return this.getStatsService.execute(filters);
  }
}
