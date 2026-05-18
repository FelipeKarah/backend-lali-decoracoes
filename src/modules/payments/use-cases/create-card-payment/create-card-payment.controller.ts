import { Body, Controller, Post } from '@nestjs/common';
import { CreateCardPaymentService } from './create-card-payment.service';
import { CreateCardPaymentDto } from '../../dto/create-card-payment.dto';

@Controller('payments')
export class CreateCardPaymentController {
  constructor(private readonly createCardPaymentService: CreateCardPaymentService) {}

  @Post('card')
  async create(@Body() createCardDto: CreateCardPaymentDto) {
    return this.createCardPaymentService.execute(createCardDto);
  }
}
