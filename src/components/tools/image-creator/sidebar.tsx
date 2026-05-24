import type { ImageGenerationProvider } from "@/lib/image-generation";
import {
  ChevronIcon,
  QualityIcon,
  RatioIcon,
  ResolutionIcon,
  SeedIcon,
  SettingsIcon,
  SparkIcon,
  StyleIcon,
  WandIcon,
} from "@/components/icons/image-creator-icons";
import {
  imageGenerationProviders,
  imageProviderLabels,
  qualityOptions,
  resolutions,
  selectClassName,
  styles,
} from "./constants";
import { IconBox, SelectWrap } from "./shared";
import type { AspectRatio, Quality, Style } from "./types";

type ImageCreatorSidebarProps = {
  prompt: string;
  onPromptChange: (value: string) => void;
  provider: ImageGenerationProvider;
  onProviderChange: (value: ImageGenerationProvider) => void;
  settingsOpen: boolean;
  onSettingsToggle: () => void;
  style: Style;
  onStyleChange: (value: Style) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (value: AspectRatio) => void;
  quality: Quality;
  onQualityChange: (value: Quality) => void;
  resolution: string;
  currentResolutions: string[];
  onResolutionChange: (value: string) => void;
  seed: string;
  onSeedChange: (value: string) => void;
  onGenerate: () => void;
  isGenerateDisabled: boolean;
  isGenerating: boolean;
  generateButtonLabel: string;
};

