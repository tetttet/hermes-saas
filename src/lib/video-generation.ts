export type GenerateVideoRequestBody = {
  prompt: string;
  style?: string;
  aspectRatio?: string;
  motion?: string;
  pacing?: string;
  model?: string;
  duration?: number;
};

export type GenerateVideoErrorResponse = {
  error: string;
  details?: string[];
};

export type GenerateVideoSuccessResponse = {
  videoUrl: string;
  composedPrompt: string;
  aspectRatio: string;
  model: string;
  duration: number;
  estimatedCostPollen: number;
};

const POLLINATIONS_VIDEO_BASE_URL = "https://gen.pollinations.ai/video";
const POLLINATIONS_ACCOUNT_BALANCE_URL =
  "https://gen.pollinations.ai/account/balance";
const VIDEO_COST_SAFETY_MULTIPLIER = 1.4;

export const DEFAULT_VIDEO_MODEL = "ltx-2";
export const DEFAULT_VIDEO_DURATION_SECONDS = 1;

const videoModelPricingPerSecond: Record<string, number> = {
  veo: 0.15,
  "seedance-pro": 0.0375,
  "seedance-2.0": 0.27,
  wan: 0.075,
  "wan-fast": 0.015,
  "grok-video-pro": 0.075,
  "ltx-2": 0.005,
  "p-video": 0.036,
  "nova-reel": 0.08,
};

const styleDirections: Record<string, string> = {
  Cinematic:
    "cinematic lighting, premium color grading, confident framing, polished production value",
  Photoreal:
    "photoreal motion, realistic detail, grounded lighting, natural materials",
  Editorial:
    "editorial campaign energy, refined staging, premium pacing, fashion-forward polish",
  Minimal:
    "minimal composition, restrained movement, clean premium atmosphere, elegant negative space",
};

const aspectRatioDirections: Record<string, string> = {
  "16:9": "compose for a wide cinematic frame",
  "9:16": "compose for a tall vertical mobile frame",
  "1:1": "compose for a balanced square frame",
};

const motionDirections: Record<string, string> = {
  "Subtle Drift": "use gentle camera drift and refined motion",
  "Push In": "use a smooth cinematic push-in toward the subject",
  Orbit: "use a controlled orbital camera move with dimensional depth",
  Handheld: "use light handheld energy with natural micro-movement",
};

const pacingDirections: Record<string, string> = {
  Punchy: "keep the pacing concise and high impact",
  Balanced: "keep the pacing clear, smooth, and balanced",
  "Slow Burn": "let the pacing breathe with slower transitions and atmosphere",
};

export const buildVideoPrompt = ({
  prompt,
  style,
  aspectRatio,
  motion,
  pacing,
}: GenerateVideoRequestBody) => {
  const basePrompt = prompt.trim();
  const modifiers = [
    style
      ? `Visual style: ${style}. ${styleDirections[style] ?? `Use a ${style.toLowerCase()} video direction`}.`
      : null,
    aspectRatio
      ? `Frame: ${aspectRatioDirections[aspectRatio] ?? `match a ${aspectRatio} composition`}.`
      : null,
    motion
      ? `Camera motion: ${motionDirections[motion] ?? motion.toLowerCase()}.`
      : null,
    pacing
      ? `Pacing: ${pacingDirections[pacing] ?? pacing.toLowerCase()}.`
      : null,
  ].filter((value): value is string => Boolean(value));

  return [basePrompt, ...modifiers].filter(Boolean).join(" ");
};

const normalizeVideoDuration = (duration?: number) => {
  if (!Number.isFinite(duration)) {
    return DEFAULT_VIDEO_DURATION_SECONDS;
  }

  return Math.max(1, Math.min(30, Math.round(duration ?? DEFAULT_VIDEO_DURATION_SECONDS)));
};

export const normalizeVideoModel = (model?: string) => {
  const normalized = model?.trim();

  if (!normalized) {
    return DEFAULT_VIDEO_MODEL;
  }

  return normalized;
};

export const buildPollinationsVideoUrl = ({
  composedPrompt,
  aspectRatio,
  duration,
  model,
  apiKey,
}: {
  composedPrompt: string;
  aspectRatio?: string;
  duration?: number;
  model?: string;
  apiKey?: string | null;
}) => {
  const url = new URL(
    `${POLLINATIONS_VIDEO_BASE_URL}/${encodeURIComponent(composedPrompt.trim())}`,
  );
  const normalizedModel = normalizeVideoModel(model);
  const normalizedDuration = normalizeVideoDuration(duration);

  url.searchParams.set("model", normalizedModel);
  url.searchParams.set("duration", String(normalizedDuration));

  if (aspectRatio?.trim()) {
    url.searchParams.set("aspectRatio", aspectRatio.trim());
  }

  if (apiKey) {
    url.searchParams.set("key", apiKey);
  }

  return url.toString();
};

export const buildInternalVideoUrl = (
  composedPrompt: string,
  {
    requestId,
    aspectRatio,
    duration,
    model,
  }: {
    requestId: string;
    aspectRatio?: string;
    duration?: number;
    model?: string;
  },
) => {
  const searchParams = new URLSearchParams({
    prompt: composedPrompt,
    requestId,
    model: normalizeVideoModel(model),
    duration: String(normalizeVideoDuration(duration)),
  });

  if (aspectRatio?.trim()) {
    searchParams.set("aspectRatio", aspectRatio.trim());
  }

  return `/api/video-file?${searchParams.toString()}`;
};

export const getPollinationsApiKey = () => {
  const candidates = [
    process.env.API_KEY,
    process.env.POLLINATIONS_API_KEY,
    process.env.POLLINATIONS_API_TOKEN,
  ]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

  return candidates[0] ?? null;
};

export const buildPollinationsVideoRequestHeaders = (range?: string | null) => {
  const headers = new Headers({
    Accept: "video/mp4,video/*;q=0.9,application/octet-stream;q=0.8,*/*;q=0.7",
  });

  if (range) {
    headers.set("Range", range);
  }

  return headers;
};

export const normalizeVideoContentType = (contentType?: string | null) => {
  const normalized = contentType?.split(";")[0]?.trim().toLowerCase();

  if (!normalized || normalized === "application/octet-stream") {
    return "video/mp4";
  }

  if (normalized.startsWith("video/")) {
    return normalized;
  }

  return null;
};

export const estimateVideoCostPollen = (model?: string, duration?: number) => {
  const normalizedModel = normalizeVideoModel(model);
  const normalizedDuration = normalizeVideoDuration(duration);
  const pricePerSecond =
    videoModelPricingPerSecond[normalizedModel] ??
    videoModelPricingPerSecond[DEFAULT_VIDEO_MODEL];

  return Number(
    (pricePerSecond * normalizedDuration * VIDEO_COST_SAFETY_MULTIPLIER).toFixed(
      4,
    ),
  );
};

export const fetchPollinationsBalance = async (apiKey: string) => {
  const response = await fetch(POLLINATIONS_ACCOUNT_BALANCE_URL, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`balance status ${response.status}`);
  }

  const data = (await response.json()) as { balance?: number };

  return Number(data.balance ?? 0);
};
