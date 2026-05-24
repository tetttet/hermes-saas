export type AspectRatio = "1:1" | "16:9";

export type Quality = "Standard" | "HD" | "Ultra";

export type WorkflowMode = "create" | "edit";

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
  basePrompt: string;
  aspectRatio: AspectRatio;
  resolution: string;
  naturalWidth?: number;
  naturalHeight?: number;
  style: Style;
  quality: Quality;
  seed?: string;
  retryCount: number;
  createdAt: number;
  loadState: "loading" | "ready" | "error";
};
