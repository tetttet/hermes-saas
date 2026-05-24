import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import EmptyRoutePage from "@/components/tools/empty-route-page";

export const metadata: Metadata = createPageMetadata({
  title: "Video",
  description: "Video page placeholder for Hermes/AI.",
  keywords: ["video", "placeholder"],
});

const VideoPage = () => {
  return <EmptyRoutePage />;
};

export default VideoPage;
