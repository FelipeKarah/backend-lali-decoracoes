import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { KitSugestoesAdminService } from './kit-sugestoes-admin.service';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../utils/enums';

@Controller('admin/kits')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KitSugestoesAdminController {
  constructor(private readonly kitSugestoesAdminService: KitSugestoesAdminService) {}

  @Get(':kitId/sugestoes')
  @Roles(UserRole.ADMIN)
  async getSugestoes(@Param('kitId') kitId: string) {
    return this.kitSugestoesAdminService.getSugestoes(kitId);
  }

  @Post(':kitId/sugestoes')
  @Roles(UserRole.ADMIN)
  async addSugestao(
    @Param('kitId') kitId: string,
    @Body() body: { tipo: string; itemId: string },
  ) {
    return this.kitSugestoesAdminService.addSugestao(kitId, body.tipo, body.itemId);
  }

  @Delete(':kitId/sugestoes/:tipo/:itemId')
  @Roles(UserRole.ADMIN)
  async removeSugestao(
    @Param('kitId') kitId: string,
    @Param('tipo') tipo: string,
    @Param('itemId') itemId: string,
  ) {
    return this.kitSugestoesAdminService.removeSugestao(kitId, tipo, itemId);
  }
}
