import { Module } from '@nestjs/common'
import { UploadController } from './upload.controller'
import { UploadService } from '../../shared/services/upload.service'

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService], // exporta para usar em KitsModule, ItensModule, etc.
})
export class UploadModule {}
