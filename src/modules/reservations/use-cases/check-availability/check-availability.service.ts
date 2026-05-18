import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { CheckAvailabilityDto } from '../../dto/check-availability.dto'

@Injectable()
export class CheckAvailabilityService {
  constructor(private prismaService: PrismaService) {}

  async execute(checkDto: CheckAvailabilityDto) {
    const { kitId, startDate, endDate } = checkDto

    const start = new Date(startDate)
    const end = new Date(endDate)

    // Verificar se o kit existe e está ativo
    const kit = await this.prismaService.kit.findUnique({
      where: { id: kitId, isActive: true },
    })

    if (!kit) {
      return { available: false, message: 'Kit não encontrado ou indisponível' }
    }

    // Verificar reservas conflitantes
    const conflictingReservations =
      await this.prismaService.reservation.findMany({
        where: {
          status: { in: ['CONFIRMED', 'WITHDRAWN'] },
          OR: [
            {
              AND: [{ startDate: { lte: end } }, { endDate: { gte: start } }],
            },
          ],
        },
      })

    const available = conflictingReservations.length === 0

    return {
      available,
      message: available
        ? 'Kit disponível para o período selecionado'
        : 'Kit já reservado para este período',
      conflictingReservations: available
        ? undefined
        : conflictingReservations.map((r) => ({
            startDate: r.startDate,
            endDate: r.endDate,
          })),
    }
  }
}
