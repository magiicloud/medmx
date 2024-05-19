import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

const morningKeywords = [
  "morning",
  "1 times a day",
  "1 time a day",
  "once a day",
  "2 times a day",
  "3 times a day",
  "4 times a day",
];
const afternoonKeywords = ["afternoon", "3 times a day", "4 times a day"];
const eveningKeywords = [
  "evening",
  "2 times a day",
  "3 times a day",
  "4 times a day",
];
const nightKeywords = ["night", "4 times a day"];

const checkKeywords = (instruction: string, keywords: string[]) => {
  const cleanedInstruction = instruction.replace(/[\(\)]/g, ""); // remove parentheses
  return keywords.some((keyword) =>
    cleanedInstruction.includes(keyword.toLowerCase())
  );
};

export const POST = async (req: NextRequest) => {
  const {
    userId,
    drugId,
    dosingInstruction,
  }: { userId: string; drugId: number; dosingInstruction: string } =
    await req.json();

  if (!userId || !drugId || !dosingInstruction) {
    return NextResponse.json({
      success: false,
      error: "Missing required fields: userId, drugId, or dosingInstruction",
    });
  }

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const drugToAdd = await prisma.userDrug.create({
        data: {
          userId,
          drugId,
          dosingInstruction,
        },
      });

      const normalizedInstruction = drugToAdd.dosingInstruction.toLowerCase();
      const morning = checkKeywords(normalizedInstruction, morningKeywords);
      const afternoon = checkKeywords(normalizedInstruction, afternoonKeywords);
      const evening = checkKeywords(normalizedInstruction, eveningKeywords);
      const night = checkKeywords(normalizedInstruction, nightKeywords);

      const addSchedule = await prisma.schedule.create({
        data: {
          userDrugId: drugToAdd.id,
          morning,
          afternoon,
          evening,
          night,
        },
      });

      return { drugToAdd, addSchedule };
    });

    return NextResponse.json({
      success: true,
      drugToAddData: result.drugToAdd,
      addScheduleData: result.addSchedule,
    });
  } catch (error) {
    console.error("Error adding user drug:", error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
};