export const ImageCreatorSidebar = ({
  prompt,
  onPromptChange,
  provider,
  onProviderChange,
  settingsOpen,
  onSettingsToggle,
  style,
  onStyleChange,
  aspectRatio,
  onAspectRatioChange,
  quality,
  onQualityChange,
  resolution,
  currentResolutions,
  onResolutionChange,
  seed,
  onSeedChange,
  onGenerate,
  isGenerateDisabled,
  isGenerating,
  generateButtonLabel,
}: ImageCreatorSidebarProps) => (
  <aside className="order-1 min-w-0 md:sticky md:top-[5.25rem]">
    <div className="rounded-[28px] border border-white/10 bg-[#191a1d] p-3 shadow-[0_26px_90px_rgba(0,0,0,0.34)] sm:p-4">
      <div className="mt-0 space-y-3">
        <label className="group block">
          <span className="mb-1.5 flex items-center gap-2 text-xs font-bold text-white/70">
            <IconBox>
              <WandIcon className="size-4" />
            </IconBox>
            Prompt
          </span>

          <textarea
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="Describe the photo you want to generate..."
            className="h-[148px] w-full resize-none rounded-[21px] border border-white/10 bg-[#121317] px-3.5 py-3 text-[13px] leading-5 text-white outline-none transition placeholder:text-white/22 focus:border-[#2563eb]/70 focus:ring-4 focus:ring-[#2563eb]/10"
          />
        </label>

        <div className="rounded-[23px]">
          <button
            type="button"
            onClick={onSettingsToggle}
            className="flex w-full items-center justify-between gap-3 rounded-[18px] border border-white/8 bg-white/[0.035] px-3 py-2.5 transition hover:border-[#2563eb]/40 hover:bg-white/[0.055]"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-[#8fbdff]">
                <SettingsIcon
                  className={[
                    "size-4",
                    settingsOpen ? "animate-[settingsSpin_5s_linear_infinite]" : "",
                  ].join(" ")}
                />
              </div>

              <div className="text-left">
                <p className="text-[13px] font-black text-white">Settings</p>

                <p className="mt-0.5 text-[11px] font-medium text-white/38">
                  {imageProviderLabels[provider]} · {style} · {aspectRatio} ·{" "}
                  {quality}
                </p>
              </div>
            </div>

            <ChevronIcon
              className={[
                "size-4 text-white/45 transition duration-300",
                settingsOpen ? "rotate-180 text-white" : "rotate-0",
              ].join(" ")}
            />
          </button>

          <div
            className={[
              "grid px-3 transition-all duration-300 ease-out",
              settingsOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0",
            ].join(" ")}
          >
            <div className="overflow-hidden">
              <div className="mt-2 grid gap-2">
                <label className="group block">
                  <span className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-white/50">
                    <IconBox>
                      <SettingsIcon className="size-3.5" />
                    </IconBox>
                    Mode
                  </span>

                  <SelectWrap>
                    <select
                      value={provider}
                      onChange={(event) =>
                        onProviderChange(
                          event.target.value as ImageGenerationProvider,
                        )
                      }
                      className={selectClassName}
                    >
                      {imageGenerationProviders.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </SelectWrap>
                </label>

                <label className="group block">
                  <span className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-white/50">
                    <IconBox>
                      <StyleIcon className="size-3.5" />
                    </IconBox>
                    Style
                  </span>

                  <SelectWrap>
                    <select
                      value={style}
                      onChange={(event) => onStyleChange(event.target.value as Style)}
                      className={selectClassName}
                    >
                      {styles.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </SelectWrap>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="group block">
                    <span className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-white/50">
                      <IconBox>
                        <RatioIcon className="size-3.5" />
                      </IconBox>
                      Aspect ratio
                    </span>

                    <SelectWrap>
                      <select
                        value={aspectRatio}
                        onChange={(event) =>
                          onAspectRatioChange(event.target.value as AspectRatio)
                        }
                        className={selectClassName}
                      >
                        {Object.keys(resolutions).map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </SelectWrap>
                  </label>

                  <label className="group block">
                    <span className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-white/50">
                      <IconBox>
                        <QualityIcon className="size-3.5" />
                      </IconBox>
                      Quality
                    </span>

                    <SelectWrap>
                      <select
                        value={quality}
                        onChange={(event) =>
                          onQualityChange(event.target.value as Quality)
                        }
                        className={selectClassName}
                      >
                        {qualityOptions.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </SelectWrap>
                  </label>
                </div>

                <label className="group block">
                  <span className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-white/50">
                    <IconBox>
                      <ResolutionIcon className="size-3.5" />
                    </IconBox>
                    Resolution
                  </span>

                  <SelectWrap>
                    <select
                      value={resolution}
                      onChange={(event) => onResolutionChange(event.target.value)}
                      className={selectClassName}
                    >
                      {currentResolutions.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </SelectWrap>
                </label>

                <label className="group block">
                  <span className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-white/50">
                    <IconBox>
                      <SeedIcon className="size-3.5" />
                    </IconBox>
                    Seed
                  </span>

                  <input
                    value={seed}
                    onChange={(event) => onSeedChange(event.target.value)}
                    placeholder="Random"
                    className="h-10 w-full rounded-[16px] border border-white/10 bg-[#121317] px-3 text-xs text-white outline-none transition placeholder:text-white/22 focus:border-[#2563eb]/70 focus:ring-4 focus:ring-[#2563eb]/10"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[23px]">
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerateDisabled}
            aria-busy={isGenerating}
            className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-[18px] bg-[#2563eb] px-5 text-sm font-black text-white shadow-[0_18px_50px_rgba(37,99,235,0.34)] transition hover:bg-[#1d4ed8] active:scale-[0.99] disabled:cursor-progress disabled:opacity-90"
          >
            <span className="absolute inset-y-0 left-0 w-1/2 animate-[shimmerMove_2.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <span className="relative flex items-center gap-2">
              {generateButtonLabel}
              <SparkIcon className="size-4 transition group-hover:rotate-12 group-hover:scale-110" />
            </span>
          </button>

          {/* {isWaitingForImage ? (
            <p className="mt-2 px-1 text-[11px] leading-5 text-white/38">
              Current image is still loading into the gallery, so generation is
              locked until it finishes or errors.
            </p>
          ) : null} */}
        </div>
      </div>
    </div>
  </aside>
);
