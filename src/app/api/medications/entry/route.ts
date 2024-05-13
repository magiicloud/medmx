import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const GET = async (req: NextRequest) => {
  const drugs = await prisma.drugEntry.findFirst({
    where: { drugId: 1 },
    include: {
      drug: {
        select: {
          drugName: true,
        },
      },
    },
  });
  return NextResponse.json(drugs);
};
