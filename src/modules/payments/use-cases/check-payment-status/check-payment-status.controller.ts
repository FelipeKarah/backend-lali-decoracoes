import { Controller, Get, Param } from '@nestjs/common';
import { CheckPaymentStatusService } from './check-payment-status.service';

@Controller('payments')
export class CheckPaymentStatusController {
  constructor(private readonly checkPaymentStatusService: CheckPaymentStatusService) {}

  @Get(':id/status')
  async check(@Param('id') id: string) {
    return this.checkPaymentStatusService.execute(id);
  }
}
