import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: "UserID not found" }, { status: 400 });
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

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error querying schedules:", error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
};
