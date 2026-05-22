import Image from "next/image";
import { aspectRatioLabels } from "./constants";
import type { AspectRatio } from "./types";
import { aspectRatioToCssValue } from "./utils";

type GallerySkeletonCardProps = {
  aspectRatio: AspectRatio;
};

export const GallerySkeletonCard = ({
  aspectRatio,
}: GallerySkeletonCardProps) => (
  <div className="group relative w-full overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-3 shadow-[0_22px_70px_rgba(0,0,0,0.28)]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.22),transparent_54%)]" />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/28 to-transparent" />

    <div
      className="relative overflow-hidden rounded-[20px] border border-white/8 bg-[#101116] p-4"
      style={{
        aspectRatio: aspectRatioToCssValue(aspectRatio),
      }}
    >
      <div className="absolute inset-0 animate-[shimmerMove_2s_linear_infinite] bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)]" />

      <div className="relative flex h-full flex-col items-center justify-center gap-4">
        <div className="rounded-[26px] border border-white/10 bg-white p-3 shadow-[0_12px_38px_rgba(255,255,255,0.12)]">
          <Image
            src="/logo.png"
            alt="Hermes logo"
            width={52}
            height={52}
            priority
            className="h-[52px] w-[52px] animate-[logoFloat_2.8s_ease-in-out_infinite] rounded-[18px] object-cover"
          />
        </div>
      </div>
    </div>

    <div className="relative mt-3 space-y-2 px-1">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full border border-[#2563eb]/35 bg-[#2563eb]/12 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#8fbdff]">
          Working
        </span>
        <span className="text-[11px] text-white/28">
          {aspectRatioLabels[aspectRatio]}
        </span>
      </div>
      <span className="block h-2.5 rounded-full bg-white/10" />
      <span className="block h-2.5 w-2/3 rounded-full bg-white/[0.07]" />
    </div>
  </div>
);
