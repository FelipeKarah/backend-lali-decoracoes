import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FindAllReservationsService } from './find-all-reservations.service';
import { FilterReservationsDto } from '../../dto/filter-reservations.dto';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FindAllReservationsController {
  constructor(private readonly findAllReservationsService: FindAllReservationsService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  handle(@Query() filters: FilterReservationsDto) {
    return this.findAllReservationsService.execute(filters);
  }
}
