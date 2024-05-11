import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export interface DrugData {
  id: number;
  drugName: string;
  pilLink: string;
  drugImagesLink: string;
  counsellingPointsText: string;
  counsellingPointsVoiceLink: string;
  otherResources: string;
  acute: boolean;
  chronic: boolean;
}

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
