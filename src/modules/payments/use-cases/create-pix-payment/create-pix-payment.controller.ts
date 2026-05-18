import { Body, Controller, Post } from '@nestjs/common';
import { CreatePixPaymentService } from './create-pix-payment.service';
import { CreatePixPaymentDto } from '../../dto/create-pix-payment.dto';

@Controller('payments')
export class CreatePixPaymentController {
  constructor(private readonly createPixPaymentService: CreatePixPaymentService) {}

  @Post('pix')
  async create(@Body() createPixDto: CreatePixPaymentDto) {
    return this.createPixPaymentService.execute(createPixDto);
  }
}
