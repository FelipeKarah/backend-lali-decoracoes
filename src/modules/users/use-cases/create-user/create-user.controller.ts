import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CreateUserDto } from '../../dto/create-user.dto'
import { CreateUserService } from './create-user.service'
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard'
import { UserRole } from 'src/utils/enums/user-role.enum'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { RolesGuard } from 'src/shared/guards/roles.guard'

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  handle(@Body() createUserDto: CreateUserDto) {
    return this.createUserService.execute(createUserDto)
  }
}
