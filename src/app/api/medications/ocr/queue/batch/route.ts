import { NextRequest, NextResponse } from "next/server";
import queue from "@/app/add-medication/queueManager";
import { auth } from "@/auth";
import { convertImageToBase64 } from "@/app/actions/extractMedLabel";
import { getErrorMessage } from "@/lib/utils";

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

  if (!queue) {
    throw new Error("Queue is not initialized.");
  }

  try {
    const base64Image = await convertImageToBase64(file);
    console.log("Adding job to queue");
    const job = await queue.add(
      {
        file: base64Image,
        userId: session!.user!.id,
      },
      {
        timeout: 60000, // 1 minute
        removeOnComplete: {
          age: 60, // 60 seconds
        },
        removeOnFail: { age: 60 },
        attempts: 3, // Retry failed jobs up to 3 times
      }
    );
    return NextResponse.json({
      status: 200,
      msg: "Job added to queue.",
      jobId: job.id,
    });
  } catch (error) {
    console.error("Failed to add job to queue:", getErrorMessage(error));
    return NextResponse.json(
      { error: getErrorMessage(error) },
      {
        status:
          getErrorMessage(error) === "Please select a file to be uploaded."
            ? 400
            : 500,
      }
    );
  }
};
