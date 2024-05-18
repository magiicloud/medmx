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
    return NextResponse.json(drugs);
  } catch (error) {
    console.error("Error fetching drug:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
