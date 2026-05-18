// src/modules/kits/use-cases/admin-find-all-kits/admin-find-all-kits.controller.ts
import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common'
import { FindAllKitsService } from '../find-all-kits/find-all-kits.service'
import { FilterKitsDto } from '../../dto/filter-kits.dto'
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard'
import { RolesGuard } from '../../../../shared/guards/roles.guard'
import { Roles } from '../../../../shared/decorators/roles.decorator'
import { UserRole } from '../../../../utils/enums'

@Controller('admin/kits')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminFindAllKitsController {
  constructor(private readonly findAllKitsService: FindAllKitsService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  handle(@Request() req, @Query() filters: FilterKitsDto) {
    return this.findAllKitsService.execute(filters, req.user.id)
  }
}
