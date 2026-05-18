import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';

@Injectable()
export class WhatsAppService {
  constructor(private prismaService: PrismaService) {}

  async updateWhatsapp(userId: string, whatsapp: string) {
    if (!whatsapp || whatsapp.length < 10) {
      throw new HttpException('WhatsApp inválido', 400);
    }

    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { whatsapp },
    });

    return user.whatsapp;
  }
}
