/*
  Warnings:

  - You are about to drop the column `acute` on the `Drug` table. All the data in the column will be lost.
  - You are about to drop the column `chronic` on the `Drug` table. All the data in the column will be lost.
  - You are about to drop the column `counsellingPointsVoiceLink` on the `Drug` table. All the data in the column will be lost.
  - You are about to drop the column `otherResources` on the `Drug` table. All the data in the column will be lost.
  - You are about to drop the column `daysOfWeek` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Drug" DROP COLUMN "acute",
DROP COLUMN "chronic",
DROP COLUMN "counsellingPointsVoiceLink",
DROP COLUMN "otherResources";

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "daysOfWeek";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified";
