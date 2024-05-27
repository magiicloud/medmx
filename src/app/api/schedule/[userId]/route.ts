import { getUserDrugsAndSchedules } from "@/app/actions/getUserDrugsAndSchedules";
import { getErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: "UserID not found" }, { status: 400 });
  }

  try {
    const schedules = await getUserDrugsAndSchedules(userId);
    return NextResponse.json(schedules);
  } catch (error) {
    console.error(
      "Error fetching user drugs and schedules:",
      getErrorMessage(error)
    );
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getErrorMessage(error) === "UserID not found" ? 400 : 500 }
    );
  }
};
