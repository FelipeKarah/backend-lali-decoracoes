import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetChecklistService } from './get-checklist.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GetChecklistController {
  constructor(private readonly getChecklistService: GetChecklistService) {}

  @Get(':id/checklist')
  @Roles(UserRole.ADMIN)
  handle(@Param('id') id: string) {
    return this.getChecklistService.execute(id);
  }
}
