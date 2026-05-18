import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { Complemento } from '../../entities/complemento.entity';

@Injectable()
export class FindComplementoByIdService {
  constructor(private prismaService: PrismaService) {}

  async execute(id: string): Promise<Complemento> {
    const complemento = await this.prismaService.complemento.findUnique({
      where: { id },
    });

    if (!complemento) {
      throw new HttpException('Complemento não encontrado', 404);
    }

    return new Complemento(complemento);
  }
}
