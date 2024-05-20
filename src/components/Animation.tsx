import { generateImageFal, generateVideoFal } from "@/ai/fal";
import { getGroqCompletion } from "@/ai/groq";
import { ReactNode, useEffect, useRef, useState } from "react";
import Blend, { BlendImage } from "./Blend";

type AnimationProps = {
  prompt: string;
  systemPrompt: string;
  width: number;
  height: number;
  animate: number;
  fullscreen: boolean;
  onChange?: (url: string) => void;
  video?: boolean;
};

//Component that uses groq to generate image descriptions from prompts, then uses fal to generates the image and blends them together.
//All runs on an animation timer
export default function Animation({
  prompt,
  systemPrompt,
  width,
  height,
  animate,
  fullscreen,
  onChange,
  video = false,
}: AnimationProps) {
  const [image, setImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    console.log("effect triggered");

    async function generateDescription() {
      return await getGroqCompletion(prompt, 32, systemPrompt);
    }
    async function generateImage() {
      //improve image description
      const imageDescription = await generateDescription();
      console.log(
        imageDescription +
          " Canon EOS 5D Mark IV, 24mm, f/8, 1/250s, ISO 100, 2019"
      );
      const url = await generateImageFal(
        imageDescription +
          " Canon EOS 5D Mark IV, 24mm, f/8, 1/250s, ISO 100, 2019",
        { width: width, height: height },
        "hyper-sdxl"
      );
      return { imageDescription, url };
    }

    async function generateVideo(url: string) {
      const videoUrl = await generateVideoFal(url, 4);
      return videoUrl;
    }

    if (animate === 0) {
      generateImage().then((img) => {
        setImage(img.url);
        setVideoUrl(null);
        console.log("generating video");
        if (video && img.url)
          generateVideo(img.url).then((videoUrl) => {
            console.log("got video", videoUrl);
            setVideoUrl(videoUrl);
          });
      });
    } else {
      const interval = setInterval(async () => {
        const { url } = await generateImage();
        setImage(url); // Set new image
        if (onChange) onChange(url);
      }, animate);

      return () => clearInterval(interval); // Cleanup
    }
  }, [prompt, animate, systemPrompt, width, height, video, onChange]);

  return (
    <Blend
      component={
        videoUrl ? (
          <VideoComponent image={image ?? ""} videoUrl={videoUrl} />
        ) : (
          <img className="w-full  h-full  object-cover" src={image ?? ""} />
        )
      }
      fullscreen={fullscreen}
    />
  );
}

const VideoComponent = ({
  image,
  videoUrl,
}: {
  image: string;
  videoUrl: string;
}) => {
  return (
    <video
      poster={image ?? ""}
      src={videoUrl}
      autoPlay
      className="w-full h-full object-cover"
      muted
      loop={false}
    />
  );
};
