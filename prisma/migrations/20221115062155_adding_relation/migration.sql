/*
  Warnings:

  - Added the required column `serviceId` to the `prices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prices" ADD COLUMN     "serviceId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
