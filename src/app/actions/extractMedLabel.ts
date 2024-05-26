"use server";
import { DocumentProcessorServiceClient } from "@google-cloud/documentai";

export const extractMedLabel = async (base64Image: string) => {
  if (!base64Image) {
    throw new Error("Please select a file to be uploaded.");
  }

  try {
    // Configure the Google Cloud Document AI client
    const client = new DocumentProcessorServiceClient();
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_LOCATION;
    const processorId = process.env.GOOGLE_CLOUD_PROCESSOR_ID;
    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
    const request = {
      name,
      rawDocument: {
        content: base64Image,
        mimeType: "image/jpeg",
      },
    };

    // Process the document with Google Cloud Document AI
    const [result] = await client.processDocument(request);

    // Extract only the required fields
    const entities = result.document?.entities;
    const extractedMedLabel = {
      drugName: "",
      dosingInstruction: "",
    };
    if (entities) {
      for (const entity of entities) {
        switch (entity.type) {
          case "drug_name":
            extractedMedLabel.drugName =
              entity.mentionText?.toUpperCase() ?? "";
            break;
          case "dosing_instruction":
            extractedMedLabel.dosingInstruction =
              entity.mentionText?.toUpperCase() ?? "";
            break;
        }
      }
    }

    return extractedMedLabel;
  } catch (error) {
    console.error("Error extracting label:", error);
    throw new Error("Internal server error");
  }
};

export const convertImageToBase64 = async (file: File) => {
  if (!file) {
    throw new Error("Please select a file to be uploaded.");
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    return buffer.toString("base64");
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw new Error("Internal server error");
  }
};
