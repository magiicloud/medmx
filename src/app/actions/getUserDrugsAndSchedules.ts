"use server";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

export const getUserDrugsAndSchedules = async (userId: string) => {
  if (!userId) {
    throw new Error("UserID not found");
  }

  try {
    // Step 1: Query userDrug to get the list of userDrugIds for the specific userId
    const userDrugs = await prisma.userDrug.findMany({
      where: { userId },
      select: {
        id: true,
        dosingInstruction: true,
        drug: {
          select: {
            drugName: true,
          },
        },
      },
    });

    // Extract the list of userDrugIds
    const userDrugIds = userDrugs.map((userDrug) => userDrug.id);

    // Step 2: Query schedule to get all schedules that match the list of userDrugIds
    const schedules = await prisma.schedule.findMany({
      where: { userDrugId: { in: userDrugIds } },
      include: {
        userDrug: {
          select: {
            dosingInstruction: true,
            drug: {
              select: {
                drugName: true,
                auxInstruction: true,
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
        },
      },
    });
    // revalidatePath("/schedule");
    return schedules;
  } catch (error) {
    console.error("Error querying schedules:", error);
    throw new Error("Internal server error");
  }
};
