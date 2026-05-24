import type { ImageGenerationProvider } from "@/lib/image-generation";
import type { AspectRatio, Quality, Style } from "./types";

export const MAX_GALLERY_ITEMS = 8;
export const DEFAULT_ASPECT_RATIO: AspectRatio = "1:1";
export const DEFAULT_IMAGE_PROVIDER: ImageGenerationProvider =
  "dublios-power";

export const resolutions: Record<AspectRatio, string[]> = {
  "1:1": ["1024×1024", "1536×1536", "2048×2048"],
  "16:9": ["1280×720"],
};

export const getDefaultResolution = (aspectRatio: AspectRatio) =>
  resolutions[aspectRatio][0];

export const getSafeResolution = (
  aspectRatio: AspectRatio,
  resolution?: string,
) =>
  resolution && resolutions[aspectRatio].includes(resolution)
    ? resolution
    : getDefaultResolution(aspectRatio);

export const styles: Style[] = [
  "Cinematic",
  "Photoreal",
  "Editorial",
  "3D Render",
  "Fashion",
  "Minimal",
];

export const qualityOptions: Quality[] = ["Standard", "HD", "Ultra"];

export const imageGenerationProviders = [
  {
    value: "dublios-power",
    label: "Dublios",
  },
  {
    value: "ai-horde",
    label: "AI Horde",
  },
] as const;

export const imageProviderLabels: Record<ImageGenerationProvider, string> = {
  "dublios-power": "Dublios",
  "ai-horde": "AI Horde",
};

export const imageProviderTagLabels: Record<ImageGenerationProvider, string> = {
  "dublios-power": "Dublios",
  "ai-horde": "AI Horde",
};

export const aspectRatioLabels: Record<AspectRatio, string> = {
  "1:1": "1:1",
  "16:9": "16:9",
};

export const selectClassName =
  "h-10 w-full appearance-none rounded-[16px] border border-white/10 bg-[#121317] px-3 pr-10 text-xs font-bold text-white outline-none transition focus:border-[#2563eb]/70 focus:ring-4 focus:ring-[#2563eb]/10";
