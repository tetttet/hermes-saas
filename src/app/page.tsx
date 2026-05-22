import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Home",
  description: "Hermes/AI home page for image, video and audio workflows.",
  keywords: ["Hermes AI home"],
});

const HomePage = () => {
  return (
    <div>HomePage</div>
  )
}

export default HomePage
