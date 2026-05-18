import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';

import { AddFavoriteController } from './use-cases/add-favorite/add-favorite.controller';
import { RemoveFavoriteController } from './use-cases/remove-favorite/remove-favorite.controller';
import { FindFavoritesByUserController } from './use-cases/find-favorites-by-user/find-favorites-by-user.controller';

import { AddFavoriteService } from './use-cases/add-favorite/add-favorite.service';
import { RemoveFavoriteService } from './use-cases/remove-favorite/remove-favorite.service';
import { FindFavoritesByUserService } from './use-cases/find-favorites-by-user/find-favorites-by-user.service';

@Module({
  controllers: [
    AddFavoriteController,
    RemoveFavoriteController,
    FindFavoritesByUserController,
  ],
  providers: [
    PrismaService,
    AddFavoriteService,
    RemoveFavoriteService,
    FindFavoritesByUserService,
  ],
  exports: [],
})
export class FavoritesModule {}
