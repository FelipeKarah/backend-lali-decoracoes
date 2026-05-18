import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { CreateReservationDto } from '../../dto/create-reservation.dto';
import { CreateReservationService } from './create-reservation.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class CreateReservationController {
  constructor(private readonly createReservationService: CreateReservationService) {}

  @Post()
  handle(@Request() req, @Body() createReservationDto: CreateReservationDto) {
    return this.createReservationService.execute(req.user.id, createReservationDto);
  }
}
