"use server";

import * as fal from "@fal-ai/serverless-client";
const fal_key = process.env.FAL_KEY;

fal.config({
  credentials: fal_key, // or a function that returns a string
});

type Image = {
  url: string;
  file_name: string;
  file_size: number;
};
type Result = {
  images: Image[];
};

// This function makes a request to the FAL api and gets an image.
export async function generateImageFal(
  prompt: string,
  image_size: string,
  model:
    | "fast-turbo-diffusion"
    | "hyper-sdxl"
    | "fast-sdxl" = "fast-turbo-diffusion",
  negativePrompt: string = "cartoon, illustration, animation, face, male, female, ugly"
) {
  const result: Result = await fal.run(`fal-ai/${model}`, {
    input: {
      prompt: prompt,
      negativePrompt: negativePrompt,
      image_size: image_size,
      sync_mode: true,
    },
  });
  return result.images[0].url;
}

//Speech to text with Whisper
export async function speechToText(audio_url: string = "") {
  console.log("generating audio");
  const response = await fetch(`https://fal.run/fal-ai/whisper`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Key ${fal_key}`,
    },
    body: JSON.stringify({
      audio_url: audio_url,
      task: "transcribe",
      chunk_level: "segment",
      version: "3",
      batch_size: 64,
    }),
  });

  const responseJSON = await response.json();
  console.log(responseJSON);

  return responseJSON?.chunks;
}
