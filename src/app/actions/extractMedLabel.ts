"use server";
import { getGCPCredentials } from "@/lib/utils";
import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import sharp from "sharp";

export const extractMedLabel = async (base64Image: string) => {
  if (!base64Image) {
    throw new Error("Please select a file to be uploaded.");
  }
  console.log("Starting extractMedLabel with image size:", base64Image.length);

  try {
    // Configure the Google Cloud Document AI client
    const client = new DocumentProcessorServiceClient(getGCPCredentials());
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_LOCATION;
    const processorId = process.env.GOOGLE_CLOUD_PROCESSOR_ID;
    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
    console.log("Google Cloud Document AI client configured");
    const request = {
      name,
      rawDocument: {
        content: base64Image,
        mimeType: "image/jpeg",
      },
    };
    console.log("Sending request to Google Cloud Document AI");

    // Process the document with Google Cloud Document AI
    const [result] = await client.processDocument(request);

    console.log("Received response from Google Cloud Document AI");

    // Extract only the required fields
    const entities = result.document?.entities;
    console.log("Entities received:", entities);
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
    console.log("Extracted medication label:", extractedMedLabel);
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
    // return buffer.toString("base64");

    // Compress the image using sharp to ensure it is less than 1MB
    let quality = 80;
    let compressedBuffer = await sharp(buffer).jpeg({ quality }).toBuffer();

    while (compressedBuffer.length > 786432 && quality > 10) {
      // Attempt to compress until less than 1MB or minimum quality of 10. Account for 33% increase in file size when convert to base64.
      quality -= 5;
      compressedBuffer = await sharp(buffer).jpeg({ quality }).toBuffer();
    }

    if (compressedBuffer.length > 786432) {
      throw new Error("Unable to compress image to under 1MB");
    }
    console.log(`Final compressed size: ${compressedBuffer.length} bytes`);
    return compressedBuffer.toString("base64");
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw new Error("Internal server error");
  }
};
