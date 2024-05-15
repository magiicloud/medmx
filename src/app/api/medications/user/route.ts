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

export const POST = async (req: NextRequest) => {
  try {
    const { userId, drugId, dosingInstruction } = await req.json();

    const drugToAdd = await prisma.userDrug.create({
      data: {
        userId: parseInt(userId),
        drugId: parseInt(drugId),
        dosingInstruction,
      },
    });

    return NextResponse.json({ success: true, data: drugToAdd });
  } catch (error) {
    console.error("Error adding user drug:", error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
};
