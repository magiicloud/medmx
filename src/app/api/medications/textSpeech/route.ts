import { NextRequest, NextResponse } from "next/server";
import {
  convertTextToSpeech,
  TTSData,
} from "@/app/actions/convertTextToSpeech";

export const POST = async (req: NextRequest) => {
  const ttsData: TTSData = await req.json();
  if (!ttsData) {
    return NextResponse.json({
      status: 400,
      error: "Missing counselling text and file name.",
    });
  }

  try {
    const tts = await convertTextToSpeech(ttsData);
    return NextResponse.json({
      tts,
    });
  } catch (error) {
    console.error("Error during text-to-speech conversion:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      {
        status:
          (error as Error).message === "Missing counselling text and file name."
            ? 400
            : 500,
      }
    );
  }
};
