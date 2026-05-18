import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';

import { GetChecklistController } from './use-cases/get-checklist/get-checklist.controller';
import { ScanItemController } from './use-cases/scan-item/scan-item.controller';
import { FinalizeChecklistController } from './use-cases/finalize-checklist/finalize-checklist.controller';

import { GetChecklistService } from './use-cases/get-checklist/get-checklist.service';
import { ScanItemService } from './use-cases/scan-item/scan-item.service';
import { FinalizeChecklistService } from './use-cases/finalize-checklist/finalize-checklist.service';

@Module({
  controllers: [
    GetChecklistController,
    ScanItemController,
    FinalizeChecklistController,
  ],
  providers: [
    PrismaService,
    GetChecklistService,
    ScanItemService,
    FinalizeChecklistService,
  ],
  exports: [],
})
export class ChecklistModule {}
