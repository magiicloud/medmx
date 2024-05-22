import axios from "axios";
import { SubmittedData } from "./types";

export const fetchOcrData = async (
  file: File,
  setProgress: (progress: number) => void
) => {
  if (!file) {
    throw new Error("No file provided");
  }

  const formData = new FormData();
  formData.set("file", file);

  try {
    const response = await axios.post("/api/medications/ocr", formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const fetchDrugId = async (
  drugName: string
): Promise<{ id: number }> => {
  const encodedDrugName = encodeURIComponent(drugName);
  try {
    const response = await axios.get(`/api/medications/ocr/${encodedDrugName}`);
    return response.data;
  } catch (error) {
    console.error("Error getting Drug ID:", error);
    throw error;
  }
};

export const submitFormData = async (submittedData: SubmittedData) => {
  try {
    const response = await axios.post("/api/medications/user", submittedData);
    return response.data;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};
