/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "offers" DROP CONSTRAINT "offers_personAId_fkey";

-- DropForeignKey
ALTER TABLE "offers" DROP CONSTRAINT "offers_personBId_fkey";

-- AlterTable
ALTER TABLE "offers" ALTER COLUMN "personAId" SET DATA TYPE TEXT,
ALTER COLUMN "personBId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("address");

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_personAId_fkey" FOREIGN KEY ("personAId") REFERENCES "users"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_personBId_fkey" FOREIGN KEY ("personBId") REFERENCES "users"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
