/*
  Warnings:

  - You are about to drop the column `kitId` on the `reservations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_kitId_fkey";

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "kitId";

-- CreateTable
CREATE TABLE "reservation_kits" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "kitId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "pricePerDay" DOUBLE PRECISION NOT NULL,
    "days" INTEGER NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "rentalType" "RentalType" NOT NULL DEFAULT 'ALUGUEL',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservation_kits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reservation_kits_reservationId_kitId_key" ON "reservation_kits"("reservationId", "kitId");

-- AddForeignKey
ALTER TABLE "reservation_kits" ADD CONSTRAINT "reservation_kits_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_kits" ADD CONSTRAINT "reservation_kits_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "kits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
