import { getUserDrugsByUserId } from "@/app/actions/getUserDrugsByUserId";
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
    const drugs = await getUserDrugsByUserId(userId);
    return NextResponse.json(drugs);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: (error as Error).message === "UserID not found" ? 400 : 500 }
    );
  }
};
