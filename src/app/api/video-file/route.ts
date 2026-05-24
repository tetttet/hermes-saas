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
export const dynamic = "force-dynamic";

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

const applyPassthroughHeaders = (
  targetHeaders: Headers,
  upstreamHeaders: Headers,
) => {
  for (const headerName of [
    "accept-ranges",
    "content-length",
    "content-range",
    "etag",
    "last-modified",
  ]) {
    const headerValue = upstreamHeaders.get(headerName);

    if (headerValue) {
      targetHeaders.set(headerName, headerValue);
    }
  }
};

const proxyVideoRequest = async (
  request: Request,
  method: "GET" | "HEAD",
) => {
  const requestUrl = new URL(request.url);
  const prompt = requestUrl.searchParams.get("prompt")?.trim();
  const aspectRatio = requestUrl.searchParams.get("aspectRatio")?.trim();
  const model = normalizeVideoModel(
    requestUrl.searchParams.get("model") ?? DEFAULT_VIDEO_MODEL,
  );
  const duration = Number(
    requestUrl.searchParams.get("duration") ?? DEFAULT_VIDEO_DURATION_SECONDS,
  );
  const apiKey = getPollinationsApiKey();

  if (!prompt) {
    return jsonError("Prompt is required.", 400, [
      "pass the prompt query parameter to stream the generated video",
    ]);
  }

  if (!apiKey) {
    return jsonError("Missing Pollinations API key.", 500, [
      "set API_KEY in your environment before streaming video",
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
      method,
      headers: buildPollinationsVideoRequestHeaders(request.headers.get("range")),
      cache: "no-store",
      redirect: "follow",
      },
    );
  } catch {
    return jsonError("Failed to reach the video host.", 502, [
      "pollinations did not respond to the server video request",
    ]);
  }

  if (!upstreamResponse.ok) {
    const upstreamContentType = upstreamResponse.headers.get("content-type") ?? "";

    if (upstreamContentType.includes("application/json")) {
      try {
        const upstreamData = (await upstreamResponse.json()) as {
          error?: string | { message?: string; code?: string };
          status?: number;
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

  const responseHeaders = new Headers({
    "Cache-Control": "no-store",
    "Content-Type": contentType,
  });

  applyPassthroughHeaders(responseHeaders, upstreamResponse.headers);

  return new Response(method === "HEAD" ? null : upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
};

export async function GET(request: Request) {
  return proxyVideoRequest(request, "GET");
}

export async function HEAD(request: Request) {
  return proxyVideoRequest(request, "HEAD");
}
