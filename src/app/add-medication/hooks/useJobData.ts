import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { UserJobsData } from "../types";
import { getErrorMessage } from "@/lib/utils";

const fetchJobs = async (userId: string): Promise<UserJobsData[]> => {
  try {
    const response = await axios.get(`/api/medications/ocr/jobs/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", getErrorMessage(error));
    throw new Error(`Error fetching jobs: ${getErrorMessage(error)}`);
  }
};

export const useJobData = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["userJobs", userId],
    queryFn: () => fetchJobs(userId!),
    enabled: !!userId,
  });
};
