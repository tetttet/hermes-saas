import {
  buildPollinationsVideoRequestHeaders,
  buildPollinationsVideoUrl,
  DEFAULT_VIDEO_DURATION_SECONDS,
  DEFAULT_VIDEO_MODEL,
  getPollinationsApiKey,
  normalizeVideoContentType,
  normalizeVideoModel,
  type GenerateVideoErrorResponse,
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

const sanitizeFilename = (value?: string) => {
  const fallback = "hermes-video.mp4";

  if (!value) {
    return fallback;
  }

  const cleaned = value
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!cleaned) {
    return fallback;
  }

  return cleaned.includes(".") ? cleaned : `${cleaned}.mp4`;
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
  const aspectRatio = optionalString(payload.aspectRatio)?.trim();
  const model = normalizeVideoModel(
    optionalString(payload.model) ?? DEFAULT_VIDEO_MODEL,
  );
  const rawDuration = Number(
    optionalString(payload.duration) ?? DEFAULT_VIDEO_DURATION_SECONDS,
  );
  const duration = Number.isFinite(rawDuration)
    ? rawDuration
    : DEFAULT_VIDEO_DURATION_SECONDS;
  const apiKey = getPollinationsApiKey();

  if (!prompt) {
    return jsonError("Prompt is required.", 400, [
      "pass the composed prompt in the request body",
    ]);
  }

  if (!apiKey) {
    return jsonError("Missing Pollinations API key.", 500, [
      "set API_KEY in your environment before downloading video",
    ]);
  }

  let upstreamResponse: Response;

  try {
    upstreamResponse = await fetch(
      buildPollinationsVideoUrl({
        composedPrompt: prompt,
        aspectRatio,
        duration,
        model,
        apiKey,
      }),
      {
      headers: buildPollinationsVideoRequestHeaders(),
      cache: "no-store",
      redirect: "follow",
      },
    );
  } catch {
    return jsonError("Failed to reach the video host.", 502, [
      "pollinations did not respond to the server download request",
    ]);
  }

  if (!upstreamResponse.ok) {
    const upstreamContentType = upstreamResponse.headers.get("content-type") ?? "";

    if (upstreamContentType.includes("application/json")) {
      try {
        const upstreamData = (await upstreamResponse.json()) as {
          error?: string | { message?: string; code?: string };
        };
        const upstreamError =
          typeof upstreamData.error === "string"
            ? upstreamData.error
            : upstreamData.error?.message;

        return jsonError(
          upstreamError || "Video host returned an error.",
          upstreamResponse.status,
          [
            typeof upstreamData.error === "object" && upstreamData.error?.code
              ? `code: ${upstreamData.error.code}`
              : null,
            `upstream status: ${upstreamResponse.status}`,
          ].filter((value): value is string => Boolean(value)),
        );
      } catch {
        return jsonError("Video host returned an error.", upstreamResponse.status, [
          `upstream status: ${upstreamResponse.status}`,
        ]);
      }
    }

    return jsonError("Video host returned an error.", upstreamResponse.status, [
      `upstream status: ${upstreamResponse.status}`,
    ]);
  }

  const contentType = normalizeVideoContentType(
    upstreamResponse.headers.get("content-type"),
  );

  if (!contentType) {
    return jsonError("Video host did not return a video.", 502, [
      `received content type: ${upstreamResponse.headers.get("content-type") ?? "unknown"}`,
    ]);
  }

  const filename = sanitizeFilename(optionalString(payload.filename));
  const responseHeaders = new Headers({
    "Cache-Control": "no-store",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Content-Type": contentType,
  });
  const contentLength = upstreamResponse.headers.get("content-length");

  if (contentLength) {
    responseHeaders.set("Content-Length", contentLength);
  }

  return new Response(upstreamResponse.body, {
    headers: responseHeaders,
  });
}
