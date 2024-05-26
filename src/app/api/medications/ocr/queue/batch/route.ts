import { NextRequest, NextResponse } from "next/server";
import queue from "@/lib/queueManager";
import { auth } from "@/auth";
import { convertImageToBase64 } from "@/app/actions/extractMedLabel";

export const POST = async (req: NextRequest) => {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({
      status: 401,
      error: "Unauthorized",
    });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({
      status: 400,
      error: "Please select a file to be uploaded.",
    });
  }

  try {
    const base64Image = await convertImageToBase64(file);
    const job = await queue.add(
      {
        file: base64Image,
        userId: session!.user!.id,
      },
      {
        removeOnComplete: {
          age: 300, // // Clean up the job after 5 minutes
        },
        removeOnFail: {
          age: 300,
        },
        attempts: 3, // Retry failed jobs up to 3 times
      }
    );
    return NextResponse.json({
      status: 200,
      msg: "Job added to queue.",
      jobId: job.id,
    });
  } catch (error) {
    console.error("Failed to add job to queue:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      {
        status:
          (error as Error).message === "Please select a file to be uploaded."
            ? 400
            : 500,
      }
    );
  }
};
