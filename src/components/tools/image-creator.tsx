"use client";

import { useRef, useState } from "react";
import {
  type GenerateImageErrorResponse,
  type GenerateImageRequestBody,
  type GenerateImageSuccessResponse,
} from "@/lib/image-generation";
import {
  DEFAULT_ASPECT_RATIO,
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
  WorkflowMode,
} from "./image-creator/types";
import { buildDownloadName } from "./image-creator/utils";

const ImageCreator = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [workflowMode, setWorkflowMode] = useState<WorkflowMode>("create");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImageItem[]>(
    [],
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

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
  const isGenerationLocked = isGenerating || browserLoadingCount > 0;
  const currentImageIsLoading = !isGenerating && browserLoadingCount > 0;

  const handleAspectChange = (value: AspectRatio) => {
    setAspectRatio(value);
    setResolution(getDefaultResolution(value));
  };

  const handleFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setReferenceImage(reader.result as string);
    };

    reader.readAsDataURL(file);
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
      });

      if (!response.ok) {
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
    void downloadGeneratedImage(item);
  };

  const handleGeneratedImageLoad = (id: string) => {
    updateGalleryItem(id, { loadState: "ready" });
  };

  const handleGeneratedImageError = (id: string) => {
    updateGalleryItem(id, { loadState: "error" });
    setErrorMessage(
      "The generated image URL was returned, but the browser could not load it.",
    );
    setErrorDetails([
      "pollinations did not finish serving the image to the browser",
      "try generating again to get a fresh image URL",
    ]);
  };

  const handleGenerateImage = async () => {
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

      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") ?? "";
        const fallbackMessage = "Failed to generate image.";

        if (contentType.includes("application/json")) {
          const data = (await response.json()) as GenerateImageErrorResponse;
          setErrorDetails(data.details ?? []);
          throw new Error(data.error || fallbackMessage);
        }

        const text = await response.text();
        setErrorDetails([]);
        throw new Error(text || fallbackMessage);
      }

      const data = (await response.json()) as GenerateImageSuccessResponse;

      const createdAt = Date.now();
      pushToGallery({
        id: crypto.randomUUID(),
        url: data.imageUrl,
        mimeType: "image/png",
        basePrompt: trimmedPrompt,
        aspectRatio,
        resolution: data.resolution,
        style,
        quality,
        seed: data.seed,
        createdAt,
        loadState: "loading",
      });
    } catch (error) {
      if (error instanceof TypeError) {
        setErrorDetails([
          "the browser could not reach /api/generate-image",
          "check that the Next.js server is running and reload the page",
        ]);
      }

      setErrorMessage(
        error instanceof Error ? error.message : "Failed to generate image.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const galleryStatusLabel = isGenerating
    ? "Generating..."
    : browserLoadingCount > 0
      ? `${browserLoadingCount} loading`
      : generatedImages.length > 0
        ? `${generatedImages.length} ready`
        : referenceImage
          ? "Reference ready"
          : "Empty canvas";
  const generateButtonLabel = isGenerating
    ? "Generating..."
    : currentImageIsLoading
      ? "Waiting for image..."
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

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <div className="mx-auto max-w-420 px-3 py-3 sm:px-5 lg:px-6 lg:py-5">
        <div
          dir="ltr"
          className="grid items-start gap-3 md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[328px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]"
        >
          <ImageCreatorSidebar
            inputRef={inputRef}
            workflowMode={workflowMode}
            onWorkflowModeChange={setWorkflowMode}
            referenceImage={referenceImage}
            onFileSelect={handleFile}
            onRemoveReference={() => setReferenceImage(null)}
            prompt={prompt}
            onPromptChange={setPrompt}
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
