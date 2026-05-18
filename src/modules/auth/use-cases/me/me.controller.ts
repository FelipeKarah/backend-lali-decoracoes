import { Controller, Get, UseGuards, Request } from '@nestjs/common'
import { MeService } from './me.service'
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard'

@Controller('auth')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  handle(@Request() req) {
    return this.meService.execute(req.user.id)
  }
}
