import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { User } from '../../entities/user.entity'

@Injectable()
export class MeService {
  constructor(private prismaService: PrismaService) {}

  async execute(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { reservations: true },
    })

    return new User(user)
  }
}
