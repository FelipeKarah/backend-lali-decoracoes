import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { DeleteComplementoService } from './delete-complemento.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/complementos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeleteComplementoController {
  constructor(private readonly deleteComplementoService: DeleteComplementoService) {}

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  handle(@Param('id') id: string) {
    return this.deleteComplementoService.execute(id);
  }
}
