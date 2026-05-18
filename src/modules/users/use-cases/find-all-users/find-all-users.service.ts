import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { User } from '../../entities/user.entity'
import { FilterUsersDto } from '../../dto/filter-users.dto'

@Injectable()
export class FindAllUsersService {
  constructor(private prismaService: PrismaService) {}

  async execute(filters: FilterUsersDto) {
    const { page, limit, search } = filters
    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.user.count({ where }),
    ])

    return {
      data: users.map((user) => new User(user)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }
}
