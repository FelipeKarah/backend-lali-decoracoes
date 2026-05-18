import { Body, Controller, Post } from '@nestjs/common';
import { CheckAvailabilityService } from './check-availability.service';
import { CheckAvailabilityDto } from '../../dto/check-availability.dto';

@Controller('kits')
export class CheckAvailabilityController {
  constructor(private readonly checkAvailabilityService: CheckAvailabilityService) {}

  @Post('check-availability')
  handle(@Body() checkDto: CheckAvailabilityDto) {
    return this.checkAvailabilityService.execute(checkDto);
  }
}
