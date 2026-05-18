import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { Complemento } from '../../../complementos/entities/complemento.entity';
import { ItemAvulso } from '../../../itens-avulsos/entities/item-avulso.entity';

@Injectable()
export class KitSugestoesService {
  constructor(private prismaService: PrismaService) {}

  async execute(kitId: string): Promise<any[]> {
    const sugestoes = await this.prismaService.kitSugestao.findMany({
      where: { kitId },
    });

    const resultados = [];

    for (const sug of sugestoes) {
      if (sug.tipo === 'complemento') {
        const complemento = await this.prismaService.complemento.findUnique({
          where: { id: sug.itemId, isActive: true },
        });
        if (complemento) {
          resultados.push({
            id: complemento.id,
            name: complemento.name,
            description: complemento.description,
            icon: complemento.icon,
            price: complemento.price,
            tipo: 'complemento',
            categoria: complemento.category,
          });
        }
      } else if (sug.tipo === 'item_avulso') {
        const item = await this.prismaService.itemAvulso.findUnique({
          where: { id: sug.itemId, isActive: true },
        });
        if (item) {
          resultados.push({
            id: item.id,
            name: item.name,
            description: item.description,
            icon: item.icon,
            price: item.pricePerDay,
            tipo: 'item_avulso',
            categoria: item.category,
            rentalType: item.rentalType,
          });
        }
      }
    }

    return resultados;
  }
}
