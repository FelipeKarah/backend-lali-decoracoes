import { Controller, Post, Body } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleAuthDto } from '../../dto/google-auth.dto';

@Controller('auth')
export class GoogleController {
  constructor(private readonly googleAuthService: GoogleService) {}

  @Post('google')
  handleGoogleAuth(@Body() googleAuthDto: GoogleAuthDto) {
    return this.googleAuthService.execute(googleAuthDto);
  }
}
