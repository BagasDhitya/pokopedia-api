/*
  Warnings:

  - A unique constraint covering the columns `[invoice]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "invoice" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_invoice_key" ON "public"."Transaction"("invoice");
