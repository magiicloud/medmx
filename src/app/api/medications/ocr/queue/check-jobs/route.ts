import { NextRequest, NextResponse } from "next/server";
import queue from "@/lib/queueManager";

export const GET = async (req: NextRequest) => {
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
    console.error("Failed to fetch job statuses:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
