import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { DeleteItemAvulsoService } from './delete-item.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/itens-avulsos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeleteItemAvulsoController {
  constructor(private readonly deleteItemService: DeleteItemAvulsoService) {}

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  handle(@Param('id') id: string) {
    return this.deleteItemService.execute(id);
  }
}
