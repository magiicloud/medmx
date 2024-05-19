import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const getDrugByName = async (drugName: string) => {
  if (!drugName) {
    throw new Error("Drug name is required");
  }

  try {
    const response = await prisma.drug.findUnique({
      where: { drugName },
      select: { id: true }, // Select only the id field
    });

    if (!response) {
      throw new Error("Drug not found");
    }

    return response;
  } catch (error) {
    console.error("Error fetching drug:", error);
    throw new Error("Internal server error");
  }
};

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
      { error: (error as Error).message },
      { status: (error as Error).message === "Drug not found" ? 404 : 500 }
    );
  }
};
