import type { AspectRatio, GeneratedImageItem } from "./types";

export const toCssAspectRatio = (resolution: string, fallback: AspectRatio) => {
  const [width, height] = resolution.split("×").map((value) => Number(value));

  if (
    Number.isFinite(width) &&
    Number.isFinite(height) &&
    width > 0 &&
    height > 0
  ) {
    return `${width} / ${height}`;
  }

  return fallback.replace(":", " / ");
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "image";

const getFileExtension = (mimeType: string) => {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "png";
  }
};

export const buildDownloadName = (item: GeneratedImageItem) =>
  `hermes-${slugify(item.style)}-${item.createdAt}.${getFileExtension(item.mimeType)}`;

export const formatCreatedAt = (timestamp: number) =>
  new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);

export const buildImageTags = (item: GeneratedImageItem) =>
  [
    item.style,
    item.quality,
    item.aspectRatio,
    item.resolution,
  ].filter((value): value is string => Boolean(value));
