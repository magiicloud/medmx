import { getUserDrugsAndSchedules } from "@/app/actions/getUserDrugsAndSchedules";
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
    return NextResponse.json(
      { error: (error as Error).message },
      { status: (error as Error).message === "UserID not found" ? 400 : 500 }
    );
  }
};
