import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import ImageCreator from "@/components/tools/image-creator";

export const metadata: Metadata = createPageMetadata({
  title: "Image Studio",
  description: "Hermes/AI image studio for prompt-based photo generation.",
  keywords: ["AI image generation", "photo generation", "image prompts"],
});

const ImagePage = () => {
  return <ImageCreator />;
};

export default ImagePage;
