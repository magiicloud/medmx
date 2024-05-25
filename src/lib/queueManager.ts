import Bull from "bull";
import prisma from "@/prisma/client";
import { extractMedLabel } from "@/app/actions/extractMedLabel";

const queue = new Bull(
  "scan-label",
  `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  {
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: true,
    },
  }
);

queue.process(async (job, done) => {
  try {
    const result = await extractMedLabel(job.data.file);
    const { userId } = job.data;
    job.progress(100);
    console.log(`Job ${job.id} userId: ${userId}`);

    // Save the result in the database with the userId
    try {
      console.log(`Saving job result to database: ${JSON.stringify(result)}`);
      await prisma.jobResult.create({
        data: {
          userId: userId,
          jobId: job.id.toString(),
          drugName: result.drugName,
          dosingInstruction: result.dosingInstruction,
        },
      });
    } catch (dbError) {
      console.error(
        `Failed to save job result to database: ${(dbError as Error).message}`
      );
      done(
        new Error(
          `Failed to save job result to database: ${(dbError as Error).message}`
        )
      );
      return;
    }

    done(null, result);
  } catch (error) {
    done(new Error("An error occurred while processing the job"));
  }
});

queue.on("completed", (job, result) => {
  console.log(
    `Job ${job.id} completed with result: ${JSON.stringify(result, null, 2)}`
  );
});

queue.on("error", (error) => {
  console.error(`error: ${error.message}`);
});

queue.on("failed", (job, error) => {
  console.error(`Job ${job.id} failed with error: ${error.message}`);
});

export default queue;
