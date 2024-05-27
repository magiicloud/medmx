"use server";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

export const deleteUserDrug = async (userDrugId: string) => {
  if (!userDrugId) {
    throw new Error("userDrugId not found");
  }

  try {
    const deletedDrug = await prisma.userDrug.delete({
      where: { id: parseInt(userDrugId) },
    });
    revalidatePath("/medications");
    revalidatePath("/schedule");
    revalidatePath("/");
    return deletedDrug;
  } catch (error) {
    console.error("Error deleting drug:", error);
    throw new Error("Internal server error");
  }
};
