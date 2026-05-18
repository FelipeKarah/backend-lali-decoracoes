import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../shared/services/prisma.service'

// Controllers Admin
import { CreateItemAvulsoController } from './use-cases/create-item/create-item.controller'
import { FindAllItensAvulsosController } from './use-cases/find-all-itens/find-all-itens.controller'
import { FindItemAvulsoByIdController } from './use-cases/find-item-by-id/find-item-by-id.controller'
import { UpdateItemAvulsoController } from './use-cases/update-item/update-item.controller'
import { DeleteItemAvulsoController } from './use-cases/delete-item/delete-item.controller'

// Controllers Públicos
import { PublicFindAllItensAvulsosController } from './use-cases/public-find-all-itens/public-find-all-itens.controller'
import { PublicFindItemAvulsoByIdController } from './use-cases/public-find-item-by-id/public-find-item-by-id.controller'
import { CheckItemAvailabilityController } from './use-cases/check-availability/check-availability.controller'

// Services
import { CreateItemAvulsoService } from './use-cases/create-item/create-item.service'
import { FindAllItensAvulsosService } from './use-cases/find-all-itens/find-all-itens.service'
import { FindItemAvulsoByIdService } from './use-cases/find-item-by-id/find-item-by-id.service'
import { UpdateItemAvulsoService } from './use-cases/update-item/update-item.service'
import { DeleteItemAvulsoService } from './use-cases/delete-item/delete-item.service'
import { CheckItemAvailabilityService } from './use-cases/check-availability/check-availability.service'
import { UploadService } from 'src/shared/services/upload.service'

@Module({
  controllers: [
    // Admin
    CreateItemAvulsoController,
    FindAllItensAvulsosController,
    FindItemAvulsoByIdController,
    UpdateItemAvulsoController,
    DeleteItemAvulsoController,
    // Públicos
    PublicFindAllItensAvulsosController,
    PublicFindItemAvulsoByIdController,
    CheckItemAvailabilityController,
  ],
  providers: [
    PrismaService,
    ConfigService,
    CreateItemAvulsoService,
    FindAllItensAvulsosService,
    FindItemAvulsoByIdService,
    UpdateItemAvulsoService,
    DeleteItemAvulsoService,
    CheckItemAvailabilityService,
    UploadService,
  ],
  exports: [],
})
export class ItensAvulsosModule {}
