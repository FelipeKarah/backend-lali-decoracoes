import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { FindReservationByIdService } from './find-reservation-by-id.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class FindReservationByIdController {
  constructor(private readonly findReservationByIdService: FindReservationByIdService) {}

  @Get(':id')
  handle(@Request() req, @Param('id') id: string) {
    const isAdmin = req.user.role === 'ADMIN';
    return this.findReservationByIdService.execute(id, req.user.id, isAdmin);
  }
}
