export type SiteNavItem = {
  href: "/" | "/image" | "/video" | "/audio";
  label: string;
  badge?: string;
};

export const navItems: SiteNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/image", label: "Image" },
  { href: "/video", label: "Video" },
  { href: "/audio", label: "Audio", badge: "Demo" },
];

export const siteConfig = {
  name: "Hermes/AI",
  description:
    "Hermes/AI creates image, video and audio workflows from one product experience.",
  navItems,
};
