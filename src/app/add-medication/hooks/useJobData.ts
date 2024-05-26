import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { UserJobsData } from "../types";

const fetchJobs = async (userId: string): Promise<UserJobsData[]> => {
  const response = await axios.get(`/api/medications/ocr/jobs/${userId}`);
  return response.data;
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
