import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { Favorite } from '../../entities/favorite.entity';

@Injectable()
export class FindFavoritesByUserService {
  constructor(private prismaService: PrismaService) {}

  async execute(userId: string) {
    const favorites = await this.prismaService.favorite.findMany({
      where: { userId },
      include: {
        kit: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((favorite) => ({
      id: favorite.id,
      kit: favorite.kit,
      createdAt: favorite.createdAt,
    }));
  }
}
