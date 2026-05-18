import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindReviewsByKitService } from './find-reviews-by-kit.service';

@Controller('reviews')
export class FindReviewsByKitController {
  constructor(private readonly findReviewsByKitService: FindReviewsByKitService) {}

  @Get('kit/:kitId')
  handle(
    @Param('kitId') kitId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.findReviewsByKitService.execute(
      kitId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }
}
