/*
  Warnings:

  - Added the required column `auxInstruction` to the `Drug` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dosingInstruction` to the `UserDrug` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Drug" ADD COLUMN     "auxInstruction" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserDrug" ADD COLUMN     "dosingInstruction" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "DrugEntry" (
    "id" SERIAL NOT NULL,
    "drugId" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "unitDose" TEXT NOT NULL,

    CONSTRAINT "DrugEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DrugEntry" ADD CONSTRAINT "DrugEntry_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE CASCADE ON UPDATE CASCADE;
