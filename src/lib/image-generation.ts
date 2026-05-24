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
const DEFAULT_IMAGE_WIDTH = 1024;
const DEFAULT_IMAGE_HEIGHT = 1024;
const WIDESCREEN_IMAGE_WIDTH = 1280;
const WIDESCREEN_IMAGE_HEIGHT = 720;

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
    quality
      ? `Quality target: ${qualityDirections[quality] ?? quality.toLowerCase()}.`
      : null,
    seed ? `Seed reference: ${seed.trim()}.` : null,
  ].filter((value): value is string => Boolean(value));

  return [basePrompt, ...modifiers].filter(Boolean).join(" ");
};

const formatResolution = (width: number, height: number) => `${width}×${height}`;

const getDefaultDimensions = (aspectRatio?: string) => {
  if (aspectRatio === "16:9") {
    return {
      width: WIDESCREEN_IMAGE_WIDTH,
      height: WIDESCREEN_IMAGE_HEIGHT,
    };
  }

  return {
    width: DEFAULT_IMAGE_WIDTH,
    height: DEFAULT_IMAGE_HEIGHT,
  };
};

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
  if (aspectRatio === "16:9") {
    return getDefaultDimensions(aspectRatio);
  }

  if (!resolution) {
    return getDefaultDimensions(aspectRatio);
  }

  const match = resolution.match(/^(\d+)[×x](\d+)$/);
  const width = match ? Number(match[1]) : Number.NaN;
  const height = match ? Number(match[2]) : Number.NaN;

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return getDefaultDimensions(aspectRatio);
  }

  return normalizeDimensionsForAspectRatio(width, height, aspectRatio);
};

export const normalizeImageSeed = (seed?: string) =>
  typeof seed === "string" && seed.trim() ? seed.trim() : String(Date.now());

export const buildPollinationsImageUrl = (
  requestBody: GenerateImageRequestBody,
) => {
  const composedPrompt = buildImagePrompt(requestBody);
  const encodedPrompt = encodeURIComponent(composedPrompt);
  const { width, height } = parseResolution(
    requestBody.resolution,
    requestBody.aspectRatio,
  );
  const normalizedSeed = normalizeImageSeed(requestBody.seed);
  const cacheBust = String(Date.now());
  const imageUrl = new URL(`${POLLINATIONS_BASE_URL}/${encodedPrompt}`);

  imageUrl.searchParams.set("width", String(width));
  imageUrl.searchParams.set("height", String(height));
  imageUrl.searchParams.set("seed", normalizedSeed);
  imageUrl.searchParams.set("nologo", "true");
  imageUrl.searchParams.set("cacheBust", cacheBust);

  const sourceUrl = imageUrl.toString();

  return {
    sourceUrl,
    seed: normalizedSeed,
    composedPrompt,
    resolution: formatResolution(width, height),
  };
};
