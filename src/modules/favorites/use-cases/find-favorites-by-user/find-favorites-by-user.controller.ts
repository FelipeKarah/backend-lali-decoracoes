import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { FindFavoritesByUserService } from './find-favorites-by-user.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FindFavoritesByUserController {
  constructor(private readonly findFavoritesByUserService: FindFavoritesByUserService) {}

  @Get()
  handle(@Request() req) {
    return this.findFavoritesByUserService.execute(req.user.id);
  }
}
