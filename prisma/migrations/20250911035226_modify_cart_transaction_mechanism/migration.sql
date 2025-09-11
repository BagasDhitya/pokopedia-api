/*
  Warnings:

  - You are about to drop the column `cartId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_cartId_fkey";

-- DropIndex
DROP INDEX "public"."Transaction_cartId_key";

-- AlterTable
ALTER TABLE "public"."Cart" ADD COLUMN     "checkedOutAt" TIMESTAMP(3),
ADD COLUMN     "transactionId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "cartId",
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
