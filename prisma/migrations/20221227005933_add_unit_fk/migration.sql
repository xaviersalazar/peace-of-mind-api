/*
  Warnings:

  - You are about to drop the column `unit` on the `Price` table. All the data in the column will be lost.
  - Added the required column `unit_id` to the `Price` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Price" DROP COLUMN "unit",
ADD COLUMN     "unit_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
