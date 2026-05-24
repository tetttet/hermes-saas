"use client";

import { useState } from "react";
import {
  type GenerateVideoErrorResponse,
  type GenerateVideoRequestBody,
  type GenerateVideoSuccessResponse,
} from "@/lib/video-generation";
import {
  DEFAULT_VIDEO_ASPECT_RATIO,
  DEFAULT_CREATOR_VIDEO_DURATION,
  DEFAULT_CREATOR_VIDEO_MODEL,
  DEFAULT_VIDEO_MOTION,
  DEFAULT_VIDEO_PACING,
  DEFAULT_VIDEO_STYLE,
  MAX_VIDEO_GALLERY_ITEMS,
} from "./video-creator/constants";
import { VideoCreatorGallery } from "./video-creator/gallery";
import { VideoCreatorSidebar } from "./video-creator/sidebar";
import type {
  GeneratedVideoItem,
  VideoAspectRatio,
  VideoMotion,
  VideoPacing,
  VideoStyle,
} from "./video-creator/types";
import { buildVideoDownloadName } from "./video-creator/utils";

const VideoCreator = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideoItem[]>(
    [],
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [style, setStyle] = useState<VideoStyle>(DEFAULT_VIDEO_STYLE);
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>(
    DEFAULT_VIDEO_ASPECT_RATIO,
  );
  const [model, setModel] = useState(DEFAULT_CREATOR_VIDEO_MODEL);
  const [duration, setDuration] = useState(DEFAULT_CREATOR_VIDEO_DURATION);
  const [motion, setMotion] = useState<VideoMotion>(DEFAULT_VIDEO_MOTION);
  const [pacing, setPacing] = useState<VideoPacing>(DEFAULT_VIDEO_PACING);

  const pushToGallery = (item: GeneratedVideoItem) => {
    setGeneratedVideos((currentGallery) =>
      [item, ...currentGallery].slice(0, MAX_VIDEO_GALLERY_ITEMS),
    );
  };

  const updateGalleryItem = (
    id: string,
    updates: Partial<GeneratedVideoItem>,
  ) => {
    setGeneratedVideos((currentGallery) =>
      currentGallery.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    );
  };

  const clearGallery = () => setGeneratedVideos([]);

  const loadingCount = generatedVideos.filter(
    (item) => item.loadState === "loading",
  ).length;

  const fallbackDownload = (item: GeneratedVideoItem) => {
    const anchor = document.createElement("a");

    anchor.href = item.url;
    anchor.rel = "noreferrer";
    anchor.target = "_blank";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  };

  const downloadGeneratedVideo = async (item: GeneratedVideoItem) => {
    const filename = buildVideoDownloadName(item);

    try {
      const response = await fetch("/api/download-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: item.composedPrompt,
          filename,
          model: item.model,
          duration: String(item.duration),
          aspectRatio: item.aspectRatio,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to download video.");
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

  const triggerDownload = (item: GeneratedVideoItem) => {
    void downloadGeneratedVideo(item);
  };

  const handleVideoLoadedMetadata = (
    id: string,
    videoWidth: number,
    videoHeight: number,
    durationSeconds: number,
  ) => {
    updateGalleryItem(id, {
      loadState: "ready",
      videoWidth,
      videoHeight,
      durationSeconds,
    });
  };

  const handleVideoError = (id: string) => {
    updateGalleryItem(id, { loadState: "error" });
    setErrorMessage(
      "The generated video URL was returned, but the browser could not stream the MP4.",
    );
    setErrorDetails([
      "pollinations did not finish serving a playable video to the browser",
      "try generating again to get a fresh streaming request",
    ]);
  };

  const handleGenerateVideo = async () => {
    if (isGenerating) {
      return;
    }

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setErrorMessage("Enter a prompt to generate a video.");
      setErrorDetails(["fill in the prompt field first"]);
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setErrorDetails([]);

    try {
      const payload: GenerateVideoRequestBody = {
        prompt: trimmedPrompt,
        style,
        aspectRatio,
        model,
        duration,
        motion,
        pacing,
      };

      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") ?? "";
        const fallbackMessage = "Failed to generate video.";

        if (contentType.includes("application/json")) {
          const data = (await response.json()) as GenerateVideoErrorResponse;
          setErrorDetails(data.details ?? []);
          throw new Error(data.error || fallbackMessage);
        }

        const text = await response.text();
        setErrorDetails([]);
        throw new Error(text || fallbackMessage);
      }

      const data = (await response.json()) as GenerateVideoSuccessResponse;
      const createdAt = Date.now();

      pushToGallery({
        id: crypto.randomUUID(),
        url: data.videoUrl,
        mimeType: "video/mp4",
        basePrompt: trimmedPrompt,
        composedPrompt: data.composedPrompt,
        aspectRatio: data.aspectRatio as VideoAspectRatio,
        model: data.model as GeneratedVideoItem["model"],
        duration: data.duration,
        style,
        motion,
        pacing,
        createdAt,
        estimatedCostPollen: data.estimatedCostPollen,
        loadState: "loading",
      });
    } catch (error) {
      if (error instanceof TypeError) {
        setErrorDetails([
          "the browser could not reach /api/generate-video",
          "check that the Next.js server is running and reload the page",
        ]);
      }

      setErrorMessage(
        error instanceof Error ? error.message : "Failed to generate video.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const galleryStatusLabel = isGenerating
    ? "Generating..."
    : loadingCount > 0
      ? `${loadingCount} loading`
      : generatedVideos.length > 0
        ? `${generatedVideos.length} ready`
        : "Empty timeline";
  const generateButtonLabel = isGenerating
    ? "Generating..."
    : "Generate Video";

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
          <VideoCreatorSidebar
            prompt={prompt}
            onPromptChange={setPrompt}
            settingsOpen={settingsOpen}
            onSettingsToggle={() => setSettingsOpen((value) => !value)}
            style={style}
            onStyleChange={setStyle}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            model={model}
            onModelChange={setModel}
            duration={duration}
            onDurationChange={setDuration}
            motion={motion}
            onMotionChange={setMotion}
            pacing={pacing}
            onPacingChange={setPacing}
            onGenerate={handleGenerateVideo}
            isGenerateDisabled={isGenerating}
            isGenerating={isGenerating}
            generateButtonLabel={generateButtonLabel}
          />

          <VideoCreatorGallery
            generatedVideos={generatedVideos}
            isGenerating={isGenerating}
            aspectRatio={aspectRatio}
            galleryStatusLabel={galleryStatusLabel}
            errorMessage={errorMessage}
            errorDetails={errorDetails}
            onClearGallery={clearGallery}
            onDownload={triggerDownload}
            onVideoLoadedMetadata={handleVideoLoadedMetadata}
            onVideoError={handleVideoError}
          />
        </div>
      </div>
    </section>
  );
};

export default VideoCreator;
