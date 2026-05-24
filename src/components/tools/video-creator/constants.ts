import type {
  VideoAspectRatio,
  VideoModel,
  VideoMotion,
  VideoPacing,
  VideoStyle,
} from "./types";
import {
  DEFAULT_VIDEO_DURATION_SECONDS,
  DEFAULT_VIDEO_MODEL,
} from "@/lib/video-generation";

export const MAX_VIDEO_GALLERY_ITEMS = 6;

export const DEFAULT_VIDEO_ASPECT_RATIO: VideoAspectRatio = "16:9";
export const DEFAULT_VIDEO_STYLE: VideoStyle = "Cinematic";
export const DEFAULT_VIDEO_MOTION: VideoMotion = "Subtle Drift";
export const DEFAULT_VIDEO_PACING: VideoPacing = "Balanced";
export const DEFAULT_CREATOR_VIDEO_MODEL: VideoModel = DEFAULT_VIDEO_MODEL;
export const DEFAULT_CREATOR_VIDEO_DURATION = DEFAULT_VIDEO_DURATION_SECONDS;

export const videoStyles: VideoStyle[] = [
  "Cinematic",
  "Photoreal",
  "Editorial",
  "Minimal",
];

export const videoAspectRatios: VideoAspectRatio[] = ["16:9", "9:16", "1:1"];

export const videoMotionOptions: VideoMotion[] = [
  "Subtle Drift",
  "Push In",
  "Orbit",
  "Handheld",
];

export const videoPacingOptions: VideoPacing[] = [
  "Punchy",
  "Balanced",
  "Slow Burn",
];

export const videoModelOptions: Array<{
  value: VideoModel;
  label: string;
}> = [
  { value: "ltx-2", label: "LTX-2" },
  { value: "seedance-pro", label: "Seedance Pro" },
  { value: "wan-fast", label: "Wan Fast" },
  { value: "veo", label: "Veo" },
  { value: "p-video", label: "P-Video" },
  { value: "nova-reel", label: "Nova Reel" },
];

export const videoDurationOptions = [1, 3, 5, 8];
