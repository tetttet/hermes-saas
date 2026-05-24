import {
  ChevronIcon,
  ClockIcon,
  FilmIcon,
  LockIcon,
  MotionIcon,
  RatioIcon,
  SettingsIcon,
  SparkIcon,
  StyleIcon,
  WandIcon,
} from "@/components/icons/image-creator-icons";
import { selectClassName } from "@/components/tools/image-creator/constants";
import { IconBox, SelectWrap } from "@/components/tools/image-creator/shared";
import {
  videoAspectRatios,
  videoDurationOptions,
  videoModelOptions,
  videoMotionOptions,
  videoPacingOptions,
  videoStyles,
} from "./constants";
import type {
  VideoAspectRatio,
  VideoModel,
  VideoMotion,
  VideoPacing,
  VideoStyle,
} from "./types";

type VideoCreatorSidebarProps = {
  prompt: string;
  onPromptChange: (value: string) => void;
  settingsOpen: boolean;
  onSettingsToggle: () => void;
  style: VideoStyle;
  onStyleChange: (value: VideoStyle) => void;
  aspectRatio: VideoAspectRatio;
  onAspectRatioChange: (value: VideoAspectRatio) => void;
  model: VideoModel;
  onModelChange: (value: VideoModel) => void;
  duration: number;
  onDurationChange: (value: number) => void;
  motion: VideoMotion;
  onMotionChange: (value: VideoMotion) => void;
  pacing: VideoPacing;
  onPacingChange: (value: VideoPacing) => void;
  onGenerate: () => void;
  isGenerateDisabled: boolean;
  isGenerating: boolean;
  generateButtonLabel: string;
};

export const VideoCreatorSidebar = ({
  prompt,
  onPromptChange,
  settingsOpen,
  onSettingsToggle,
  style,
  onStyleChange,
  aspectRatio,
  onAspectRatioChange,
  model,
  onModelChange,
  duration,
  onDurationChange,
  motion,
  onMotionChange,
  pacing,
  onPacingChange,
  onGenerate,
  isGenerateDisabled,
  isGenerating,
  generateButtonLabel,
}: VideoCreatorSidebarProps) => (
  <aside className="order-1 min-w-0 md:sticky md:top-[5.25rem]">
    <div className="rounded-[28px] border border-white/10 bg-[#191a1d] p-3 shadow-[0_26px_90px_rgba(0,0,0,0.34)] sm:p-4">
      <div className="rounded-[21px] border border-white/8 bg-[#111215] p-1">
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            className="relative flex h-10 items-center justify-center overflow-hidden rounded-[17px] bg-[#2563eb] text-[13px] font-bold text-white shadow-[0_12px_26px_rgba(37,99,235,0.35)]"
          >
            <span className="absolute inset-y-0 left-0 w-1/2 animate-[shimmerMove_2.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/18 to-transparent" />
            <span className="relative">Generate</span>
          </button>

          <button
            type="button"
            disabled
            aria-disabled="true"
            className="relative flex h-10 items-center justify-center overflow-hidden rounded-[17px] cursor-not-allowed border border-white/6 bg-[#0f1013] text-[13px] font-bold text-white/28"
          >
            <span className="relative flex items-center gap-2">
              Storyboard
              <LockIcon className="size-3.5" />
            </span>
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        <div className="group rounded-[23px] border border-dashed border-white/12 bg-[#111215] p-2.5">
          <div className="flex items-center gap-3 rounded-[18px] border border-white/8 bg-white/[0.035] p-3">
            <IconBox active>
              <FilmIcon className="size-4" />
            </IconBox>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-white">
                Pollinations Video API
              </p>

              <p className="mt-0.5 text-[11px] leading-4 text-white/42">
                <code className="font-mono text-white/55">GET /video/{"{prompt}"}</code>{" "}
                streamed through your Next server as MP4.
              </p>
            </div>

            <span className="rounded-full border border-[#2563eb]/30 bg-[#2563eb]/12 px-2.5 py-1 text-[10px] font-bold tracking-[0.04em] text-[#8fbdff]">
              MP4
            </span>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
            {[
              {
                label: "Base URL",
                value: "gen.pollinations.ai",
              },
              {
                label: "Endpoint",
                value: "/video/{prompt}",
              },
              {
                label: "Auth",
                value: "API_KEY server-side",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[16px] border border-white/8 bg-[#15161a] px-3 py-2.5"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/28">
                  {item.label}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-white/70">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
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
            placeholder="Describe the video scene you want to generate..."
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
                  {model} · {duration}s · {aspectRatio} · {motion}
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
                      onChange={(event) => onStyleChange(event.target.value as VideoStyle)}
                      className={selectClassName}
                    >
                      {videoStyles.map((item) => (
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
                          onAspectRatioChange(event.target.value as VideoAspectRatio)
                        }
                        className={selectClassName}
                      >
                        {videoAspectRatios.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </SelectWrap>
                  </label>

                  <label className="group block">
                    <span className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-white/50">
                      <IconBox>
                        <FilmIcon className="size-3.5" />
                      </IconBox>
                      Model
                    </span>

                    <SelectWrap>
                      <select
                        value={model}
                        onChange={(event) =>
                          onModelChange(event.target.value as VideoModel)
                        }
                        className={selectClassName}
                      >
                        {videoModelOptions.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </SelectWrap>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <label className="group block">
                    <span className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-white/50">
                      <IconBox>
                        <ClockIcon className="size-3.5" />
                      </IconBox>
                      Duration
                    </span>

                    <SelectWrap>
                      <select
                        value={String(duration)}
                        onChange={(event) =>
                          onDurationChange(Number(event.target.value))
                        }
                        className={selectClassName}
                      >
                        {videoDurationOptions.map((item) => (
                          <option key={item} value={item}>
                            {item}s
                          </option>
                        ))}
                      </select>
                    </SelectWrap>
                  </label>

                  <label className="group block">
                    <span className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-white/50">
                      <IconBox>
                        <ClockIcon className="size-3.5" />
                      </IconBox>
                      Pacing
                    </span>

                    <SelectWrap>
                      <select
                        value={pacing}
                        onChange={(event) =>
                          onPacingChange(event.target.value as VideoPacing)
                        }
                        className={selectClassName}
                      >
                        {videoPacingOptions.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </SelectWrap>
                  </label>
                </div>

                <label className="group block">
                  <span className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-white/50">
                    <IconBox>
                      <MotionIcon className="size-3.5" />
                    </IconBox>
                    Motion
                  </span>

                  <SelectWrap>
                    <select
                      value={motion}
                      onChange={(event) =>
                        onMotionChange(event.target.value as VideoMotion)
                      }
                      className={selectClassName}
                    >
                      {videoMotionOptions.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </SelectWrap>
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

          <p className="mt-2 px-1 text-[11px] leading-5 text-white/38">
            Video requests are proxied through your app, and the server checks
            Pollinations balance before starting generation.
          </p>
        </div>
      </div>
    </div>
  </aside>
);
