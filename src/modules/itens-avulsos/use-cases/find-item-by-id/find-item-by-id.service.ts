import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { ItemAvulso } from '../../entities/item-avulso.entity';

@Injectable()
export class FindItemAvulsoByIdService {
  constructor(private prismaService: PrismaService) {}

  async execute(id: string): Promise<ItemAvulso> {
    const item = await this.prismaService.itemAvulso.findUnique({
      where: { id },
    });

    if (!item) {
      throw new HttpException('Item não encontrado', 404);
    }

    return new ItemAvulso(item);
  }
}
