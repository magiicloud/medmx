import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DrugData } from "../types";
import { getErrorMessage } from "@/lib/utils";

const fetchDrugs = async (): Promise<DrugData[]> => {
  try {
    const response = await axios.get("/api/medications");
    return response.data;
  } catch (error) {
    console.error("Error fetching drugs:", getErrorMessage(error));
    throw new Error(`Error fetching drugs: ${getErrorMessage(error)}`);
  }
};

export const useDrugData = () => {
  return useQuery({
    queryKey: ["medications"],
    queryFn: fetchDrugs,
  });
};
