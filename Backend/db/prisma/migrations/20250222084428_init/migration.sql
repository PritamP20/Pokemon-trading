-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "offers" (
    "id" SERIAL NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "senderAddress" TEXT NOT NULL,
    "intrestedNFT" INTEGER NOT NULL,
    "offeredNFT" INTEGER NOT NULL,
    "personAId" INTEGER NOT NULL,
    "personBId" INTEGER NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_personAId_fkey" FOREIGN KEY ("personAId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_personBId_fkey" FOREIGN KEY ("personBId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
