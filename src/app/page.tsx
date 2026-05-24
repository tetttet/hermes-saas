import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import EmptyRoutePage from "@/components/tools/empty-route-page";

export const metadata: Metadata = createPageMetadata({
  title: "Home",
  description: "Home page placeholder for Hermes/AI.",
  keywords: ["home", "workspace"],
});

const HomePage = () => {
  return <EmptyRoutePage />;
};

export default HomePage;
