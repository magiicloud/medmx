import { deleteUserDrug } from "@/app/actions/deleteUserDrug";
import { getErrorMessage } from "@/lib/utils";
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
    console.error("Error deleting user drug:", getErrorMessage(error));
    return NextResponse.json(
      { error: getErrorMessage(error) },
      {
        status: getErrorMessage(error) === "userDrugId not found" ? 400 : 500,
      }
    );
  }
};
