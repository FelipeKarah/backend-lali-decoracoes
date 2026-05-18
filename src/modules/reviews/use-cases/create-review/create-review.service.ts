import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { CreateReviewDto } from '../../dto/create-review.dto';
import { Review } from '../../entities/review.entity';

@Injectable()
export class CreateReviewService {
  constructor(private prismaService: PrismaService) {}

  async execute(userId: string, createReviewDto: CreateReviewDto): Promise<Review> {
    try {
      const { kitId, rating, comment, reservationId } = createReviewDto;

      // Verificar se o kit existe
      const kit = await this.prismaService.kit.findUnique({
        where: { id: kitId },
      });

      if (!kit) {
        throw new HttpException('Kit não encontrado', 404);
      }

      // Verificar se o usuário já avaliou este kit
      const existingReview = await this.prismaService.review.findFirst({
        where: {
          userId,
          kitId,
        },
      });

      if (existingReview) {
        throw new HttpException('Você já avaliou este kit', 400);
      }

      // Se foi fornecida reserva, verificar se pertence ao usuário
      if (reservationId) {
        const reservation = await this.prismaService.reservation.findFirst({
          where: {
            id: reservationId,
            userId,
          },
        });

        if (!reservation) {
          throw new HttpException('Reserva não encontrada ou não pertence ao usuário', 404);
        }
      }

      // Criar avaliação
      const review = await this.prismaService.review.create({
        data: {
          userId,
          kitId,
          reservationId,
          rating,
          comment,
        },
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

      return new Review(review);
    } catch (err) {
      throw new HttpException(err.message, err.status || 400);
    }
  }
}
