-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_unit_id_fkey";

-- AlterTable
ALTER TABLE "Price" ALTER COLUMN "unit_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
