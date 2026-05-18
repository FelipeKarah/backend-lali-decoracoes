import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { FindItemAvulsoByIdService } from './find-item-by-id.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/itens-avulsos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FindItemAvulsoByIdController {
  constructor(private readonly findItemService: FindItemAvulsoByIdService) {}

  @Get(':id')
  @Roles(UserRole.ADMIN)
  handle(@Param('id') id: string) {
    return this.findItemService.execute(id);
  }
}
