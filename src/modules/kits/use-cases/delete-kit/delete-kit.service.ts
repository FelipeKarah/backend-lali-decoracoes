import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';

@Injectable()
export class DeleteKitService {
  constructor(private prismaService: PrismaService) {}

  async execute(id: string): Promise<{ message: string }> {
    const existingKit = await this.prismaService.kit.findUnique({
      where: { id },
    });

    if (!existingKit) {
      throw new HttpException('Kit não encontrado', 404);
    }

    await this.prismaService.kit.delete({
      where: { id },
    });

    return { message: 'Kit deletado com sucesso' };
  }
}
