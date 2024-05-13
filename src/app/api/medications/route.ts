import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const GET = async (req: NextRequest) => {
  const drugs = await prisma.userDrug.findMany({
    where: { userId: 1 },
    include: {
      drug: {
        include: {
          drugClasses: {
            select: {
              drugClass: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return NextResponse.json(drugs);
};
