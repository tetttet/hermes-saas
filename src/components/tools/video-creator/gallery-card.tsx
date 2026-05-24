import Image from "next/image";
import { useState } from "react";
import {
  ChevronIcon,
  DownloadIcon,
} from "@/components/icons/image-creator-icons";
import type { GeneratedVideoItem } from "./types";
import {
  buildVideoTags,
  formatCreatedAt,
  getVideoPreviewAspectRatio,
} from "./utils";

type VideoGalleryCardProps = {
  item: GeneratedVideoItem;
  onDownload: (item: GeneratedVideoItem) => void;
  onVideoLoadedMetadata: (
    id: string,
    videoWidth: number,
    videoHeight: number,
    durationSeconds: number,
  ) => void;
  onVideoError: (id: string) => void;
};

const PROMPT_EXPAND_THRESHOLD = 120;

export const VideoGalleryCard = ({
  item,
  onDownload,
  onVideoLoadedMetadata,
  onVideoError,
}: VideoGalleryCardProps) => {
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const isPromptExpandable =
    item.basePrompt.trim().length > PROMPT_EXPAND_THRESHOLD;

  return (
    <article className="group relative h-full w-full overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-3 shadow-[0_22px_70px_rgba(0,0,0,0.26)] transition hover:border-white/16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_44%)] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative">
        <div
          className="relative overflow-hidden rounded-[20px] border border-white/8 bg-[#131419]"
          style={{
            aspectRatio: getVideoPreviewAspectRatio(item),
          }}
        >
          <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-full border border-[#2563eb]/30 bg-[#0f172a]/75 px-2.5 py-1 text-[10px] font-bold tracking-[0.04em] text-[#8fbdff] backdrop-blur-sm">
            MP4 stream
          </div>

          <video
            key={item.url}
            src={item.url}
            controls={item.loadState === "ready"}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={(event) => {
              onVideoLoadedMetadata(
                item.id,
                event.currentTarget.videoWidth,
                event.currentTarget.videoHeight,
                event.currentTarget.duration,
              );
            }}
            onError={() => onVideoError(item.id)}
            className={[
              "absolute inset-0 h-full w-full object-contain bg-[#131419] transition duration-500 group-hover:scale-[1.01]",
              item.loadState === "ready" ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />

          {item.loadState !== "ready" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#131419] p-4">
              {item.loadState === "error" ? (
                <div className="max-w-[13rem] text-center">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffb0b0]">
                    Stream failed
                  </p>
                  <p className="mt-2 text-[11px] leading-5 text-white/48">
                    Pollinations did not return a playable MP4 to the browser.
                    Generate again for a fresh attempt.
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
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative mt-3 flex flex-col space-y-3 px-1">
        <div className="flex flex-wrap gap-1.5">
          {buildVideoTags(item).map((tag, tagIndex) => (
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
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] font-bold text-white/72 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            Download MP4
            <DownloadIcon className="size-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
