import type { VideoAspectRatio, GeneratedVideoItem } from "./types";
import { VideoGalleryCard } from "./gallery-card";
import { videoAspectRatioToCssValue } from "./utils";

type VideoCreatorGalleryProps = {
  generatedVideos: GeneratedVideoItem[];
  isGenerating: boolean;
  aspectRatio: VideoAspectRatio;
  galleryStatusLabel: string;
  errorMessage: string | null;
  errorDetails: string[];
  onClearGallery: () => void;
  onDownload: (item: GeneratedVideoItem) => void;
  onVideoLoadedMetadata: (
    id: string,
    videoWidth: number,
    videoHeight: number,
    durationSeconds: number,
  ) => void;
  onVideoError: (id: string) => void;
};

const GallerySkeletonCard = ({
  aspectRatio,
}: {
  aspectRatio: VideoAspectRatio;
}) => (
  <article className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-3 shadow-[0_22px_70px_rgba(0,0,0,0.26)]">
    <div className="animate-pulse">
      <div
        className="rounded-[20px] border border-white/8 bg-[#131419]"
        style={{
          aspectRatio: videoAspectRatioToCssValue(aspectRatio),
        }}
      />

      <div className="mt-3 space-y-3 px-1">
        <div className="flex gap-1.5">
          <div className="h-6 w-20 rounded-full bg-white/8" />
          <div className="h-6 w-24 rounded-full bg-white/6" />
          <div className="h-6 w-[4.5rem] rounded-full bg-white/6" />
        </div>

        <div className="rounded-[18px] border border-white/8 bg-[#131419] px-3 py-2.5">
          <div className="h-3 w-14 rounded bg-white/8" />
          <div className="mt-3 h-3 w-full rounded bg-white/6" />
          <div className="mt-2 h-3 w-4/5 rounded bg-white/6" />
        </div>

        <div className="flex items-center justify-between">
          <div className="h-3 w-12 rounded bg-white/8" />
          <div className="h-8 w-28 rounded-full bg-white/8" />
        </div>
      </div>
    </div>
  </article>
);

const GalleryEmptyState = () => (
  <div className="rounded-[26px] border border-dashed border-white/12 bg-[#141519] p-5">
    <div className="rounded-[22px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_48%),#111215] px-5 py-8 text-center">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8fbdff]">
        Video Studio
      </p>
      <h2 className="mt-3 text-xl font-black text-white">
        Your generated clips will land here.
      </h2>
      <p className="mx-auto mt-3 max-w-[34rem] text-sm leading-6 text-white/52">
        Start with a strong scene description, then tune style, aspect ratio,
        motion, and pacing to shape the final prompt sent to Pollinations.
      </p>
    </div>
  </div>
);

export const VideoCreatorGallery = ({
  generatedVideos,
  isGenerating,
  aspectRatio,
  galleryStatusLabel,
  errorMessage,
  errorDetails,
  onClearGallery,
  onDownload,
  onVideoLoadedMetadata,
  onVideoError,
}: VideoCreatorGalleryProps) => (
  <main className="order-2 min-w-0">
    <div className="rounded-[30px] border border-white/10 bg-[#191a1d] p-3.5 shadow-[0_26px_90px_rgba(0,0,0,0.34)] sm:p-4 lg:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xs font-bold uppercase text-white/55">Gallery</h1>
          <p className="mt-1 text-[12px] text-white/32">
            Generated videos stay previewable, compact, and downloadable.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {generatedVideos.length > 0 ? (
            <button
              type="button"
              onClick={onClearGallery}
              disabled={isGenerating}
              className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] font-bold text-white/72 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear
            </button>
          ) : null}

          <span className="text-[12px] text-white/28">{galleryStatusLabel}</span>
        </div>
      </div>

      {errorMessage ? (
        <div className="mb-3 rounded-[20px] border border-[#ff8e8e]/18 bg-[#2c1114] px-4 py-3 text-left">
          <p className="text-sm font-bold text-[#ffb0b0]">{errorMessage}</p>

          {errorDetails.length > 0 ? (
            <p className="mt-1 text-[11px] leading-5 text-white/55">
              {errorDetails.join(" · ")}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="relative overflow-hidden">
        {generatedVideos.length === 0 && !isGenerating ? (
          <GalleryEmptyState />
        ) : (
          <div className="relative grid grid-cols-1 gap-3 xl:grid-cols-2 2xl:grid-cols-3">
            {isGenerating ? <GallerySkeletonCard aspectRatio={aspectRatio} /> : null}

            {generatedVideos.map((item) => (
              <VideoGalleryCard
                key={item.id}
                item={item}
                onDownload={onDownload}
                onVideoLoadedMetadata={onVideoLoadedMetadata}
                onVideoError={onVideoError}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  </main>
);
