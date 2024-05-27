import { getAllDrugs } from "@/app/actions/getAllDrugs";
import { getErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const drugs = await getAllDrugs();
    return NextResponse.json(drugs);
  } catch (error) {
    console.error("Failed to fetch drugs:", getErrorMessage(error));
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
};
