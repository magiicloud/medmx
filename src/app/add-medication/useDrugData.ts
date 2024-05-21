import { useQuery } from "@tanstack/react-query";
import { getAllDrugs } from "../api/medications/route";

export const useDrugData = () => {
  return useQuery({
    queryKey: ["medications"],
    queryFn: getAllDrugs,
  });
};
