-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('RETIRADA', 'ENTREGA');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'CARTAO', 'DINHEIRO');

-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "deliveryAddress" TEXT,
ADD COLUMN     "deliveryCep" TEXT,
ADD COLUMN     "deliveryCity" TEXT,
ADD COLUMN     "deliveryNeighborhood" TEXT,
ADD COLUMN     "deliveryNumber" TEXT,
ADD COLUMN     "deliveryState" TEXT,
ADD COLUMN     "deliveryType" "DeliveryType" DEFAULT 'RETIRADA',
ADD COLUMN     "mpPaymentId" TEXT,
ADD COLUMN     "paidOnline" BOOLEAN DEFAULT false,
ADD COLUMN     "paymentMethod" "PaymentMethod",
ADD COLUMN     "shippingPrice" DOUBLE PRECISION DEFAULT 0;
