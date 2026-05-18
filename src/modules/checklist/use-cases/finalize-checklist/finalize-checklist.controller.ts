import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { FinalizeChecklistDto } from '../../dto/finalize-checklist.dto';
import { FinalizeChecklistService } from './finalize-checklist.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinalizeChecklistController {
  constructor(private readonly finalizeChecklistService: FinalizeChecklistService) {}

  @Post(':id/checklist/finalizar')
  @Roles(UserRole.ADMIN)
  handle(@Param('id') id: string, @Body() finalizeDto: FinalizeChecklistDto) {
    return this.finalizeChecklistService.execute(id, finalizeDto);
  }
}
