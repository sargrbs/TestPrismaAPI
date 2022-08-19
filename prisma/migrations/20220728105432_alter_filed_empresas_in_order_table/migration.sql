-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_empresasId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "empresasId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_empresasId_fkey" FOREIGN KEY ("empresasId") REFERENCES "Empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
