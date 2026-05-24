export type SiteNavItem = {
  href: "/" | "/image" | "/video" | "/audio" | "/chats";
  label: string;
  badge?: string;
  locked?: boolean;
};

export const navItems: SiteNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/image", label: "Image" },
  { href: "/video", label: "Video", badge: "Demo", locked: true },
  { href: "/audio", label: "Audio", badge: "Demo", locked: true },
  { href: "/chats", label: "Chats" },
];

export const siteConfig = {
  name: "Hermes/AI",
  description:
    "Hermes/AI is a focused workspace for home, image, video, audio, and chats.",
  navItems,
};
