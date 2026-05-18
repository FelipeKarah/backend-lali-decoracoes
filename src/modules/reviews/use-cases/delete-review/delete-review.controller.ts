import { Controller, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { DeleteReviewService } from './delete-review.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class DeleteReviewController {
  constructor(private readonly deleteReviewService: DeleteReviewService) {}

  @Delete(':id')
  handle(@Request() req, @Param('id') id: string) {
    const isAdmin = req.user.role === 'ADMIN';
    return this.deleteReviewService.execute(id, req.user.id, isAdmin);
  }
}
