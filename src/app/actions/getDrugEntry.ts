"use server";
import prisma from "@/prisma/client";

export const getDrugEntry = async (drugId: number) => {
  if (!drugId) {
    throw new Error("Drug ID is required");
  }
  try {
    const drugs = await prisma.drugEntry.findFirst({
      where: { drugId },
      include: {
        drug: {
          select: {
            drugName: true,
          },
        },
      },
    });
    return drugs;
  } catch (error) {
    console.error("Error fetching drug entry:", error);
    throw new Error("Internal server error");
  }
};
