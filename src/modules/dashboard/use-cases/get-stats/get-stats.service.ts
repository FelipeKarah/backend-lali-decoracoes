import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { DashboardFiltersDto } from '../../dto/dashboard-filters.dto'

@Injectable()
export class GetStatsService {
  constructor(private prismaService: PrismaService) {}

  async execute(filters: DashboardFiltersDto) {
    const currentDate = new Date()
    const year = filters.year || currentDate.getFullYear()
    const month = filters.month || currentDate.getMonth() + 1

    const startOfMonth = new Date(year, month - 1, 1)
    const endOfMonth = new Date(year, month, 0, 23, 59, 59)

    // Total de kits cadastrados
    const totalKits = await this.prismaService.kit.count()

    // Reservas ativas
    const activeReservas = await this.prismaService.reservation.count({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED', 'WITHDRAWN'],
        },
      },
    })

    // Devoluções pendentes
    const pendingReturns = await this.prismaService.reservation.count({
      where: {
        status: 'RETURNED',
      },
    })

    // Faturamento do mês
    const monthlyRevenue = await this.prismaService.reservation.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        total: true,
      },
    })

    // Produtos mais alugados (Top 5 kits)
    // const topKits = await this.prismaService.reservation.groupBy({
    //   by: ['kitId'],
    //   _count: {
    //     kitId: true,
    //   },
    //   orderBy: {
    //     _count: {
    //       kitId: 'desc',
    //     },
    //   },
    //   take: 5,
    // });

    const kitIds = [].map((item) => item.kitId)
    const kits = await this.prismaService.kit.findMany({
      where: {
        id: { in: kitIds },
      },
      select: {
        id: true,
        name: true,
        icon: true,
      },
    })

    const popularKits = [].map((item) => ({
      ...kits.find((k) => k.id === item.kitId),
      totalReservas: item._count.kitId,
    }))

    // Reservas por status
    const reservasPorStatus = await this.prismaService.reservation.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    })

    // Crescimento percentual
    const previousMonthStart = new Date(year, month - 2, 1)
    const previousMonthEnd = new Date(year, month - 1, 0, 23, 59, 59)

    const previousRevenue = await this.prismaService.reservation.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
      _sum: {
        total: true,
      },
    })

    const currentRevenue = monthlyRevenue._sum.total || 0
    const previousRevenueValue = previousRevenue._sum.total || 0
    const growth =
      previousRevenueValue > 0
        ? ((currentRevenue - previousRevenueValue) / previousRevenueValue) * 100
        : 0

    return {
      totalKits,
      activeReservas,
      pendingReturns,
      monthlyRevenue: currentRevenue,
      growth: Math.round(growth),
      popularKits: popularKits.filter((k) => k),
      reservasPorStatus: reservasPorStatus.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
    }
  }
}
