"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GenerateContentRequest, VertexAI } from "@google-cloud/vertexai";

// Access your API key as an environment variable (see "Set up your API key" above)
const project_id = process.env.GEMINI_PROJECT_ID ?? "";

export async function getGeminiPDF(file_url: string, prompt: string) {
  const vertexAI = new VertexAI({
    project: project_id,
    location: "us-central1",
  });

  const generativeModel = vertexAI.getGenerativeModel({
    model: "gemini-1.5-pro-preview-0409",
  });

  const filePart = {
    file_data: {
      file_uri: file_url,
      mime_type: "application/pdf",
    },
  };
  const textPart = {
    text: prompt,
  };

  const request = {
    contents: [{ role: "user", parts: [filePart, textPart] }],
  } as GenerateContentRequest;

  const resp = await generativeModel.generateContent(request);
  const contentResponse = await resp.response;
  console.log(JSON.stringify(contentResponse));
  return contentResponse;
}

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI ?? "");

export async function getGeminiCompletion(prompt: string, base64Image: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  const formatted = base64Image.split(",")[1];
  const image = {
    inlineData: {
      data: formatted,
      mimeType: "image/jpeg",
    },
  };

  const result = await model.generateContent([prompt, image]);
  console.log(result.response.text());
  return result.response.text();
}
