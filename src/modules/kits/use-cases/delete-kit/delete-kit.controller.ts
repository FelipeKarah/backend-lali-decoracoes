import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { DeleteKitService } from './delete-kit.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/kits')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeleteKitController {
  constructor(private readonly deleteKitService: DeleteKitService) {}

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  handle(@Param('id') id: string) {
    return this.deleteKitService.execute(id);
  }
}
