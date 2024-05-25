import { getAllDrugs } from "@/app/actions/getAllDrugs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const drugs = await getAllDrugs();
    return NextResponse.json(drugs);
  } catch (error) {
    console.error("Failed to fetch drugs:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
