import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import ImageCreator from "@/components/tools/image-creator";

export const metadata: Metadata = createPageMetadata({
  title: "Image Studio",
  description: "Hermes/AI image page for image workflows.",
  keywords: ["AI image generation", "image workflows"],
});

const ImagePage = () => {
  return <ImageCreator />;
};

export default ImagePage;
