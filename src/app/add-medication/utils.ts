import axios from "axios";
import { SubmittedData } from "./types";
import { getErrorMessage } from "@/lib/utils";
import { get } from "http";

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
    const response = await axios.post(
      "/api/medications/ocr/queue/batch",
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", getErrorMessage(error));
    throw new Error(`Error uploading file: ${getErrorMessage(error)}`);
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
    console.error("Error getting Drug ID:", getErrorMessage(error));
    throw new Error(`Error getting Drug ID: ${getErrorMessage(error)}`);
  }
};

export const fetchDrugEntry = async (drugId: string) => {
  const encodedDrugId = encodeURIComponent(drugId);
  try {
    const response = await axios.get(`/api/medications/entry/${encodedDrugId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting Drug ID:", getErrorMessage(error));
    throw new Error(`Error getting Drug ID: ${getErrorMessage(error)}`);
  }
};

export const submitFormData = async (submittedData: SubmittedData) => {
  try {
    const response = await axios.post("/api/medications/user", submittedData);
    return response.data;
  } catch (error) {
    console.error("Error submitting form:", getErrorMessage(error));
    throw new Error(`Error submitting form: ${getErrorMessage(error)}`);
  }
};

export const deleteJob = async (userId: string, jobPk: number) => {
  try {
    const response = await axios.delete(
      `/api/medications/ocr/jobs/${userId}/${jobPk}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting job:", getErrorMessage(error));
    throw new Error(`Error deleting job: ${getErrorMessage(error)}`);
  }
};
