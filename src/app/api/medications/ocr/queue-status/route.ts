import { NextRequest, NextResponse } from "next/server";
import queue from "@/lib/queueManager";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({
      status: 400,
      error: "Job ID is required",
    });
  }

  try {
    const job = await queue.getJob(jobId);

    if (!job) {
      return NextResponse.json({
        status: 404,
        error: "Job not found",
      });
    }

    const state = await job.getState();
    const progress = job.progress();
    const result = job.returnvalue;

    return NextResponse.json({
      status: 200,
      state,
      progress,
      result,
    });
  } catch (error) {
    console.error("Failed to fetch job status:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      {
        status: 500,
      }
    );
  }
};
