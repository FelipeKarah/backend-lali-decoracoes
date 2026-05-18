import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { FindAllUsersService } from './find-all-users.service'
import { FilterUsersDto } from '../../dto/filter-users.dto'
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard'
import { RolesGuard } from '../../../../shared/guards/roles.guard'
import { Roles } from '../../../../shared/decorators/roles.decorator'
import { UserRole } from 'src/utils/enums/user-role.enum'

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FindAllUsersController {
  constructor(private readonly findAllUsersService: FindAllUsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  handle(@Query() filters: FilterUsersDto) {
    return this.findAllUsersService.execute(filters)
  }
}
