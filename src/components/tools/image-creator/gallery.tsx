import type { AspectRatio, GeneratedImageItem } from "./types";
import { GalleryEmptyState } from "./gallery-empty-state";
import { ImageGalleryCard } from "./gallery-card";
import { GallerySkeletonCard } from "./gallery-skeleton-card";

type ImageCreatorGalleryProps = {
  generatedImages: GeneratedImageItem[];
  isGenerating: boolean;
  isGenerationLocked: boolean;
  aspectRatio: AspectRatio;
  galleryStatusLabel: string;
  errorMessage: string | null;
  errorDetails: string[];
  onClearGallery: () => void;
  onDownload: (item: GeneratedImageItem) => void;
  onImageLoad: (id: string) => void;
  onImageError: (id: string) => void;
};

export const ImageCreatorGallery = ({
  generatedImages,
  isGenerating,
  isGenerationLocked,
  aspectRatio,
  galleryStatusLabel,
  errorMessage,
  errorDetails,
  onClearGallery,
  onDownload,
  onImageLoad,
  onImageError,
}: ImageCreatorGalleryProps) => (
  <main className="order-2 min-w-0">
    <div className="rounded-[30px] border border-white/10 bg-[#191a1d] p-3.5 shadow-[0_26px_90px_rgba(0,0,0,0.34)] sm:p-4 lg:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xs font-bold uppercase text-white/55">Gallery</h1>
          <p className="mt-1 text-[12px] text-white/32">
            Generated images stay compact, aligned, and downloadable.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {generatedImages.length > 0 ? (
            <button
              type="button"
              onClick={onClearGallery}
              disabled={isGenerationLocked}
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
        {generatedImages.length === 0 && !isGenerating ? (
          <GalleryEmptyState />
        ) : (
          <div className="relative grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {isGenerating ? <GallerySkeletonCard aspectRatio={aspectRatio} /> : null}

            {generatedImages.map((item) => (
              <ImageGalleryCard
                key={item.id}
                item={item}
                onDownload={onDownload}
                onImageLoad={onImageLoad}
                onImageError={onImageError}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  </main>
);
