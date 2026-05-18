import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { KitsModule } from './modules/kits/kits.module'
import { ItensAvulsosModule } from './modules/itens-avulsos/itens-avulsos.module'
import { ComplementosModule } from './modules/complementos/complementos.module'
import { ReservationsModule } from './modules/reservations/reservations.module'
import { ChecklistModule } from './modules/checklist/checklist.module'
import { FavoritesModule } from './modules/favorites/favorites.module'
import { ReviewsModule } from './modules/reviews/reviews.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { ConfigModule as AppConfigModule } from './modules/config/config.module'
import { PrismaService } from './shared/services/prisma.service'
import { PaymentsModule } from './modules/payments/payments.module'
import { UploadModule } from './modules/upload/upload.module'
import { ImageUrlHelper } from './shared/helpers/image-url.helper'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ImageUrlInterceptor } from './shared/interceptors/image-url.interceptor'

@Module({
  imports: [
    PaymentsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    KitsModule,
    ItensAvulsosModule,
    ComplementosModule,
    ReservationsModule,
    ChecklistModule,
    FavoritesModule,
    ReviewsModule,
    DashboardModule,
    AppConfigModule,
    UploadModule,
  ],
  providers: [
    PrismaService,
    ImageUrlHelper,
    {
      provide: APP_INTERCEPTOR,
      useClass: ImageUrlInterceptor,
    },
  ],
})
export class AppModule {}
