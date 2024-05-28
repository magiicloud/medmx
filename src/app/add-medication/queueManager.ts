import Bull, { Queue } from "bull";
import prisma from "@/prisma/client";
import { extractMedLabel } from "@/app/actions/extractMedLabel";
import { getErrorMessage } from "../../lib/utils";

// VercelKV Hobby plan limits file size to 1048576 bytes or 1MB and daily 3000 requests
// VercelKV requires tls option to be set to an empty object

let queue: Queue | undefined;

// Only initialize the queue if not in build process
if (!process.env.NEXT_PUBLIC_IS_BUILD) {
  console.log("Initializing queue");

  // Determine Redis URL based on the environment
  const redisUrl =
    process.env.NODE_ENV === "production"
      ? process.env.KV_URL // Use Vercel KV URL in production
      : `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`; // Use local Redis URL in development
  console.log("Redis URL:", redisUrl);

  // Configure Redis options for Vercel KV
  const redisOptions =
    process.env.NODE_ENV === "production" ? { redis: { tls: {} } } : {};
  console.log("Redis options:", redisOptions);

  try {
    queue = new Bull("scan-label", redisUrl!, {
      ...redisOptions,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
      limiter: {
        max: 1, // Limit to 1 job every 5 seconds
        duration: 5000,
      },
    });

    queue.process(async (job) => {
      console.log("Processing job:", job.id);
      try {
        const result = await extractMedLabel(job.data.file);
        console.log("Extracted result:", result);
        const { userId } = job.data;
        job.progress(100);
        console.log(`Job ${job.id} userId: ${userId}`);

        // Save the result in the database with the userId
        try {
          console.log(
            `Saving job result to database: ${JSON.stringify(result)}`
          );
          await prisma.jobResult.create({
            data: {
              userId: userId,
              jobId: job.id.toString(),
              drugName: result.drugName,
              dosingInstruction: result.dosingInstruction,
            },
          });
          console.log("Job result saved to database");
        } catch (dbError) {
          console.error(
            `Failed to save job result to database: ${getErrorMessage(dbError)}`
          );
          throw new Error(
            `Failed to save job result to database: ${getErrorMessage(dbError)}`
          );
        }

        return result;
      } catch (error) {
        console.error(
          `An error occurred while processing the job: ${getErrorMessage(
            error
          )}`
        );
        throw new Error("An error occurred while processing the job");
      }
    });

    queue.on("completed", (job, result) => {
      console.log(
        `Job ${job.id} completed with result: ${JSON.stringify(
          result,
          null,
          2
        )}`
      );
    });

    queue.on("error", (error) => {
      console.error(`Queue error: ${getErrorMessage(error)}`);
    });

    queue.on("failed", (job, error) => {
      console.error(
        `Job ${job.id} failed with error: ${getErrorMessage(error)}`
      );
    });

    queue.on("stalled", (job) => {
      console.error(
        `Job ${job.id} stalled with data: ${JSON.stringify(job.data, null, 2)}`
      );
    });

    console.log("Queue initialized successfully");
  } catch (initError) {
    console.error("Failed to initialize queue:", getErrorMessage(initError));
  }
} else {
  console.log("Build process detected, not initializing queue");
}

export default queue;
