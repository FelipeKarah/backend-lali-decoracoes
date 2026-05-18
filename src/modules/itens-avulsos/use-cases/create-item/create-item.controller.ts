import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateItemAvulsoDto } from '../../dto/create-item-avulso.dto';
import { CreateItemAvulsoService } from './create-item.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/itens-avulsos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreateItemAvulsoController {
  constructor(private readonly createItemService: CreateItemAvulsoService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  handle(@Body() createDto: CreateItemAvulsoDto) {
    return this.createItemService.execute(createDto);
  }
}
