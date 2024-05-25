import { addUserDrugWithSchedule } from "@/app/actions/addUserDrugWithSchedule";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const {
    userId,
    drugId,
    dosingInstruction,
  }: { userId: string; drugId: number; dosingInstruction: string } =
    await req.json();

  if (!userId || !drugId || !dosingInstruction) {
    return NextResponse.json(
      {
        error: "Missing required fields: userId, drugId, or dosingInstruction",
      },
      { status: 400 }
    );
  }

  try {
    const result = await addUserDrugWithSchedule(
      userId,
      drugId,
      dosingInstruction
    );
    return NextResponse.json({
      success: true,
      drugToAddData: result.drugToAdd,
      addScheduleData: result.addSchedule,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      {
        status:
          (error as Error).message ===
          "Missing required fields: userId, drugId, or dosingInstruction"
            ? 400
            : 500,
      }
    );
  }
};
