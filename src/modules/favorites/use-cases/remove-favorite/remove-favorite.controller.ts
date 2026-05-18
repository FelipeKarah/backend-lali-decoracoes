import { Controller, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { RemoveFavoriteService } from './remove-favorite.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class RemoveFavoriteController {
  constructor(private readonly removeFavoriteService: RemoveFavoriteService) {}

  @Delete(':kitId')
  handle(@Request() req, @Param('kitId') kitId: string) {
    return this.removeFavoriteService.execute(req.user.id, kitId);
  }
}
