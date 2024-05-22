import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const getDrugEntry = async (drugId: number) => {
  if (!drugId) {
    throw new Error("Drug ID is required");
  }
  try {
    const drugs = await prisma.drugEntry.findFirst({
      where: { drugId },
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

export const GET = async (
  req: NextRequest,
  { params }: { params: { drugId: string } }
) => {
  const { drugId } = params;

  if (!drugId) {
    return NextResponse.json({ error: "Drug ID is required" }, { status: 400 });
  }

  try {
    const drugs = await getDrugEntry(Number(drugId));
    return NextResponse.json(drugs);
  } catch (error) {
    console.error("Error fetching drug entry:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
