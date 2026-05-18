import { Controller, Delete, Param, UseGuards } from '@nestjs/common'
import { DeleteUserService } from './delete-user.service'
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard'
import { RolesGuard } from '../../../../shared/guards/roles.guard'
import { Roles } from '../../../../shared/decorators/roles.decorator'
import { UserRole } from 'src/utils/enums/user-role.enum'

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeleteUserController {
  constructor(private readonly deleteUserService: DeleteUserService) {}

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  handle(@Param('id') id: string) {
    return this.deleteUserService.execute(id)
  }
}
