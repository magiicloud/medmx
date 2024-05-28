import { NextRequest, NextResponse } from "next/server";
// import queue from "@/app/add-medication/queueManager";
import { getErrorMessage } from "@/lib/utils";
import getQueue from "@/app/add-medication/queueManager";

export const GET = async (req: NextRequest) => {
  const queue = getQueue();
  if (!queue) {
    throw new Error("Queue is not initialized.");
  }

  try {
    const pendingJobs = await queue.getJobs(["waiting", "active"]);
    const completedJobs = await queue.getJobs(["completed"]);

    return NextResponse.json({
      status: 200,
      data: {
        pendingCount: pendingJobs.length,
        completedJobs: completedJobs.map((job) => ({
          id: job.id,
          result: job.returnvalue,
        })),
      },
    });
  } catch (error) {
    console.error("Failed to fetch job statuses:", getErrorMessage(error));
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
};
