-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "profile_img_url" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drug" (
    "id" SERIAL NOT NULL,
    "drugName" TEXT NOT NULL,
    "pilLink" TEXT NOT NULL,
    "drugImagesLink" TEXT NOT NULL,
    "counsellingPointsText" TEXT NOT NULL,
    "counsellingPointsVoiceLink" TEXT NOT NULL,
    "otherResources" TEXT,
    "acute" BOOLEAN NOT NULL DEFAULT false,
    "chronic" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Drug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrugClass" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DrugClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrugToClass" (
    "drugId" INTEGER NOT NULL,
    "drugClassId" INTEGER NOT NULL,

    CONSTRAINT "DrugToClass_pkey" PRIMARY KEY ("drugId","drugClassId")
);

-- CreateTable
CREATE TABLE "UserDrug" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "drugId" INTEGER NOT NULL,

    CONSTRAINT "UserDrug_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Drug_drugName_key" ON "Drug"("drugName");

-- AddForeignKey
ALTER TABLE "DrugToClass" ADD CONSTRAINT "DrugToClass_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrugToClass" ADD CONSTRAINT "DrugToClass_drugClassId_fkey" FOREIGN KEY ("drugClassId") REFERENCES "DrugClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDrug" ADD CONSTRAINT "UserDrug_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDrug" ADD CONSTRAINT "UserDrug_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE CASCADE ON UPDATE CASCADE;
