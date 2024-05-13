import { NextRequest, NextResponse } from "next/server";
import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import fs from "fs/promises";

export const POST = async (req: NextRequest) => {
  // const file = process.env.SAMPLE_IMG_URL;
  const formData = await req.formData();
  const file = formData.get("file") as File;
  console.log(file);

  if (!file) {
    return NextResponse.json({
      status: 400,
      error: "Please select a file to be uploaded.",
    });
  }

  try {
    // const buffer = await fs.readFile(file);
    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert the file to an ArrayBuffer then to a Buffer
    const encodedImage = buffer.toString("base64");
    console.log("Hello encoded Image");

    // Configure the Google Cloud Document AI client
    const client = new DocumentProcessorServiceClient();
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_LOCATION;
    const processorId = process.env.GOOGLE_CLOUD_PROCESSOR_ID;
    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
    const request = {
      name,
      rawDocument: {
        content: encodedImage,
        mimeType: "image/jpeg",
      },
    };
    console.log("Send req to Document AI");

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
    return NextResponse.json({
      status: 200,
      msg: "The document has been processed.",
      data: extractedMedLabel,
    });
  } catch (error) {
    console.error("Failed to process document:", error);
    return NextResponse.json({
      status: 500,
      error: "Failed to process document",
      details: error as Error,
    });
  }
};
