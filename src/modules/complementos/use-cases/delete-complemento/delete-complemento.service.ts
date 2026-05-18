import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';

@Injectable()
export class DeleteComplementoService {
  constructor(private prismaService: PrismaService) {}

  async execute(id: string): Promise<{ message: string }> {
    const existingComplemento = await this.prismaService.complemento.findUnique({
      where: { id },
    });

    if (!existingComplemento) {
      throw new HttpException('Complemento não encontrado', 404);
    }

    await this.prismaService.complemento.delete({
      where: { id },
    });

    return { message: 'Complemento deletado com sucesso' };
  }
}
