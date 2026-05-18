import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { UpdateConfigDto } from '../../dto/update-config.dto';
import { UpdateConfigService } from './update-config.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/config')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UpdateConfigController {
  constructor(private readonly updateConfigService: UpdateConfigService) {}

  @Put()
  @Roles(UserRole.ADMIN)
  handle(@Body() updateConfigDto: UpdateConfigDto) {
    return this.updateConfigService.execute(updateConfigDto);
  }
}
