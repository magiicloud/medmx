"use server";
import prisma from "@/prisma/client";

export const getDrugByName = async (drugName: string) => {
  if (!drugName) {
    throw new Error("Drug name is required");
  }

  try {
    const response = await prisma.drug.findUnique({
      where: { drugName },
      select: { id: true }, // Select only the id field
    });

    if (!response) {
      throw new Error("Drug not found");
    }

    return response;
  } catch (error) {
    console.error("Error fetching drug:", error);
    throw new Error("Internal server error");
  }
};
