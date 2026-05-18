import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';

@Injectable()
export class KitSugestoesAdminService {
  constructor(private prismaService: PrismaService) {}

  async getSugestoes(kitId: string): Promise<any[]> {
    const kit = await this.prismaService.kit.findUnique({
      where: { id: kitId },
    });

    if (!kit) {
      throw new HttpException('Kit não encontrado', 404);
    }

    const sugestoes = await this.prismaService.kitSugestao.findMany({
      where: { kitId },
    });

    const resultados = [];

    for (const sug of sugestoes) {
      if (sug.tipo === 'complemento') {
        const complemento = await this.prismaService.complemento.findUnique({
          where: { id: sug.itemId },
        });
        if (complemento) {
          resultados.push({
            id: complemento.id,
            name: complemento.name,
            icon: complemento.icon,
            price: complemento.price,
            tipo: 'complemento',
          });
        }
      } else if (sug.tipo === 'item_avulso') {
        const item = await this.prismaService.itemAvulso.findUnique({
          where: { id: sug.itemId },
        });
        if (item) {
          resultados.push({
            id: item.id,
            name: item.name,
            icon: item.icon,
            price: item.pricePerDay,
            tipo: 'item_avulso',
            rentalType: item.rentalType,
          });
        }
      }
    }

    return resultados;
  }

  async addSugestao(kitId: string, tipo: string, itemId: string): Promise<{ message: string }> {
    const kit = await this.prismaService.kit.findUnique({
      where: { id: kitId },
    });

    if (!kit) {
      throw new HttpException('Kit não encontrado', 404);
    }

    if (tipo === 'complemento') {
      const complemento = await this.prismaService.complemento.findUnique({
        where: { id: itemId },
      });
      if (!complemento) {
        throw new HttpException('Complemento não encontrado', 404);
      }
    } else if (tipo === 'item_avulso') {
      const item = await this.prismaService.itemAvulso.findUnique({
        where: { id: itemId },
      });
      if (!item) {
        throw new HttpException('Item avulso não encontrado', 404);
      }
    } else {
      throw new HttpException('Tipo inválido. Use "complemento" ou "item_avulso"', 400);
    }

    const existing = await this.prismaService.kitSugestao.findFirst({
      where: {
        kitId,
        tipo,
        itemId,
      },
    });

    if (existing) {
      throw new HttpException('Esta sugestão já está adicionada ao kit', 400);
    }

    await this.prismaService.kitSugestao.create({
      data: {
        kitId,
        tipo,
        itemId,
      },
    });

    return { message: 'Sugestão adicionada com sucesso' };
  }

  async removeSugestao(kitId: string, tipo: string, itemId: string): Promise<{ message: string }> {
    const existing = await this.prismaService.kitSugestao.findFirst({
      where: {
        kitId,
        tipo,
        itemId,
      },
    });

    if (!existing) {
      throw new HttpException('Sugestão não encontrada', 404);
    }

    await this.prismaService.kitSugestao.delete({
      where: {
        id: existing.id,
      },
    });

    return { message: 'Sugestão removida com sucesso' };
  }
}
