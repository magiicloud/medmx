"use server";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

export const deleteUserJob = async (jobPk: number) => {
  if (!jobPk) {
    throw new Error("Job PK not found");
  }

  try {
    const jobs = await prisma.jobResult.delete({
      where: { id: jobPk },
    });
    revalidatePath("/add-medication");
    return jobs;
  } catch (error) {
    console.error("Error deleting job:", error);
    throw new Error("Internal server error");
  }
};
