"use server";
import prisma from "@/prisma/client";

export const getAllDrugs = async () => {
  try {
    const drugs = await prisma.drug.findMany();
    return drugs;
  } catch (error) {
    console.error("Error fetching drugs:", error);
    throw new Error("Error fetching drugs");
  }
};
