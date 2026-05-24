"use client";

import { useState } from "react";
import {
  buildPollinationsImageUrl,
  type GenerateImageErrorResponse,
  type GenerateImageRequestBody,
  type HordeGenerationPollResponse,
  type HordeGenerationStartResponse,
  type ImageGenerationProvider,
} from "@/lib/image-generation";
import {
  DEFAULT_ASPECT_RATIO,
  DEFAULT_IMAGE_PROVIDER,
  MAX_GALLERY_ITEMS,
  getDefaultResolution,
  getSafeResolution,
  resolutions,
} from "./image-creator/constants";
import { ImageCreatorGallery } from "./image-creator/gallery";
import { ImageCreatorSidebar } from "./image-creator/sidebar";
import type {
  AspectRatio,
  GeneratedImageItem,
  Quality,
  Style,
} from "./image-creator/types";
import { buildDownloadName } from "./image-creator/utils";

const MAX_IMAGE_LOAD_RETRIES = 3;
const HORDE_CHECK_INTERVAL_MS = 4000;
const HORDE_GENERATING_INTERVAL_MS = 2500;
const HORDE_MAX_POLL_ATTEMPTS = 150;
const DUBLIOS_ERROR_MESSAGE = "Dublios could not generate the image. Try again.";
const AI_HORDE_ERROR_MESSAGE =
  "AI Horde could not generate the image. Try again.";
const AI_HORDE_BUSY_MESSAGE = "AI Horde is busy right now. Try again later.";

const delay = (durationMs: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, durationMs);
  });

