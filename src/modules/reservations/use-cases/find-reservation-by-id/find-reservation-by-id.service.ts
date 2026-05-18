import { HttpException, Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { Reservation } from '../../entities/reservation.entity'

@Injectable()
export class FindReservationByIdService {
  constructor(private prismaService: PrismaService) {}

  async execute(id: string, userId?: string, isAdmin: boolean = false) {
    const where: any = { id }

    if (!isAdmin) {
      where.userId = userId
    }

    const reservation = await this.prismaService.reservation.findFirst({
      where,
      include: {
        user: true,
        kits: {
          include: {
            kit: true,
          },
        },
        itens: true,
        complementos: true,
        checklist: true,
      },
    })

    if (!reservation) {
      throw new HttpException('Reserva não encontrada', 404)
    }

    return new Reservation(reservation)
  }
}
