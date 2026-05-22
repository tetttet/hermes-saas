import type { AspectRatio, GeneratedImageItem } from "./types";

export const aspectRatioToCssValue = (aspectRatio: AspectRatio) =>
  aspectRatio.replace(":", " / ");

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

  return aspectRatioToCssValue(fallback);
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

export const formatActualImageSize = (item: GeneratedImageItem) => {
  if (
    Number.isFinite(item.naturalWidth) &&
    Number.isFinite(item.naturalHeight) &&
    (item.naturalWidth ?? 0) > 0 &&
    (item.naturalHeight ?? 0) > 0
  ) {
    return `${item.naturalWidth}×${item.naturalHeight}`;
  }

  return item.resolution;
};

export const buildImageTags = (item: GeneratedImageItem) =>
  [
    item.style,
    item.quality,
    item.aspectRatio,
    formatActualImageSize(item),
  ].filter((value): value is string => Boolean(value));
