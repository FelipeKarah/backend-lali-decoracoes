import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { UpdateItemAvulsoDto } from '../../dto/update-item-avulso.dto';
import { UpdateItemAvulsoService } from './update-item.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/itens-avulsos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UpdateItemAvulsoController {
  constructor(private readonly updateItemService: UpdateItemAvulsoService) {}

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  handle(@Param('id') id: string, @Body() updateDto: UpdateItemAvulsoDto) {
    return this.updateItemService.execute(id, updateDto);
  }
}
