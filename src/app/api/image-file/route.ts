import type { GenerateImageErrorResponse } from "@/lib/image-generation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_IMAGE_HOSTNAMES = new Set(["image.pollinations.ai"]);
const POLLINATIONS_IMAGE_ACCEPT_HEADER =
  "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8";
const IMAGE_READY_RETRY_DELAYS_MS = [1200, 2000, 3200];

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

const sleep = (durationMs: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, durationMs);
  });

const normalizeImageContentType = (contentType?: string | null) => {
  const normalized = contentType?.split(";")[0]?.trim().toLowerCase();

  if (!normalized || normalized === "application/octet-stream") {
    return "image/jpeg";
  }

  if (normalized.startsWith("image/")) {
    return normalized;
  }

  return null;
};

const isRetriableStatus = (status: number) =>
  [404, 408, 425, 429, 500, 502, 503, 504].includes(status);

const applyPassthroughHeaders = (
  targetHeaders: Headers,
  upstreamHeaders: Headers,
) => {
  for (const headerName of ["content-length", "etag", "last-modified"]) {
    const headerValue = upstreamHeaders.get(headerName);

    if (headerValue) {
      targetHeaders.set(headerName, headerValue);
    }
  }
};

const fetchPollinationsImage = async (
  sourceUrl: URL,
  method: "GET" | "HEAD",
) => {
  let lastNetworkError = false;

  for (let attempt = 0; attempt <= IMAGE_READY_RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      const upstreamResponse = await fetch(sourceUrl, {
        method,
        headers: {
          Accept: POLLINATIONS_IMAGE_ACCEPT_HEADER,
        },
        cache: "no-store",
        redirect: "follow",
      });
      const normalizedContentType = normalizeImageContentType(
        upstreamResponse.headers.get("content-type"),
      );

      if (upstreamResponse.ok && normalizedContentType) {
        return {
          upstreamResponse,
          normalizedContentType,
        };
      }

      const canRetry =
        attempt < IMAGE_READY_RETRY_DELAYS_MS.length &&
        (isRetriableStatus(upstreamResponse.status) || !normalizedContentType);

      if (!canRetry) {
        return {
          upstreamResponse,
          normalizedContentType,
        };
      }
    } catch {
      lastNetworkError = true;

      if (attempt === IMAGE_READY_RETRY_DELAYS_MS.length) {
        break;
      }
    }

    await sleep(IMAGE_READY_RETRY_DELAYS_MS[attempt]);
  }

  return {
    upstreamResponse: null,
    normalizedContentType: null,
    lastNetworkError,
  };
};

const proxyImageRequest = async (
  request: Request,
  method: "GET" | "HEAD",
) => {
  const requestUrl = new URL(request.url);
  const sourceUrl = requestUrl.searchParams.get("url")?.trim();

  if (!sourceUrl) {
    return jsonError("Image URL is required.", 400, [
      "pass the upstream image URL in the url query parameter",
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
      "only generated pollinations images can be streamed through this route",
    ]);
  }

  const {
    upstreamResponse,
    normalizedContentType,
    lastNetworkError,
  } = await fetchPollinationsImage(parsedUrl, method);

  if (!upstreamResponse) {
    return jsonError("Failed to reach the image host.", 502, [
      "pollinations did not respond to the server image request",
      ...(lastNetworkError
        ? ["the request still failed after retrying the upstream image fetch"]
        : []),
    ]);
  }

  if (!upstreamResponse.ok) {
    return jsonError("Image host returned an error.", upstreamResponse.status, [
      `upstream status: ${upstreamResponse.status}`,
    ]);
  }

  if (!normalizedContentType) {
    return jsonError("Image host did not return an image.", 502, [
      `received content type: ${upstreamResponse.headers.get("content-type") ?? "unknown"}`,
    ]);
  }

  const responseHeaders = new Headers({
    "Cache-Control": "no-store",
    "Content-Type": normalizedContentType,
  });

  applyPassthroughHeaders(responseHeaders, upstreamResponse.headers);

  return new Response(method === "HEAD" ? null : upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
};

export async function GET(request: Request) {
  return proxyImageRequest(request, "GET");
}

export async function HEAD(request: Request) {
  return proxyImageRequest(request, "HEAD");
}
