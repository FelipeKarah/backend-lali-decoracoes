import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';

@Injectable()
export class DeleteReviewService {
  constructor(private prismaService: PrismaService) {}

  async execute(reviewId: string, userId: string, isAdmin: boolean = false): Promise<{ message: string }> {
    try {
      const review = await this.prismaService.review.findUnique({
        where: { id: reviewId },
      });

      if (!review) {
        throw new HttpException('Avaliação não encontrada', 404);
      }

      // Verificar permissão: admin ou dono da avaliação
      if (!isAdmin && review.userId !== userId) {
        throw new HttpException('Você não tem permissão para excluir esta avaliação', 403);
      }

      const kitId = review.kitId;

      // Deletar avaliação
      await this.prismaService.review.delete({
        where: { id: reviewId },
      });

      // Atualizar média de avaliações do kit
      const kitReviews = await this.prismaService.review.aggregate({
        where: { kitId },
        _avg: { rating: true },
        _count: true,
      });

      await this.prismaService.kit.update({
        where: { id: kitId },
        data: {
          rating: kitReviews._avg.rating || 4.5,
          reviewsCount: kitReviews._count,
        },
      });

      return { message: 'Avaliação excluída com sucesso' };
    } catch (err) {
      throw new HttpException(err.message, err.status || 400);
    }
  }
}
