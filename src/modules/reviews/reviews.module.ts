import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';

import { CreateReviewController } from './use-cases/create-review/create-review.controller';
import { FindReviewsByKitController } from './use-cases/find-reviews-by-kit/find-reviews-by-kit.controller';
import { DeleteReviewController } from './use-cases/delete-review/delete-review.controller';

import { CreateReviewService } from './use-cases/create-review/create-review.service';
import { FindReviewsByKitService } from './use-cases/find-reviews-by-kit/find-reviews-by-kit.service';
import { DeleteReviewService } from './use-cases/delete-review/delete-review.service';

@Module({
  controllers: [
    CreateReviewController,
    FindReviewsByKitController,
    DeleteReviewController,
  ],
  providers: [
    PrismaService,
    CreateReviewService,
    FindReviewsByKitService,
    DeleteReviewService,
  ],
  exports: [],
})
export class ReviewsModule {}
