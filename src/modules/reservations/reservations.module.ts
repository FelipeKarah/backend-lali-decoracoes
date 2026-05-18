import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';

import { CreateReservationController } from './use-cases/create-reservation/create-reservation.controller';
import { FindReservationsByUserController } from './use-cases/find-reservations-by-user/find-reservations-by-user.controller';
import { FindAllReservationsController } from './use-cases/find-all-reservations/find-all-reservations.controller';
import { FindReservationByIdController } from './use-cases/find-reservation-by-id/find-reservation-by-id.controller';
import { UpdateReservationStatusController } from './use-cases/update-reservation-status/update-reservation-status.controller';
import { CancelReservationController } from './use-cases/cancel-reservation/cancel-reservation.controller';
import { CheckoutController } from './use-cases/checkout/checkout.controller';
import { CheckAvailabilityController } from './use-cases/check-availability/check-availability.controller';

import { CreateReservationService } from './use-cases/create-reservation/create-reservation.service';
import { FindReservationsByUserService } from './use-cases/find-reservations-by-user/find-reservations-by-user.service';
import { FindAllReservationsService } from './use-cases/find-all-reservations/find-all-reservations.service';
import { FindReservationByIdService } from './use-cases/find-reservation-by-id/find-reservation-by-id.service';
import { UpdateReservationStatusService } from './use-cases/update-reservation-status/update-reservation-status.service';
import { CancelReservationService } from './use-cases/cancel-reservation/cancel-reservation.service';
import { CheckoutService } from './use-cases/checkout/checkout.service';
import { CheckAvailabilityService } from './use-cases/check-availability/check-availability.service';

@Module({
  controllers: [
    CreateReservationController,
    FindReservationsByUserController,
    FindAllReservationsController,
    FindReservationByIdController,
    UpdateReservationStatusController,
    CancelReservationController,
    CheckoutController,
    CheckAvailabilityController,
  ],
  providers: [
    PrismaService,
    CreateReservationService,
    FindReservationsByUserService,
    FindAllReservationsService,
    FindReservationByIdService,
    UpdateReservationStatusService,
    CancelReservationService,
    CheckoutService,
    CheckAvailabilityService,
  ],
  exports: [],
})
export class ReservationsModule {}
