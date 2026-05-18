import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetConfigService } from './get-config.service';

@Controller('config')
export class GetConfigController {
  constructor(private readonly getConfigService: GetConfigService) {}

  @Get()
  handle() {
    // Rota pública - retorna apenas informações públicas
    return this.getConfigService.execute(true);
  }
}
