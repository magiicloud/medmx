import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { DrugData } from "@/types/globalTypes";

const fetchDrugData = async () => {
  const { data } = await axios.get<DrugData[]>("/api/medications");
  return data;
};

export const useDrugData = () => {
  return useQuery<DrugData[], Error>({
    queryKey: ["medications"],
    queryFn: fetchDrugData,
  });
};
