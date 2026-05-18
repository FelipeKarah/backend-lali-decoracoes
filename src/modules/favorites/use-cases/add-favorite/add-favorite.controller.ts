import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AddFavoriteDto } from '../../dto/add-favorite.dto';
import { AddFavoriteService } from './add-favorite.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class AddFavoriteController {
  constructor(private readonly addFavoriteService: AddFavoriteService) {}

  @Post()
  handle(@Request() req, @Body() addFavoriteDto: AddFavoriteDto) {
    return this.addFavoriteService.execute(req.user.id, addFavoriteDto);
  }
}
