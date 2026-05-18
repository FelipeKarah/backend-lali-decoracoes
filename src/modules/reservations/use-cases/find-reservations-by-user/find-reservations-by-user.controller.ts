import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { FindReservationsByUserService } from './find-reservations-by-user.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class FindReservationsByUserController {
  constructor(private readonly findReservationsByUserService: FindReservationsByUserService) {}

  @Get('minhas')
  handle(@Request() req) {
    return this.findReservationsByUserService.execute(req.user.id);
  }
}
