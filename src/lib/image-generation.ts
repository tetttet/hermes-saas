export type GenerateImageRequestBody = {
  prompt: string;
  style?: string;
  aspectRatio?: string;
  resolution?: string;
  quality?: string;
  seed?: string;
};

export type GenerateImageErrorResponse = {
  error: string;
  details?: string[];
};

export type GenerateImageSuccessResponse = {
  imageUrl: string;
  seed: string;
  resolution: string;
};

const POLLINATIONS_BASE_URL = "https://image.pollinations.ai/prompt";
const DEFAULT_IMAGE_WIDTH = 768;
const DEFAULT_IMAGE_HEIGHT = 768;

const styleDirections: Record<string, string> = {
  Cinematic:
    "cinematic lighting, dramatic contrast, layered depth, polished color grading",
  Photoreal:
    "photorealistic rendering, natural materials, lifelike texture detail, realistic lighting",
  Editorial:
    "editorial campaign mood, magazine-ready framing, refined lighting, premium visual polish",
  "3D Render":
    "high-end 3d render, sculpted forms, crisp surfaces, studio lighting, premium finish",
  Fashion:
    "fashion campaign energy, elevated styling, luxe lighting, confident posing, premium composition",
  Minimal:
    "minimal visual language, restrained palette, elegant negative space, clean premium composition",
};

const aspectRatioDirections: Record<string, string> = {
  "1:1": "balanced square framing",
  "16:9": "wide cinematic composition",
  "9:16": "vertical mobile-first composition",
  "4:3": "classic editorial composition",
  "3:4": "vertical portrait composition",
};

const qualityDirections: Record<string, string> = {
  Standard: "clean render, solid detail",
  HD: "high detail, crisp focus, polished finish",
  Ultra: "ultra detailed render, refined texture work, premium production finish",
};

export const buildImagePrompt = ({
  prompt,
  style,
  aspectRatio,
  resolution,
  quality,
  seed,
}: GenerateImageRequestBody) => {
  const basePrompt = prompt.trim();
  const modifiers = [
    style
      ? `Visual style: ${style}. ${styleDirections[style] ?? `Use a ${style.toLowerCase()} direction`}.`
      : null,
    aspectRatio
      ? `Composition: ${aspectRatioDirections[aspectRatio] ?? `match the ${aspectRatio} frame`}.`
      : null,
    resolution ? `Output target: ${resolution}.` : null,
    quality
      ? `Quality target: ${qualityDirections[quality] ?? quality.toLowerCase()}.`
      : null,
    seed ? `Seed reference: ${seed.trim()}.` : null,
  ].filter((value): value is string => Boolean(value));

  return [basePrompt, ...modifiers].filter(Boolean).join(" ");
};

const formatResolution = (width: number, height: number) => `${width}×${height}`;

const normalizeDimensionsForAspectRatio = (
  width: number,
  height: number,
  aspectRatio?: string,
) => {
  if (aspectRatio === "1:1" && width !== height) {
    const squareSize = Math.max(width, height);

    return {
      width: squareSize,
      height: squareSize,
    };
  }

  return { width, height };
};

const parseResolution = (resolution?: string, aspectRatio?: string) => {
  if (!resolution) {
    return { width: DEFAULT_IMAGE_WIDTH, height: DEFAULT_IMAGE_HEIGHT };
  }

  const match = resolution.match(/^(\d+)[×x](\d+)$/);
  const width = match ? Number(match[1]) : Number.NaN;
  const height = match ? Number(match[2]) : Number.NaN;

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { width: DEFAULT_IMAGE_WIDTH, height: DEFAULT_IMAGE_HEIGHT };
  }

  return normalizeDimensionsForAspectRatio(width, height, aspectRatio);
};

export const normalizeImageSeed = (seed?: string) =>
  typeof seed === "string" && seed.trim() ? seed.trim() : String(Date.now());

export const buildPollinationsImageUrl = (
  requestBody: GenerateImageRequestBody,
) => {
  const composedPrompt = buildImagePrompt(requestBody);
  const { width, height } = parseResolution(
    requestBody.resolution,
    requestBody.aspectRatio,
  );
  const normalizedSeed = normalizeImageSeed(requestBody.seed);

  const imageUrl =
    `${POLLINATIONS_BASE_URL}/${encodeURIComponent(composedPrompt)}` +
    `?width=${width}&height=${height}&seed=${encodeURIComponent(normalizedSeed)}&nologo=true`;

  return {
    imageUrl,
    seed: normalizedSeed,
    composedPrompt,
    resolution: formatResolution(width, height),
  };
};
