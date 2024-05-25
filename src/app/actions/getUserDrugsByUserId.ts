"use server";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

export const getUserDrugsByUserId = async (userId: string) => {
  if (!userId) {
    throw new Error("UserID not found");
  }

  try {
    const drugs = await prisma.userDrug.findMany({
      where: { userId: `${userId}` },
      include: {
        drug: {
          include: {
            drugClasses: {
              select: {
                drugClass: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    // revalidatePath("/medications");
    return drugs;
  } catch (error) {
    console.error("Error fetching drugs:", error);
    throw new Error("Internal server error");
  }
};
