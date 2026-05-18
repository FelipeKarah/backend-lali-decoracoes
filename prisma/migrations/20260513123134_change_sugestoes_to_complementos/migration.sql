/*
  Warnings:

  - You are about to drop the column `sugestaoId` on the `kit_sugestoes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[kitId,complementoId]` on the table `kit_sugestoes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `complementoId` to the `kit_sugestoes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "kit_sugestoes" DROP CONSTRAINT "kit_sugestoes_sugestaoId_fkey";

-- DropIndex
DROP INDEX "kit_sugestoes_kitId_sugestaoId_key";

-- AlterTable
ALTER TABLE "kit_sugestoes" DROP COLUMN "sugestaoId",
ADD COLUMN     "complementoId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "kit_sugestoes_kitId_complementoId_key" ON "kit_sugestoes"("kitId", "complementoId");

-- AddForeignKey
ALTER TABLE "kit_sugestoes" ADD CONSTRAINT "kit_sugestoes_complementoId_fkey" FOREIGN KEY ("complementoId") REFERENCES "complementos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
