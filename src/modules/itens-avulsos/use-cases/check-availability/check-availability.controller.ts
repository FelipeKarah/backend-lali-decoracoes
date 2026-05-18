import { Body, Controller, Post } from '@nestjs/common';
import { CheckItemAvailabilityService } from './check-availability.service';
import { CheckItemAvailabilityDto } from './check-availability.dto';

@Controller('itens-avulsos')
export class CheckItemAvailabilityController {
  constructor(private readonly checkAvailabilityService: CheckItemAvailabilityService) {}

  @Post('check-availability')
  handle(@Body() checkDto: CheckItemAvailabilityDto) {
    return this.checkAvailabilityService.execute(checkDto);
  }
}
