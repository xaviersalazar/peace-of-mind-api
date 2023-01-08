/*
  Warnings:

  - You are about to drop the column `imgName` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "imgName",
ADD COLUMN     "img_name" TEXT;
