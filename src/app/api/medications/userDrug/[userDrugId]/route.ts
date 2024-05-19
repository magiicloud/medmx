import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { userDrugId: string } }
) => {
  const { userDrugId } = params;

  if (!userDrugId) {
    return NextResponse.json(
      { error: "userDrugId not found" },
      { status: 400 }
    );
  }
  try {
    const drugs = await prisma.userDrug.delete({
      where: { id: parseInt(userDrugId) },
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
