import { Controller, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../../../../shared/services/prisma.service';

@Controller('auth')
export class WhatsAppController {
  constructor(private prismaService: PrismaService) {}

  @Patch('whatsapp')
  @UseGuards(AuthGuard('jwt'))
  async updateWhatsapp(@Request() req, @Body('whatsapp') whatsapp: string) {
    const userId = req.user.sub;
    
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { whatsapp },
    });
    
    return { 
      success: true, 
      whatsapp: user.whatsapp,
      message: 'WhatsApp atualizado com sucesso' 
    };
  }
}
