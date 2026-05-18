import { Controller, Post, Param, UseGuards, Request } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post(':id/checkout')
  handle(@Request() req, @Param('id') id: string) {
    return this.checkoutService.execute(id);
  }
}
