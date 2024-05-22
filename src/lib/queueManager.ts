import Bull from "bull";
import { extractMedLabel } from "@/app/api/medications/ocr/route";

const queue = new Bull(
  "scan-label",
  `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
);

queue.process(async (job, done) => {
  try {
    const result = await extractMedLabel(job.data.file);
    job.progress(100);
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
