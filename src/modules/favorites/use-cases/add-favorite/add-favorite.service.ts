import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { AddFavoriteDto } from '../../dto/add-favorite.dto';
import { Favorite } from '../../entities/favorite.entity';

@Injectable()
export class AddFavoriteService {
  constructor(private prismaService: PrismaService) {}

  async execute(userId: string, addFavoriteDto: AddFavoriteDto): Promise<Favorite> {
    try {
      const { kitId } = addFavoriteDto;

      // Verificar se o kit existe
      const kit = await this.prismaService.kit.findUnique({
        where: { id: kitId },
      });

      if (!kit) {
        throw new HttpException('Kit não encontrado', 404);
      }

      // Verificar se já é favorito
      const existingFavorite = await this.prismaService.favorite.findUnique({
        where: {
          userId_kitId: {
            userId,
            kitId,
          },
        },
      });

      if (existingFavorite) {
        throw new HttpException('Kit já está nos favoritos', 400);
      }

      const favorite = await this.prismaService.favorite.create({
        data: {
          userId,
          kitId,
        },
        include: {
          kit: true,
        },
      });

      return new Favorite(favorite);
    } catch (err) {
      throw new HttpException(err.message, err.status || 400);
    }
  }
}
