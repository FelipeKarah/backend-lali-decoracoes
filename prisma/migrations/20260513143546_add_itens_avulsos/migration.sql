/*
  Warnings:

  - You are about to drop the `items` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('painel', 'mesa', 'bandeja', 'cadeira', 'toalha', 'luminaria', 'outros');

-- CreateEnum
CREATE TYPE "RentalType" AS ENUM ('ALUGUEL', 'CONSUMIVEL');

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_kitId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_kitId_fkey";

-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "rentalDays" INTEGER,
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "reservations" ALTER COLUMN "kitId" DROP NOT NULL;

-- DropTable
DROP TABLE "items";

-- CreateTable
CREATE TABLE "itens_avulsos" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL,
    "category" "ItemCategory" NOT NULL,
    "pricePerDay" DOUBLE PRECISION NOT NULL,
    "replacementPrice" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "available" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "rentalType" "RentalType" NOT NULL DEFAULT 'ALUGUEL',
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itens_avulsos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kit_itens" (
    "id" TEXT NOT NULL,
    "kitId" TEXT NOT NULL,
    "itemAvulsoId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "kit_itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_itens" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "itemAvulsoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "pricePerDay" DOUBLE PRECISION NOT NULL,
    "days" INTEGER NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "rentalType" "RentalType" NOT NULL,

    CONSTRAINT "reservation_itens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "itens_avulsos_code_key" ON "itens_avulsos"("code");

-- CreateIndex
CREATE UNIQUE INDEX "kit_itens_kitId_itemAvulsoId_key" ON "kit_itens"("kitId", "itemAvulsoId");

-- AddForeignKey
ALTER TABLE "kit_itens" ADD CONSTRAINT "kit_itens_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "kits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit_itens" ADD CONSTRAINT "kit_itens_itemAvulsoId_fkey" FOREIGN KEY ("itemAvulsoId") REFERENCES "itens_avulsos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "kits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_itens" ADD CONSTRAINT "reservation_itens_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_itens" ADD CONSTRAINT "reservation_itens_itemAvulsoId_fkey" FOREIGN KEY ("itemAvulsoId") REFERENCES "itens_avulsos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
