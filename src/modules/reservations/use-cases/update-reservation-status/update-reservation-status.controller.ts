import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { UpdateReservationStatusDto } from '../../dto/update-reservation-status.dto';
import { UpdateReservationStatusService } from './update-reservation-status.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UpdateReservationStatusController {
  constructor(private readonly updateReservationStatusService: UpdateReservationStatusService) {}

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  handle(@Param('id') id: string, @Body() updateStatusDto: UpdateReservationStatusDto) {
    return this.updateReservationStatusService.execute(id, updateStatusDto);
  }
}
