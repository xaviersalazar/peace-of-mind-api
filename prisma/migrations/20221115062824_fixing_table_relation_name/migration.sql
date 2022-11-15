/*
  Warnings:

  - You are about to drop the column `serviceId` on the `prices` table. All the data in the column will be lost.
  - Added the required column `service_id` to the `prices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "prices" DROP CONSTRAINT "prices_serviceId_fkey";

-- AlterTable
ALTER TABLE "prices" DROP COLUMN "serviceId",
ADD COLUMN     "service_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
