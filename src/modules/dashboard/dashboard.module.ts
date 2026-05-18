import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';

import { GetStatsController } from './use-cases/get-stats/get-stats.controller';
import { GetChartsController } from './use-cases/get-charts/get-charts.controller';

import { GetStatsService } from './use-cases/get-stats/get-stats.service';
import { GetChartsService } from './use-cases/get-charts/get-charts.service';

@Module({
  controllers: [
    GetStatsController,
    GetChartsController,
  ],
  providers: [
    PrismaService,
    GetStatsService,
    GetChartsService,
  ],
  exports: [],
})
export class DashboardModule {}
