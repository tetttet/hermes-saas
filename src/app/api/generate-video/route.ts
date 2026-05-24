import {
  buildInternalVideoUrl,
  buildVideoPrompt,
  DEFAULT_VIDEO_DURATION_SECONDS,
  DEFAULT_VIDEO_MODEL,
  estimateVideoCostPollen,
  fetchPollinationsBalance,
  getPollinationsApiKey,
  normalizeVideoModel,
  type GenerateVideoErrorResponse,
  type GenerateVideoRequestBody,
  type GenerateVideoSuccessResponse,
} from "@/lib/video-generation";

export const runtime = "nodejs";

const jsonError = (error: string, status: number, details?: string[]) =>
  Response.json(
    {
      error,
      ...(details && details.length > 0 ? { details } : {}),
    } satisfies GenerateVideoErrorResponse,
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );

const optionalString = (value: unknown) =>
  typeof value === "string" ? value : undefined;

const optionalNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400, [
      "the request body must be valid JSON",
    ]);
  }

  if (!body || typeof body !== "object") {
    return jsonError("Request body must be a JSON object.", 400);
  }

  const payload = body as Record<string, unknown>;
  const prompt = optionalString(payload.prompt)?.trim();

  if (!prompt) {
    return jsonError("Prompt is required.", 400, [
      "enter text in the prompt field before generating",
    ]);
  }

  const requestBody: GenerateVideoRequestBody = {
    prompt,
    style: optionalString(payload.style),
    aspectRatio: optionalString(payload.aspectRatio),
    motion: optionalString(payload.motion),
    pacing: optionalString(payload.pacing),
    model: optionalString(payload.model),
    duration: optionalNumber(payload.duration),
  };

  const composedPrompt = buildVideoPrompt(requestBody);
  const aspectRatio = requestBody.aspectRatio?.trim() || "16:9";
  const model = normalizeVideoModel(requestBody.model ?? DEFAULT_VIDEO_MODEL);
  const duration = requestBody.duration ?? DEFAULT_VIDEO_DURATION_SECONDS;
  const requestId = crypto.randomUUID();
  const apiKey = getPollinationsApiKey();

  if (!apiKey) {
    return jsonError("Missing Pollinations API key.", 500, [
      "set API_KEY in your environment before generating video",
    ]);
  }

  try {
    const balance = await fetchPollinationsBalance(apiKey);
    const estimatedCostPollen = estimateVideoCostPollen(model, duration);

    if (balance < estimatedCostPollen) {
      return jsonError(
        "Insufficient Pollinations balance for this video request.",
        402,
        [
          `current balance: ${balance.toFixed(4)} pollen`,
          `estimated request cost: ${estimatedCostPollen.toFixed(4)} pollen`,
          "top up your Pollinations balance or lower the duration/model cost",
        ],
      );
    }
  } catch {
    return jsonError("Failed to verify your Pollinations balance.", 502, [
      "the server could not reach /account/balance before starting video generation",
    ]);
  }

  return Response.json(
    {
      videoUrl: buildInternalVideoUrl(composedPrompt, {
        requestId,
        aspectRatio,
        duration,
        model,
      }),
      composedPrompt,
      aspectRatio,
      model,
      duration,
      estimatedCostPollen: estimateVideoCostPollen(model, duration),
    } satisfies GenerateVideoSuccessResponse,
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
