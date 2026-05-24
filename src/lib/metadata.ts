import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

type PageMetadataInput = {
  title: string;
  description: string;
  keywords?: string[];
};

const defaultKeywords = [
  "Hermes AI",
  "AI image generator",
  "image generation",
  "photo generation",
  "image studio",
];

export function createPageMetadata({
  title,
  description,
  keywords = [],
}: PageMetadataInput): Metadata {
  const mergedKeywords = [...new Set([...defaultKeywords, ...keywords])];
  const fullTitle = `${title} | ${siteConfig.name}`;

  return {
    title,
    description,
    keywords: mergedKeywords,
    openGraph: {
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
