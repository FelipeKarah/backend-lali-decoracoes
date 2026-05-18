import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { FilterItensAvulsosDto } from '../../dto/filter-itens-avulsos.dto';
import { ItemAvulso } from '../../entities/item-avulso.entity';

@Injectable()
export class FindAllItensAvulsosService {
  constructor(private prismaService: PrismaService) {}

  async execute(filters: FilterItensAvulsosDto & { isActive?: boolean }) {
    const { page, limit, search, category, rentalType, isActive } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (category) {
      where.category = category;
    }

    if (rentalType) {
      where.rentalType = rentalType;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [itens, total] = await Promise.all([
      this.prismaService.itemAvulso.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prismaService.itemAvulso.count({ where }),
    ]);

    return {
      data: itens.map((item) => new ItemAvulso(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
