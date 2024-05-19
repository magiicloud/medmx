import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const deleteUserDrug = async (userDrugId: string) => {
  if (!userDrugId) {
    throw new Error("userDrugId not found");
  }

  try {
    const deletedDrug = await prisma.userDrug.delete({
      where: { id: parseInt(userDrugId) },
    });

    return deletedDrug;
  } catch (error) {
    console.error("Error deleting drug:", error);
    throw new Error("Internal server error");
  }
};

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
    const deletedDrug = await deleteUserDrug(userDrugId);
    return NextResponse.json(deletedDrug);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      {
        status: (error as Error).message === "userDrugId not found" ? 400 : 500,
      }
    );
  }
};