const ImageCreator = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImageItem[]>(
    [],
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [provider, setProvider] =
    useState<ImageGenerationProvider>(DEFAULT_IMAGE_PROVIDER);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [aspectRatio, setAspectRatio] =
    useState<AspectRatio>(DEFAULT_ASPECT_RATIO);
  const [resolution, setResolution] = useState(
    getDefaultResolution(DEFAULT_ASPECT_RATIO),
  );
  const [style, setStyle] = useState<Style>("Cinematic");
  const [quality, setQuality] = useState<Quality>("HD");
  const [seed, setSeed] = useState("");

  const currentResolutions = resolutions[aspectRatio];
  const safeResolution = getSafeResolution(aspectRatio, resolution);

  const pushToGallery = (item: GeneratedImageItem) => {
    setGeneratedImages((currentGallery) =>
      [item, ...currentGallery].slice(0, MAX_GALLERY_ITEMS),
    );
  };

  const updateGalleryItem = (
    id: string,
    updates: Partial<GeneratedImageItem>,
  ) => {
    setGeneratedImages((currentGallery) =>
      currentGallery.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    );
  };

  const clearGallery = () => setGeneratedImages([]);

  const browserLoadingCount = generatedImages.filter(
    (item) => item.loadState === "loading",
  ).length;
  const activeGenerationStatusLabel = generatedImages.find(
    (item) => item.loadState === "loading" && item.generationStatusLabel,
  )?.generationStatusLabel;
  const isGenerationLocked = isGenerating;

  const handleAspectChange = (value: AspectRatio) => {
    setAspectRatio(value);
    setResolution(getDefaultResolution(value));
  };

  const fallbackDownload = (item: GeneratedImageItem) => {
    const anchor = document.createElement("a");
    anchor.href = item.url;
    anchor.rel = "noreferrer";
    anchor.target = "_blank";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  };

  const downloadGeneratedImage = async (item: GeneratedImageItem) => {
    if (!item.url) {
      return;
    }

    if (!item.url.startsWith("https://")) {
      fallbackDownload(item);
      return;
    }

    const filename = buildDownloadName(item);

    try {
      const response = await fetch("/api/download-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: item.url,
          filename,
        }),
        cache: "no-store",
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") ?? "";

        if (contentType.includes("application/json")) {
          const data = (await response.json()) as GenerateImageErrorResponse;
          throw new Error(data.error || "Failed to download image.");
        }

        throw new Error("Failed to download image.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = objectUrl;
      anchor.download = filename;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 1000);
    } catch {
      fallbackDownload(item);
    }
  };

  const triggerDownload = (item: GeneratedImageItem) => {
    if (!item.url) {
      return;
    }

    void downloadGeneratedImage(item);
  };

  const createDubliosGeneratedImage = (payload: GenerateImageRequestBody) => {
    const { sourceUrl, seed: generatedSeed, resolution } =
      buildPollinationsImageUrl(payload);

    return {
      imageUrl: sourceUrl,
      seed: generatedSeed,
      resolution,
    };
  };

  const handleGeneratedImageLoad = (
    id: string,
    naturalWidth: number,
    naturalHeight: number,
  ) => {
    updateGalleryItem(id, {
      loadState: "ready",
      naturalWidth,
      naturalHeight,
      generationStatusMessage: undefined,
    });
  };

  const buildProviderErrorMessage = (selectedProvider: ImageGenerationProvider) =>
    selectedProvider === "ai-horde"
      ? AI_HORDE_ERROR_MESSAGE
      : DUBLIOS_ERROR_MESSAGE;

  const toFriendlyErrorMessage = (
    selectedProvider: ImageGenerationProvider,
    error: unknown,
  ) => {
    if (error instanceof Error) {
      const trimmedMessage = error.message.trim();

      if (
        trimmedMessage === DUBLIOS_ERROR_MESSAGE ||
        trimmedMessage === AI_HORDE_ERROR_MESSAGE ||
        trimmedMessage === AI_HORDE_BUSY_MESSAGE
      ) {
        return trimmedMessage;
      }
    }

    return buildProviderErrorMessage(selectedProvider);
  };

  const markFailedImage = (id: string, message: string) => {
    updateGalleryItem(id, {
      loadState: "error",
      generationStatusLabel: "Failed",
      generationStatusMessage: undefined,
      errorMessage: message,
    });
  };

  const submitHordeGeneration = async (payload: GenerateImageRequestBody) => {
    const response = await fetch("/api/image-generation/horde", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = (await response.json()) as
      | HordeGenerationStartResponse
      | GenerateImageErrorResponse;

    if (!response.ok) {
      throw new Error(
        "error" in data && data.error ? data.error : AI_HORDE_ERROR_MESSAGE,
      );
    }

    return data as HordeGenerationStartResponse;
  };

  const fetchHordeGenerationStatus = async (requestId: string) => {
    const response = await fetch(
      `/api/image-generation/horde?requestId=${encodeURIComponent(requestId)}`,
      {
        cache: "no-store",
      },
    );

    const data = (await response.json()) as
      | HordeGenerationPollResponse
      | GenerateImageErrorResponse;

    if (!response.ok) {
      throw new Error(
        "error" in data && data.error ? data.error : AI_HORDE_ERROR_MESSAGE,
      );
    }

    return data as HordeGenerationPollResponse;
  };

  const pollHordeGeneration = async (id: string, requestId: string) => {
    for (let attempt = 0; attempt < HORDE_MAX_POLL_ATTEMPTS; attempt += 1) {
      const status = await fetchHordeGenerationStatus(requestId);

      if (status.state === "waiting") {
        updateGalleryItem(id, {
          requestId,
          generationStatusLabel: status.statusLabel,
          generationStatusMessage: status.statusMessage,
        });
        await delay(HORDE_CHECK_INTERVAL_MS);
        continue;
      }

      if (status.state === "generating") {
        updateGalleryItem(id, {
          requestId,
          generationStatusLabel: status.statusLabel,
          generationStatusMessage: status.statusMessage,
        });
        await delay(HORDE_GENERATING_INTERVAL_MS);
        continue;
      }

      if (status.state === "done") {
        updateGalleryItem(id, {
          requestId,
          url: status.imageDataUrl,
          mimeType: status.mimeType,
          seed: status.seed,
          generationStatusLabel: status.statusLabel,
          generationStatusMessage: status.statusMessage,
          errorMessage: undefined,
          loadState: "loading",
        });
        return;
      }

      markFailedImage(id, status.error);
      throw new Error(status.error);
    }

    markFailedImage(id, AI_HORDE_BUSY_MESSAGE);
    throw new Error(AI_HORDE_BUSY_MESSAGE);
  };

  const handleGeneratedImageError = (id: string) => {
    const failedItem = generatedImages.find((item) => item.id === id);

    if (!failedItem) {
      return;
    }

    if (failedItem.provider === "ai-horde") {
      markFailedImage(id, AI_HORDE_ERROR_MESSAGE);
      setErrorMessage(AI_HORDE_ERROR_MESSAGE);
      setErrorDetails([]);
      return;
    }

    if (failedItem.retryCount < MAX_IMAGE_LOAD_RETRIES) {
      const nextRetryCount = failedItem.retryCount + 1;

      setErrorMessage(null);
      setErrorDetails([]);

      try {
        const refreshedImage = createDubliosGeneratedImage({
          prompt: failedItem.basePrompt,
          style: failedItem.style,
          aspectRatio: failedItem.aspectRatio,
          resolution: failedItem.resolution,
          quality: failedItem.quality,
          seed: failedItem.seed,
        });

        updateGalleryItem(id, {
          url: refreshedImage.imageUrl,
          seed: refreshedImage.seed,
          resolution: refreshedImage.resolution,
          retryCount: nextRetryCount,
          generationStatusLabel: "Generating",
          generationStatusMessage: "Dublios is refreshing the image...",
          errorMessage: undefined,
          loadState: "loading",
        });
      } catch {
        markFailedImage(id, DUBLIOS_ERROR_MESSAGE);
        updateGalleryItem(id, { retryCount: nextRetryCount });
        setErrorMessage(DUBLIOS_ERROR_MESSAGE);
        setErrorDetails([]);
      }

      return;
    }

    markFailedImage(id, DUBLIOS_ERROR_MESSAGE);
    setErrorMessage(DUBLIOS_ERROR_MESSAGE);
    setErrorDetails([]);
  };

  const generateImage = async () => {
    if (isGenerationLocked) {
      return;
    }

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setErrorMessage("Enter a prompt to generate an image.");
      setErrorDetails(["fill in the prompt field first"]);
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setErrorDetails([]);

    let queuedImageId: string | null = null;

    try {
      const normalizedResolution = safeResolution;

      if (normalizedResolution !== resolution) {
        setResolution(normalizedResolution);
      }

      const payload: GenerateImageRequestBody = {
        prompt: trimmedPrompt,
        style,
        aspectRatio,
        resolution: normalizedResolution,
        quality,
        seed: seed.trim() || undefined,
      };

      const createdAt = Date.now();
      const id = crypto.randomUUID();
      queuedImageId = id;

      if (provider === "dublios-power") {
        const data = createDubliosGeneratedImage(payload);

        pushToGallery({
          id,
          url: data.imageUrl,
          mimeType: "image/png",
          provider,
          basePrompt: trimmedPrompt,
          aspectRatio,
          resolution: data.resolution,
          style,
          quality,
          seed: data.seed,
          retryCount: 0,
          createdAt,
          loadState: "loading",
        });

        return;
      }

      pushToGallery({
        id,
        url: "",
        mimeType: "image/webp",
        provider,
        basePrompt: trimmedPrompt,
        aspectRatio,
        resolution: normalizedResolution,
        style,
        quality,
        seed: seed.trim() || undefined,
        retryCount: 0,
        createdAt,
        generationStatusLabel: "Waiting in queue",
        generationStatusMessage: "Submitting your image to the community queue...",
        loadState: "loading",
      });

      const startedGeneration = await submitHordeGeneration(payload);

      updateGalleryItem(id, {
        requestId: startedGeneration.requestId,
        seed: startedGeneration.seed,
        resolution: startedGeneration.resolution,
        generationStatusLabel: startedGeneration.statusLabel,
        generationStatusMessage: "Waiting for a community worker to pick up your image.",
      });

      await pollHordeGeneration(id, startedGeneration.requestId);
    } catch (error) {
      setErrorDetails([]);

      const friendlyMessage = toFriendlyErrorMessage(provider, error);

      setErrorMessage(friendlyMessage);

      if (provider === "ai-horde" && queuedImageId) {
        markFailedImage(queuedImageId, friendlyMessage);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = () => {
    void generateImage();
  };

  const galleryStatusLabel = isGenerating
    ? activeGenerationStatusLabel ?? "Generating..."
    : browserLoadingCount > 0
      ? `${browserLoadingCount} loading`
      : generatedImages.length > 0
        ? `${generatedImages.length} ready`
        : "Empty canvas";
  const generateButtonLabel = isGenerating
    ? activeGenerationStatusLabel === "Waiting in queue"
      ? "Waiting in queue..."
      : "Generating..."
    : "Generate Image";

  return (
    <section className="min-h-[calc(100vh-4.5rem)] bg-[#141414] text-white">
      <style jsx global>{`
        @keyframes activeIcon {
          0%,
          100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-2px) rotate(-5deg) scale(1.08);
          }
        }

        @keyframes settingsSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shimmerMove {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }

        @keyframes logoFloat {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-4px) scale(1.03);
          }
        }

        select::-ms-expand {
          display: none;
        }
      `}</style>

      <div className="mx-auto max-w-420 px-3 py-3 sm:px-5 lg:px-6 lg:py-5">
        <div
          dir="ltr"
          className="grid items-start gap-3 md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[328px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]"
        >
          <ImageCreatorSidebar
            prompt={prompt}
            onPromptChange={setPrompt}
            provider={provider}
            onProviderChange={setProvider}
            settingsOpen={settingsOpen}
            onSettingsToggle={() => setSettingsOpen((value) => !value)}
            style={style}
            onStyleChange={setStyle}
            aspectRatio={aspectRatio}
            onAspectRatioChange={handleAspectChange}
            quality={quality}
            onQualityChange={setQuality}
            resolution={safeResolution}
            currentResolutions={currentResolutions}
            onResolutionChange={setResolution}
            seed={seed}
            onSeedChange={setSeed}
            onGenerate={handleGenerateImage}
            isGenerateDisabled={isGenerationLocked}
            isGenerating={isGenerating}
            generateButtonLabel={generateButtonLabel}
          />

          <ImageCreatorGallery
            generatedImages={generatedImages}
            isGenerating={isGenerating}
            isGenerationLocked={isGenerationLocked}
            aspectRatio={aspectRatio}
            galleryStatusLabel={galleryStatusLabel}
            errorMessage={errorMessage}
            errorDetails={errorDetails}
            onClearGallery={clearGallery}
            onDownload={triggerDownload}
            onImageLoad={handleGeneratedImageLoad}
            onImageError={handleGeneratedImageError}
          />
        </div>
      </div>
    </section>
  );
};

export default ImageCreator;
