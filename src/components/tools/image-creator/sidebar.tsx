import type { RefObject } from "react";
import Image from "next/image";
import {
  ChevronIcon,
  LockIcon,
  QualityIcon,
  RatioIcon,
  ResolutionIcon,
  SeedIcon,
  SettingsIcon,
  SparkIcon,
  StyleIcon,
  UploadIcon,
  WandIcon,
} from "@/components/icons/image-creator-icons";
import {
  qualityOptions,
  resolutions,
  selectClassName,
  styles,
} from "./constants";
import { IconBox, SelectWrap } from "./shared";
import type { AspectRatio, Quality, Style, WorkflowMode } from "./types";

type ImageCreatorSidebarProps = {
  inputRef: RefObject<HTMLInputElement | null>;
  workflowMode: WorkflowMode;
  onWorkflowModeChange: (mode: WorkflowMode) => void;
  referenceImage: string | null;
  onFileSelect: (file?: File) => void;
  onRemoveReference: () => void;
  prompt: string;
  onPromptChange: (value: string) => void;
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
  inputRef,
  workflowMode,
  onWorkflowModeChange,
  referenceImage,
  onFileSelect,
  onRemoveReference,
  prompt,
  onPromptChange,
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
      <div className="rounded-[21px] border border-white/8 bg-[#111215] p-1">
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => onWorkflowModeChange("create")}
            className={[
              "relative flex h-10 items-center justify-center overflow-hidden rounded-[17px] text-[13px] font-bold transition",
              workflowMode === "create"
                ? "bg-[#2563eb] text-white shadow-[0_12px_26px_rgba(37,99,235,0.35)]"
                : "text-white/45 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            {workflowMode === "create" ? (
              <span className="absolute inset-y-0 left-0 w-1/2 animate-[shimmerMove_2.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/18 to-transparent" />
            ) : null}

            <span className="relative">Create</span>
          </button>

          <button
            type="button"
            disabled
            aria-disabled="true"
            className={[
              "relative flex h-10 items-center justify-center overflow-hidden rounded-[17px] text-[13px] font-bold transition",
              workflowMode === "edit"
                ? "bg-[#2563eb] text-white shadow-[0_12px_26px_rgba(37,99,235,0.35)]"
                : "cursor-not-allowed border border-white/6 bg-[#0f1013] text-white/28",
            ].join(" ")}
          >
            <span className="relative flex items-center gap-2">
              Edit
              <LockIcon className="size-3.5" />
            </span>
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        <div className="group rounded-[23px] border border-dashed border-white/12 bg-[#111215] p-2.5 focus-within:border-[#2563eb]/35">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full items-center gap-3 rounded-[18px] border border-white/8 bg-white/[0.035] p-2.5 text-left transition hover:border-[#2563eb]/45 hover:bg-white/[0.055]"
          >
            {referenceImage ? (
              <Image
                src={referenceImage}
                alt="Reference preview"
                width={58}
                height={58}
                unoptimized
                className="h-[58px] w-[58px] rounded-2xl object-cover"
              />
            ) : (
              <IconBox>
                <UploadIcon className="size-4" />
              </IconBox>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-white">
                {referenceImage ? "Reference attached" : "Upload reference"}
              </p>

              <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-white/42">
                PNG, JPG, WebP. Drop or click to browse.
              </p>
            </div>

            <span className="flex size-8 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-[#8fbdff] transition hover:border-[#2563eb]/45 hover:bg-[#2563eb]/10">
              <SparkIcon className="size-4" />
            </span>
          </button>

          <div
            onClick={() => inputRef.current?.click()}
            onDrop={(event) => {
              event.preventDefault();
              onFileSelect(event.dataTransfer.files[0]);
            }}
            onDragOver={(event) => event.preventDefault()}
            className="mt-2 flex min-h-[66px] cursor-pointer items-center justify-center rounded-[18px] border border-dashed border-white/10 bg-[#15161a] px-3 text-center transition hover:border-[#2563eb]/45"
          >
            <div>
              <p className="text-xs font-bold text-white">Drop image here</p>

              <p className="mt-1 text-[11px] text-white/35">
                Reference stays inside the sidebar
              </p>
            </div>
          </div>

          {referenceImage ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white transition hover:border-[#2563eb]/40 hover:bg-white/8"
              >
                Change
              </button>

              <button
                type="button"
                onClick={onRemoveReference}
                className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-xs font-bold text-white/65 transition hover:border-white/20 hover:text-white"
              >
                Remove
              </button>
            </div>
          ) : null}
        </div>

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
            placeholder="Describe the image you want to generate..."
            className="h-[112px] w-full resize-none rounded-[21px] border border-white/10 bg-[#121317] px-3.5 py-3 text-[13px] leading-5 text-white outline-none transition placeholder:text-white/22 focus:border-[#2563eb]/70 focus:ring-4 focus:ring-[#2563eb]/10"
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
                  {style} · {aspectRatio} · {resolution} · {quality}
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
