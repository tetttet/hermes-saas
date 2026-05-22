import type { ReactNode } from "react";
import { ChevronIcon } from "@/components/icons/image-creator-icons";

export const IconBox = ({
  children,
  active = false,
}: {
  children: ReactNode;
  active?: boolean;
}) => (
  <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-[#8fbdff] transition group-focus-within:border-[#2563eb]/45 group-focus-within:bg-[#2563eb]/10 group-focus-within:text-white">
    <span
      className={[
        "transition-transform duration-300",
        active
          ? "animate-[activeIcon_1.4s_ease-in-out_infinite]"
          : "group-focus-within:animate-[activeIcon_1.4s_ease-in-out_infinite]",
      ].join(" ")}
    >
      {children}
    </span>
  </div>
);

export const SelectWrap = ({ children }: { children: ReactNode }) => (
  <div className="relative">
    {children}

    <span className="pointer-events-none absolute right-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-white/42 transition group-focus-within:text-[#8fbdff]">
      <ChevronIcon className="size-3.5" />
    </span>
  </div>
);
