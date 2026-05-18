import { Module } from '@nestjs/common'
import { PrismaService } from '../../shared/services/prisma.service'

// Controllers públicos
import { FindAllComplementosController } from './use-cases/find-all-complementos/find-all-complementos.controller'
import { FindComplementoByIdController } from './use-cases/find-complemento-by-id/find-complemento-by-id.controller'

// Controllers admin
import { AdminFindAllComplementosController } from './use-cases/admin-find-all-complementos/admin-find-all-complementos.controller'
import { CreateComplementoController } from './use-cases/create-complemento/create-complemento.controller'
import { UpdateComplementoController } from './use-cases/update-complemento/update-complemento.controller'
import { DeleteComplementoController } from './use-cases/delete-complemento/delete-complemento.controller'

// Services
import { CreateComplementoService } from './use-cases/create-complemento/create-complemento.service'
import { FindAllComplementosService } from './use-cases/find-all-complementos/find-all-complementos.service'
import { FindComplementoByIdService } from './use-cases/find-complemento-by-id/find-complemento-by-id.service'
import { UpdateComplementoService } from './use-cases/update-complemento/update-complemento.service'
import { DeleteComplementoService } from './use-cases/delete-complemento/delete-complemento.service'
import { UploadService } from 'src/shared/services/upload.service'

@Module({
  controllers: [
    // Públicos
    FindAllComplementosController,
    FindComplementoByIdController,
    // Admin
    AdminFindAllComplementosController,
    CreateComplementoController,
    UpdateComplementoController,
    DeleteComplementoController,
  ],
  providers: [
    PrismaService,
    CreateComplementoService,
    FindAllComplementosService,
    FindComplementoByIdService,
    UpdateComplementoService,
    DeleteComplementoService,
    UploadService,
  ],
  exports: [],
})
export class ComplementosModule {}
