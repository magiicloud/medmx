import { deleteUserDrug } from "@/app/actions/deleteUserDrug";
import { NextRequest, NextResponse } from "next/server";

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
