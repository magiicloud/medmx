import { NextRequest, NextResponse } from "next/server";
import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import {
  convertImageToBase64,
  extractMedLabel,
} from "@/app/actions/extractMedLabel";
import { getErrorMessage } from "@/lib/utils";

// export const extractMedLabel = async (file: File) => {
//   if (!file) {
//     throw new Error("Please select a file to be uploaded.");
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
//         mimeType: "image/jpeg",
//       },
//     };

//     // Process the document with Google Cloud Document AI
//     const [result] = await client.processDocument(request);

//     // Extract only the required fields
//     const entities = result.document?.entities;
//     const extractedMedLabel = {
//       drugName: "",
//       dosingInstruction: "",
//     };
//     if (entities) {
//       for (const entity of entities) {
//         switch (entity.type) {
//           case "drug_name":
//             extractedMedLabel.drugName =
//               entity.mentionText?.toUpperCase() ?? "";
//             break;
//           case "dosing_instruction":
//             extractedMedLabel.dosingInstruction =
//               entity.mentionText?.toUpperCase() ?? "";
//             break;
//         }
//       }
//     }

//     return extractedMedLabel;
//   } catch (error) {
//     console.error("Error extracting label:", error);
//     throw new Error("Internal server error");
//   }
// };

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({
      status: 400,
      error: "Please select a file to be uploaded.",
    });
  }

  try {
    const base64Image = await convertImageToBase64(file);
    const extractedMedLabel = await extractMedLabel(base64Image);
    return NextResponse.json({
      status: 200,
      msg: "The label has been extracted.",
      data: extractedMedLabel,
    });
  } catch (error) {
    console.error("Failed to extract label:", getErrorMessage(error));
    return NextResponse.json(
      { error: getErrorMessage(error) },
      {
        status:
          getErrorMessage(error) === "Please select a file to be uploaded."
            ? 400
            : 500,
      }
    );
  }
};
