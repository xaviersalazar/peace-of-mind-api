/*
  Warnings:

  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `price` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "service" DROP CONSTRAINT "service_category_id_fkey";

-- DropTable
DROP TABLE "category";

-- DropTable
DROP TABLE "price";

-- DropTable
DROP TABLE "service";

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT,
    "description" TEXT,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prices" (
    "id" SERIAL NOT NULL,
    "price" TEXT,
    "unit" TEXT,
    "has_upcharge" BOOLEAN DEFAULT false,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_category_id_key" ON "services"("category_id");

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
