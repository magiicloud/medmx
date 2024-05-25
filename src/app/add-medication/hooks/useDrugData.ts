import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DrugData } from "../types";

const fetchDrugs = async (): Promise<DrugData[]> => {
  const response = await axios.get("/api/medications");
  return response.data;
};

export const useDrugData = () => {
  return useQuery({
    queryKey: ["medications"],
    queryFn: fetchDrugs,
  });
};
