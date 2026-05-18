import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { DashboardFiltersDto } from '../../dto/dashboard-filters.dto';

@Injectable()
export class GetChartsService {
  constructor(private prismaService: PrismaService) {}

  async execute(filters: DashboardFiltersDto) {
    const currentDate = new Date();
    const year = filters.year || currentDate.getFullYear();

    // Reservas por semana (últimas 4 semanas)
    const weeks = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(currentDate.getDate() - (currentDate.getDay() + 7 * i));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const count = await this.prismaService.reservation.count({
        where: {
          createdAt: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      });

      weeks.push({
        label: `Sem ${Math.abs(i - 4)}`,
        value: count,
      });
    }

    // Reservas por mês (últimos 6 meses)
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(year, currentDate.getMonth() - i, 1);
      const monthStart = new Date(year, currentDate.getMonth() - i, 1);
      const monthEnd = new Date(year, currentDate.getMonth() - i + 1, 0, 23, 59, 59);

      const count = await this.prismaService.reservation.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });

      months.push({
        label: monthDate.toLocaleDateString('pt-BR', { month: 'short' }),
        value: count,
      });
    }

    // Faturamento por mês (últimos 6 meses)
    const revenueByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(year, currentDate.getMonth() - i, 1);
      const monthEnd = new Date(year, currentDate.getMonth() - i + 1, 0, 23, 59, 59);

      const revenue = await this.prismaService.reservation.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: {
          total: true,
        },
      });

      revenueByMonth.push({
        label: monthStart.toLocaleDateString('pt-BR', { month: 'short' }),
        value: revenue._sum.total || 0,
      });
    }

    // Kits por categoria
    const kitsByCategory = await this.prismaService.kit.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
    });

    return {
      reservasPorSemana: weeks,
      reservasPorMes: months,
      faturamentoPorMes: revenueByMonth,
      kitsPorCategoria: kitsByCategory.map((item) => ({
        category: item.category,
        count: item._count.category,
      })),
    };
  }
}
