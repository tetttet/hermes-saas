import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Audio Studio",
  description: "Hermes/AI audio page for audio workflows.",
  keywords: ["AI audio generation", "audio workflows"],
});

const AudioPage = () => {
  return (
    <div>AudioPage</div>
  )
}

export default AudioPage
