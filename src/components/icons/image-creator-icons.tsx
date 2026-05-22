export type IconProps = {
  className?: string;
};

export const SparkIcon = ({ className = "size-4" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 3.4 14.2 9l5.8 2.2-5.8 2.3L12 20l-2.3-6.5L4 11.2 9.7 9 12 3.4Z" />
    <path d="M19 4.5v3M20.5 6h-3M5 17v2.5M6.2 18.3H3.8" />
  </svg>
);

export const UploadIcon = ({ className = "size-4" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 15V4" />
    <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
    <path d="M5 15v2.5A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5V15" />
  </svg>
);

export const WandIcon = ({ className = "size-4" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="m14.5 5.5 4 4" />
    <path d="m4 20 12.5-12.5" />
    <path d="M18.5 3.5v3" />
    <path d="M20 5h-3" />
    <path d="M7 4.5v2" />
    <path d="M8 5.5H6" />
    <path d="M18 16.5v2.5" />
    <path d="M19.2 17.8h-2.4" />
  </svg>
);

export const RatioIcon = ({ className = "size-4" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="3.5" y="6.5" width="17" height="11" rx="2.5" />
    <path d="M7 10h3M14 14h3" />
    <path d="M9.5 14.5 14.5 9.5" />
  </svg>
);

export const ResolutionIcon = ({ className = "size-4" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="4" y="5" width="16" height="14" rx="3" />
    <path d="M8 9v6" />
    <path d="M12 11v4" />
    <path d="M16 8v7" />
  </svg>
);

export const StyleIcon = ({ className = "size-4" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 4c4.7 0 8 3.1 8 7.2 0 2.7-1.6 4.3-4 4.3h-1.5c-.9 0-1.5.7-1.5 1.5 0 .9.5 1.6.5 2.4 0 1.3-1.1 2.1-2.7 2.1C6 21.5 2 17.7 2 12.9 2 7.8 6.3 4 12 4Z" />
    <path d="M7.4 11.3h.01M9.7 8.5h.01M13.1 8.1h.01M16 10.5h.01" />
  </svg>
);

export const QualityIcon = ({ className = "size-4" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 3.8 18.5 7v5.6c0 4.1-2.7 6.6-6.5 8-3.8-1.4-6.5-3.9-6.5-8V7L12 3.8Z" />
    <path d="m9 12.3 2 2 4-4.4" />
  </svg>
);

export const SeedIcon = ({ className = "size-4" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 20c4.1 0 7-2.8 7-7 0-4.9-4.1-8.5-7-10-2.9 1.5-7 5.1-7 10 0 4.2 2.9 7 7 7Z" />
    <path d="M12 4v16" />
    <path d="M8.8 9.1c1.8 1 4.6 1 6.4 0" />
    <path d="M8.8 14.2c1.8 1 4.6 1 6.4 0" />
  </svg>
);

export const SettingsIcon = ({ className = "size-4" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
    <path d="M19.4 15a1.8 1.8 0 0 0 .35 1.98l.06.06a2.1 2.1 0 0 1-2.97 2.97l-.06-.06a1.8 1.8 0 0 0-1.98-.35 1.8 1.8 0 0 0-1.1 1.66v.18a2.1 2.1 0 0 1-4.2 0v-.1a1.8 1.8 0 0 0-1.18-1.7 1.8 1.8 0 0 0-1.98.35l-.06.06a2.1 2.1 0 1 1-2.97-2.97l.06-.06A1.8 1.8 0 0 0 3.6 15a1.8 1.8 0 0 0-1.66-1.1h-.18a2.1 2.1 0 0 1 0-4.2h.1A1.8 1.8 0 0 0 3.56 8.52a1.8 1.8 0 0 0-.35-1.98l-.06-.06a2.1 2.1 0 1 1 2.97-2.97l.06.06A1.8 1.8 0 0 0 8.16 3.92 1.8 1.8 0 0 0 9.26 2.26v-.18a2.1 2.1 0 0 1 4.2 0v.1a1.8 1.8 0 0 0 1.18 1.7 1.8 1.8 0 0 0 1.98-.35l.06-.06a2.1 2.1 0 1 1 2.97 2.97l-.06.06a1.8 1.8 0 0 0-.35 1.98 1.8 1.8 0 0 0 1.66 1.1h.18a2.1 2.1 0 0 1 0 4.2h-.1A1.8 1.8 0 0 0 19.4 15Z" />
  </svg>
);

export const ChevronIcon = ({ className = "size-4" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const LockIcon = ({ className = "size-4" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="5" y="10" width="14" height="10" rx="2.5" />
    <path d="M8 10V7.8A4 4 0 0 1 12 4a4 4 0 0 1 4 3.8V10" />
  </svg>
);

export const DownloadIcon = ({ className = "size-4" }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 4v10" />
    <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
    <path d="M5 18.5h14" />
  </svg>
);
