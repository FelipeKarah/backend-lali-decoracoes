import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { FilterComplementosDto } from '../../dto/filter-complementos.dto';
import { Complemento } from '../../entities/complemento.entity';

@Injectable()
export class FindAllComplementosService {
  constructor(private prismaService: PrismaService) {}

  async execute(filters: FilterComplementosDto, isAdmin: boolean = false) {
    const { page, limit, search, category } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Se não for admin, filtrar apenas ativos
    if (!isAdmin) {
      where.isActive = true;
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [complementos, total] = await Promise.all([
      this.prismaService.complemento.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prismaService.complemento.count({ where }),
    ]);

    return {
      data: complementos.map((complemento) => new Complemento(complemento)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
