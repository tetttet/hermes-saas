"use client";

type HamburgerProps = {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
};

const Hamburger = ({ isOpen, onToggle, className }: HamburgerProps) => {
  return (
    <button
      type="button"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-navigation"
      onClick={onToggle}
      className={[
        "relative z-[90] flex size-12 items-center justify-center rounded-2xl text-white outline-none transition-transform duration-300 hover:scale-105 active:scale-95 xl:hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className={[
          "h-8 w-8 transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]",
          isOpen ? "-rotate-45" : "rotate-0",
        ].join(" ")}
      >
        <path
          d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
          className="fill-none stroke-white [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:3] transition-[stroke-dasharray,stroke-dashoffset] duration-[600ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
          style={{
            strokeDasharray: isOpen ? "20 300" : "12 63",
            strokeDashoffset: isOpen ? -32.42 : 0,
          }}
        />
        <path
          d="M7 16 27 16"
          className="fill-none stroke-white [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:3] transition-[stroke-dasharray,stroke-dashoffset] duration-[600ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
        />
      </svg>
    </button>
  );
};

export default Hamburger;
