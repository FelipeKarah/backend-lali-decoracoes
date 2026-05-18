import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';

@Injectable()
export class DeleteItemAvulsoService {
  constructor(private prismaService: PrismaService) {}

  async execute(id: string): Promise<{ message: string }> {
    const existingItem = await this.prismaService.itemAvulso.findUnique({
      where: { id },
    });

    if (!existingItem) {
      throw new HttpException('Item não encontrado', 404);
    }

    await this.prismaService.itemAvulso.delete({
      where: { id },
    });

    return { message: 'Item deletado com sucesso' };
  }
}
