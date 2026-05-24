import type { GenerateImageErrorResponse } from "@/lib/image-generation";

export const runtime = "nodejs";

const ALLOWED_IMAGE_HOSTNAMES = new Set(["image.pollinations.ai"]);
const POLLINATIONS_IMAGE_ACCEPT_HEADER =
  "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8";

const jsonError = (error: string, status: number, details?: string[]) =>
  Response.json(
    {
      error,
      ...(details && details.length > 0 ? { details } : {}),
    } satisfies GenerateImageErrorResponse,
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
  const fallback = "hermes-image.png";

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

  return cleaned.includes(".") ? cleaned : `${cleaned}.png`;
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
  const sourceUrl = optionalString(payload.url);

  if (!sourceUrl) {
    return jsonError("Image URL is required.", 400, [
      "pass the generated image URL in the request body",
    ]);
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(sourceUrl);
  } catch {
    return jsonError("Image URL is invalid.", 400);
  }

  if (
    parsedUrl.protocol !== "https:" ||
    !ALLOWED_IMAGE_HOSTNAMES.has(parsedUrl.hostname)
  ) {
    return jsonError("Image host is not allowed.", 400, [
      "only generated pollinations images can be downloaded through this route",
    ]);
  }

  let upstreamResponse: Response;

  try {
    upstreamResponse = await fetch(parsedUrl, {
      headers: {
        Accept: POLLINATIONS_IMAGE_ACCEPT_HEADER,
      },
      cache: "no-store",
    });
  } catch {
    return jsonError("Failed to reach the image host.", 502, [
      "pollinations did not respond to the server download request",
    ]);
  }

  if (!upstreamResponse.ok) {
    return jsonError("Image host returned an error.", 502, [
      `upstream status: ${upstreamResponse.status}`,
    ]);
  }

  const contentType =
    upstreamResponse.headers.get("content-type")?.split(";")[0]?.trim() ||
    "application/octet-stream";

  if (!contentType.startsWith("image/")) {
    return jsonError("Image host did not return an image.", 502, [
      `received content type: ${contentType}`,
    ]);
  }

  const filename = sanitizeFilename(optionalString(payload.filename));
  const contentLength = upstreamResponse.headers.get("content-length");

  const responseHeaders = new Headers({
    "Cache-Control": "no-store",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Content-Type": contentType,
  });

  if (contentLength) {
    responseHeaders.set("Content-Length", contentLength);
  }

  return new Response(upstreamResponse.body, {
    headers: responseHeaders,
  });
}
