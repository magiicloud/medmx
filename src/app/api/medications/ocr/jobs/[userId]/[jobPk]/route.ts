import { deleteUserJob } from "@/app/actions/deleteUserJob";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { userId: string; jobPk: string } }
) => {
  const { jobPk } = params;
  console.log(jobPk);

  if (!jobPk) {
    return NextResponse.json({ error: "Job ID not found" }, { status: 400 });
  }

  try {
    const deletedJob = await deleteUserJob(parseInt(jobPk));
    return NextResponse.json(deletedJob);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: (error as Error).message === "Job ID not found" ? 400 : 500 }
    );
  }
};
