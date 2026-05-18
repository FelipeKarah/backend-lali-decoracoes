import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { UpdateConfigDto } from '../../dto/update-config.dto';
import { Config } from '../../entities/config.entity';

@Injectable()
export class UpdateConfigService {
  constructor(private prismaService: PrismaService) {}

  async execute(updateConfigDto: UpdateConfigDto): Promise<Config> {
    try {
      let config = await this.prismaService.config.findFirst();

      if (!config) {
        config = await this.prismaService.config.create({
          data: {
            id: '1',
            companyName: updateConfigDto.companyName || 'Lali',
            whatsappNumber: updateConfigDto.whatsappNumber || '5511999990000',
            defaultCauction: updateConfigDto.defaultCauction || 200,
            barcodePrefix: updateConfigDto.barcodePrefix || 'PM',
            emailSupport: updateConfigDto.emailSupport || 'oi@lali.com.br',
            address: updateConfigDto.address || null,
            workingHours: updateConfigDto.workingHours || null,
          },
        });
      } else {
        config = await this.prismaService.config.update({
          where: { id: config.id },
          data: {
            companyName: updateConfigDto.companyName,
            companyLogo: updateConfigDto.companyLogo,
            whatsappNumber: updateConfigDto.whatsappNumber,
            defaultCauction: updateConfigDto.defaultCauction,
            barcodePrefix: updateConfigDto.barcodePrefix,
            emailSupport: updateConfigDto.emailSupport,
            address: updateConfigDto.address,
            workingHours: updateConfigDto.workingHours,
          },
        });
      }

      return new Config(config);
    } catch (err) {
      throw new HttpException(err.message, err.status || 400);
    }
  }
}
