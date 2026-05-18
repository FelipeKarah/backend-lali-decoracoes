import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { FilterReservationsDto } from '../../dto/filter-reservations.dto'
import { Reservation } from '../../entities/reservation.entity'

@Injectable()
export class FindAllReservationsService {
  constructor(private prismaService: PrismaService) {}

  async execute(filters: FilterReservationsDto) {
    const { page, limit, status } = filters
    const skip = (page - 1) * limit

    const where: any = {}

    if (status) {
      where.status = status
    }

    const [reservations, total] = await Promise.all([
      this.prismaService.reservation.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: true,
          kits: {
            include: {
              kit: true,
            },
          },
          complementos: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.reservation.count({ where }),
    ])

    return {
      data: reservations.map((reservation) => new Reservation(reservation)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }
}
