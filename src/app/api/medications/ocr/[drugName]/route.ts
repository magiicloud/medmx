import { getDrugByName } from "@/app/actions/getDrugByName";
import { getErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { drugName: string } }
) => {
  const { drugName } = params;

  if (!drugName) {
    return NextResponse.json(
      { error: "Drug name is required" },
      { status: 400 }
    );
  }

  try {
    const response = await getDrugByName(drugName);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching drug:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: getErrorMessage(error) === "Drug not found" ? 404 : 500 }
    );
  }
};
