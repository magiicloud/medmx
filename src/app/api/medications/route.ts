import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const getAllDrugs = async () => {
  const drugs = await prisma.drug.findMany();
  return drugs;
};

export const GET = async (req: NextRequest) => {
  const drugs = await getAllDrugs();
  return NextResponse.json(drugs);
};
