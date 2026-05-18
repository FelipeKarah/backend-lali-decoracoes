import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { CreateReviewDto } from '../../dto/create-review.dto';
import { CreateReviewService } from './create-review.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class CreateReviewController {
  constructor(private readonly createReviewService: CreateReviewService) {}

  @Post()
  handle(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.createReviewService.execute(req.user.id, createReviewDto);
  }
}
