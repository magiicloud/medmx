import { getUserJobs } from "@/app/actions/getUserJobs";
import { getErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: "userId not found" }, { status: 400 });
  }

  try {
    const jobs = await getUserJobs(userId);
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getErrorMessage(error) === "UserID not found" ? 400 : 500 }
    );
  }
};
