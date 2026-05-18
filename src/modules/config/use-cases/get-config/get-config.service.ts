import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { Config } from '../../entities/config.entity';

@Injectable()
export class GetConfigService {
  constructor(private prismaService: PrismaService) {}

  async execute(publicView: boolean = true) {
    let config = await this.prismaService.config.findFirst();

    if (!config) {
      // Criar configuração padrão se não existir
      config = await this.prismaService.config.create({
        data: {
          id: '1',
          companyName: 'Lali',
          whatsappNumber: '5511999990000',
          defaultCauction: 200,
          barcodePrefix: 'PM',
          emailSupport: 'oi@lali.com.br',
          address: 'Rua Exemplo, 123 - Americana, SP',
          workingHours: 'Segunda a Sexta: 9h às 18h | Sábado: 9h às 13h',
        },
      });
    }

    if (publicView) {
      // Retornar apenas informações públicas
      return {
        companyName: config.companyName,
        companyLogo: config.companyLogo,
        whatsappNumber: config.whatsappNumber,
        emailSupport: config.emailSupport,
        address: config.address,
        workingHours: config.workingHours,
      };
    }

    return new Config(config);
  }
}
