import { HttpException, Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { User } from '../../entities/user.entity'

@Injectable()
export class FindUserByIdService {
  constructor(private prismaService: PrismaService) {}

  async execute(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new HttpException('Usuário não encontrado', 404)
    }

    return new User(user)
  }
}
