import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const GET = async (req: NextRequest) => {
  const drugs = await prisma.drug.findMany({
    include: {
      drugClasses: true,
    },
  });
  return NextResponse.json(drugs);
};