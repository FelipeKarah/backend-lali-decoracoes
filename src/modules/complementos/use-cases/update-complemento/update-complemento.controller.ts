import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { UpdateComplementoDto } from '../../dto/update-complemento.dto';
import { UpdateComplementoService } from './update-complemento.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/complementos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UpdateComplementoController {
  constructor(private readonly updateComplementoService: UpdateComplementoService) {}

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  handle(@Param('id') id: string, @Body() updateComplementoDto: UpdateComplementoDto) {
    return this.updateComplementoService.execute(id, updateComplementoDto);
  }
}
