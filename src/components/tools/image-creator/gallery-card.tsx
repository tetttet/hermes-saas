/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { useState } from "react";
import {
  ChevronIcon,
  DownloadIcon,
} from "@/components/icons/image-creator-icons";
import type { GeneratedImageItem } from "./types";
import {
  aspectRatioToCssValue,
  buildImageTags,
  formatCreatedAt,
} from "./utils";

type ImageGalleryCardProps = {
  item: GeneratedImageItem;
  onDownload: (item: GeneratedImageItem) => void;
  onImageLoad: (id: string, naturalWidth: number, naturalHeight: number) => void;
  onImageError: (id: string) => void;
};

const PROMPT_EXPAND_THRESHOLD = 120;

export const ImageGalleryCard = ({
  item,
  onDownload,
  onImageLoad,
  onImageError,
}: ImageGalleryCardProps) => {
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const isPromptExpandable =
    item.basePrompt.trim().length > PROMPT_EXPAND_THRESHOLD;
  const canDownload = item.url.trim().length > 0;
  const loadingStatusMessage =
    item.generationStatusMessage ??
    (item.retryCount > 0 ? "Dublios is refreshing the image..." : null);

  return (
    <article className="group relative h-full w-full overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-3 shadow-[0_22px_70px_rgba(0,0,0,0.26)] transition hover:border-white/16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_44%)] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div
        role={canDownload ? "button" : undefined}
        tabIndex={canDownload ? 0 : -1}
        aria-disabled={!canDownload}
        onClick={() => {
          if (!canDownload) {
            return;
          }

          onDownload(item);
        }}
        onKeyDown={(event) => {
          if (!canDownload) {
            return;
          }

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onDownload(item);
          }
        }}
        className={[
          "relative outline-none",
          canDownload ? "cursor-pointer" : "cursor-default",
        ].join(" ")}
      >
        <div
          className="relative overflow-hidden rounded-[20px] border border-white/8 bg-[#131419]"
          style={{
            aspectRatio: aspectRatioToCssValue(item.aspectRatio),
          }}
        >
          <div className="absolute inset-0">
            {item.url ? (
              <img
                key={item.url}
                src={item.url}
                alt={item.basePrompt}
                referrerPolicy="no-referrer"
                loading={item.loadState === "loading" ? "eager" : "lazy"}
                fetchPriority={item.loadState === "loading" ? "high" : "auto"}
                decoding="async"
                onLoad={(event) => {
                  onImageLoad(
                    item.id,
                    event.currentTarget.naturalWidth,
                    event.currentTarget.naturalHeight,
                  );
                }}
                onError={() => onImageError(item.id)}
                className={[
                  "absolute inset-0 h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]",
                  item.loadState === "ready" ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />
            ) : null}

            {item.loadState !== "ready" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#131419] p-4">
                {item.loadState === "error" ? (
                  <div className="max-w-[11rem] text-center">
                    <p className="text-xs font-black text-[#ffb0b0]">
                      {item.generationStatusLabel ?? "Failed"}
                    </p>
                    <p className="mt-2 text-[11px] leading-5 text-white/48">
                      {item.errorMessage ??
                        "The image could not be loaded. Please try again."}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto rounded-[22px] border border-white/10 bg-white p-2.5 shadow-[0_12px_38px_rgba(255,255,255,0.12)]">
                      <Image
                        src="/logo.png"
                        alt="Hermes loading"
                        width={42}
                        height={42}
                        className="size-[42px] animate-[logoFloat_2.2s_ease-in-out_infinite] rounded-[14px] object-cover"
                      />
                    </div>

                    {item.generationStatusLabel ? (
                      <p className="mt-3 text-[11px] font-bold text-white/65">
                        {item.generationStatusLabel}
                      </p>
                    ) : null}

                    {loadingStatusMessage ? (
                      <p className="mt-2 text-[11px] leading-5 text-white/48">
                        {loadingStatusMessage}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative mt-3 flex flex-col space-y-3 px-1">
        <div className="flex flex-wrap gap-1.5">
          {buildImageTags(item).map((tag, tagIndex) => (
            <span
              key={`${item.id}-${tagIndex}-${tag}`}
              className={[
                "rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.04em]",
                tagIndex === 0
                  ? "border border-[#2563eb]/30 bg-[#2563eb]/12 text-[#8fbdff]"
                  : "border border-white/10 bg-white/[0.035] text-white/62",
              ].join(" ")}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="rounded-[18px] border border-white/8 bg-[#131419] px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-black uppercase text-white/32">
              Prompt
            </p>

            {isPromptExpandable ? (
              <button
                type="button"
                onClick={() => setIsPromptExpanded((value) => !value)}
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#8fbdff] transition hover:text-white"
              >
                {isPromptExpanded ? "Collapse" : "Expand"}
                <ChevronIcon
                  className={[
                    "size-3 transition duration-300",
                    isPromptExpanded ? "rotate-180" : "rotate-0",
                  ].join(" ")}
                />
              </button>
            ) : null}
          </div>

          <div className="relative mt-1.5">
            <div
              className={[
                "overflow-hidden text-[12px] leading-5 text-white/72 transition-[max-height] duration-300 ease-out",
                isPromptExpandable
                  ? isPromptExpanded
                    ? "max-h-80"
                    : "max-h-10"
                  : "",
              ].join(" ")}
            >
              <p>{item.basePrompt}</p>
            </div>

            {isPromptExpandable && !isPromptExpanded ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#131419] to-transparent" />
            ) : null}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 text-[11px] text-white/32">
          <span>{formatCreatedAt(item.createdAt)}</span>
          <button
            type="button"
            onClick={() => onDownload(item)}
            disabled={!canDownload}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] font-bold text-white/72 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {item.loadState === "loading"
              ? "Download image"
              : item.loadState === "error"
                ? "Try download"
                : "Download image"}
            <DownloadIcon className="size-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
