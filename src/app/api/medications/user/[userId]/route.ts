import { getUserDrugsByUserId } from "@/app/actions/getUserDrugsByUserId";
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
    const drugs = await getUserDrugsByUserId(userId);
    return NextResponse.json(drugs);
  } catch (error) {
    console.error("Error fetching user drugs:", getErrorMessage(error));
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getErrorMessage(error) === "UserID not found" ? 400 : 500 }
    );
  }
};
