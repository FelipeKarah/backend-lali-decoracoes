import { HttpException, Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../shared/services/prisma.service'

@Injectable()
export class DeleteUserService {
  constructor(private prismaService: PrismaService) {}

  async execute(id: string): Promise<{ message: string }> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      throw new HttpException('Usuário não encontrado', 404)
    }

    await this.prismaService.user.delete({
      where: { id },
    })

    return { message: 'Usuário deletado com sucesso' }
  }
}
