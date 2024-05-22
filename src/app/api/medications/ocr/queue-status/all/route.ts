import { NextRequest, NextResponse } from "next/server";
import queue from "@/lib/queueManager";

export const GET = async (req: NextRequest) => {
  try {
    const jobs = await queue.getJobs(["completed"]);
    const results = jobs.map((job) => ({
      id: job.id,
      result: job.returnvalue,
    }));

    return NextResponse.json({
      status: 200,
      data: results,
    });
  } catch (error) {
    console.error("Failed to fetch job statuses:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      {
        status: 500,
      }
    );
  }
};
