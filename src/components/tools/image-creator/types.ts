import type {
  HordeStatusLabel,
  ImageGenerationProvider,
} from "@/lib/image-generation";

export type AspectRatio = "1:1" | "16:9";

export type Quality = "Standard" | "HD" | "Ultra";

export type Style =
  | "Cinematic"
  | "Photoreal"
  | "Editorial"
  | "3D Render"
  | "Fashion"
  | "Minimal";

export type GeneratedImageItem = {
  id: string;
  url: string;
  mimeType: string;
  provider: ImageGenerationProvider;
  basePrompt: string;
  aspectRatio: AspectRatio;
  resolution: string;
  naturalWidth?: number;
  naturalHeight?: number;
  style: Style;
  quality: Quality;
  requestId?: string;
  seed?: string;
  retryCount: number;
  createdAt: number;
  generationStatusLabel?: HordeStatusLabel;
  generationStatusMessage?: string;
  errorMessage?: string;
  loadState: "loading" | "ready" | "error";
};
