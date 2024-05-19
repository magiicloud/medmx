import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const getDrugEntry = async () => {
  try {
    const drugs = await prisma.drugEntry.findFirst({
      where: { drugId: 1 },
      include: {
        drug: {
          select: {
            drugName: true,
          },
        },
      },
    });
    return drugs;
  } catch (error) {
    console.error("Error fetching drug entry:", error);
    throw new Error("Internal server error");
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const drugs = await getDrugEntry();
    return NextResponse.json(drugs);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
