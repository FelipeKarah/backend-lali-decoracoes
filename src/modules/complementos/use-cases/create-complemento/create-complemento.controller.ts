import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateComplementoDto } from '../../dto/create-complemento.dto';
import { CreateComplementoService } from './create-complemento.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/complementos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreateComplementoController {
  constructor(private readonly createComplementoService: CreateComplementoService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  handle(@Body() createComplementoDto: CreateComplementoDto) {
    return this.createComplementoService.execute(createComplementoDto);
  }
}
