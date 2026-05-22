import {
  buildPollinationsImageUrl,
  type GenerateImageErrorResponse,
  type GenerateImageRequestBody,
  type GenerateImageSuccessResponse,
} from "@/lib/image-generation";

export const runtime = "nodejs";

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

  const requestBody: GenerateImageRequestBody = {
    prompt,
    style: optionalString(payload.style),
    aspectRatio: optionalString(payload.aspectRatio),
    resolution: optionalString(payload.resolution),
    quality: optionalString(payload.quality),
    seed: optionalString(payload.seed),
  };

  const { imageUrl, seed, resolution } = buildPollinationsImageUrl(requestBody);

  return Response.json(
    {
      imageUrl,
      seed,
      resolution,
    } satisfies GenerateImageSuccessResponse,
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
