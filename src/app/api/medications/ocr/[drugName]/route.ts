import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

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
    const response = await prisma.drug.findUnique({
      where: { drugName },
      select: { id: true }, // Select only the id field
    });

    if (!response) {
      return NextResponse.json({ error: "Drug not found" }, { status: 404 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching drug:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
