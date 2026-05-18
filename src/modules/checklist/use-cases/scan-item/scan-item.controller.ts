import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ScanItemDto } from '../../dto/scan-item.dto';
import { ScanItemService } from './scan-item.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScanItemController {
  constructor(private readonly scanItemService: ScanItemService) {}

  @Post(':id/checklist/scan')
  @Roles(UserRole.ADMIN)
  handle(@Param('id') id: string, @Body() scanItemDto: ScanItemDto) {
    return this.scanItemService.execute(id, scanItemDto);
  }
}
