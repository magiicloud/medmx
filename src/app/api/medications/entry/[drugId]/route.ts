import { getDrugEntry } from "@/app/actions/getDrugEntry";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { drugId: string } }
) => {
  const { drugId } = params;

  if (!drugId) {
    return NextResponse.json({ error: "Drug ID is required" }, { status: 400 });
  }

  try {
    const drugs = await getDrugEntry(Number(drugId));
    return NextResponse.json(drugs);
  } catch (error) {
    console.error("Error fetching drug entry:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
