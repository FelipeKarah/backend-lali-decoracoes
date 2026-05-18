// src/modules/kits/services/find-all-kits/find-all-kits.service.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { ImageUrlHelper } from '../../../../shared/helpers/image-url.helper'
import { FilterKitsDto } from '../../dto/filter-kits.dto'
import { Kit } from '../../entities/kit.entity'

@Injectable()
export class FindAllKitsService {
  constructor(
    private prismaService: PrismaService,
    private imageUrlHelper: ImageUrlHelper, // ✅ Injeta o helper
  ) {}

  async execute(filters: FilterKitsDto, userId?: string, baseUrl?: string) {
    const { page, limit, search, category, sort } = filters
    const skip = (page - 1) * limit

    const where: any = { isActive: true }

    if (category) where.category = category
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'popular') orderBy = { rating: 'desc' }
    else if (sort === 'menor') orderBy = { pricePerDay: 'asc' }
    else if (sort === 'maior') orderBy = { pricePerDay: 'desc' }

    const kits = await this.prismaService.kit.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: { items: { include: { itemAvulso: true } } },
    })

    const total = await this.prismaService.kit.count({ where })

    // Buscar favoritos
    let favoriteKitIds = new Set<string>()
    if (userId) {
      const favorites = await this.prismaService.favorite.findMany({
        where: { userId },
        select: { kitId: true },
      })
      favoriteKitIds = new Set(favorites.map((fav) => fav.kitId))
    }

    // ✅ Processa os kits (as imagens serão tratadas pelo interceptor)
    const kitsWithData = kits.map((kit) => ({
      ...new Kit(kit),
      isFavorite: favoriteKitIds.has(kit.id),
    }))

    return {
      data: kitsWithData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }
}
