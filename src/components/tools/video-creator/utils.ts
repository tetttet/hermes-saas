import type { GeneratedVideoItem, VideoAspectRatio, VideoModel } from "./types";

export const videoAspectRatioToCssValue = (aspectRatio: VideoAspectRatio) =>
  aspectRatio.replace(":", " / ");

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "video";

const getFileExtension = (mimeType: string) => {
  switch (mimeType) {
    case "video/webm":
      return "webm";
    case "video/quicktime":
      return "mov";
    default:
      return "mp4";
  }
};

export const buildVideoDownloadName = (item: GeneratedVideoItem) =>
  `hermes-${slugify(item.style)}-video-${item.createdAt}.${getFileExtension(item.mimeType)}`;

export const formatCreatedAt = (timestamp: number) =>
  new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);

export const formatDuration = (durationSeconds?: number) => {
  if (!Number.isFinite(durationSeconds) || (durationSeconds ?? 0) <= 0) {
    return null;
  }

  const totalSeconds = Math.max(0, Math.round(durationSeconds ?? 0));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const formatActualVideoSize = (item: GeneratedVideoItem) => {
  if (
    Number.isFinite(item.videoWidth) &&
    Number.isFinite(item.videoHeight) &&
    (item.videoWidth ?? 0) > 0 &&
    (item.videoHeight ?? 0) > 0
  ) {
    return `${item.videoWidth}×${item.videoHeight}`;
  }

  return item.aspectRatio;
};

export const getVideoPreviewAspectRatio = (item: GeneratedVideoItem) => {
  if (
    Number.isFinite(item.videoWidth) &&
    Number.isFinite(item.videoHeight) &&
    (item.videoWidth ?? 0) > 0 &&
    (item.videoHeight ?? 0) > 0
  ) {
    return `${item.videoWidth} / ${item.videoHeight}`;
  }

  return videoAspectRatioToCssValue(item.aspectRatio);
};

export const buildVideoTags = (item: GeneratedVideoItem) =>
  [
    item.model,
    item.motion,
    item.aspectRatio,
    formatActualVideoSize(item),
    formatDuration(item.durationSeconds),
  ].filter((value): value is string => Boolean(value));

export const getVideoModelLabel = (model: VideoModel) => {
  switch (model) {
    case "ltx-2":
      return "LTX-2";
    case "seedance-pro":
      return "Seedance Pro";
    case "wan-fast":
      return "Wan Fast";
    case "veo":
      return "Veo";
    case "p-video":
      return "P-Video";
    case "nova-reel":
      return "Nova Reel";
    default:
      return model;
  }
};
