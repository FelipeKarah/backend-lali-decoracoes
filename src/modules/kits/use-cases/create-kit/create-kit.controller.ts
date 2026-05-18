import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateKitDto } from '../../dto/create-kit.dto';
import { CreateKitService } from './create-kit.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/kits')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreateKitController {
  constructor(private readonly createKitService: CreateKitService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  handle(@Body() createKitDto: CreateKitDto) {
    return this.createKitService.execute(createKitDto);
  }
}
