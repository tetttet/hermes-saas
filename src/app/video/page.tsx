import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Video Studio",
  description: "Hermes/AI video page for video workflows.",
  keywords: ["AI video generation", "video workflows"],
});

const VideoPage = () => {
  return (
    <div>VideoPage</div>
  )
}

export default VideoPage
