import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { Reservation } from '../../entities/reservation.entity'

@Injectable()
export class FindReservationsByUserService {
  constructor(private prismaService: PrismaService) {}

  async execute(userId: string) {
    const reservations = await this.prismaService.reservation.findMany({
      where: { userId },
      include: {
        itens: true,
        kits: {
          include: {
            kit: true,
          },
        },
        complementos: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return reservations.map((reservation) => new Reservation(reservation))
  }
}
