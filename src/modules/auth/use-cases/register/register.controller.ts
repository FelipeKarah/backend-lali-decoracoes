import { Body, Controller, Post } from '@nestjs/common'
import { RegisterDto } from '../../dto/register.dto'
import { RegisterService } from './register.service'

@Controller('auth')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register')
  handle(@Body() registerDto: RegisterDto) {
    return this.registerService.execute(registerDto)
  }
}
