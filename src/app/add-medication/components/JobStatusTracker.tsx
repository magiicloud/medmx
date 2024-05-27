"use client";
import { useCallback, useRef } from "react";
import axios from "axios";
import useCustomToast from "@/components/useCustomToast";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import { getErrorMessage } from "@/lib/utils";

const useJobStatusChecker = () => {
  const queryClient = useQueryClient();
  const { displayToast } = useCustomToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Store interval ID

  const checkForPendingJobs = async () => {
    try {
      const response = await axios.get("/api/medications/ocr/queue/check-jobs");
      const { pendingCount } = response.data.data;
      return pendingCount;
    } catch (error) {
      console.error(
        "Failed to check for pending jobs:",
        getErrorMessage(error)
      );
      throw new Error(
        `Failed to check for pending jobs: ${getErrorMessage(error)}`
      );
      return null; // Return null in case of error
    }
  };

  const checkJobStatus = useCallback(() => {
    // Clear existing interval if it exists so that we don't create multiple intervals on each click
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const interval = setInterval(async () => {
      try {
        const pendingCount = await checkForPendingJobs();
        if (pendingCount === 0) {
          displayToast(
            "default",
            "Jobs Completed",
            <>
              <Button size="sm" variant="ghost" className="mt-2 mr-2">
                <Link href="/add-medication">Click</Link>
              </Button>
              to go back to the <b>Add Medication</b> page.
            </>
          );
          console.log("All jobs have been completed successfully.");
          clearInterval(interval);
          queryClient.invalidateQueries({ queryKey: ["userJobs"] });
        }
        if (pendingCount === null) {
          // Stop polling if an error occurs
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Failed to fetch job statuses:", getErrorMessage(error));
        throw new Error(
          `Failed to fetch job statuses: ${getErrorMessage(error)}`
        );
        clearInterval(interval);
      }
    }, 5000); // Poll every 5 seconds

    // Store the interval ID in the ref
    intervalRef.current = interval;
  }, [displayToast, queryClient]);

  return checkJobStatus;
};

export default useJobStatusChecker;
