import {
  buildHordeGenerationPayload,
  type GenerateImageErrorResponse,
  type GenerateImageRequestBody,
  type HordeGenerationPollResponse,
  type HordeGenerationStartResponse,
} from "@/lib/image-generation";

export const runtime = "nodejs";

const AI_HORDE_API_BASE_URL = "https://aihorde.net/api/v2";
const AI_HORDE_ANONYMOUS_API_KEY = "0000000000";
const AI_HORDE_DEFAULT_CLIENT_AGENT =
  "HermesAI:1.0:support@example.com";
const AI_HORDE_BUSY_MESSAGE = "AI Horde is busy right now. Try again later.";
const AI_HORDE_ERROR_MESSAGE = "AI Horde could not generate the image. Try again.";

type HordeCheckResponse = {
  done?: boolean;
  faulted?: boolean;
  finished?: number;
  processing?: number;
  waiting?: number;
  wait_time?: number;
  queue_position?: number;
  is_possible?: boolean;
};

type HordeStatusResponse = HordeCheckResponse & {
  generations?: Array<{
    img?: string;
    seed?: string;
  }>;
};

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

const getApiKey = () =>
  process.env.AI_HORDE_API_KEY?.trim() || AI_HORDE_ANONYMOUS_API_KEY;

const getClientAgent = () =>
  process.env.AI_HORDE_CLIENT_AGENT?.trim() || AI_HORDE_DEFAULT_CLIENT_AGENT;

const getBaseHeaders = () => ({
  apikey: getApiKey(),
  "Client-Agent": getClientAgent(),
});

const formatWaitTime = (totalSeconds?: number) => {
  if (!Number.isFinite(totalSeconds) || (totalSeconds ?? 0) <= 0) {
    return null;
  }

  const safeSeconds = Math.max(1, Math.floor(totalSeconds ?? 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
};

const buildWaitingMessage = (
  queuePosition?: number,
  waitTimeSeconds?: number,
) => {
  const parts: string[] = [];

  if (Number.isFinite(queuePosition) && (queuePosition ?? 0) > 0) {
    parts.push(`Queue position #${queuePosition}`);
  }

  const formattedWait = formatWaitTime(waitTimeSeconds);

  if (formattedWait) {
    parts.push(`About ${formattedWait} remaining`);
  }

  return parts.join(" · ") || "Waiting for a community worker to pick up your image.";
};

const parseJson = async <T>(response: Response) => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

const fetchHorde = async <T>(
  path: string,
  init?: RequestInit,
) => {
  const response = await fetch(`${AI_HORDE_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...getBaseHeaders(),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const data = await parseJson<T | GenerateImageErrorResponse>(response);

  return { response, data };
};

const normalizeStatus = async (
  requestId: string,
): Promise<HordeGenerationPollResponse> => {
  const checkResult = await fetchHorde<HordeCheckResponse>(
    `/generate/check/${encodeURIComponent(requestId)}`,
  );

  if (!checkResult.response.ok) {
    throw new Error(
      checkResult.response.status === 404
        ? AI_HORDE_ERROR_MESSAGE
        : AI_HORDE_BUSY_MESSAGE,
    );
  }

  const check = checkResult.data as HordeCheckResponse | null;

  if (!check) {
    throw new Error(AI_HORDE_ERROR_MESSAGE);
  }

  if (check.is_possible === false) {
    return {
      state: "failed",
      statusLabel: "Failed",
      error: AI_HORDE_BUSY_MESSAGE,
      statusMessage: AI_HORDE_BUSY_MESSAGE,
    };
  }

  if (check.faulted) {
    return {
      state: "failed",
      statusLabel: "Failed",
      error: AI_HORDE_ERROR_MESSAGE,
      statusMessage: AI_HORDE_ERROR_MESSAGE,
    };
  }

  if (!check.done) {
    if ((check.processing ?? 0) > 0 || (check.finished ?? 0) > 0) {
      return {
        state: "generating",
        statusLabel: "Generating",
        statusMessage: "A community worker is generating your image.",
      };
    }

    return {
      state: "waiting",
      statusLabel: "Waiting in queue",
      statusMessage: buildWaitingMessage(
        check.queue_position,
        check.wait_time,
      ),
      queuePosition: check.queue_position,
      waitTimeSeconds: check.wait_time,
    };
  }

  const statusResult = await fetchHorde<HordeStatusResponse>(
    `/generate/status/${encodeURIComponent(requestId)}`,
  );

  if (!statusResult.response.ok) {
    throw new Error(
      statusResult.response.status === 404
        ? AI_HORDE_ERROR_MESSAGE
        : AI_HORDE_BUSY_MESSAGE,
    );
  }

  const status = statusResult.data as HordeStatusResponse | null;
  const generation = Array.isArray(status?.generations)
    ? status.generations.find(
        (item) => typeof item?.img === "string" && item.img.length > 0,
      )
    : undefined;

  if (!generation?.img) {
    return {
      state: "failed",
      statusLabel: "Failed",
      error: AI_HORDE_ERROR_MESSAGE,
      statusMessage: AI_HORDE_ERROR_MESSAGE,
    };
  }

  return {
    state: "done",
    statusLabel: "Done",
    statusMessage: "The image is ready.",
    imageDataUrl: `data:image/webp;base64,${generation.img}`,
    mimeType: "image/webp",
    seed: generation.seed,
  };
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

  const payload = body as GenerateImageRequestBody;

  if (!payload.prompt?.trim()) {
    return jsonError("Enter a prompt to generate an image.", 400, [
      "fill in the prompt field first",
    ]);
  }

  const { payload: hordePayload, seed, resolution } =
    buildHordeGenerationPayload(payload);

  let submitResult: Awaited<ReturnType<typeof fetchHorde<{ id?: string }>>>;

  try {
    submitResult = await fetchHorde<{ id?: string }>("/generate/async", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hordePayload),
    });
  } catch {
    return jsonError(AI_HORDE_BUSY_MESSAGE, 502);
  }

  if (!submitResult.response.ok) {
    const message =
      submitResult.response.status === 429 ||
      submitResult.response.status === 503
        ? AI_HORDE_BUSY_MESSAGE
        : AI_HORDE_ERROR_MESSAGE;

    return jsonError(message, submitResult.response.status);
  }

  const requestId = (submitResult.data as { id?: string } | null)?.id;

  if (typeof requestId !== "string" || !requestId) {
    return jsonError(AI_HORDE_ERROR_MESSAGE, 502);
  }

  return Response.json(
    {
      requestId,
      seed,
      resolution,
      statusLabel: "Waiting in queue",
    } satisfies HordeGenerationStartResponse,
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const requestId = requestUrl.searchParams.get("requestId")?.trim();

  if (!requestId) {
    return jsonError("AI Horde request ID is required.", 400, [
      "pass requestId as a query parameter",
    ]);
  }

  try {
    const normalizedStatus = await normalizeStatus(requestId);

    return Response.json(normalizedStatus, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return jsonError(
      error instanceof Error && error.message
        ? error.message
        : AI_HORDE_ERROR_MESSAGE,
      502,
    );
  }
}
