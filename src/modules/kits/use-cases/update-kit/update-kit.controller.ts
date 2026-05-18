import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { UpdateKitDto } from '../../dto/update-kit.dto';
import { UpdateKitService } from './update-kit.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/kits')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UpdateKitController {
  constructor(private readonly updateKitService: UpdateKitService) {}

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  handle(@Param('id') id: string, @Body() updateKitDto: UpdateKitDto) {
    return this.updateKitService.execute(id, updateKitDto);
  }
}
