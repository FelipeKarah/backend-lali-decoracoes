/*
  Warnings:

  - You are about to drop the column `complementoId` on the `kit_sugestoes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[kitId,tipo,itemId]` on the table `kit_sugestoes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemId` to the `kit_sugestoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `kit_sugestoes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "kit_sugestoes" DROP CONSTRAINT "kit_sugestoes_complementoId_fkey";

-- DropIndex
DROP INDEX "kit_sugestoes_kitId_complementoId_key";

-- AlterTable
ALTER TABLE "kit_sugestoes" DROP COLUMN "complementoId",
ADD COLUMN     "itemId" TEXT NOT NULL,
ADD COLUMN     "tipo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "kit_sugestoes_kitId_tipo_itemId_key" ON "kit_sugestoes"("kitId", "tipo", "itemId");
