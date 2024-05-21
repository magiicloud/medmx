// Imports the Google Cloud client libraries
import textToSpeech from "@google-cloud/text-to-speech";
import { Storage } from "@google-cloud/storage";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { NextRequest, NextResponse } from "next/server";

// Creates clients
const ttsClient = new textToSpeech.TextToSpeechClient();
const storage = new Storage();

interface TTSData {
  speechString: string;
  fileNameString: string;
}

export const convertTextToSpeech = async (ttsData: TTSData) => {
  const request = {
    input: { text: ttsData.speechString },
    voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "MP3" },
  };

  const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
  const fileName = `${ttsData.fileNameString}.mp3`;
  // Temporary file path for storing the audio file
  const tempFilePath = path.join(os.tmpdir(), fileName);

  try {
    // Ignore typescript error for response and request
    // @ts-ignore
    const [response] = await ttsClient.synthesizeSpeech(request);

    // Write the binary audio content to a temporary local file
    await fs.writeFile(tempFilePath, response.audioContent, "binary");

    // Upload the temporary file to your bucket
    await storage.bucket(bucketName!).upload(tempFilePath, {
      destination: fileName,
    });

    // Generate a signed URL for the file
    const [url] = await storage
      .bucket(bucketName!)
      .file(fileName)
      .getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60, // 1 hour expiration
      });

    return url;
  } catch (error) {
    console.error("Error during text-to-speech conversion:", error);
    throw error;
  } finally {
    // Clean up the temporary file
    await fs.unlink(tempFilePath);
  }
};

export const POST = async (req: NextRequest) => {
  const ttsData: TTSData = await req.json();
  if (!ttsData) {
    return NextResponse.json({
      status: 400,
      error: "Missing counselling text and file name.",
    });
  }

  try {
    const tts = await convertTextToSpeech(ttsData);
    return NextResponse.json({
      status: 200,
      msg: "The label has been extracted.",
      data: tts,
    });
  } catch (error) {
    console.error("Error during text-to-speech conversion:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      {
        status:
          (error as Error).message === "Missing counselling text and file name."
            ? 400
            : 500,
      }
    );
  }
};
