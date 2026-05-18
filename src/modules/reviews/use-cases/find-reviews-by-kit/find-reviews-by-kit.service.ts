import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { Review } from '../../entities/review.entity';

@Injectable()
export class FindReviewsByKitService {
  constructor(private prismaService: PrismaService) {}

  async execute(kitId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prismaService.review.findMany({
        where: { kitId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.review.count({ where: { kitId } }),
    ]);

    return {
      data: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        userName: review.user.name,
        createdAt: review.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      averageRating: reviews.length > 0 
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
        : 0,
    };
  }
}
