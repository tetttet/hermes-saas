export type VideoStyle =
  | "Cinematic"
  | "Photoreal"
  | "Editorial"
  | "Minimal";

export type VideoAspectRatio = "16:9" | "9:16" | "1:1";

export type VideoMotion = "Subtle Drift" | "Push In" | "Orbit" | "Handheld";

export type VideoPacing = "Punchy" | "Balanced" | "Slow Burn";

export type VideoModel =
  | "ltx-2"
  | "seedance-pro"
  | "wan-fast"
  | "veo"
  | "p-video"
  | "nova-reel";

export type GeneratedVideoItem = {
  id: string;
  url: string;
  mimeType: string;
  basePrompt: string;
  composedPrompt: string;
  aspectRatio: VideoAspectRatio;
  model: VideoModel;
  duration: number;
  style: VideoStyle;
  motion: VideoMotion;
  pacing: VideoPacing;
  createdAt: number;
  durationSeconds?: number;
  videoWidth?: number;
  videoHeight?: number;
  estimatedCostPollen: number;
  loadState: "loading" | "ready" | "error";
};
