import { Module } from '@nestjs/common'
import { PrismaService } from '../../shared/services/prisma.service'

// Controllers públicos
import { FindAllKitsController } from './use-cases/find-all-kits/find-all-kits.controller'
import { FindKitByIdController } from './use-cases/find-kit-by-id/find-kit-by-id.controller'
import { KitSugestoesController } from './use-cases/kit-sugestoes/kit-sugestoes.controller'

// Controllers admin
import { AdminFindAllKitsController } from './use-cases/admin-find-all-kits/admin-find-all-kits.controller'
import { CreateKitController } from './use-cases/create-kit/create-kit.controller'
import { UpdateKitController } from './use-cases/update-kit/update-kit.controller'
import { DeleteKitController } from './use-cases/delete-kit/delete-kit.controller'
import { KitSugestoesAdminController } from './use-cases/kit-sugestoes-admin/kit-sugestoes-admin.controller'

// Services
import { CreateKitService } from './use-cases/create-kit/create-kit.service'
import { FindAllKitsService } from './use-cases/find-all-kits/find-all-kits.service'
import { FindKitByIdService } from './use-cases/find-kit-by-id/find-kit-by-id.service'
import { UpdateKitService } from './use-cases/update-kit/update-kit.service'
import { DeleteKitService } from './use-cases/delete-kit/delete-kit.service'
import { KitSugestoesService } from './use-cases/kit-sugestoes/kit-sugestoes.service'
import { KitSugestoesAdminService } from './use-cases/kit-sugestoes-admin/kit-sugestoes-admin.service'
import { UploadModule } from '../upload/upload.module'
import { ImageUrlHelper } from 'src/shared/helpers/image-url.helper'

@Module({
  imports: [UploadModule],
  controllers: [
    // Públicos
    FindAllKitsController,
    FindKitByIdController,
    KitSugestoesController,
    // Admin
    AdminFindAllKitsController,
    CreateKitController,
    UpdateKitController,
    DeleteKitController,
    KitSugestoesAdminController,
  ],
  providers: [
    PrismaService,
    CreateKitService,
    FindAllKitsService,
    FindKitByIdService,
    UpdateKitService,
    DeleteKitService,
    KitSugestoesService,
    KitSugestoesAdminService,
    ImageUrlHelper,
  ],
  exports: [],
})
export class KitsModule {}
