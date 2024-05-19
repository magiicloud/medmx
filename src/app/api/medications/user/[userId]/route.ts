import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

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
    return drugs;
  } catch (error) {
    console.error("Error fetching drugs:", error);
    throw new Error("Internal server error");
  }
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: "userId not found" }, { status: 400 });
  }

  try {
    const drugs = await getUserDrugsByUserId(userId);
    return NextResponse.json(drugs);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: (error as Error).message === "UserID not found" ? 400 : 500 }
    );
  }
};
