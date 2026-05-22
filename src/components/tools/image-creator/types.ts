export type AspectRatio = "1:1";

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
  style: Style;
  quality: Quality;
  seed?: string;
  createdAt: number;
  loadState: "loading" | "ready" | "error";
};
