import { Controller, Post, Param, UseGuards, Request } from '@nestjs/common';
import { CancelReservationService } from './cancel-reservation.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class CancelReservationController {
  constructor(private readonly cancelReservationService: CancelReservationService) {}

  @Post(':id/cancelar')
  handle(@Request() req, @Param('id') id: string) {
    const isAdmin = req.user.role === 'ADMIN';
    return this.cancelReservationService.execute(id, req.user.id, isAdmin);
  }
}
