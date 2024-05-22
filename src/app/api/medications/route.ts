import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const getAllDrugs = async () => {
  try {
    const drugs = await prisma.drug.findMany();
    return drugs;
  } catch (error) {
    console.error("Error fetching drugs:", error);
    throw new Error("Error fetching drugs");
  }
};

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
