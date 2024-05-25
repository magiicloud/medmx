"use server";
import prisma from "@/prisma/client";

export const getUserJobs = async (userId: string) => {
  if (!userId) {
    throw new Error("UserID not found");
  }

  try {
    const jobs = await prisma.jobResult.findMany({
      where: { userId: `${userId}` },
    });
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw new Error("Internal server error");
  }
};
