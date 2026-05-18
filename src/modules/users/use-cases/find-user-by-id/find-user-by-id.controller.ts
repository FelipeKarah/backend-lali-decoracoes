import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { FindUserByIdService } from './find-user-by-id.service'
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard'
import { RolesGuard } from '../../../../shared/guards/roles.guard'
import { Roles } from '../../../../shared/decorators/roles.decorator'
import { UserRole } from 'src/utils/enums/user-role.enum'

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FindUserByIdController {
  constructor(private readonly findUserByIdService: FindUserByIdService) {}

  @Get(':id')
  @Roles(UserRole.ADMIN)
  handle(@Param('id') id: string) {
    return this.findUserByIdService.execute(id)
  }
}
