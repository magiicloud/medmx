import { NextRequest, NextResponse } from "next/server";
import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import fs from "fs/promises";

export const POST = async (req: NextRequest) => {
  const filePath =
    "/Users/hongyun/Rocket/bootcamp/m4/capstone-project/medmx/public/IMG_1316.jpeg";

  try {
    const buffer = await fs.readFile(filePath);

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
              entity.mentionText?.toLocaleLowerCase() ?? "";
            break;
          case "dosing_instruction":
            extractedMedLabel.dosingInstruction =
              entity.mentionText?.toLocaleLowerCase() ?? "";
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

//ACTUAL CODE
// export const POST = async (req: NextRequest) => {
//   const formData = await req.formData();
//   const file = formData.get("file") as File;
//   if (!file) {
//     return NextResponse.json({ Message: "No file received.", status: 400 });
//   }

//   try {
//     // Convert the file to an ArrayBuffer then to a Buffer
//     const buffer = Buffer.from(await file.arrayBuffer());
//     const encodedImage = buffer.toString("base64");

//     // Configure the Google Cloud Document AI client
//     const client = new DocumentProcessorServiceClient();
//     const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
//     const location = process.env.GOOGLE_CLOUD_LOCATION;
//     const processorId = process.env.GOOGLE_CLOUD_PROCESSOR_ID;
//     const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

//     const request = {
//       name,
//       rawDocument: {
//         content: encodedImage,
//         mimeType: file.type,
//       },
//     };

//     // Process the document with Google Cloud Document AI
//     const [result] = await client.processDocument(request);
//     const { document } = result;
//     console.log("The document has been processed.");
//     console.log(result);
//     return NextResponse.json({ document });
//   } catch (error) {
//     console.error("Failed to process document:", error);
//     return NextResponse.json({
//       error: "Failed to process document",
//       details: (error as Error).message,
//     });
//   }
// };
