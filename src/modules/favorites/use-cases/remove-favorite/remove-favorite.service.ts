import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';

@Injectable()
export class RemoveFavoriteService {
  constructor(private prismaService: PrismaService) {}

  async execute(userId: string, kitId: string): Promise<{ message: string }> {
    try {
      const favorite = await this.prismaService.favorite.findUnique({
        where: {
          userId_kitId: {
            userId,
            kitId,
          },
        },
      });

      if (!favorite) {
        throw new HttpException('Kit não está nos favoritos', 404);
      }

      await this.prismaService.favorite.delete({
        where: {
          userId_kitId: {
            userId,
            kitId,
          },
        },
      });

      return { message: 'Kit removido dos favoritos com sucesso' };
    } catch (err) {
      throw new HttpException(err.message, err.status || 400);
    }
  }
}
