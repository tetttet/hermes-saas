import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import VideoCreator from "@/components/tools/video-creator";

export const metadata: Metadata = createPageMetadata({
  title: "Video Studio",
  description: "Hermes/AI video page for Pollinations-powered video workflows.",
  keywords: ["AI video generation", "video workflows", "Pollinations video"],
});

const VideoPage = () => {
  return <VideoCreator />;
};

export default VideoPage;
