import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';

import { GetConfigController } from './use-cases/get-config/get-config.controller';
import { UpdateConfigController } from './use-cases/update-config/update-config.controller';

import { GetConfigService } from './use-cases/get-config/get-config.service';
import { UpdateConfigService } from './use-cases/update-config/update-config.service';

@Module({
  controllers: [
    GetConfigController,
    UpdateConfigController,
  ],
  providers: [
    PrismaService,
    GetConfigService,
    UpdateConfigService,
  ],
  exports: [],
})
export class ConfigModule {}
